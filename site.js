/* Dr Manu Manjith — scroll reveals, count-ups, hero parallax, install app (own code).
   Booking lives in booking.js (built from the DotCom template). */
(function () {
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* reveal on scroll (fade-up + blur, highlight boxes, swashes, marks, handwriting) */
const targets = $$(".fx, .fx-pop, .radar, .about-photo");
/* handwriting lines are fully clipped at first, so watch a wrapper instead of the line itself */
const writes = $$(".write").map(w => { const s = document.createElement("span"); s.className = "write-wrap"; w.parentNode.insertBefore(s, w); s.appendChild(w); s._w = w; return s; });
if ("IntersectionObserver" in window && !reduce) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { (e.target._w || e.target).classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .2, rootMargin: "0px 0px -6% 0px" });
  targets.concat(writes).forEach(el => io.observe(el));
} else targets.concat(writes.map(w => w._w)).forEach(el => el.classList.add("in"));

/* hero: reveal straight away, staggered */
$$(".hero .fx").forEach((el, i) => { el.style.transitionDelay = (.15 + i * .14) + "s"; requestAnimationFrame(() => el.classList.add("in")); });

/* count-up */
const counters = $$("[data-count]");
const runCount = el => {
  const to = +el.dataset.count, t0 = performance.now(), d = 1600;
  (function f(t) { const k = Math.min(1, (t - t0) / d); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(t0);
};
if ("IntersectionObserver" in window && !reduce) {
  const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { runCount(e.target); io2.unobserve(e.target); } }), { threshold: .6 });
  counters.forEach(c => { c.textContent = "0"; io2.observe(c); });
}

/* hero portrait parallax */
const img = $("#heroImg");
if (img && !reduce) {
  let tick = false;
  addEventListener("scroll", () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => { const y = Math.min(scrollY, innerHeight); img.style.transform = `translateY(${y * .22}px) scale(${1 + y / innerHeight * .06})`; tick = false; });
  }, { passive: true });
}

/* install as app (Pro). Doctor opening the installed app goes to the dashboard. */
if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
(function () {
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  let docToken = ""; try { docToken = localStorage.getItem("docToken") || ""; } catch (e) {}
  if (standalone && docToken && /source=app/.test(location.search)) { location.replace("doctor.html"); return; }
  if (standalone) return;
  const btns = [$("#installNav"), $("#installFoot")];
  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  let prompt = null;
  const show = () => { btns.forEach(b => b && (b.hidden = false)); $("#installRow").hidden = false; };
  if (isIOS) show();
  addEventListener("beforeinstallprompt", e => { e.preventDefault(); prompt = e; show(); });
  addEventListener("appinstalled", () => { btns.forEach(b => b && (b.hidden = true)); $("#installRow").hidden = true; });
  const help = () => {
    const d = document.createElement("div"); d.className = "ihelp";
    d.innerHTML = `<div class="box" role="dialog" aria-modal="true"><div class="top"><h3>Install the app</h3><button class="x" aria-label="Close">×</button></div><ol>${isIOS ? "<li>Tap the <b>Share</b> button at the bottom of Safari</li><li>Scroll down and tap <b>Add to Home Screen</b></li><li>Tap <b>Add</b></li>" : "<li>Open the browser menu <b>⋮</b> (top right)</li><li>Tap <b>Install app</b> or <b>Add to Home screen</b></li><li>Tap <b>Install</b></li>"}</ol></div>`;
    document.body.appendChild(d); d.addEventListener("click", e => { if (e.target === d || e.target.closest(".x")) d.remove(); });
  };
  btns.forEach(b => b && (b.onclick = async () => { if (prompt) { prompt.prompt(); await prompt.userChoice.catch(() => {}); prompt = null; } else help(); }));
})();
})();
