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

(() => {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#contact-status");
  if (!form || !status) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const button = form.querySelector(".contact-send");
    const label = button.querySelector("span");
    button.disabled = true;
    label.textContent = "Sending…";
    status.hidden = false;
    status.classList.remove("is-error");
    status.textContent = "Sending your message…";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === "false") {
        throw new Error(result.message || "Message could not be sent.");
      }
      form.reset();
      status.textContent = "Thanks! Your message has been sent.";
    } catch {
      status.classList.add("is-error");
      status.textContent = "Sorry, your message could not be sent right now. Please try again shortly.";
    } finally {
      button.disabled = false;
      label.textContent = "Send message";
    }
  });
})();
