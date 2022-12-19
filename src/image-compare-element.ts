const stylesheet = new CSSStyleSheet()
stylesheet.replaceSync(`
  :host {
    display: block;
    width: 500px;
    padding: 22px;
  }
  div {
    position: relative;
  }
  .left {
    position: absolute;
    overflow: hidden;
    z-index: 99;
  }
  input {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    height: auto;
    right: 0;
    appearance: none;
    -webkit-appearance: none;
    background: none;
    margin: -44px 0 0 -44px
  }
  input::-webkit-slider-thumb {
    appearance: none;
    background: hotpink;
    border-radius: 8px;
    border: 4px solid black;
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
    width: 44px;
    height: 44px;
    margin-left: 22px;
  }
  ::slotted(img) {
    top: 0;
    aspect-ratio: 1;
    object-fit: cover;
  }
`)

/**
 * An example Custom Element. This documentation ends up in the
 * README so describe how this elements works here.
 *
 * You can event add examples on the element is used with Markdown.
 *
 * ```
 * <image-compare></image-compare>
 * ```
 */
class ImageCompareElement extends HTMLElement {
  #renderRoot!: ShadowRoot

  get #left() {
    return this.#renderRoot.querySelector('.left')
  }

  get #input() {
    return this.#renderRoot.querySelector('input')
  }

  connectedCallback(): void {
    this.#renderRoot = this.attachShadow({mode: 'open', delegatesFocus: true})
    this.#renderRoot.adoptedStyleSheets.push(stylesheet)
    this.#renderRoot.innerHTML = `
      <div>
        <input type="range" step="">
        <div class="left"><slot name="left"></slot></div>
        <div><slot name="right"></slot></div>
      </div>
    `
    this.#renderRoot.addEventListener('input', this)
    this.#update(this.#input.value)
  }

  handleEvent(event: Event) {
    this.#update(event.target.value)
  }

  #update(value: number) {
    this.#left.style.width = `${value}%`
  }
}

declare global {
  interface Window {
    ImageCompareElement: typeof ImageCompareElement
  }
}

export default ImageCompareElement

if (!window.customElements.get('image-compare')) {
  window.ImageCompareElement = ImageCompareElement
  window.customElements.define('image-compare', ImageCompareElement)
}
