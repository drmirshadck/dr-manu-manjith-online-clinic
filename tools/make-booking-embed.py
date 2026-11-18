#!/usr/bin/env python3
"""Build booking.js: the template's booking flow as ONE drop-in file for any page/design.

  python3 tools/make-booking-embed.py out/booking.js

The page needs: config.js (same window.SITE format as the template) loaded first, qrcode.js,
and buttons with data-book (optional data-doc="<doctor id>", data-book="<consultation slug>").
All styles are scoped under #dcb-ov so the page's own CSS is not touched.
"""
import re, sys, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
app = (root / "app.js").read_text()
css = (root / "style.css").read_text()

# ---- JS: booking part of app.js ----
a = app.index("/* ---------- booking (same flow")
b = app.index("/* ---------- install as app")
js = app[a:b]
if "/* ---------- ?doctor=<id>#book" in app:
    q = app.index("/* ---------- ?doctor=<id>#book")
    js += app[q:app.rindex("})();")]
js = js.replace('const ov = $("#ov"), box = $("#stepbox"), sheet = $(".sheet");',
                'const ov = SR.getElementById("dcb-ov"), box = SR.getElementById("stepbox"), sheet = SR.querySelector(".sheet");')
js = js.replace('$("#close").onclick = closeSheet;', 'SR.getElementById("close").onclick = closeSheet;')
js = js.replace('document.querySelectorAll(".prog i")', 'SR.querySelectorAll(".prog i")')
js = js.replace('const el = document.getElementById(id);', 'const el = SR.getElementById(id);')
js = js.replace('document.querySelectorAll("[data-copy]")', 'ov.querySelectorAll("[data-copy]")')
# open: also lock page scroll
js = js.replace("ov.hidden = false; render();", "ov.hidden = false; document.body.style.overflow = \"hidden\"; render();")

pre = r'''/* DotCom by Arshees — booking (drop-in). Built from the template by tools/make-booking-embed.py — do not edit by hand.
   Needs config.js (window.SITE) and qrcode.js before this file; opens on any element with data-book. */
(function () {
const S = window.SITE;
const $ = (q, el = document) => el.querySelector(q);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const D = S.doctor, C = S.contact;
const BASEDOC = { id: "main", name: D.name, photo: D.photo, title: D.role, bio: "", languages: "", calUser: (S.cal && S.cal.username) || "", doctorEmail: (S.cal && S.cal.doctorEmail) || "", roomUrl: (S.video && S.video.roomUrl) || "", upiId: S.payment.upiId, payeeName: S.payment.payeeName, consultations: S.consultations.types };
const DOCS = (S.doctors && S.doctors.length) ? S.doctors.map(d => Object.assign({}, BASEDOC, { bio: "", languages: "", calUser: "", doctorEmail: "", roomUrl: "" }, d, { consultations: (d.consultations && d.consultations.length) ? d.consultations : S.consultations.types })) : [BASEDOC];
let DOC = DOCS[0];
const PAY = () => ({ upiId: DOC.upiId || S.payment.upiId, payeeName: DOC.payeeName || S.payment.payeeName });
const wa = txt => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(txt)}`;
let T = DOC.consultations;
const setDoc = id => { DOC = DOCS.find(d => d.id === id) || DOCS[0]; T = DOC.consultations; };

/* booking window in its own Shadow DOM: the page's styles can't reach it */
const host = document.createElement("div"); host.id = "dcb-host"; document.body.appendChild(host);
const SR = host.attachShadow({ mode: "open" });
const st0 = document.createElement("style"); st0.textContent = __CSS__; SR.appendChild(st0);
const ovEl = document.createElement("div");
ovEl.className = "overlay"; ovEl.id = "dcb-ov"; ovEl.hidden = true;
ovEl.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="dcb-title"><div class="sheet-top"><h3 id="dcb-title">Book a consultation</h3><button class="x" id="close" aria-label="Close">×</button></div><div class="prog" aria-hidden="true"><i></i><i></i><i></i></div><div id="stepbox"></div></div>`;
SR.appendChild(ovEl);
const vars = ovEl.style;
vars.setProperty("--brand", S.theme.brand); vars.setProperty("--brand-deep", S.theme.brandDeep); vars.setProperty("--accent", S.theme.accent);

'''
# ---- CSS: booking sheet rules, scoped ----
c1 = css.index("/* booking sheet */")
c2 = css.index("/* Standard: install app")
c3 = css.index("/* Pro: doctors list */")
body = css[c1:c2] + css[css.index(".doc-opt{", c3):]
body = re.sub(r"@media \(prefers-reduced-motion:reduce\)\{[^}]*\}\}", "", body)
body = re.sub(r"/\*.*?\*/", "", body, flags=re.S)
def scope(rule_sel):
    out = []
    for s in rule_sel.split(","):
        s = s.strip()
        if s == ".overlay": out.append("#dcb-ov.overlay")
        else: out.append("#dcb-ov " + s)
    return ",".join(out)
def scope_block(text):
    res, i = [], 0
    for m in re.finditer(r"([^{}]+)\{([^{}]*)\}", text):
        sel = m.group(1).strip()
        res.append(f"{scope(sel)}{{{m.group(2)}}}")
    return "\n".join(res)
# media queries
parts = re.split(r"(@media[^{]+\{(?:[^{}]*\{[^{}]*\})*[^{}]*\})", body)
scoped = []
for p_ in parts:
    if p_.startswith("@media"):
        head = p_[:p_.index("{")]; inner = p_[p_.index("{")+1:-1]
        scoped.append(head + "{" + scope_block(inner) + "}")
    else:
        scoped.append(scope_block(p_))
base = """
#dcb-ov{--teal:var(--brand);--teal-deep:var(--brand-deep);--coral:var(--accent);--bg:#fff;--soft:color-mix(in srgb,var(--brand) 8%,#fff);--surface:#fff;--fg:#1d3239;--muted:#5d727a;--line:color-mix(in srgb,var(--brand) 14%,#e6e6e6);--on-teal:#fff;--display:"Outfit","Avenir Next","Segoe UI",system-ui,sans-serif;--body:"Nunito Sans",system-ui,-apple-system,sans-serif;font-family:var(--body);font-size:16px;line-height:1.55;color:var(--fg);text-align:left}
#dcb-ov[hidden]{display:none!important}
#dcb-ov *{box-sizing:border-box;letter-spacing:normal}
#dcb-ov h3{margin:0;font-family:var(--display);color:var(--fg)}
#dcb-ov p{margin:0}
#dcb-ov a{color:var(--teal-deep)}
#dcb-ov .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:999px;padding:12px 22px;font:700 .8rem var(--display);letter-spacing:.08em;text-transform:uppercase;cursor:pointer;text-decoration:none;box-shadow:none;width:auto;min-height:0;transform:none}
#dcb-ov .btn::before,#dcb-ov .btn::after{display:none}
#dcb-ov .btn-solid{background:var(--teal);color:var(--on-teal)}
#dcb-ov .btn:disabled{opacity:.6;cursor:default}
"""
allcss = base + "\n".join(scoped)
import json
out = pre.replace("__CSS__", json.dumps(allcss)) + js + "})();\n"
dest = pathlib.Path(sys.argv[1]); dest.parent.mkdir(parents=True, exist_ok=True); dest.write_text(out)
print("wrote", dest, len(out), "bytes")
