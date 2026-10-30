import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  // local preview serves authored content under /content/, so look for the footer there
  const localPrefix = window.location.hostname === 'localhost' && window.location.pathname.startsWith('/content/') ? '/content' : '';
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : `${localPrefix}/footer`;
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  block.append(footer);
}
