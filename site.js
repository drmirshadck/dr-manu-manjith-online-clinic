/* Dr Manu Manjith — cosmic site motion (own code, no libraries).
   Starfield, dotted orb, scroll-scrubbed scenes, word reveals, parallax, stacked cards, wave lines, install app.
   Booking lives in booking.js (built from the DotCom template). */
(function () {
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const small = () => innerWidth < 640;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => 1 - Math.pow(1 - t, 3);
const DPR = Math.min(2, devicePixelRatio || 1);

/* ---------- star texture for cards (one canvas → data URL) ---------- */
(function () {
  const c = document.createElement("canvas"); c.width = c.height = 600;
  const g = c.getContext("2d");
  for (let i = 0; i < 260; i++) {
    const r = Math.random() < .9 ? Math.random() * .9 + .2 : Math.random() * 1.6 + .8;
    g.fillStyle = `rgba(255,255,255,${(Math.random() * .7 + .2).toFixed(2)})`;
    g.beginPath(); g.arc(Math.random() * 600, Math.random() * 600, r, 0, 7); g.fill();
  }
  document.documentElement.style.setProperty("--stars", `url(${c.toDataURL()})`);
})();

/* ---------- canvas helpers ---------- */
function fit(cv) {
  const r = cv.getBoundingClientRect();
  cv.width = Math.max(1, r.width * DPR); cv.height = Math.max(1, r.height * DPR);
  return [cv.width, cv.height];
}
const visible = new Map();
const vio = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => visible.set(e.target, e.isIntersecting)), { rootMargin: "100px" }) : null;
function watch(el) { visible.set(el, true); vio && vio.observe(el); }

/* ---------- hero starfield ---------- */
const starsCv = $("#heroStars");
let stars = [], SW = 0, SH = 0;
function initStars() {
  [SW, SH] = fit(starsCv);
  const n = Math.round((SW * SH) / (small() ? 5200 : 3800) / DPR);
  stars = Array.from({ length: n }, () => ({ x: Math.random() * SW, y: Math.random() * SH, r: (Math.random() < .92 ? Math.random() * .9 + .3 : Math.random() * 1.6 + 1) * DPR, t: Math.random() * 6.3, s: Math.random() * .02 + .005, v: Math.random() * .08 + .02 }));
}
function drawStars() {
  const g = starsCv.getContext("2d"); g.clearRect(0, 0, SW, SH);
  for (const s of stars) {
    s.t += s.s; if (!reduce) { s.y -= s.v * DPR; if (s.y < -4) s.y = SH + 4; }
    g.globalAlpha = .35 + .65 * (0.5 + 0.5 * Math.sin(s.t));
    g.fillStyle = "#fff"; g.beginPath(); g.arc(s.x, s.y, s.r, 0, 7); g.fill();
  }
  g.globalAlpha = 1;
}

/* ---------- dotted orb (points on a sphere, wobbling with layered sines) ---------- */
const orbCv = $("#orb");
let OW = 0, OH = 0, pts = [];
function initOrb() {
  [OW, OH] = fit(orbCv);
  const N = small() ? 1300 : 2600; pts = [];
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, rr = Math.sqrt(1 - y * y), th = ga * i;
    pts.push([Math.cos(th) * rr, y, Math.sin(th) * rr]);
  }
}
function drawOrb(t) {
  const g = orbCv.getContext("2d"); g.clearRect(0, 0, OW, OH);
  const R = Math.min(OW, OH) * .36, cx = OW / 2, cy = OH / 2;
  const rot = t * .00012, cr = Math.cos(rot), sr = Math.sin(rot), tilt = .35, ct = Math.cos(tilt), st = Math.sin(tilt);
  for (const [x0, y0, z0] of pts) {
    const w = 1 + .13 * Math.sin(3 * x0 + t * .0011) * Math.cos(2.4 * y0 - t * .0009) + .07 * Math.sin(5 * z0 + t * .0015);
    let x = x0 * w, y = y0 * w, z = z0 * w;
    const x1 = x * cr - z * sr, z1 = x * sr + z * cr;
    const y1 = y * ct - z1 * st, z2 = y * st + z1 * ct;
    const p = 1.9 / (2.6 - z2), sx = cx + x1 * R * p, sy = cy + y1 * R * p;
    const d = (z2 + 1.2) / 2.4;
    g.globalAlpha = .12 + .8 * d * d;
    g.fillStyle = d > .62 ? "#efe9ff" : "#b9a8ff";
    g.fillRect(sx, sy, (.9 + 1.4 * d) * DPR, (.9 + 1.4 * d) * DPR);
  }
  g.globalAlpha = 1;
}

/* ---------- wave lines ---------- */
const waveCv = $("#wave");
let WW = 0, WH = 0;
function drawWave(t, prog) {
  const g = waveCv.getContext("2d"); g.clearRect(0, 0, WW, WH);
  const lines = small() ? 34 : 56, amp = WH * .06;
  for (let i = 0; i < lines; i++) {
    const k = i / lines;
    const grad = g.createLinearGradient(0, 0, WW, WH);
    grad.addColorStop(0, `rgba(60,70,255,${.0 + .9 * Math.sin(k * Math.PI)})`);
    grad.addColorStop(.55, `rgba(140,80,255,${.9 * Math.sin(k * Math.PI)})`);
    grad.addColorStop(1, "rgba(200,120,255,0)");
    g.strokeStyle = grad; g.lineWidth = (small() ? 3 : 4.5) * DPR; g.beginPath();
    for (let x = -20; x <= WW + 20; x += 18 * DPR) {
      const nx = x / WW;
      const y = WH * (.15 + k * .75) + (nx - .5) * WH * -.35
        + Math.sin(nx * 5.2 + t * .0006 + k * 3.1) * amp
        + Math.sin(nx * 2.1 - t * .0004 + k * 6) * amp * .8;
      x < 0 ? g.moveTo(x, y) : g.lineTo(x, y);
    }
    g.globalAlpha = .55 + .45 * Math.sin(k * Math.PI);
    g.stroke();
  }
  g.globalAlpha = 1;
  const word = $("#waveWord");
  const b = lerp(18, 0, ease(clamp(prog * 1.6 - .2))), o = lerp(.2, 1, ease(clamp(prog * 1.6 - .2)));
  word.style.filter = `blur(${b.toFixed(1)}px)`; word.style.opacity = o.toFixed(2);
}

/* ---------- split paragraphs into words ---------- */
$$(".reveal-words").forEach(p => {
  p.innerHTML = p.textContent.trim().split(/\s+/).map(w => `<span class="rw">${w}</span>`).join(" ");
});

/* ---------- scroll scenes ---------- */
const seedCircles = $$("#seedBig .sc");
const seedStart = [[-330, -200], [330, -200], [0, 0], [-330, 200], [330, 200], [-560, 0], [560, 0]];
const seedEnd = [[0, 0]].concat([0, 1, 2, 3, 4, 5].map(k => [56 * Math.cos(k * Math.PI / 3 - Math.PI / 2), 56 * Math.sin(k * Math.PI / 3 - Math.PI / 2)]));
const stTokens = $$("#stWords .w, #stWords .pill");
const jrCards = $$(".jr-cards>*");
const stackCards = $$(".stack-card");
const hpCard = $(".hp-card");

function progressOf(el) {
  const r = el.getBoundingClientRect(), total = r.height - innerHeight;
  return total > 0 ? clamp(-r.top / total) : clamp((innerHeight - r.top) / (innerHeight + r.height));
}

function scenes() {
  const vh = innerHeight;
  // hero portrait straightens as you scroll
  if (hpCard && !reduce) {
    const p = clamp(scrollY / (vh * .8));
    hpCard.style.transform = `rotate(${lerp(-14, 0, ease(p))}deg) translateY(${lerp(60, -20, ease(p))}px) scale(${lerp(1, 1.04, p)})`;
    if (p > 0) hpCard.style.animation = "none";
  }
  // circles converge into the seed of life
  const cp = ease(clamp(progressOf($("#converge")) * 1.25));
  const sc = small() ? .55 : 1;
  seedCircles.forEach((c, i) => {
    const [x0, y0] = seedStart[i], [x1, y1] = seedEnd[i];
    c.setAttribute("cx", (lerp(x0 * sc, x1, cp)).toFixed(1));
    c.setAttribute("cy", (lerp(y0 * sc, y1, cp)).toFixed(1));
    c.setAttribute("r", lerp(sc * 46, 56, cp).toFixed(1));
  });
  $("#seedBig").style.transform = `rotate(${lerp(-30, 0, cp)}deg) scale(${lerp(1, 1.15, cp)})`;
  // statement words: blur in one by one, older ones soften
  const sp = progressOf($("#counselling"));
  const n = stTokens.length, cur = sp * (n + 3) - 1;
  stTokens.forEach((t, i) => {
    t.classList.toggle("on", i <= cur && i > cur - 5.5);
    t.classList.toggle("past", i <= cur - 5.5);
  });
  // journey: title sharpens, cards drift at different speeds
  const jEl = $("#how"), jp = progressOf(jEl);
  if (!small()) {
    jrCards.forEach(c => {
      const s = +c.dataset.speed || .4;
      c.style.transform = `translate3d(0,${(-jp * s * vh * 1.6).toFixed(1)}px,0)`;
    });
    $(".jt1").style.filter = `blur(${lerp(10, 0, clamp(jp * 4)).toFixed(1)}px)`;
    $(".jt2").style.filter = `blur(${lerp(10, 2, clamp(jp * 3 - .2)).toFixed(1)}px)`;
  }
  // stacked cards: earlier cards shrink and dim as the next arrives
  stackCards.forEach((c, i) => {
    const next = stackCards[i + 1]; if (!next) return;
    const r = next.getBoundingClientRect(), top = parseFloat(getComputedStyle(next).top);
    const k = clamp(1 - (r.top - top) / (vh * .8));
    c.style.transform = `scale(${lerp(1, .93, k)})`; c.style.filter = `brightness(${lerp(1, .55, k)})`;
  });
  // word-by-word paragraph reveal
  $$(".reveal-words").forEach(p => {
    const r = p.getBoundingClientRect();
    const k = clamp((vh * .9 - r.top) / (r.height + vh * .45));
    const words = p.children, on = Math.floor(k * words.length * 1.05);
    for (let i = 0; i < words.length; i++) words[i].classList.toggle("on", i < on);
  });
  // hide floating CTA near the CTA card and footer
  const cta = $("#heroCta"), cr = $(".cta-card").getBoundingClientRect(), fr = $(".foot").getBoundingClientRect();
  cta.classList.toggle("hide", (cr.top < vh && cr.bottom > 0) || fr.top < vh);
}

/* ---------- in-view classes for small animations ---------- */
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .35 });
  $$(".feat, .ring-card, .mini").forEach(el => io.observe(el));
} else $$(".feat, .ring-card, .mini").forEach(el => el.classList.add("in"));

/* ---------- main loop ---------- */
function resize() { initStars(); initOrb(); [WW, WH] = fit(waveCv); scenes(); }
watch(starsCv); watch(waveCv);
let ticking = false;
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { scenes(); ticking = false; }); } }, { passive: true });
let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
resize();
function frame(t) {
  if (visible.get(starsCv)) { drawStars(); drawOrb(reduce ? 0 : t); }
  if (visible.get(waveCv)) drawWave(reduce ? 0 : t, progressOf($(".wave-sec")));
  if (!reduce) requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
if (reduce) { drawStars(); drawOrb(0); drawWave(0, 1); }

/* ---------- install as app (Pro). Doctor opening the installed app goes to the dashboard. ---------- */
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
