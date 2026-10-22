// One desktop-only owner. The persistent header is outside this boundary.
export function desktopEntrance(node: HTMLElement, initial: boolean): () => void {
  const animations: Animation[] = [];
  const duration = initial ? 400 : 300;
  const started = document.timeline.currentTime;
  const animate = (element: HTMLElement, distance: number, opacity: number) => {
    const animation = element.animate([
      {opacity, transform: distance ? `translateY(${distance}px)` : "none"},
      {opacity: 1, transform: "none"},
    ], {duration, easing: "cubic-bezier(0.22, 0.61, 0.36, 1)", fill: "both"});
    // All visible content shares the same clock; no stagger or readiness delays.
    animation.startTime = started;
    animations.push(animation);
    void animation.finished.then(() => animation.cancel()).catch(() => {});
  };
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const hero = node.querySelector<HTMLElement>(".hero");
    const photo = hero?.querySelector<HTMLElement>(".hero-photo");
    const text = hero?.querySelector<HTMLElement>(".hero-content");
    // Retain the image's contrast; never fade the entire page over a blank backing.
    if (photo) animate(photo, 0, 0.88);
    if (text) animate(text, initial ? 5 : 4, 0);
    const visible = [...node.querySelectorAll<HTMLElement>("main > :not(.hero), footer")].filter(element => {
      const box = element.getBoundingClientRect();
      return box.bottom > 0 && box.top < innerHeight && box.width > 0;
    });
    visible.forEach(element => animate(element, 0, 0.65));
  }
  node.removeAttribute("data-desktop-arriving");
  node.removeAttribute("data-home-arriving");
  return () => animations.forEach(animation => animation.cancel());
}
