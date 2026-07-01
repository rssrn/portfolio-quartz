let overlay: HTMLElement | null = null
let imgEl: HTMLImageElement | null = null
let captionEl: HTMLElement | null = null
let counterEl: HTMLElement | null = null
let prevBtnEl: HTMLElement | null = null
let nextBtnEl: HTMLElement | null = null
let currentGroup: HTMLImageElement[] = []
let currentIndex = 0

function renderCurrent() {
  if (!imgEl || !captionEl) return
  const img = currentGroup[currentIndex]
  imgEl.src = img.src
  imgEl.alt = img.alt
  captionEl.textContent = img.alt
  captionEl.style.display = img.alt ? "block" : "none"
  if (counterEl) {
    const multiple = currentGroup.length > 1
    counterEl.textContent = `${currentIndex + 1} / ${currentGroup.length}`
    counterEl.style.display = multiple ? "block" : "none"
    prevBtnEl && (prevBtnEl.style.display = multiple ? "block" : "none")
    nextBtnEl && (nextBtnEl.style.display = multiple ? "block" : "none")
  }
}

function openLightbox(group: HTMLImageElement[], index: number) {
  if (!overlay) return
  currentGroup = group
  currentIndex = index
  renderCurrent()
  overlay.classList.add("active")
  document.body.style.overflow = "hidden"
}

function closeLightbox() {
  if (!overlay) return
  overlay.classList.remove("active")
  document.body.style.overflow = ""
}

function showNext(delta: number) {
  if (currentGroup.length === 0) return
  currentIndex = (currentIndex + delta + currentGroup.length) % currentGroup.length
  renderCurrent()
}

function onKeydown(e: KeyboardEvent) {
  if (!overlay?.classList.contains("active")) return
  if (e.key === "Escape") closeLightbox()
  else if (e.key === "ArrowRight") showNext(1)
  else if (e.key === "ArrowLeft") showNext(-1)
}

function setupLightbox() {
  overlay = document.getElementById("project-lightbox")
  if (!overlay) return
  imgEl = overlay.querySelector(".lightbox-image")
  captionEl = overlay.querySelector(".lightbox-caption")
  counterEl = overlay.querySelector(".lightbox-counter")

  const closeBtn = overlay.querySelector(".lightbox-close")
  const prevBtn = overlay.querySelector(".lightbox-prev")
  const nextBtn = overlay.querySelector(".lightbox-next")
  prevBtnEl = prevBtn as HTMLElement | null
  nextBtnEl = nextBtn as HTMLElement | null

  const onClose = () => closeLightbox()
  const onPrev = () => showNext(-1)
  const onNext = () => showNext(1)
  const onOverlayClick = (e: MouseEvent) => {
    if (e.target === overlay) closeLightbox()
  }

  closeBtn?.addEventListener("click", onClose)
  prevBtn?.addEventListener("click", onPrev)
  nextBtn?.addEventListener("click", onNext)
  overlay.addEventListener("click", onOverlayClick)
  document.addEventListener("keydown", onKeydown)

  window.addCleanup(() => {
    closeBtn?.removeEventListener("click", onClose)
    prevBtn?.removeEventListener("click", onPrev)
    nextBtn?.removeEventListener("click", onNext)
    overlay?.removeEventListener("click", onOverlayClick)
    document.removeEventListener("keydown", onKeydown)
  })

  const groupNames = new Set(
    Array.from(document.querySelectorAll<HTMLImageElement>("img[data-lightbox-group]")).map(
      (img) => img.dataset.lightboxGroup!,
    ),
  )

  for (const groupName of groupNames) {
    const images = Array.from(
      document.querySelectorAll<HTMLImageElement>(`img[data-lightbox-group="${groupName}"]`),
    )
    images.forEach((img, index) => {
      const onClick = () => openLightbox(images, index)
      img.addEventListener("click", onClick)
      window.addCleanup(() => img.removeEventListener("click", onClick))
    })

    if (images.length > 1) {
      const visibleImg = images.find((img) => img.offsetParent !== null)
      const container = visibleImg?.parentElement
      if (container && !container.querySelector(".lightbox-count-badge")) {
        const badge = document.createElement("div")
        badge.className = "lightbox-count-badge"
        badge.textContent = `${images.length} screenshots`
        container.appendChild(badge)
      }
    }
  }
}

document.addEventListener("nav", setupLightbox)
