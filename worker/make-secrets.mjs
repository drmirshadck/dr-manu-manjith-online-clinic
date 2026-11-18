// Makes the per-clinic secrets for the Pro helper.
// Usage: node make-secrets.mjs <doctorId>=<PIN> [<doctorId>=<PIN> ...] desk=<PIN>
//   e.g. node make-secrets.mjs anish=482915 desk=731604
// Prints values to paste into Cloudflare → Worker → Settings → Variables and secrets (type: Secret).
// CAL_KEYS / DAILY_KEYS: {"<doctorId>":"<key>"} from each doctor's own accounts. WA_TOKEN: from Meta.
import { webcrypto as c } from "node:crypto";
const pairs = process.argv.slice(2).filter(a => !a.startsWith("--")).map(a => a.split("="));
if (!pairs.length || pairs.some(([id, pin]) => !/^[a-z0-9]+$/i.test(id || "") || !/^\d{4,8}$/.test(pin || ""))) {
  console.error("Usage: node make-secrets.mjs anish=482915 desk=731604   (PINs 4–8 digits, ids letters/numbers)"); process.exit(1);
}
if (new Set(pairs.map(p => p[1])).size !== pairs.length) { console.error("Every person needs a different PIN."); process.exit(1); }
const hex = u => Buffer.from(u).toString("hex"), b64u = u => Buffer.from(u).toString("base64url");
const rand = n => b64u(c.getRandomValues(new Uint8Array(n)));
const pins = {};
for (const [id, pin] of pairs) pins[id] = hex(await c.subtle.digest("SHA-256", new TextEncoder().encode("dotcom-pin:" + pin)));
const kp = await c.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
const jwk = await c.subtle.exportKey("jwk", kp.privateKey);
const out = {
  PINS: JSON.stringify(pins),
  SESSION_SECRET: rand(32),
  DATA_KEY: rand(32),   // own calendar: encrypts patient details. Keep a copy in Studio Desk; never change it once bookings exist.
  CAL_WEBHOOK_SECRET: rand(24),
  VAPID_PUBLIC_KEY: b64u(new Uint8Array(await c.subtle.exportKey("raw", kp.publicKey))),
  VAPID_PRIVATE_JWK: JSON.stringify({ kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y, d: jwk.d })
};
if (process.argv.includes("--json")) console.log(JSON.stringify(out));
else for (const [k, v] of Object.entries(out)) console.log(`${k}\n${v}\n`);
