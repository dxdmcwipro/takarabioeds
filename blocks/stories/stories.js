import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  node.append(...children);
  return node;
}

function parseStory(row, index) {
  const [imageCell, textCell, linkCell] = [...row.children];
  const img = imageCell?.querySelector('img');
  const meta = textCell?.querySelector('p');
  const title = textCell?.querySelector('h2, h3');
  const subheading = textCell?.querySelector('h4, h5');
  const summary = [...(textCell?.querySelectorAll('p') || [])].filter((p) => p !== meta);
  const href = linkCell?.querySelector('a')?.href || linkCell?.textContent.trim() || '';
  const metaText = meta?.textContent.trim() || '';
  const [category = '', date = ''] = metaText.split('•').map((s) => s.trim());
  return {
    row,
    index,
    img,
    metaText,
    category,
    date: Date.parse(date) || 0,
    title: title?.textContent.trim() || '',
    subheading: subheading?.textContent.trim() || '',
    summary: summary.map((p) => p.textContent.trim()).filter(Boolean),
    href,
  };
}

function picture(img, width) {
  if (!img) return document.createElement('div');
  return createOptimizedPicture(img.src, img.alt, false, [{ width }]);
}

function buildToolbar(stories) {
  const search = el('input', {
    type: 'search', placeholder: 'Search', 'aria-label': 'Search stories', class: 'stories-search-input',
  });
  const searchBtn = el('button', { type: 'button', class: 'stories-search-button', 'aria-label': 'Search' });
  const searchWrap = el('div', { class: 'stories-search' }, search, searchBtn);

  const categories = [...new Set(stories.map((s) => s.category).filter(Boolean))];
  const product = el('select', { class: 'stories-select', 'aria-label': 'Filter by product' });
  product.append(new Option('Product : All', ''));
  categories.forEach((c) => product.append(new Option(c, c)));

  const sort = el('select', { class: 'stories-select', 'aria-label': 'Sort stories' });
  sort.append(new Option('Popularity', 'popularity'), new Option('Newest', 'newest'));

  const share = el('button', { type: 'button', class: 'stories-share' }, 'Share');

  return {
    toolbar: el('div', { class: 'stories-toolbar' }, searchWrap, product, sort, share),
    search,
    searchBtn,
    product,
    sort,
    share,
  };
}

function renderPanel(panel, story) {
  panel.textContent = '';
  if (!story) return;
  const media = el('div', { class: 'stories-panel-media' }, picture(story.img, '1200'));
  const save = el('button', {
    type: 'button', class: 'stories-save', 'aria-label': 'Save story', 'aria-pressed': 'false',
  });
  save.addEventListener('click', () => {
    save.setAttribute('aria-pressed', save.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
  });
  media.append(save);

  const body = el('div', { class: 'stories-panel-body' }, el('h3', {}, story.title));
  if (story.subheading) body.append(el('h4', {}, story.subheading));
  story.summary.forEach((text) => body.append(el('p', {}, text)));
  if (story.href) {
    const cta = el('a', { href: story.href, class: 'stories-read' }, 'Read full story');
    body.append(el('p', { class: 'stories-read-wrap' }, cta));
  }
  panel.append(media, body);
}

export default function decorate(block) {
  const rows = [...block.children];
  const introRow = rows.find((row) => row.children.length === 1);
  const stories = rows.filter((row) => row !== introRow).map(parseStory);

  const intro = el('div', { class: 'stories-intro' });
  let viewAll = null;
  if (introRow) {
    moveInstrumentation(introRow, intro);
    intro.append(...introRow.firstElementChild.childNodes);
    const link = intro.querySelector('a');
    if (link) {
      viewAll = link;
      link.closest('p')?.remove();
      link.className = 'stories-view-all';
    }
  }

  const controls = buildToolbar(stories);
  const header = el('div', { class: 'stories-header' }, intro, controls.toolbar);

  const list = el('ul', { class: 'stories-list' });
  const panel = el('div', { class: 'stories-panel', 'aria-live': 'polite' });
  let active = stories[0];

  stories.forEach((story) => {
    const button = el('button', { type: 'button', class: 'stories-item-button' });
    const thumb = el('div', { class: 'stories-thumb' }, picture(story.img, '300'));
    const text = el(
      'div',
      { class: 'stories-item-text' },
      el('p', { class: 'stories-meta' }, story.metaText),
      el('p', { class: 'stories-title' }, story.title),
      el('p', { class: 'stories-cta' }, 'Open story'),
    );
    button.append(thumb, text);
    button.addEventListener('click', () => {
      active = story;
      // eslint-disable-next-line no-use-before-define
      update();
    });
    const li = el('li', { class: 'stories-item' }, button);
    moveInstrumentation(story.row, li);
    story.li = li;
    story.cta = text.querySelector('.stories-cta');
    list.append(li);
  });

  const aside = el(
    'div',
    { class: 'stories-aside' },
    el('p', { class: 'stories-aside-title' }, 'Latest stories'),
    list,
  );
  if (viewAll) aside.append(viewAll);

  function update() {
    const query = controls.search.value.trim().toLowerCase();
    const category = controls.product.value;
    const sorted = [...stories].sort((a, b) => (controls.sort.value === 'newest'
      ? b.date - a.date || a.index - b.index
      : a.index - b.index));
    const visible = sorted.filter((s) => (!category || s.category === category)
      && (!query || `${s.title} ${s.subheading} ${s.summary.join(' ')}`.toLowerCase().includes(query)));
    list.append(...sorted.map((s) => s.li));
    stories.forEach((s) => { s.li.hidden = !visible.includes(s); });
    if (!visible.includes(active)) [active] = visible;
    stories.forEach((s) => {
      const isActive = s === active;
      s.li.classList.toggle('is-active', isActive);
      s.li.querySelector('button').setAttribute('aria-current', isActive ? 'true' : 'false');
      s.cta.textContent = isActive ? 'Now reading' : 'Open story';
    });
    renderPanel(panel, active);
  }

  controls.search.addEventListener('input', update);
  controls.searchBtn.addEventListener('click', update);
  controls.product.addEventListener('change', update);
  controls.sort.addEventListener('change', update);
  controls.share.addEventListener('click', async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: document.title, url }); } catch (e) { /* dismissed */ }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      controls.share.classList.add('is-copied');
      setTimeout(() => controls.share.classList.remove('is-copied'), 2000);
    }
  });

  block.textContent = '';
  block.append(header, el('div', { class: 'stories-body' }, aside, panel));
  update();
}
