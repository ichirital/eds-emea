export default function decorate(block) {
    const contentWrapper = block.firstElementChild;
    const pic = contentWrapper.querySelector('img')
    pic.classList.add('banner');
}
