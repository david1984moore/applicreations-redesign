"""Compose the 1200x630 Open Graph / iMessage link-preview image."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
MARK = ROOT / "public" / "logo-mark.png"
OUT = ROOT / "public" / "og-image.png"

W, H = 1200, 630
NAVY = (12, 18, 34)
NAVY_MID = (18, 28, 52)
PURPLE = (58, 36, 88)
CYAN = (42, 92, 128)


def gradient() -> Image.Image:
    img = Image.new("RGB", (W, H), NAVY)
    px = img.load()
    for y in range(H):
        for x in range(W):
            tx = x / (W - 1)
            ty = y / (H - 1)
            # Deep navy left/top → slightly purple-cyan right/bottom.
            r = int(NAVY[0] + (NAVY_MID[0] - NAVY[0]) * tx + (PURPLE[0] - NAVY[0]) * ty * 0.35)
            g = int(NAVY[1] + (CYAN[1] - NAVY[1]) * tx * 0.28 + (PURPLE[1] - NAVY[1]) * ty * 0.18)
            b = int(NAVY[2] + (CYAN[2] - NAVY[2]) * tx * 0.42 + (PURPLE[2] - NAVY[2]) * ty * 0.22)
            px[x, y] = (min(255, r), min(255, g), min(255, b))
    return img


def glow(canvas: Image.Image) -> Image.Image:
    """Soft logo-colored bloom behind the lockup so the mark reads as lit, not flat."""
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.ellipse((40, -40, 560, 420), fill=(90, 140, 210, 58))
    draw.ellipse((180, 80, 720, 560), fill=(120, 70, 180, 42))
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=48))
    return Image.alpha_composite(canvas.convert("RGBA"), overlay)


def load_font(names: list[str], size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for name in names:
        path = Path(r"C:\Windows\Fonts") / name
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def knock_out_black(mark: Image.Image) -> Image.Image:
    """Treat near-black pixels as transparent so a boxed mark sits on the dark field."""
    mark = mark.convert("RGBA")
    pixels = mark.load()
    w, h = mark.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if a == 0:
                continue
            if r < 18 and g < 18 and b < 18:
                pixels[x, y] = (r, g, b, 0)
    return mark


def main() -> None:
    canvas = glow(gradient())
    mark = knock_out_black(Image.open(MARK))
    mark_size = 236
    mark = mark.resize((mark_size, mark_size), Image.Resampling.LANCZOS)

    name_font = load_font(["segoeuib.ttf", "arialbd.ttf", "calibrib.ttf"], 72)
    tag_font = load_font(["segoeuib.ttf", "segoeui.ttf", "arialbd.ttf"], 22)

    draw = ImageDraw.Draw(canvas)
    name = "Applicreations"
    tag = "CUSTOM APPS AND WEBSITES"

    name_bbox = draw.textbbox((0, 0), name, font=name_font)
    name_h = name_bbox[3] - name_bbox[1]

    # Top-left quadrant lockup — logo left, wordmark beside it, tagline under the name.
    pad_x = 72
    pad_y = 78
    gap = 28
    text_x = pad_x + mark_size + gap
    name_y = pad_y + 52
    tag_y = name_y + name_h + 18

    canvas.paste(mark, (pad_x, pad_y), mark)
    draw.text((text_x, name_y), name, font=name_font, fill=(255, 255, 255))

    tracking = 5
    cursor = text_x
    for ch in tag:
        draw.text((cursor, tag_y), ch, font=tag_font, fill=(176, 204, 232))
        cursor += draw.textlength(ch, font=tag_font) + tracking

    canvas.convert("RGB").save(OUT, "PNG", optimize=True)
    print(f"Wrote {OUT} {canvas.size}")


if __name__ == "__main__":
    main()
