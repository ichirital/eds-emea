export default function decorate(block) {
  const contentWrapper = block.firstElementChild;
  const pic = contentWrapper.querySelector('img');
  pic.classList.add('banner');
  const paragraph = contentWrapper.querySelector('p')
  paragraph.classList.add('banner-text');
}
