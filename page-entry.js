(() => {
  // Run in the head, before the browser restores a previous scroll position.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  const clearInitialAnchor = () => {
    if (location.hash) history.replaceState(history.state, "", location.pathname + location.search);
  };
  clearInitialAnchor();

  let interacted = false;
  const markInteraction = () => { interacted = true; };
  for (const event of ["pointerdown", "touchstart", "wheel", "keydown"]) {
    window.addEventListener(event, markInteraction, { passive: true, capture: true });
  }

  const startAtTop = () => {
    if (interacted) return;
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    root.style.scrollBehavior = previousBehavior;
  };

  startAtTop();
  document.addEventListener("DOMContentLoaded", startAtTop, { once: true });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      interacted = false;
      clearInitialAnchor();
    }
    startAtTop();
    requestAnimationFrame(startAtTop);
  });
})();
