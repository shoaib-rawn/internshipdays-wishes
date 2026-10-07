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
  document.querySelectorAll("details.skill-category").forEach((box) => {
    const trigger = box.querySelector("summary");
    let pinnedOpen = false;
    const setOpen = (open) => {
      box.open = open;
      trigger.setAttribute("aria-expanded", String(open));
    };

    box.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "touch") setOpen(true);
    });
    box.addEventListener("pointerleave", (event) => {
      if (event.pointerType !== "touch" && !pinnedOpen && !box.querySelector(":focus-visible")) setOpen(false);
    });
    box.addEventListener("focusin", (event) => {
      if (event.target.matches(":focus-visible")) setOpen(true);
    });
    box.addEventListener("focusout", (event) => {
      if (!pinnedOpen && !box.contains(event.relatedTarget) && !box.matches(":hover")) setOpen(false);
    });
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      pinnedOpen = !pinnedOpen;
      setOpen(pinnedOpen);
    });
    box.addEventListener("toggle", () => trigger.setAttribute("aria-expanded", String(box.open)));
    box.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      pinnedOpen = false;
      trigger.focus();
      setOpen(false);
    });
    document.addEventListener("pointerdown", (event) => {
      if (!box.contains(event.target)) {
        pinnedOpen = false;
        setOpen(false);
      }
    });
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

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 35000);
    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
        signal: controller.signal
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success !== true) {
        const error = new Error(result?.message || "The message service did not return a confirmation. Your message is still in the form.");
        error.isServiceError = true;
        throw error;
      }
      form.reset();
      status.textContent = "Thanks! Your message has been sent.";
    } catch (error) {
      status.classList.add("is-error");
      status.textContent = error.isServiceError
        ? error.message
        : error.name === "AbortError"
          ? "We could not confirm delivery before the request timed out. Your message is still in the form."
          : "Could not reach the message service. Please check your connection; your message is still in the form.";
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      label.textContent = "Send message";
    }
  });
})();

(() => {
  const card = document.querySelector("#contact-widget");
  const trigger = card?.querySelector(".contact-trigger");
  const panel = card?.querySelector("#contact-panel");
  if (!card || !trigger || !panel) return;

  let pinnedOpen = false;
  const setOpen = (open) => {
    card.classList.toggle("is-open", open);
    trigger.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
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
