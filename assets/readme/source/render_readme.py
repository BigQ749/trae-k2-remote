# -*- coding: utf-8 -*-
"""TRAE K2 README visuals. Theme comes from the badge: black studio, Shandian blue, PPT orange."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[3]
ASSETS = ROOT / "assets" / "readme"
ASSETS.mkdir(parents=True, exist_ok=True)
SRC = ROOT / "assets"

W, H = 1200, 400
RX = 26
BG = (7, 9, 14, 255)
INK = (243, 244, 246, 255)
MUTED = (139, 147, 160, 255)
BLUE = (59, 158, 255, 255)
ORANGE = (232, 135, 42, 255)
LINE = (28, 34, 46, 255)


def font(kind: str, size: int) -> ImageFont.FreeTypeFont:
    files = {
        "ui": r"C:\Windows\Fonts\segoeui.ttf",
        "uib": r"C:\Windows\Fonts\segoeuib.ttf",
        "cn": r"C:\Windows\Fonts\msyh.ttc",
        "cnb": r"C:\Windows\Fonts\msyhbd.ttc",
        "mono": r"C:\Windows\Fonts\consola.ttf",
    }
    return ImageFont.truetype(files[kind], size)


def ease_out(t: float) -> float:
    t = max(0.0, min(1.0, t))
    return 1.0 - (1.0 - t) ** 3


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def rounded_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius, fill=255)
    return mask


_BADGE: dict[tuple[str, int], Image.Image] = {}


def load_badge(path: Path, height: int) -> Image.Image:
    key = (str(path), height)
    if key not in _BADGE:
        im = Image.open(path).convert("RGBA")
        w, h = im.size
        _BADGE[key] = im.resize((int(w * height / h), height), Image.Resampling.LANCZOS)
    return _BADGE[key]


def paste_rotated(base: Image.Image, src: Image.Image, xy: tuple[int, int], angle: float) -> None:
    rot = src.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    base.alpha_composite(rot, xy)


def draw_title(layer: Image.Image) -> None:
    d = ImageDraw.Draw(layer)
    d.text((56, 46), "CONTEST BADGE  ·  BLE HID", font=font("ui", 16), fill=MUTED)
    d.rounded_rectangle((56, 74, 108, 80), 3, fill=BLUE)
    d.text((56, 104), "TRAE K2", font=font("uib", 64), fill=INK)
    d.rounded_rectangle((56, 188, 292, 198), 5, fill=ORANGE)
    d.text((56, 226), "大赛工牌，变成口袋遥控器。", font=font("cn", 22), fill=(206, 212, 222, 255))
    d.text((56, 262), "闪电说听写  ·  PPT 翻页  ·  不用伴侣脚本", font=font("cn", 18), fill=MUTED)
    d.text((56, 338), "ESP32-C3   ·   TRAE K2   ·   JUST WORKS", font=font("mono", 14), fill=MUTED)


def frame(t: float) -> Image.Image:
    im = Image.new("RGBA", (W, H), BG)
    d = ImageDraw.Draw(im)
    for x in range(0, W, 40):
        d.line([(x, 0), (x, H)], fill=LINE, width=1)
    for y in range(0, H, 40):
        d.line([(0, y), (W, y)], fill=LINE, width=1)
    d.ellipse((820, -120, 1320, 260), fill=(40, 90, 160, 28))
    d.ellipse((900, 200, 1400, 620), fill=(160, 90, 30, 22))
    draw_title(im)

    shandian = load_badge(SRC / "product" / "shandian.jpg", 340)
    ppt = load_badge(SRC / "product" / "ppt.jpg", 300)
    p = 0.78 + 0.22 * ease_out(t / 0.9) if t < 4.15 else lerp(1.0, 0.78, ease_out((t - 4.15) / 0.8))
    paste_rotated(im, shandian, (int(lerp(820, 742, p)), int(lerp(-8, 18, p))), lerp(-10, -6, p))
    paste_rotated(im, ppt, (int(lerp(980, 900, p)), int(lerp(90, 58, p))), lerp(12, 7, p))
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    out.paste(im, mask=rounded_mask((W, H), RX))
    return out


def write_hero_svg() -> None:
    (ASSETS / "hero.svg").write_text(
        '''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400" role="img" aria-labelledby="t d">
  <title id="t">TRAE K2：大赛工牌变成口袋遥控器</title>
  <desc id="d">把 FoloToy TRAE AI Passport 烧成 BLE HID 键盘。闪电说听写，PPT 翻页，不用伴侣脚本。</desc>
  <defs>
    <pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0 H0 V40" fill="none" stroke="#1C222E" stroke-width="1"/>
    </pattern>
    <clipPath id="c"><rect width="1200" height="400" rx="26"/></clipPath>
  </defs>
  <g clip-path="url(#c)">
    <rect width="1200" height="400" fill="#07090E"/>
    <rect width="1200" height="400" fill="url(#g)"/>
    <text x="56" y="62" fill="#8B93A0" font-size="16" font-family="Segoe UI, sans-serif" letter-spacing="2">CONTEST BADGE  ·  BLE HID</text>
    <rect x="56" y="74" width="52" height="6" rx="3" fill="#3B9EFF"/>
    <text x="56" y="160" fill="#F3F4F6" font-size="64" font-weight="700" font-family="Segoe UI, Microsoft YaHei, sans-serif">TRAE K2</text>
    <rect x="56" y="178" width="236" height="10" rx="5" fill="#E8872A"/>
    <text x="56" y="230" fill="#CED4DE" font-size="22" font-family="Microsoft YaHei, sans-serif">大赛工牌，变成口袋遥控器。</text>
    <text x="56" y="266" fill="#8B93A0" font-size="18" font-family="Microsoft YaHei, sans-serif">闪电说听写  ·  PPT 翻页  ·  不用伴侣脚本</text>
    <text x="56" y="348" fill="#8B93A0" font-size="14" font-family="Consolas, monospace">ESP32-C3   ·   TRAE K2   ·   JUST WORKS</text>
    <text x="820" y="210" fill="#8B93A0" font-size="18" font-family="Segoe UI, sans-serif">Shandian / PPT</text>
  </g>
</svg>
''',
        encoding="utf-8",
    )


def write_section(name: str, eyebrow: str, title: str, accent: str) -> None:
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="120" viewBox="0 0 1200 120" role="img" aria-labelledby="t">
  <title id="t">{title}</title>
  <rect width="1200" height="120" rx="22" fill="#07090E"/>
  <rect x="40" y="36" width="48" height="6" rx="3" fill="{accent}"/>
  <text x="40" y="28" fill="#8B93A0" font-size="14" font-family="Segoe UI, sans-serif" letter-spacing="2.4">{eyebrow}</text>
  <text x="40" y="84" fill="#F3F4F6" font-size="32" font-weight="700" font-family="Microsoft YaHei, Segoe UI, sans-serif">{title}</text>
</svg>
'''
    (ASSETS / name).write_text(svg, encoding="utf-8")


def write_keymap() -> None:
    (ASSETS / "keymap.svg").write_text(
        '''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="280" viewBox="0 0 1200 280" role="img" aria-labelledby="t d">
  <title id="t">三键两档</title>
  <desc id="d">上键和下键执行当前档；确认短按换挡，长按回菜单。</desc>
  <rect width="1200" height="280" rx="26" fill="#07090E"/>
  <g font-family="Segoe UI, Microsoft YaHei, sans-serif">
    <rect x="32" y="32" width="360" height="216" rx="20" fill="#10151F"/>
    <text x="56" y="72" fill="#3B9EFF" font-size="18" font-weight="700">SHANDIAN</text>
    <text x="56" y="116" fill="#F3F4F6" font-size="22">上 = 右 Ctrl</text>
    <text x="56" y="156" fill="#F3F4F6" font-size="22">下 = Enter</text>
    <text x="56" y="204" fill="#8B93A0" font-size="18">闪电说开始 / 结束听写</text>

    <rect x="420" y="32" width="360" height="216" rx="20" fill="#10151F"/>
    <text x="444" y="72" fill="#E8872A" font-size="18" font-weight="700">PPT</text>
    <text x="444" y="116" fill="#F3F4F6" font-size="22">上 = PageUp</text>
    <text x="444" y="156" fill="#F3F4F6" font-size="22">下 = PageDown</text>
    <text x="444" y="204" fill="#8B93A0" font-size="18">上一页 / 下一页</text>

    <rect x="808" y="32" width="360" height="216" rx="20" fill="#10151F"/>
    <text x="832" y="72" fill="#F3F4F6" font-size="18" font-weight="700">CONFIRM</text>
    <text x="832" y="116" fill="#F3F4F6" font-size="22">短按 = 换挡</text>
    <text x="832" y="156" fill="#F3F4F6" font-size="22">长按 = 回菜单</text>
    <text x="832" y="204" fill="#8B93A0" font-size="18">屏幕立刻改成档位名</text>
  </g>
</svg>
''',
        encoding="utf-8",
    )


def write_proof() -> None:
    canvas = Image.new("RGBA", (1200, 560), (0, 0, 0, 0))
    bg = Image.new("RGBA", (1200, 560), BG)
    ImageDraw.Draw(bg).rounded_rectangle((0, 0, 1199, 559), 26, fill=BG)
    canvas.alpha_composite(bg)
    d = ImageDraw.Draw(canvas)
    d.text((48, 36), "PROOF  ·  SAME BADGE, TWO MODES", font=font("ui", 16), fill=MUTED)

    left = load_badge(SRC / "product" / "shandian.jpg", 460)
    right = load_badge(SRC / "product" / "ppt.jpg", 460)
    canvas.alpha_composite(left, (40, 70))
    canvas.alpha_composite(right, (620, 70))
    d.text((80, 520), "Shandian  ·  听写", font=font("cn", 18), fill=BLUE)
    d.text((660, 520), "PPT  ·  翻页", font=font("cn", 18), fill=ORANGE)
    out = Image.new("RGBA", (1200, 560), (0, 0, 0, 0))
    out.paste(canvas, mask=rounded_mask((1200, 560), 26))
    out.save(ASSETS / "proof.png")


def render_gif() -> None:
    still = frame(2.2)
    still.save(ASSETS / "hero.png")
    fps = 20
    enter = [i / fps for i in range(int(1.1 * fps))]
    exit_t = [4.2 + i / fps for i in range(int(0.75 * fps))]
    times = enter + [2.2] + exit_t
    durations = [int(1000 / fps)] * len(times)
    durations[len(enter)] = 2800
    frames = [frame(t) for t in times]
    rgb = []
    for fr in frames:
        base = Image.new("RGB", (W, H), (7, 9, 14))
        base.paste(fr, mask=fr.split()[-1])
        rgb.append(base.quantize(colors=128, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE))
    rgb[0].save(
        ASSETS / "hero.gif",
        save_all=True,
        append_images=rgb[1:],
        duration=durations,
        loop=0,
        optimize=True,
        disposal=1,
    )


def main() -> None:
    write_hero_svg()
    write_section("section-keys.svg", "01  CONTROLS", "三键，两档。确认键是换挡，不是确定。", "#3B9EFF")
    write_section("section-flash.svg", "02  FIRST USE", "先备份出厂 Flash，再烧预编译固件。", "#E8872A")
    write_section("section-pair.svg", "03  WINDOWS", "蓝牙名 TRAE K2。配对一次，关机再开自己连。", "#3B9EFF")
    write_keymap()
    write_proof()
    render_gif()
    gif = ASSETS / "hero.gif"
    print("gif_bytes", gif.stat().st_size if gif.exists() else 0)


if __name__ == "__main__":
    main()
