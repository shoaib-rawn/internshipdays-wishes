(() => {
  const announcement = document.querySelector("[data-daily-announcement]");
  const track = announcement?.querySelector(".marquee > span");
  if (!track) return;

  const personalNote = track.textContent;
  const startsAt = Date.parse("2026-10-10T00:00:00+05:00");
  const dayLength = 86400000;
  const firstDay = Date.UTC(2026, 9, 10);
  const pakistanOffset = 5 * 60 * 60 * 1000;
  const calendar = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Karachi", year: "numeric", month: "2-digit", day: "2-digit"
  });

  // Short translation excerpts: Dr. Mustafa Khattab, The Clear Quran.
  // Each reference links to the complete verse and its context.
  const quotes = [
    ["So, surely with hardship comes ease.", "94:5"],
    ["Seek comfort in patience and prayer. Allah is truly with those who are patient.", "2:153"],
    ["Surely in the remembrance of Allah do hearts find comfort.", "13:28"],
    ["My Lord! Increase me in knowledge.", "20:114"],
    ["If you are grateful, I will certainly give you more.", "14:7"],
    ["Allah does not require of any soul more than what it can afford.", "2:286"],
    ["Do not lose hope in Allah’s mercy, for Allah certainly forgives all sins.", "39:53"],
    ["remember Me; I will remember you. And thank Me, and never be ungrateful.", "2:152"],
    ["Do not falter or grieve, for you will have the upper hand, if you are ˹true˺ believers.", "3:139"],
    ["Once you make a decision, put your trust in Allah. Surely Allah loves those who trust in Him.", "3:159"],
    ["The believers are but one brotherhood, so make peace between your brothers.", "49:10"],
    ["Then which of your Lord’s favours will you ˹humans and jinn˺ both deny?", "55:13"],
    ["Your Lord ˹O Prophet˺ has not abandoned you, nor has He become hateful ˹of you˺.", "93:3"],
    ["Call upon Me, I will respond to you.", "40:60"]
  ];

  let displayedDay;
  let timer;
  const update = () => {
    const now = new Date();
    const parts = Object.fromEntries(calendar.formatToParts(now).map(({ type, value }) => [type, value]));
    const day = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
    const dailyQuote = now.getTime() >= startsAt;

    if (day !== displayedDay) {
      displayedDay = day;
      announcement.classList.toggle("is-daily-quote", dailyQuote);
      if (dailyQuote) {
        const index = Math.floor((day - firstDay) / dayLength) % quotes.length;
        const [text, reference] = quotes[index];
        const copy = document.createElement("a");
        copy.className = "daily-quote-copy";
        copy.href = `https://quran.com/${reference.replace(":", "/")}`;
        copy.target = "_blank";
        copy.rel = "noopener noreferrer";
        copy.textContent = `DAILY REMINDER: “${text}” — Qur’an ${reference} (translation excerpt)`;
        track.replaceChildren(copy);
      } else {
        track.textContent = personalNote;
      }
    }

    clearTimeout(timer);
    // Recheck at Pakistan midnight, including when this page stays open overnight.
    const midnight = day + dayLength - pakistanOffset;
    timer = setTimeout(update, Math.max(250, midnight - now.getTime() + 250));
  };

  update();
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) update();
  });
  window.addEventListener("pageshow", update);
})();
