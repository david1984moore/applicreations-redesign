"""Compose the 1200x630 Open Graph / iMessage link-preview image."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
MARK = ROOT / "public" / "logo-mark.png"
OUT = ROOT / "public" / "og-image.png"

W, H = 1200, 630
BLACK = (0, 0, 0)
NAME_FILL = (255, 255, 255)
TAG_FILL = (176, 204, 232)
NAME_FONTS = ["segoeuib.ttf", "arialbd.ttf", "calibrib.ttf"]
TAG_FONTS = ["segoeuib.ttf", "segoeui.ttf", "arialbd.ttf"]


def load_font(names: list[str], size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for name in names:
        path = Path(r"C:\Windows\Fonts") / name
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def knock_out_black(mark: Image.Image) -> Image.Image:
    """Treat near-black pixels as transparent so the mark sits on the dark field."""
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


def tracked_width(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, tracking: float) -> float:
    if not text:
        return 0
    return sum(draw.textlength(ch, font=font) + tracking for ch in text) - tracking


def fit_font(
    names: list[str],
    text: str,
    target_w: float,
    min_size: int,
    max_size: int,
    tracking: float = 0,
) -> ImageFont.ImageFont:
    probe = ImageDraw.Draw(Image.new("RGB", (1, 1)))
    best = min_size
    lo, hi = min_size, max_size
    while lo <= hi:
        mid = (lo + hi) // 2
        font = load_font(names, mid)
        width = tracked_width(probe, text, font, tracking) if tracking else probe.textlength(text, font=font)
        if width <= target_w:
            best = mid
            lo = mid + 1
        else:
            hi = mid - 1
    return load_font(names, best)


def draw_tracked(
    draw: ImageDraw.ImageDraw,
    xy: tuple[int, int],
    text: str,
    font: ImageFont.ImageFont,
    fill: tuple[int, int, int],
    tracking: float,
) -> None:
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking


def main() -> None:
    canvas = Image.new("RGBA", (W, H), (*BLACK, 255))
    mark = knock_out_black(Image.open(MARK))

    # ~1/3 of the card, large enough for the first letters to sit on the mark.
    mark_size = 420
    mark = mark.resize((mark_size, mark_size), Image.Resampling.LANCZOS)

    name = "Applicreations"
    tag = "CUSTOM APPS AND WEBSITES"
    pad_left = 28
    pad_right = 48
    # Start the wordmark on the right half of the butterfly so "App" overlaps it.
    text_x = pad_left + int(mark_size * 0.46)
    target_w = W - text_x - pad_right
    tag_tracking = 6

    name_font = fit_font(NAME_FONTS, name, target_w, 72, 118)
    tag_font = fit_font(TAG_FONTS, tag, target_w, 22, 40, tracking=tag_tracking)

    probe = ImageDraw.Draw(canvas)
    name_box = probe.textbbox((0, 0), name, font=name_font)
    tag_box = probe.textbbox((0, 0), tag, font=tag_font)
    name_h = name_box[3] - name_box[1]
    tag_h = tag_box[3] - tag_box[1]
    # Keep descenders of "p" well clear of the tagline.
    line_gap = 36
    block_h = name_h + line_gap + tag_h
    name_y = (H - block_h) // 2 - name_box[1]
    tag_y = name_y + name_box[3] + line_gap - tag_box[1]
    mark_y = (H - mark_size) // 2

    canvas.paste(mark, (pad_left, mark_y), mark)
    draw = ImageDraw.Draw(canvas)
    draw.text((text_x, name_y), name, font=name_font, fill=NAME_FILL)
    draw_tracked(draw, (text_x, tag_y), tag, tag_font, TAG_FILL, tag_tracking)

    canvas.convert("RGB").save(OUT, "PNG", optimize=True)
    print(f"Wrote {OUT} {canvas.size}")


if __name__ == "__main__":
    main()
