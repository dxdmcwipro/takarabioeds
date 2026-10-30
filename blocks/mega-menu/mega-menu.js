import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function setOpen(block, open) {
  block.classList.toggle('is-open', open);
  block.querySelector('.mega-menu-toggle')?.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function closeAll(except) {
  document.querySelectorAll('.mega-menu.is-open').forEach((menu) => {
    if (menu !== except) setOpen(menu, false);
  });
}

// one set of document listeners shared by every mega menu on the page
let listening = false;
function listenOnce() {
  if (listening) return;
  listening = true;
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.mega-menu')) closeAll();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('.mega-menu.is-open');
    if (!open) return;
    closeAll();
    open.querySelector('.mega-menu-toggle')?.focus();
  });
}

function buildFeature(row, picture, textCell) {
  const card = document.createElement('div');
  card.className = 'mega-menu-feature';
  moveInstrumentation(row, card);
  const img = picture.querySelector('img');
  const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '640' }]);
  moveInstrumentation(img, optimized.querySelector('img'));
  const media = document.createElement('div');
  media.className = 'mega-menu-feature-media';
  media.append(optimized);
  const body = document.createElement('div');
  body.className = 'mega-menu-feature-body';
  if (textCell) body.append(...textCell.childNodes);
  card.append(media, body);
  return card;
}

export default function decorate(block) {
  listenOnce();
  block.querySelectorAll('.button').forEach((a) => a.classList.remove('button', 'primary', 'secondary'));
  block.querySelectorAll('.button-container').forEach((p) => p.classList.remove('button-container'));

  const [labelRow, ...itemRows] = [...block.children];
  const labelCell = labelRow?.firstElementChild;
  const label = labelCell?.textContent.trim() || '';
  const labelLink = labelCell?.querySelector('a');

  // a label without any items is a plain top-level link
  if (!itemRows.length) {
    block.textContent = '';
    block.classList.add('mega-menu-plain');
    if (labelLink) {
      labelLink.className = 'mega-menu-link';
      block.append(labelLink);
    } else {
      const span = document.createElement('span');
      span.className = 'mega-menu-link';
      span.textContent = label;
      block.append(span);
    }
    return;
  }

  const panelId = `mega-menu-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'mega-menu-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', panelId);
  toggle.textContent = label;

  const columns = document.createElement('div');
  columns.className = 'mega-menu-columns';
  let feature = null;

  itemRows.forEach((row) => {
    const [imageCell, textCell] = [...row.children];
    const picture = imageCell?.querySelector('picture');
    if (picture) {
      feature = buildFeature(row, picture, textCell);
      return;
    }
    const column = document.createElement('div');
    column.className = 'mega-menu-column';
    moveInstrumentation(row, column);
    const content = textCell || imageCell;
    if (content) column.append(...content.childNodes);
    columns.append(column);
  });

  const panel = document.createElement('div');
  panel.className = 'mega-menu-panel';
  panel.id = panelId;
  const inner = document.createElement('div');
  inner.className = 'mega-menu-panel-inner';
  inner.append(columns);
  if (feature) {
    inner.append(feature);
    inner.classList.add('has-feature');
  }
  panel.append(inner);

  block.textContent = '';
  block.append(toggle, panel);

  toggle.addEventListener('click', () => {
    const open = !block.classList.contains('is-open');
    closeAll(block);
    setOpen(block, open);
  });
}
