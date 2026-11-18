/* Dr Manu Manjith site: nav shadow, reveal, count-up, tabs, install app (Pro), floating Book button.
   Booking itself lives in booking.js (built from the DotCom template). */
(function () {
const $ = (q, el = document) => el.querySelector(q);

/* nav shadow */
const nav = $("#nav");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 10), { passive: true });

/* reveal on scroll */
const rv = document.querySelectorAll(".rv");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  rv.forEach(el => io.observe(el));
} else rv.forEach(el => el.classList.add("in"));

/* count-up */
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io2 = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; io2.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, from = +(el.dataset.from || 0), t0 = performance.now(), d = 1400;
    (function f(t) { const k = Math.min(1, (t - t0) / d); el.firstChild.nodeValue = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(f); })(t0);
  }), { threshold: .6 });
  document.querySelectorAll("[data-count]").forEach(e => io2.observe(e));
}

/* session tabs (auto-advance until the visitor picks one) */
const tabs = [...document.querySelectorAll('[role="tab"]')];
const titles = ["Counselling session", "Homoeopathic care", "Follow-up session"], widths = ["40%", "65%", "85%"];
let cur = 0, timer;
function pick(i, user) {
  cur = i;
  tabs.forEach((t, k) => { t.setAttribute("aria-selected", k === i); t.tabIndex = k === i ? 0 : -1; $("#" + t.getAttribute("aria-controls")).hidden = k !== i; });
  $("#devTitle").textContent = titles[i]; $("#devBar").style.width = widths[i];
  if (user) clearInterval(timer);
}
tabs.forEach((t, i) => {
  t.addEventListener("click", () => pick(i, true));
  t.addEventListener("keydown", e => { if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); pick((i + 1) % tabs.length, true); tabs[cur].focus(); } if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); pick((i + tabs.length - 1) % tabs.length, true); tabs[cur].focus(); } });
});
pick(0);
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(() => pick((cur + 1) % tabs.length), 6000);

/* hide floating Book button near the hero and closing CTA */
const fb = $("#fabBook");
if (fb && "IntersectionObserver" in window) {
  const seen = new Set();
  const io3 = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)); fb.classList.toggle("hide", seen.size > 0); }, { threshold: .2 });
  [".hero", ".closing"].forEach(s => { const el = $(s); if (el) io3.observe(el); });
}

/* install as app (Pro). The doctor opening the installed app goes to the dashboard. */
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
