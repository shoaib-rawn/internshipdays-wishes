(() => {
  const card = document.querySelector(".memory-video");
  const video = card?.querySelector("video");
  if (!video) return;

  const layer = document.createElement("div");
  layer.className = "video-celebration";
  layer.setAttribute("aria-hidden", "true");
  const colors = ["#ed8c42", "#a888c9", "#d8ac4d", "#db5574"];
  for (let index = 0; index < 32; index++) {
    const particle = document.createElement("i");
    const kind = index < 18 ? "petal" : index < 27 ? "confetti" : "sparkle";
    particle.className = `celebration-particle celebration-${kind}`;
    particle.style.setProperty("--left", `${(index * 37 + 7) % 100}%`);
    particle.style.setProperty("--size", `${kind === "petal" ? 12 + index % 8 : 6 + index % 5}px`);
    particle.style.setProperty("--duration", `${7 + index % 6}s`);
    particle.style.setProperty("--delay", `${-index * .73}s`);
    particle.style.setProperty("--drift", `${(index % 2 ? 1 : -1) * (18 + index % 5 * 8)}px`);
    particle.style.setProperty("--turn", `${index % 2 ? 280 : -240}deg`);
    particle.style.setProperty("--confetti-color", colors[index % colors.length]);
    layer.append(particle);
  }
  card.prepend(layer);

  const sizeLayer = () => layer.style.setProperty("--fall-distance", `${card.clientHeight + 70}px`);
  sizeLayer();
  if ("ResizeObserver" in window) new ResizeObserver(sizeLayer).observe(card);
  else window.addEventListener("resize", sizeLayer);

  const celebrate = () => card.classList.add("is-video-playing");
  const stop = () => card.classList.remove("is-video-playing");
  video.addEventListener("playing", celebrate);
  for (const event of ["pause", "ended", "emptied", "error", "waiting", "seeking"]) {
    video.addEventListener(event, stop);
  }
  video.addEventListener("seeked", () => {
    if (!video.paused && !video.ended && video.readyState >= 3) celebrate();
  });
  if (!video.paused && !video.ended && video.readyState >= 3) celebrate();
})();
