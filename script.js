(() => {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
})();

(() => {
  const card = document.querySelector("#party-invite");
  const trigger = card?.querySelector(".invite-trigger");
  const message = card?.querySelector("#invite-message");
  if (!card || !trigger || !message) return;

  let pinnedOpen = false;
  const setOpen = (open) => {
    card.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", String(open));
    message.hidden = !open;
  };

  card.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "touch") setOpen(true);
  });
  card.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "touch") return;
    if (!pinnedOpen && !card.contains(document.activeElement)) setOpen(false);
  });
  card.addEventListener("focusin", () => setOpen(true));
  card.addEventListener("focusout", (event) => {
    if (!pinnedOpen && !card.contains(event.relatedTarget)) setOpen(false);
  });
  trigger.addEventListener("click", () => {
    pinnedOpen = !pinnedOpen;
    setOpen(pinnedOpen);
  });
  document.addEventListener("pointerdown", (event) => {
    if (pinnedOpen && !card.contains(event.target)) {
      pinnedOpen = false;
      setOpen(false);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && pinnedOpen) {
      pinnedOpen = false;
      setOpen(false);
      trigger.focus();
    }
  });
})();
