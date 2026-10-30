export default function decorate(block) {
  const pic = block.querySelector('picture');
  if (pic) {
    const imageRow = pic.closest('.hero-home > div');
    pic.closest('div').classList.add('hero-home-image');
    if (imageRow) imageRow.classList.add('hero-home-media');
  }

  const content = [...block.children].find((row) => !row.querySelector('picture'));
  if (content) content.classList.add('hero-home-content');

  // first short paragraph before the heading becomes the eyebrow
  const heading = block.querySelector('h1, h2');
  const eyebrow = heading?.previousElementSibling;
  if (eyebrow && eyebrow.tagName === 'P') eyebrow.classList.add('hero-home-eyebrow');
}
