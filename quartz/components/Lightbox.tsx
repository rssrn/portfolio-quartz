import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/lightbox.inline"
import style from "./styles/lightbox.scss"

const Lightbox: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div id="project-lightbox" class={`lightbox-overlay ${displayClass ?? ""}`}>
      <button class="lightbox-close" aria-label="Close">
        &times;
      </button>
      <button class="lightbox-prev" aria-label="Previous image">
        &#8249;
      </button>
      <img class="lightbox-image" src="" alt="" />
      <button class="lightbox-next" aria-label="Next image">
        &#8250;
      </button>
      <div class="lightbox-caption"></div>
      <div class="lightbox-counter"></div>
    </div>
  )
}

Lightbox.css = style
Lightbox.afterDOMLoaded = script

export default (() => Lightbox) satisfies QuartzComponentConstructor
