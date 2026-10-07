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
  const video = document.querySelector(".memory-video-player");
  if (!video) return;

  // A light, piano-like Happy Birthday melody follows the video timeline.
  const beat = 0.36;
  const melody = [
    [392,1],[392,1],[440,2],[392,2],[523,2],[494,3],
    [392,1],[392,1],[440,2],[392,2],[587,2],[523,3],
    [392,1],[392,1],[784,2],[659,2],[523,2],[494,2],[440,3],
    [698,1],[698,1],[659,2],[523,2],[587,2],[523,3]
  ];
  let offset = 0;
  const notes = melody.map(([frequency, beats]) => {
    const note = { frequency, start: offset, duration: beats * beat };
    offset += note.duration;
    return note;
  });
  const loopDuration = offset;
  let context;
  let timer;
  let lastScheduled = -1;
  const active = new Set();

  const stopMusic = () => {
    clearInterval(timer);
    timer = undefined;
    for (const node of active) {
      try { node.stop(); } catch {}
    }
    active.clear();
    lastScheduled = -1;
  };

  const scheduleNote = (frequency, startAt, length) => {
    const voice = context.createOscillator();
    const overtone = context.createOscillator();
    const volume = context.createGain();
    const tone = context.createGain();
    voice.type = "triangle";
    voice.frequency.value = frequency;
    overtone.type = "sine";
    overtone.frequency.value = frequency * 2;
    volume.gain.setValueAtTime(0.0001, startAt);
    volume.gain.exponentialRampToValueAtTime(0.11, startAt + 0.025);
    volume.gain.exponentialRampToValueAtTime(0.0001, startAt + length * 0.88);
    tone.gain.value = 0.16;
    voice.connect(volume);
    overtone.connect(tone);
    tone.connect(context.destination);
    volume.connect(context.destination);
    voice.start(startAt);
    overtone.start(startAt);
    voice.stop(startAt + length);
    overtone.stop(startAt + length);
    active.add(voice);
    active.add(overtone);
    voice.onended = () => active.delete(voice);
    overtone.onended = () => active.delete(overtone);
  };

  const fillSchedule = () => {
    if (!context || video.paused || video.ended) return;
    const current = video.currentTime;
    const firstCycle = Math.floor(current / loopDuration);
    const horizon = current + 0.3;
    for (let cycle = firstCycle; cycle <= firstCycle + 1; cycle += 1) {
      for (let index = 0; index < notes.length; index += 1) {
        const absoluteIndex = cycle * notes.length + index;
        const note = notes[index];
        const videoTime = cycle * loopDuration + note.start;
        if (absoluteIndex <= lastScheduled || videoTime < current - 0.06 || videoTime > horizon) continue;
        const startAt = context.currentTime + Math.max(0, videoTime - current);
        scheduleNote(note.frequency, startAt, note.duration * 0.92);
        lastScheduled = absoluteIndex;
      }
    }
  };

  video.addEventListener("play", async () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    context ||= new AudioContextClass();
    await context.resume();
    stopMusic();
    fillSchedule();
    timer = setInterval(fillSchedule, 70);
  });
  video.addEventListener("pause", stopMusic);
  video.addEventListener("ended", stopMusic);
  video.addEventListener("seeking", stopMusic);
  video.addEventListener("seeked", () => {
    if (!video.paused) {
      fillSchedule();
      timer = setInterval(fillSchedule, 70);
    }
  });
})();
