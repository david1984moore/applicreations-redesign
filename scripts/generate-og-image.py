"""Compose compact link-preview images (iMessage thumbnail + Apple touch icon)."""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MARK = ROOT / "public" / "logo-mark.png"

# Under Apple's 900px "large preview" threshold so iMessage stays a compact
# horizontal bubble (icon + title) instead of a full-bleed square card.
OG_OUT = ROOT / "public" / "og-image.png"
OG_SIZE = 512

ICON_OUT = ROOT / "public" / "apple-touch-icon.png"
ICON_SIZE = 180


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


def square_lockup(size: int, mark_ratio: float = 0.78) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 255))
    mark = knock_out_black(Image.open(MARK))
    mark_size = int(size * mark_ratio)
    mark = mark.resize((mark_size, mark_size), Image.Resampling.LANCZOS)
    origin = (size - mark_size) // 2
    canvas.paste(mark, (origin, origin), mark)
    return canvas.convert("RGB")


def main() -> None:
    og = square_lockup(OG_SIZE)
    og.save(OG_OUT, "PNG", optimize=True)
    print(f"Wrote {OG_OUT} {og.size}")

    icon = square_lockup(ICON_SIZE)
    icon.save(ICON_OUT, "PNG", optimize=True)
    print(f"Wrote {ICON_OUT} {icon.size}")


if __name__ == "__main__":
    main()
