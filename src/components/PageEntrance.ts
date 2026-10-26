const easing = "cubic-bezier(0.22, 1, 0.36, 1)";

export function pageEntrance(node: HTMLElement, restore: boolean): () => void {
  const animations = new Set<Animation>();
  const pending = new Set<HTMLElement>();
  let observer: IntersectionObserver | undefined;
  const animate = (element: HTMLElement, duration: number, delay = 0, distance = 16, scale = 1) => {
    const animation = element.animate([
      {opacity: 0, transform: scale !== 1 ? `scale(${scale})` : `translateY(${distance}px)`},
      {opacity: 1, transform: "none"},
    ], {duration, delay, easing, fill: "both"});
    animations.add(animation);
    void animation.finished.then(() => { animation.cancel(); animations.delete(animation); }).catch(() => {});
  };
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const photo = node.querySelector<HTMLElement>(".hero-photo");
    const image = photo?.querySelector<HTMLElement>("img");
    if (photo && image) {
      // Scale both copies together to prevent double edges during the fade.
      const zoom = photo.animate([{transform: "scale(1.025)"}, {transform: "none"}], {duration: 700, easing, fill: "both"});
      animations.add(zoom);
      void zoom.finished.then(() => { zoom.cancel(); animations.delete(zoom); }).catch(() => {});
      animate(image, 700, 0, 0);
    }
    node.querySelectorAll<HTMLElement>(".hero-content .eyebrow, .hero-content h1, .hero-content h2").forEach(el => animate(el, 550));
    node.querySelectorAll<HTMLElement>(".hero-content .hero-intro").forEach(el => animate(el, 500, 100));
    node.querySelectorAll<HTMLElement>(".hero-content .button-row, .hero-meta, .hero-index").forEach(el => animate(el, 450, 190, 12));
    if (!restore) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const section = entry.target as HTMLElement;
          animate(section, 550);
          section.style.opacity = "";
          section.style.transform = "";
          pending.delete(section);
          observer?.unobserve(section);
        });
      }, {threshold: 0.05});
      node.querySelectorAll<HTMLElement>("main > section:not(.hero)").forEach(section => {
        if (section.getBoundingClientRect().bottom <= 0) return;
        section.style.opacity = "0";
        section.style.transform = "translateY(16px)";
        pending.add(section);
        observer?.observe(section);
      });
    }
  }
  node.removeAttribute("data-page-entering");
  return () => {
    observer?.disconnect();
    animations.forEach(animation => animation.cancel());
    pending.forEach(section => { section.style.opacity = ""; section.style.transform = ""; });
  };
}
