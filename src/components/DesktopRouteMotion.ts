// Desktop-only: one animation at a time, with the latest requested route queued.
let active: Animation | undefined;
let arrived: (() => void) | undefined;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function desktopPageArrived(main: HTMLElement) {
  const notify = arrived;
  active?.cancel();
  if (reduced()) { notify?.(); return; }
  active = main.animate(
    [{ opacity: 0.94, transform: "translate3d(0,3px,0)" }, { opacity: 1, transform: "translate3d(0,0,0)" }],
    { duration: 240, easing: "cubic-bezier(.22,1,.36,1)" },
  );
  void active.finished.catch(() => {}).then(() => notify?.());
}

export function createDesktopNavigation(push: (href: string) => void) {
  let queued: string | undefined;
  let running = false;
  let epoch = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const navigate = async (href: string) => {
    queued = href;
    if (running) return;
    running = true;
    const run = epoch;
    try {
      while (queued && run === epoch) {
        let next = queued;
        queued = undefined;
        if (new URL(next, location.href).pathname === location.pathname) continue;
        const main = document.getElementById("main");
        if (main && !reduced()) {
          active?.cancel();
          active = main.animate([{ opacity: 1 }, { opacity: 0.94 }], { duration: 80, easing: "ease-out", fill: "forwards" });
          await active.finished.catch(() => {});
        }
        if (run !== epoch) break;
        // Coalesce clicks made during the exit, before a route is committed.
        if (queued) { next = queued; queued = undefined; }
        if (new URL(next, location.href).pathname === location.pathname) { active?.cancel(); continue; }
        const ready = new Promise<void>(resolve => {
          const deadline = setTimeout(() => { active?.cancel(); done(); }, 2500);
          const done = () => { clearTimeout(deadline); if (arrived === done) arrived = undefined; resolve(); };
          arrived = done;
          timer = deadline;
        });
        push(next);
        await ready;
      }
    } finally {
      if (run === epoch) running = false;
    }
  };
  const cancel = () => {
    epoch++;
    queued = undefined;
    running = false;
    clearTimeout(timer);
    active?.cancel();
    arrived?.();
    arrived = undefined;
  };
  return { navigate, cancel };
}
