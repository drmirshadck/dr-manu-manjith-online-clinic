"""Make the app icons from config.js colours and the doctor's initials.
Run per doctor:  python3 make_icons.py"""
import re, os
from PIL import Image, ImageDraw, ImageFont
cfg = open(os.path.join(os.path.dirname(__file__) or ".", "config.js")).read()
col = re.search(r'brandDeep:\s*"(#[0-9a-fA-F]{6})"', cfg).group(1)
acc = re.search(r'light:\s*"(#[0-9a-fA-F]{6})"', cfg).group(1)
name = re.search(r'name:\s*"([^"]+)"', cfg).group(1)
ini = "".join(w[0] for w in re.sub(r"^Dr\.?\s*", "", name).split()[:2]).upper()
for size in (192, 512):
    im = Image.new("RGB", (size, size), col); d = ImageDraw.Draw(im)
    try: f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", int(size * .36))
    except OSError: f = ImageFont.load_default()
    w = d.textbbox((0, 0), ini, font=f); d.text(((size - (w[2]-w[0])) / 2 - w[0], (size - (w[3]-w[1])) / 2 - w[1]), ini, fill=acc, font=f)
    im.save(os.path.join(os.path.dirname(__file__) or ".", f"icons/icon-{size}.png"))
print("icons made for", name, ini)
