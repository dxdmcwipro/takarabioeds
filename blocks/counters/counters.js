import { moveInstrumentation } from '../../scripts/scripts.js';

const DURATION = 1600;

function parseValue(text) {
  const match = text.trim().match(/^([^\d]*)([\d,]+)(.*)$/);
  if (!match) return null;
  return {
    prefix: match[1],
    target: parseInt(match[2].replace(/,/g, ''), 10),
    suffix: match[3],
  };
}

function animate(el, { prefix, target, suffix }) {
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / DURATION, 1);
    const eased = 1 - (1 - progress) ** 3;
    el.textContent = `${prefix}${Math.round(target * eased)}${progress === 1 ? suffix : ''}`;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export default function decorate(block) {
  const rows = [...block.children];
  const intro = document.createElement('div');
  intro.className = 'counters-intro';
  const list = document.createElement('ul');
  list.className = 'counters-list';

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 1) {
      moveInstrumentation(row, intro);
      intro.append(...cells[0].childNodes);
      return;
    }
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    const [valueCell, labelCell] = cells;
    const value = document.createElement('p');
    value.className = 'counters-value';
    value.textContent = valueCell.textContent.trim();
    const label = document.createElement('p');
    label.className = 'counters-label';
    label.textContent = labelCell ? labelCell.textContent.trim() : '';
    li.append(value, label);
    list.append(li);
  });

  block.textContent = '';
  if (intro.childNodes.length) block.append(intro);
  block.append(list);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const values = [...list.querySelectorAll('.counters-value')]
    .map((el) => ({ el, parsed: parseValue(el.textContent) }))
    .filter(({ parsed }) => parsed);
  if (reduceMotion || !values.length) return;

  values.forEach(({ el, parsed }) => {
    el.setAttribute('aria-label', el.textContent);
    el.textContent = `${parsed.prefix}0`;
  });

  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    observer.disconnect();
    values.forEach(({ el, parsed }) => animate(el, parsed));
  }, { threshold: 0.4 });
  observer.observe(list);
}
