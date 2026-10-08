(() => {
  const desktopMouse = window.matchMedia("(min-width: 1200px) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (!desktopMouse.matches || reducedMotion.matches) return;

  const root = document.documentElement;
  const nativeScrollAreas = ".contact-panel, .invite-message, textarea, select, [contenteditable='true']";
  let frame = 0;
  let current = window.scrollY;
  let target = current;

  const maximumScroll = () => Math.max(0, root.scrollHeight - window.innerHeight);
  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    current = window.scrollY;
    target = current;
    root.classList.remove("is-wheel-smoothing");
  };

  const animate = () => {
    const distance = target - current;
    current += distance * 0.2;

    if (Math.abs(distance) < 0.5) {
      window.scrollTo(0, target);
      stop();
      return;
    }

    window.scrollTo(0, current);
    frame = requestAnimationFrame(animate);
  };

  const isMouseWheel = (event) => {
    if (event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL) return true;
    const legacyDelta = Math.abs(event.wheelDeltaY || 0);
    return legacyDelta >= 100 && legacyDelta % 120 === 0;
  };

  window.addEventListener("wheel", (event) => {
    if (
      event.ctrlKey ||
      event.defaultPrevented ||
      !isMouseWheel(event) ||
      (event.target instanceof Element && event.target.closest(nativeScrollAreas))
    ) return;

    event.preventDefault();

    if (!frame) {
      current = window.scrollY;
      target = current;
      root.classList.add("is-wheel-smoothing");
    }

    const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? window.innerHeight
        : 1;
    const requestedDistance = event.deltaY * unit;
    const controlledDistance = clamp(requestedDistance * 1.1, -190, 190);
    target = clamp(target + controlledDistance, 0, maximumScroll());

    if (!frame) frame = requestAnimationFrame(animate);
  }, { passive: false });

  window.addEventListener("resize", () => {
    target = clamp(target, 0, maximumScroll());
  }, { passive: true });

  for (const eventName of ["pointerdown", "touchstart", "keydown"]) {
    window.addEventListener(eventName, stop, { passive: true });
  }
})();
