/* Doctor site template engine. Reads window.SITE from config.js.
   You should not need to edit this file for a new doctor. */
(function () {
const S = window.SITE;
const $ = (q, el = document) => el.querySelector(q);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const D = S.doctor, C = S.contact, IG = S.instagram, CL = S.clinic || {};
const DOCS = S.doctors || []; let DOC = DOCS[0];
const PAY = () => ({ upiId: DOC.upiId || CL.upiId, payeeName: DOC.payeeName || CL.payeeName });

/* ---------- theme + page meta ---------- */
const root = document.documentElement.style;
root.setProperty("--brand", S.theme.brand);
root.setProperty("--brand-deep", S.theme.brandDeep);
root.setProperty("--accent", S.theme.accent);
root.setProperty("--sky", S.theme.light);
root.setProperty("--photo", `url("${D.photo}")`);
document.title = S.meta.title;
$('meta[name="description"]').setAttribute("content", S.meta.description);

/* ---------- icons ---------- */
const ICON = {
  degree: '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
  clinic: '<path d="M3 21h18M5 21V8l7-5 7 5v13M10 21v-6h4v6"/>',
  language: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  registration: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/>'
};
const svg = (k, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${ICON[k] || ICON.award}</svg>`;
const LOGO = '<svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="19" fill="#fff"/><path d="M20 9v22M9 20h22" stroke="var(--brand)" stroke-width="5" stroke-linecap="round"/></svg>';
const IGI = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>';
const WAI = '<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4C2.7 15.6 2.2 13.8 2.2 12 2.2 6.6 6.6 2.2 12 2.2c2.6 0 5.1 1 6.9 2.9 1.8 1.8 2.9 4.3 2.9 6.9 0 5.4-4.4 9.8-9.8 9.8zm8.4-18.2C18.2 1.3 15.2 0 12 0 5.4 0 0 5.4 0 12c0 2.1.6 4.2 1.6 6L0 24l6.2-1.6c1.8 1 3.8 1.5 5.8 1.5 6.6 0 12-5.4 12-12 0-3.2-1.2-6.2-3.6-8.4z"/></svg>';
const igUrl = IG && IG.handle ? `https://www.instagram.com/${IG.handle}/` : "";
const wa = txt => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(txt)}`;
let T = DOC.consultations;
const setDoc = id => { DOC = DOCS.find(d => d.id === id) || DOCS[0]; T = DOC.consultations; };

/* ---------- page ---------- */
const nav = [["about","About"],["experience","Experience"]].concat(DOCS.length > 1 ? [["doctors","Doctors"]] : []).concat([["book","Consultations"]]).concat(igUrl ? [["social","Instagram"]] : [], [["faq","FAQ"],["contact","Contact"]]);
$("#app").innerHTML = `
<div class="navwrap"><div class="pill">
  <a class="brand" href="#top" aria-label="${esc(D.name)} home">${LOGO}<span><b>${esc(S.brand.title)}</b><small>${esc(S.brand.subtitle)}</small></span></a>
  <nav class="links" aria-label="Main">${nav.map(([h, l]) => `<a href="#${h}">${l}</a>`).join("")}</nav>
  <div class="navbtns"><button class="btn btn-line install-btn" id="installNav" hidden aria-label="Install app"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg><span>Install app</span></button><button class="btn btn-light" data-book>Book now</button></div>
</div></div>

<main id="top">
<section class="hero"><span class="arc" aria-hidden="true"></span>
  <div class="wrap hero-grid">
    <div>
      <p class="eyebrow">${esc(D.eyebrow)}</p>
      <h1>${esc(D.name)}</h1>
      <p class="role">${esc(D.role)}</p>
      <p class="lead">${esc(D.lead)}</p>
      <div class="cta"><button class="btn btn-light" data-book>Book a consultation</button><a class="btn btn-line" href="#experience">View experience</a></div>
    </div>
    <div class="portrait"><span class="ring" aria-hidden="true"></span>
      <div class="disc"><img src="${esc(D.photo)}" alt="${esc(D.name)}"></div>
      ${D.badgeNumber ? `<div class="badge"><strong>${esc(D.badgeNumber)}</strong><span>${D.badgeText}</span></div>` : ""}
    </div>
  </div>
</section>

<div class="wrap band"><div class="band-in">
  <h3>${S.stats.headline}</h3>
  ${S.stats.items.map(s => `<div class="stat"><strong data-count="${esc(s.value)}"${s.countFrom ? ` data-from="${s.countFrom}"` : ""}>${esc(s.value)}${s.suffix ? `<span style="font-size:.5em">${esc(s.suffix)}</span>` : ""}</strong><small>${esc(s.label)}</small></div>`).join("")}
</div></div>

<section id="about"><div class="wrap statement rv">
  <h2>${esc(S.about.heading)}</h2>
  <div>${S.about.paragraphs.map(p => `<p>${esc(p)}</p>`).join("")}</div>
</div></section>

<section class="exp" id="experience"><div class="wrap exp-grid">
  <div><p class="eyebrow">Experience</p><h2 style="margin-top:12px">Training and practice</h2>
    <div class="creds">${S.experience.credentials.map(c => `<div class="cred rv">${svg(c.icon)}<div><b>${esc(c.title)}</b><span>${esc(c.text)}</span></div></div>`).join("")}</div>
  </div>
  <div><div class="timeline">${S.experience.timeline.map(t => `<div class="tl rv"><span class="yr">${esc(t.year)}</span><div><b>${esc(t.title)}</b><p>${esc(t.text)}</p></div></div>`).join("")}</div></div>
</div></section>

${DOCS.length > 1 ? `<section id="doctors"><div class="wrap">
  <div class="book-head rv"><div><p class="eyebrow">Our doctors</p><h2 style="margin-top:12px">Choose your doctor</h2><p>Every doctor consults privately by video on this website.</p></div></div>
  <div class="docs">${DOCS.map(d => `<article class="doc-card rv"><img src="${esc(d.photo)}" alt="${esc(d.name)}" loading="lazy"><div><h3>${esc(d.name)}</h3><p class="dt">${esc(d.title)}</p>${d.languages ? `<p class="dl">Speaks ${esc(d.languages)}</p>` : ""}<p>${esc(d.bio)}</p><button class="btn btn-solid" data-book data-doc="${esc(d.id)}">Book with ${esc(d.name.replace(/^Dr\.?\s*/i, "Dr "))}</button></div></article>`).join("")}</div>
</div></section>` : ""}
<section id="book"><div class="wrap">
  <div class="book-head rv">
    <div><p class="eyebrow">Online consultations</p><h2 style="margin-top:12px">Book a video consultation</h2><p>Consult ${esc(D.shortName)} privately by video. ${esc(S.consultations.intro)}</p></div>
    <button class="btn btn-solid" data-book>Start booking</button>
  </div>
  <div class="types">${T.map(t => `<article class="type rv${t.featured ? " feature" : ""}">
    <span class="ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${t.featured ? '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="M16 10l6-3v10l-6-3"/>' : '<path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5"/>'}</svg></span>
    <h3>${esc(t.name)}</h3><div class="meta"><span>${t.inClinic ? "In person" : "Video call"}</span><span>${esc(t.duration)}</span></div>
    <p>${esc(t.text)}</p><button class="go" data-book="${esc(t.calSlug)}">Book ${esc(t.name.toLowerCase())} →</button></article>`).join("")}</div>
  <div class="steps">
    <div class="step rv"><b>Choose a consultation</b><p>Pick the consultation that suits you.</p></div>
    <div class="step rv"><b>Pay by UPI</b><p>Google Pay, PhonePe, Paytm or any UPI app.</p></div>
    <div class="step rv"><b>Pick your time</b><p>Choose a slot from the doctor's live calendar. Your link arrives by email and WhatsApp.</p></div>
    <div class="step rv"><b>Join the call</b><p>The video call opens on this website. No app to install.</p></div>
  </div>
</div></section>

<section class="circle-sec"><div class="wrap"><div class="circle"><div>
  <p class="eyebrow" style="color:var(--sky)">${esc(S.panel.eyebrow)}</p>
  <h2>${esc(S.panel.heading)}</h2><p>${esc(S.panel.text)}</p>
  <div class="ticks">${S.panel.ticks.map(t => `<span>${esc(t)}</span>`).join("")}</div>
  <button class="btn btn-light" data-book>Book a consultation</button>
</div></div></div></section>

${igUrl ? `<section class="insta" id="social"><div class="wrap insta-grid">
  <div><p class="eyebrow">Social media</p><h2 style="margin-top:12px">Follow us on Instagram</h2><p class="sub">${esc(IG.text)}</p>
    <a class="btn btn-ig" href="${igUrl}" target="_blank" rel="noopener">${IGI} Follow on Instagram</a></div>
  <div class="igcard rv-pop">
    <div class="igtop"><span class="igav"><span>${LOGO}</span></span><div><b>@${esc(IG.handle)}</b><small>${esc(IG.displayName)}</small></div></div>
    <div class="igstats"><div><strong>${esc(IG.posts)}</strong><span>Posts</span></div><div><strong>${esc(IG.followers)}</strong><span>Followers</span></div><div><strong>${esc(IG.since)}</strong><span>Since</span></div></div>
    <p class="igbio">${IG.bio}</p>
    <a class="btn btn-solid" href="${igUrl}" target="_blank" rel="noopener">Follow</a>
  </div>
</div></section>` : ""}

<section id="faq" style="padding-top:20px"><div class="wrap faq-grid">
  <div><p class="eyebrow">Questions</p><h2 style="margin-top:12px">Before you book</h2></div>
  <div>${S.faq.map(f => `<details class="rv"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("")}</div>
</div></section>
</main>

<footer id="contact"><div class="wrap">
  <div class="foot rv">
    <div><h3>Booking and enquiries</h3><div class="copyrow"><span id="phone">${esc(C.phoneDisplay)}</span><button class="mini" data-copy="phone">Copy</button></div><p style="margin-top:8px">${esc(C.hours)}</p></div>
    <div><h3>Clinic</h3><p>${[C.clinicName].concat(C.address).map(esc).join("<br>")}</p></div>
    ${igUrl ? `<div><h3>Follow</h3><p>Instagram<br><a href="${igUrl}" target="_blank" rel="noopener">@${esc(IG.handle)}</a></p></div>` : "<div></div>"}
  </div>
  <div class="install-row" id="installRow" hidden><div><b>Get the app</b><span>Book and join consultations from your home screen.</span></div><button class="btn btn-light install-btn" id="installFoot"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M12 3v12M7 10l5 5 5-5M5 21h14"/></svg><span>Install app</span></button></div>
  <div class="legal"><span><a href="doctor.html" class="quiet" aria-label="Clinic login">©</a> ${esc(S.meta.year)} ${esc(D.name)} · ${esc(C.clinicName)}</span><span>Online consultations are not for medical emergencies.</span></div>
</div></footer>

<a class="fab-wa" href="${wa(`Hi, I'd like to book a consultation with ${D.name}.`)}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp"><span class="tip">Chat with us on WhatsApp</span>${WAI}</a>
<button class="fab-book" data-book id="fabBook"><span class="dot"></span>Book appointment</button>`;

/* ---------- booking (same flow as the Dr Murshida site) ----------
   type → UPI payment → doctor's Cal.com calendar (inline) → confirmation.
   Cal.com sends the confirmation email with the video link (consult.html). */
let st = {};
const ov = $("#ov"), box = $("#stepbox"), sheet = $(".sheet");
const type = () => T.find(t => t.calSlug === st.type);
const CALU = () => (DOC.calUser || "").trim();
function openBook(slug, docId) {
  st = { step: 0, type: null, utr: "", doc: docId || "" };
  if (docId) setDoc(docId); else if (DOCS.length > 1) st.step = -1; else setDoc(DOCS[0].id);
  if (slug && T.some(t => t.calSlug === slug)) { st.type = slug; st.step = type().fee > 0 ? 1 : 2; }
  ov.hidden = false; render();
}
document.querySelectorAll("[data-book]").forEach(b => b.addEventListener("click", () => openBook(b.dataset.book || null, b.dataset.doc || (b.dataset.book ? DOCS[0].id : ""))));
const closeSheet = () => { ov.hidden = true; document.body.style.overflow = ""; };
$("#close").onclick = closeSheet;
ov.addEventListener("click", e => { if (e.target === ov) closeSheet(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });

function copyFrom(btn, id) {
  const el = document.getElementById(id);
  const sel = () => { const r = document.createRange(); r.selectNodeContents(el); getSelection().removeAllRanges(); getSelection().addRange(r); };
  try { navigator.clipboard.writeText(el.textContent).then(() => btn.textContent = "Copied", sel); } catch (e) { sel(); }
}
document.querySelectorAll("[data-copy]").forEach(b => b.onclick = () => copyFrom(b, b.dataset.copy));

const upiLink = () => `upi://pay?pa=${encodeURIComponent(PAY().upiId)}&pn=${encodeURIComponent(PAY().payeeName)}&am=${type().fee.toFixed(2)}&cu=INR&tn=${encodeURIComponent(type().name)}`;
function prog() { document.querySelectorAll(".prog i").forEach((i, k) => i.classList.toggle("on", k <= Math.min(Math.max(st.step, 0), 2))); }

/* Cal.com official inline embed loader (same as Murshida site) */
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
let calCount = 0, doneAt = 0;
function findEmail(obj, depth) {
  const own = "";
  if (!obj || depth > 6) return "";
  if (typeof obj === "string") { const m = obj.match(/[\w.+-]+@[\w-]+(\.[\w-]+)+/); return m && m[0].toLowerCase() !== own ? m[0] : ""; }
  if (typeof obj !== "object") return "";
  for (const k of Object.keys(obj)) { if (/organizer|user|owner|host/i.test(k)) continue; const r = findEmail(obj[k], depth + 1); if (r) return r; }
  return "";
}

function findUid(obj, depth) {
  if (!obj || typeof obj !== "object" || depth > 6) return "";
  if (typeof obj.uid === "string" && /^[A-Za-z0-9_-]{3,100}$/.test(obj.uid)) return obj.uid;
  for (const k of Object.keys(obj)) { const r = findUid(obj[k], depth + 1); if (r) return r; }
  return "";
}

function render() {
  prog(); sheet.classList.toggle("wide", st.step === 2);
  const t = type();
  if (st.step === -1) {
    box.innerHTML = `<p class="small">Choose your doctor.</p><div style="display:grid;gap:10px">${DOCS.map(d => `<button class="opt doc-opt" data-d="${esc(d.id)}"><img src="${esc(d.photo)}" alt=""><div><b>${esc(d.name)}</b><span>${esc(d.title)}</span></div></button>`).join("")}</div>`;
    box.querySelectorAll("[data-d]").forEach(b => b.onclick = () => { setDoc(b.dataset.d); st.doc = DOC.id; st.step = 0; render(); });
    return;
  }
  if (st.step === 0) {
    box.innerHTML = `${DOCS.length > 1 ? `<div class="summary"><div><span>Doctor</span><b>${esc(DOC.name)}</b></div></div>` : ""}<p class="small">Choose your consultation type.</p><div style="display:grid;gap:10px">${T.map(x => `<button class="opt" data-t="${esc(x.calSlug)}"><div><b>${esc(x.name)}</b><span>${x.inClinic ? "In person" : "Video call"} · ${esc(x.duration)}</span></div><span class="fee">${x.fee > 0 ? "₹" + x.fee : "Free"}</span></button>`).join("")}</div>`;
    box.querySelectorAll("[data-t]").forEach(b => b.onclick = () => { st.type = b.dataset.t; st.step = type().fee > 0 ? 1 : 2; render(); });
    if (DOCS.length > 1) { const bk = document.createElement("div"); bk.className = "sheet-actions"; bk.innerHTML = `<button class="btn btn-ghost">Change doctor</button>`; bk.firstChild.onclick = () => { st.step = -1; render(); }; box.appendChild(bk); }
  } else if (st.step === 1) {
    box.innerHTML = `<div class="summary"><div><span>${esc(t.name)} (${esc(t.duration)})</span><b>₹${t.fee}</b></div></div>
      <div class="qr"><div id="qr" aria-label="UPI QR code"></div>
      <b>Scan to pay ₹${t.fee}</b>
      <a class="btn btn-solid paylink" href="${upiLink()}">Pay ₹${t.fee} with UPI app</a>
      <div class="upi"><span>${esc(PAY().payeeName)}</span>·<span id="upi">${esc(PAY().upiId)}</span><button id="cu">Copy UPI ID</button></div>
      <div class="apps"><span>Google Pay</span><span>PhonePe</span><span>Paytm</span><span>BHIM</span></div></div>
      <label class="f" for="utr">UPI transaction reference (optional, helps us verify faster)<input id="utr" inputmode="numeric" value="${esc(st.utr)}" placeholder="12-digit reference from your UPI app"></label>
      <p class="err" id="e"></p>
      <div class="sheet-actions"><button class="btn btn-ghost" id="back">Back</button><button class="btn btn-solid" id="paid">I've paid · choose time</button></div>`;
    drawQR();
    $("#cu", box).onclick = e => copyFrom(e.target, "upi");
    $("#back", box).onclick = () => { st.step = 0; render(); };
    $("#paid", box).onclick = () => {
      const u = $("#utr", box).value.replace(/\D/g, "");
      if (u && u.length !== 12) { $("#e", box).textContent = "The UPI reference has 12 digits. Check it, or leave it empty."; return; }
      st.utr = u; st.step = 2; render();
    };
  } else if (st.step === 2) {
    if (HELP() && !st.embed) { ownBooking(t); return; }
    if (!CALU()) {
      box.innerHTML = `<p>Online booking is being set up. Please message the clinic on WhatsApp to book your time.</p>
        <a class="btn btn-solid" target="_blank" rel="noopener" href="${wa(`Hi, I'd like to book a ${t.name} with ${D.name}.${st.utr ? " UPI ref: " + st.utr : ""}`)}">Message on WhatsApp</a>`;
      return;
    }
    box.innerHTML = `${t.fee > 0 ? `<div class="summary"><div><span>${esc(t.name)}</span><b>₹${t.fee} paid by UPI</b></div></div>` : ""}
      <p class="small">Choose your date and time. Please enter your WhatsApp number so we can send your consultation link.</p>
      <div id="calInline" style="min-height:520px"></div>
      <div class="sheet-actions"><button class="btn btn-ghost" id="back">Back</button></div>`;
    $("#back", box).onclick = () => { st.embed = false; st.step = t.fee > 0 ? 1 : 0; render(); };
    const ns = "b" + (++calCount);
    const cfg = { layout: "month_view", theme: "light" };
    if (st.utr) cfg.notes = `UPI ref: ${st.utr} (₹${t.fee})`;
    Cal("init", ns, { origin: "https://app.cal.com" });
    Cal.ns[ns]("inline", { elementOrSelector: "#calInline", calLink: `${CALU()}/${t.calSlug}`, config: cfg });
    Cal.ns[ns]("ui", { theme: "light", hideEventTypeDetails: false, layout: "month_view", cssVarsPerTheme: { light: { "cal-brand": S.theme.brand } } });
    const onDone = e => showDone(e && e.detail && e.detail.data);
    Cal.ns[ns]("on", { action: "bookingSuccessfulV2", callback: onDone });
    Cal.ns[ns]("on", { action: "bookingSuccessful", callback: onDone });
  } else if (st.t) {
    // booked on DotCom's own calendar
    const paid = t.fee > 0;
    const when = `${fmt(st.start, { weekday: "long", day: "numeric", month: "long" })}, ${fmt(st.start, { hour: "numeric", minute: "2-digit" })}`;
    const pend = st.bstatus === "pending";
    const manage = `${location.origin}${location.pathname.replace(/[^/]*$/, "")}manage.html?d=${encodeURIComponent(DOC.id)}&b=${encodeURIComponent(st.uid)}&t=${encodeURIComponent(st.t)}`;
    box.innerHTML = `<div class="done"><span class="tick"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 7"/></svg></span>
      <h3>${pend ? "Booking request received!" : "Your appointment is booked!"}</h3>
      <div class="summary"><div><span>${esc(st.btitle || "Consultation")}${DOCS.length > 1 ? " · " + esc(DOC.name) : ""}</span><b>${esc(when)}</b></div></div>
      <p style="color:var(--muted)">${pend ? (paid ? "The clinic will check your UPI payment and confirm your appointment." : "The clinic will confirm your appointment.") + (st.emails ? " You'll get an email at <b>" + esc(st.email) + "</b>." : " You'll get a message on WhatsApp.") : (st.emails ? "Details are sent to <b>" + esc(st.email) + "</b>." : "")} At your time, join from this website's <b>Consultation room</b>.</p>
      <div class="sheet-actions" style="flex-wrap:wrap"><button class="btn btn-ghost" id="ics">Add to my calendar</button><a class="btn btn-ghost" href="${esc(manage)}" id="mg">Change or cancel</a></div>
      <p class="small">Keep the <b>Change or cancel</b> link — <a href="#" id="cp">copy link</a>.</p>
      <div id="remind"></div>
      <button class="btn btn-solid" id="ok">Close</button></div>`;
    $("#ok", box).onclick = closeSheet;
    remindOffer($("#remind", box));
    $("#cp", box).onclick = e => { e.preventDefault(); (navigator.clipboard ? navigator.clipboard.writeText(manage) : Promise.reject()).then(() => e.target.textContent = "copied ✓").catch(() => prompt("Copy this link:", manage)); };
    $("#ics", box).onclick = () => {
      const z = d => new Date(d).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
      const end = st.bend || new Date(Date.parse(st.start) + 30 * 6e4).toISOString();
      const room = `${location.origin}${location.pathname.replace(/[^/]*$/, "")}consult.html${DOC.id !== "main" ? "?d=" + encodeURIComponent(DOC.id) : ""}`;
      const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//DotCom by Arshees//Booking//EN", "BEGIN:VEVENT", `UID:${st.uid}@dotcom`, `DTSTAMP:${z(Date.now())}`, `DTSTART:${z(st.start)}`, `DTEND:${z(end)}`,
        `SUMMARY:${((st.btitle || "Consultation") + " - " + DOC.name).replace(/[,;]/g, " ")}`, `DESCRIPTION:Join at ${room}\\nChange or cancel: ${manage}`, `URL:${room}`,
        "BEGIN:VALARM", "TRIGGER:-PT30M", "ACTION:DISPLAY", "DESCRIPTION:Consultation in 30 minutes", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "appointment.ics"; document.body.appendChild(a); a.click(); a.remove();
    };
  } else {
    const paid = t.fee > 0;
    box.innerHTML = `<div class="done"><span class="tick"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 7"/></svg></span>
      <h3>${paid ? "Booking request received!" : "Your appointment is booked!"}</h3>
      <p style="color:var(--muted)">${paid ? "We'll verify your UPI payment and confirm your appointment. A <b>confirmation email</b> with your video consultation link will be sent to" : "A <b>confirmation email</b> with your appointment details will be sent to"}</p>
      <p><b>${esc(st.email || "the email address you entered")}</b></p>
      <p class="small">${paid ? "We'll also send the link to your WhatsApp number. " : ""}Please check your Spam / Junk folder if you don't see the email.</p>
      <div id="remind"></div>
      <button class="btn btn-solid" id="ok">Close</button></div>`;
    $("#ok", box).onclick = closeSheet;
    remindOffer($("#remind", box));
  }
}
/* ---------- own booking screen (no Cal.com window) ----------
   Free times come from the helper: DotCom's own calendar (CALENDAR = "own") or, on older setups,
   the doctor's Cal.com behind the scenes. If the helper can't be reached, the old Cal.com calendar
   (or a WhatsApp message) is shown instead (st.embed). */
const HELP = () => ((S.helper && S.helper.url) || "").replace(/\/$/, "");
const TZ = (() => { try { const z = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata"; return z === "Asia/Calcutta" ? "Asia/Kolkata" : z; } catch (e) { return "Asia/Kolkata"; } })();
const ymd = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const fmt = (iso, o) => { try { return new Intl.DateTimeFormat("en-IN", Object.assign({ timeZone: TZ }, o)).format(new Date(iso)); } catch (e) { return iso; } };
async function helperGet(path) {
  const r = await fetch(HELP() + path); const d = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(d.error || "Could not load times."); e.status = r.status; throw e; } return d;
}
function useEmbed() { st.embed = true; st.sub = ""; render(); }
async function loadSlots(t, more) {
  const q = new URLSearchParams({ d: DOC.id, slug: t.calSlug, tz: TZ });
  const from = more && st.until ? st.until : ymd(new Date());
  q.set("from", from); q.set("days", "14");
  const [info, sl] = await Promise.all([st.info ? Promise.resolve(st.info) : helperGet("/book/info?" + new URLSearchParams({ d: DOC.id, slug: t.calSlug })), helperGet("/book/slots?" + q)]);
  st.info = info;
  st.slots = Object.assign(more ? (st.slots || {}) : {}, sl.slots || {});
  st.until = ymd(new Date(new Date(from + "T12:00:00").getTime() + 14 * 864e5));
}
function ownBooking(t) {
  sheet.classList.add("wide");
  const paidLine = t.fee > 0 ? `<div class="summary"><div><span>${esc(t.name)}</span><b>₹${t.fee} paid by UPI</b></div></div>` : "";
  if (st.sub === "form") return ownForm(t, paidLine);
  if (!st.slots || st.slotsFor !== DOC.id + "/" + t.calSlug) {
    box.innerHTML = `${paidLine}<p class="small" aria-live="polite">Loading available times…</p>`;
    st.slotsFor = DOC.id + "/" + t.calSlug; st.info = null; st.slots = null; st.until = "";
    loadSlots(t).then(() => { if (st.step === 2) render(); }).catch(() => { if (st.step === 2) useEmbed(); });
    return;
  }
  const days = []; const start = new Date(); start.setHours(12, 0, 0, 0);
  const n = Math.round((new Date(st.until + "T12:00:00") - start) / 864e5);
  for (let i = 0; i < n; i++) days.push(ymd(new Date(start.getTime() + i * 864e5)));
  const open = days.filter(d => st.slots[d] && st.slots[d].length);
  if (!st.day || !open.includes(st.day)) st.day = open[0] || "";
  const times = st.day ? st.slots[st.day] : [];
  const part = iso => { const h = +fmt(iso, { hour: "numeric", hourCycle: "h23" }); return h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening"; };
  const groups = {}; times.forEach(iso => (groups[part(iso)] = groups[part(iso)] || []).push(iso));
  box.innerHTML = `${paidLine}
    ${st.msg ? `<p class="err">${esc(st.msg)}</p>` : ""}
    <p class="small"><b>Choose a day</b>${TZ !== "Asia/Kolkata" ? ` · times shown in your time (${esc(TZ.replace(/_/g, " "))})` : ""}</p>
    <div class="days">${days.map(d => { const has = st.slots[d] && st.slots[d].length; const dt = d + "T12:00:00"; return `<button class="chip" data-day="${d}" aria-pressed="${d === st.day}" ${has ? "" : "disabled"}><small>${new Date(dt).toLocaleDateString("en-IN", { weekday: "short" })}</small>${new Date(dt).getDate()}<small>${new Date(dt).toLocaleDateString("en-IN", { month: "short" })}</small></button>`; }).join("")}</div>
    <button class="btn btn-ghost" id="more" style="justify-self:start">More dates →</button>
    ${st.day ? `<p class="small"><b>${esc(new Date(st.day + "T12:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }))}</b> · ${esc(st.info && st.info.length ? st.info.length + " min" : t.duration)}</p>
      ${Object.entries(groups).map(([g, l]) => `<p class="small" style="margin:6px 0 0">${g}</p><div class="slots">${l.map(iso => `<button class="chip" data-time="${esc(iso)}">${esc(fmt(iso, { hour: "numeric", minute: "2-digit" }))}</button>`).join("")}</div>`).join("")}`
      : `<p>No free times in these dates. Tap <b>More dates</b>, or message the clinic.</p>`}
    <div class="sheet-actions"><button class="btn btn-ghost" id="back">Back</button></div>
    <p class="small" style="text-align:center"><a href="#" id="alt">${CALU() ? "Having trouble? Use the full calendar" : "Having trouble? Message the clinic on WhatsApp"}</a></p>`;
  st.msg = "";
  box.querySelectorAll("[data-day]").forEach(b => b.onclick = () => { st.day = b.dataset.day; render(); });
  box.querySelectorAll("[data-time]").forEach(b => b.onclick = () => { st.time = b.dataset.time; st.sub = "form"; render(); });
  $("#more", box).onclick = e => { e.target.disabled = true; e.target.textContent = "Loading…"; loadSlots(t, true).then(render).catch(() => { e.target.textContent = "Couldn't load — try again"; e.target.disabled = false; }); };
  $("#back", box).onclick = () => { st.slots = null; st.step = t.fee > 0 ? 1 : 0; render(); };
  $("#alt", box).onclick = e => { e.preventDefault(); if (CALU()) useEmbed(); else window.open(wa(`Hello, I would like to book a ${t.name}${DOCS.length > 1 ? " with " + DOC.name : ""}.`), "_blank"); };
}
function ownForm(t, paidLine) {
  const f = st.form || (st.form = { name: "", email: "", phone: "+91 ", notes: "", extra: {} });
  const info = st.info || {}; const phoneReq = !info.phone || info.phone.required;
  const fieldHtml = x => {
    const v = f.extra[x.slug] ?? "", id = "x_" + x.slug, lab = esc(x.label) + (x.required ? "" : " (optional)");
    if (x.type === "textarea") return `<label class="f">${lab}<textarea id="${id}">${esc(v)}</textarea></label>`;
    if ((x.type === "select" || x.type === "radio") && x.options.length) return `<label class="f">${lab}<select id="${id}"><option value=""></option>${x.options.map(o => `<option ${o === v ? "selected" : ""}>${esc(o)}</option>`).join("")}</select></label>`;
    if (x.type === "boolean" || x.type === "checkbox") return `<label class="f" style="display:flex;gap:8px;align-items:center;font-weight:400"><input type="checkbox" id="${id}" style="width:auto" ${v === true ? "checked" : ""}>${lab}</label>`;
    return `<label class="f">${lab}<input id="${id}" ${x.type === "number" ? 'inputmode="numeric"' : ""} value="${esc(v)}"></label>`;
  };
  box.innerHTML = `<div class="summary"><div><span>${esc(t.name)}${DOCS.length > 1 ? " · " + esc(DOC.name) : ""}</span><b>${esc(fmt(st.time, { weekday: "short", day: "numeric", month: "short" }))}, ${esc(fmt(st.time, { hour: "numeric", minute: "2-digit" }))}</b></div>${t.fee > 0 ? `<div><span>Fee</span><b>₹${t.fee} paid by UPI</b></div>` : ""}</div>
    <label class="f">Full name<input id="bn" autocomplete="name" value="${esc(f.name)}"></label>
    <label class="f">Email (your confirmation and video link come here)<input id="be" type="email" autocomplete="email" value="${esc(f.email)}"></label>
    <label class="f">WhatsApp number${phoneReq ? "" : " (optional)"}<input id="bp" type="tel" autocomplete="tel" inputmode="tel" value="${esc(f.phone)}"></label>
    ${(info.fields || []).map(fieldHtml).join("")}
    <label class="f">Anything the doctor should know? (optional)<textarea id="bnotes" placeholder="Main complaint, how long, current medicines">${esc(f.notes)}</textarea></label>
    <p class="err" id="e"></p>
    <div class="sheet-actions"><button class="btn btn-ghost" id="back">Change time</button><button class="btn btn-solid" id="go">Confirm booking</button></div>`;
  const save = () => {
    f.name = $("#bn", box).value.trim(); f.email = $("#be", box).value.trim(); f.phone = $("#bp", box).value.trim(); f.notes = $("#bnotes", box).value.trim();
    (info.fields || []).forEach(x => { const el = $("#x_" + x.slug, box); if (el) f.extra[x.slug] = el.type === "checkbox" ? el.checked : el.value.trim(); });
  };
  $("#back", box).onclick = () => { save(); st.sub = ""; render(); };
  $("#go", box).onclick = async () => {
    save(); const e = $("#e", box), go = $("#go", box);
    const digits = f.phone.replace(/\D/g, "");
    if (f.name.length < 2) return e.textContent = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) return e.textContent = "Please enter a valid email address.";
    if ((phoneReq || digits.length > 3) && (digits.length < 10 || digits.length > 15)) return e.textContent = "Please enter your WhatsApp number with country code, e.g. +91 98765 43210.";
    const miss = (info.fields || []).find(x => x.required && (f.extra[x.slug] === "" || f.extra[x.slug] === undefined || f.extra[x.slug] === false));
    if (miss) return e.textContent = "Please fill in: " + miss.label;
    go.disabled = true; go.textContent = "Booking…"; e.textContent = "";
    try {
      const r = await fetch(HELP() + "/book/create", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ d: DOC.id, slug: t.calSlug, start: st.time, tz: TZ, name: f.name, email: f.email, phone: digits.length > 3 ? f.phone : "", notes: f.notes, extra: f.extra, utr: st.utr }) });
      const d = await r.json().catch(() => ({}));
      if (r.status === 409) { st.msg = d.error || "That time was just taken. Please choose another."; st.sub = ""; st.slots = null; render(); return; }
      if (!r.ok || !d.uid) throw new Error(d.error || "The booking could not be saved. Please try again.");
      st.email = d.email || f.email; st.uid = d.uid; st.t = d.t || ""; st.start = d.start || st.time; st.bend = d.end || ""; st.bstatus = d.status; st.emails = !!d.emails; st.btitle = t.name;
      st.form = null; st.sub = ""; st.slots = null; st.step = 3; render();
    } catch (x) { e.textContent = x.message; go.disabled = false; go.textContent = "Confirm booking"; }
  };
}
function showDone(data) {
  if (Date.now() - doneAt < 4000) return;   // both Cal events fire for one booking
  doneAt = Date.now(); st.email = findEmail(data, 0); st.uid = findUid(data, 0); st.step = 3; render();
}
/* ---------- optional app reminders for the patient (Pro) ---------- */
function remindOffer(el) {
  const H = (S.helper && S.helper.url || "").replace(/\/$/, "");
  if (!el || !H || !st.uid) return;
  const ua = navigator.userAgent;
  const isIOS = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
    if (isIOS && !standalone) el.innerHTML = `<p class="small remind-note">On iPhone, app reminders work after adding this site to your Home Screen. You'll still get your reminders on WhatsApp.</p>`;
    return;
  }
  if (Notification.permission === "denied") return;
  el.innerHTML = `<div class="remind-box"><b>Get a reminder on this phone</b><span>A notification 1 day and 1 hour before your consultation, with the link to join. Optional — WhatsApp reminders come anyway.</span><button class="btn btn-ghost" id="remindBtn">Turn on reminders</button></div>`;
  $("#remindBtn", el).onclick = async () => {
    const btn = $("#remindBtn", el); btn.disabled = true; btn.textContent = "Turning on…";
    try {
      if ((await Notification.requestPermission()) !== "granted") throw new Error("Notifications were not allowed.");
      const reg = await navigator.serviceWorker.register("sw.js"); await navigator.serviceWorker.ready;
      const { key } = await (await fetch(H + "/vapid")).json();
      const raw = atob(key.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((key.length + 3) % 4));
      let sub = await reg.pushManager.getSubscription();
      if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: Uint8Array.from(raw, c => c.charCodeAt(0)) });
      const r = await fetch(H + "/patient-subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ doctor: DOC.id, uid: st.uid, endpoint: sub.endpoint }) });
      const d = await r.json(); if (!r.ok || !d.token) throw new Error(d.error || "Could not turn on reminders.");
      const c = await caches.open("patient-reminders"); const m = await c.match("list");
      const list = (m ? await m.json() : []).filter(x => x.until > Date.now() && x.uid !== st.uid);
      list.push({ uid: st.uid, t: d.token, until: Date.now() + 40 * 864e5 });
      await c.put("list", new Response(JSON.stringify(list)));
      el.innerHTML = `<p class="small remind-note">✓ Reminders are on for this phone.</p>`;
    } catch (e) { el.innerHTML = `<p class="small remind-note">${esc(e.message || "Could not turn on reminders.")} You'll still get your reminders on WhatsApp.</p>`; }
  };
}
function drawQR() {
  const el = $("#qr", box);
  if (typeof qrcode !== "function") { el.innerHTML = '<p class="small">Use the UPI ID below to pay.</p>'; return; }
  const q = qrcode(0, "M"); q.addData(upiLink()); q.make();
  el.innerHTML = q.createImgTag(6, 0, "UPI QR code");
}

/* ---------- follow-up links: ?doctor=<id>#book opens booking for that doctor ---------- */
(function () { const q = new URLSearchParams(location.search).get("doctor"); if (q && DOCS.some(d => d.id === q)) addEventListener("load", () => setTimeout(() => openBook(null, q), 400)); })();

/* ---------- install as app (Standard) ---------- */
if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
(function () {
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  let docToken = ""; try { docToken = localStorage.getItem("docToken") || ""; } catch (e) {}
  // the doctor opening the installed app goes straight to their dashboard
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
    const d = document.createElement("div"); d.className = "overlay"; d.innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><div class="sheet-top"><h3>Install the app</h3><button class="x" aria-label="Close">×</button></div>
      <ol class="inst">${isIOS ? "<li>Tap the <b>Share</b> button at the bottom of Safari</li><li>Scroll down and tap <b>Add to Home Screen</b></li><li>Tap <b>Add</b></li>" : "<li>Open the browser menu <b>⋮</b> (top right)</li><li>Tap <b>Install app</b> or <b>Add to Home screen</b></li><li>Tap <b>Install</b></li>"}</ol></div>`;
    document.body.appendChild(d); d.addEventListener("click", e => { if (e.target === d || e.target.closest(".x")) d.remove(); });
  };
  btns.forEach(b => b && (b.onclick = async () => { if (prompt) { prompt.prompt(); await prompt.userChoice.catch(() => {}); prompt = null; } else help(); }));
})();

/* ---------- count-up stats ---------- */
(function () {
  const els = document.querySelectorAll("[data-count]");
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; io.unobserve(e.target);
    const el = e.target, to = +el.dataset.count, from = +(el.dataset.from || 0), t0 = performance.now(), d = 1400;
    if (isNaN(to)) return;
    (function f(t) { const k = Math.min(1, (t - t0) / d), v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))); el.firstChild.nodeValue = v; if (k < 1) requestAnimationFrame(f); })(t0);
  }), { threshold: .6 });
  els.forEach(e => io.observe(e));
})();
/* hide floating Book button while the booking section is on screen */
(function () {
  const fb = $("#fabBook"), bk = $("#book"); if (!fb || !bk || !("IntersectionObserver" in window)) return;
  new IntersectionObserver(es => fb.classList.toggle("hide", es[0].isIntersecting), { threshold: .25 }).observe(bk);
})();
})();
