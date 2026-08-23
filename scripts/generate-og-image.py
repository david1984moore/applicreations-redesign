"""Compose the 1200x630 Open Graph / iMessage link-preview image."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
MARK = ROOT / "public" / "logo-mark.png"
OUT = ROOT / "public" / "og-image.png"

W, H = 1200, 630
CREAM = (246, 239, 228)
SKY = (196, 220, 236)


def gradient() -> Image.Image:
    img = Image.new("RGB", (W, H), CREAM)
    px = img.load()
    for y in range(H):
        for x in range(W):
            t = (x / (W - 1)) * 0.72 + ((H - 1 - y) / (H - 1)) * 0.28
            t = min(1.0, max(0.0, t))
            px[x, y] = (
                int(CREAM[0] + (SKY[0] - CREAM[0]) * t),
                int(CREAM[1] + (SKY[1] - CREAM[1]) * t),
                int(CREAM[2] + (SKY[2] - CREAM[2]) * t),
            )
    return img.filter(ImageFilter.GaussianBlur(radius=0.6))


def load_font(names: list[str], size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for name in names:
        path = Path(r"C:\Windows\Fonts") / name
        if path.exists():
            return ImageFont.truetype(str(path), size)
    return ImageFont.load_default()


def main() -> None:
    canvas = gradient()
    mark = Image.open(MARK).convert("RGBA")
    mark_size = 168
    mark = mark.resize((mark_size, mark_size), Image.Resampling.LANCZOS)

    name_font = load_font(["segoeuib.ttf", "arialbd.ttf", "calibrib.ttf"], 58)
    tag_font = load_font(["segoeuii.ttf", "segoeuiz.ttf", "ariali.ttf", "segoeui.ttf"], 18)

    draw = ImageDraw.Draw(canvas)
    name = "Applicreations"
    tag = "CUSTOM APPS AND WEBSITES"

    name_bbox = draw.textbbox((0, 0), name, font=name_font)
    tag_bbox = draw.textbbox((0, 0), tag, font=tag_font)
    name_w, name_h = name_bbox[2] - name_bbox[0], name_bbox[3] - name_bbox[1]
    tag_w, tag_h = tag_bbox[2] - tag_bbox[0], tag_bbox[3] - tag_bbox[1]

    gap_mark_name = 22
    gap_name_tag = 14
    group_h = mark_size + gap_mark_name + name_h + gap_name_tag + tag_h
    top = (H - group_h) // 2 - 8

    mark_x = (W - mark_size) // 2
    canvas.paste(mark, (mark_x, top), mark)

    name_x = (W - name_w) // 2
    name_y = top + mark_size + gap_mark_name
    draw.text((name_x, name_y), name, font=name_font, fill=(36, 32, 28))

    tag_x = (W - tag_w) // 2
    tag_y = name_y + name_h + gap_name_tag
    draw.text((tag_x, tag_y), tag, font=tag_font, fill=(58, 106, 168))

    canvas.save(OUT, "PNG", optimize=True)
    print(f"Wrote {OUT} {canvas.size}")


if __name__ == "__main__":
    main()
