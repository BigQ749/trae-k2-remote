const pptxgen = require("pptxgenjs");
const path = require("path");

const ASSETS = path.join(__dirname, "..", "assets");
const OUT = path.join(__dirname, "TRAE-K2.pptx");

const C = {
  bg: "0B0B0D",
  card: "1C1C1E",
  line: "2C2C2E",
  blue: "0A84FF",
  orange: "FF9F0A",
  green: "30D158",
  muted: "8E8E93",
  white: "F5F5F7",
  dim: "636366",
};

const FONT = "Microsoft YaHei";
const MONO = "Consolas";

const shadow = () => ({
  type: "outer",
  color: "000000",
  blur: 14,
  offset: 3,
  angle: 135,
  opacity: 0.4,
});

function addFooter(slide, page, total) {
  slide.addText("TRAE K2", {
    x: 0.5, y: 5.28, w: 4, h: 0.22,
    fontFace: FONT, fontSize: 10, color: C.dim, margin: 0,
  });
  slide.addText(String(page), {
    x: 8.8, y: 5.28, w: 0.7, h: 0.22,
    fontFace: FONT, fontSize: 10, color: C.dim, align: "right", margin: 0,
  });
}

function addKicker(slide, text, color) {
  const w = Math.max(1.45, 0.28 * text.length + 0.55);
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 0.32, w, h: 0.28,
    fill: { color: color }, rectRadius: 0.08,
  });
  slide.addText(text, {
    x: 0.5, y: 0.32, w, h: 0.28,
    fontFace: FONT, fontSize: 11, color: C.bg, align: "center", valign: "middle",
    margin: 0, bold: true,
  });
}

const pres = new pptxgen();
pres.defineLayout({ name: "WIDE16x9", width: 10, height: 5.625 });
pres.layout = "WIDE16x9";
pres.title = "TRAE K2";
pres.author = "BigQ749";
pres.subject = "把大赛通行证变成闪电说 / PPT 遥控器";

const TOTAL = 12;

// ---------------------------------------------------------------------------
// 1 Title
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { path: path.join(ASSETS, "hero.jpg") };
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: "000000", transparency: 38 },
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.55, w: 1.7, h: 0.32,
    fill: { color: C.blue }, rectRadius: 0.08,
  });
  s.addText("社区固件", {
    x: 0.5, y: 1.55, w: 1.7, h: 0.32,
    fontFace: FONT, fontSize: 12, color: C.white, align: "center", valign: "middle",
    margin: 0, bold: true,
  });
  s.addText("TRAE K2", {
    x: 0.5, y: 2.0, w: 9, h: 0.9,
    fontFace: FONT, fontSize: 48, color: C.white, bold: true, margin: 0,
  });
  s.addText("一块通行证，变成口袋里的遥控器", {
    x: 0.5, y: 2.92, w: 8.5, h: 0.45,
    fontFace: FONT, fontSize: 20, color: C.white, margin: 0,
  });
  s.addText("闪电说快捷键  ·  PPT 翻页  ·  确认键换挡", {
    x: 0.5, y: 4.85, w: 9, h: 0.32,
    fontFace: FONT, fontSize: 14, color: "D1D1D6", margin: 0,
  });
  s.addNotes("大赛发的不只是一张纸质门票。很多人手里都有这块透明工牌。今天把它变成一个真正能用的东西：口袋里的闪电说和 PPT 遥控器。");
}

// ---------------------------------------------------------------------------
// 2 Everyone has it
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "现场", C.blue);
  s.addText("同一块硬件，很多人手里都有", {
    x: 0.5, y: 0.72, w: 9, h: 0.5,
    fontFace: FONT, fontSize: 28, color: C.white, bold: true, margin: 0,
  });

  const stats = [
    { n: "ESP32-C3", l: "主控 · 无 PSRAM · 8MB Flash" },
    { n: "240×320", l: "彩屏 · 右边三键 · 电池" },
    { n: "BLE HID", l: "刷完就是一块真键盘" },
  ];
  stats.forEach((it, i) => {
    const x = 0.5 + i * 3.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.55, w: 2.9, h: 2.55,
      fill: { color: C.card }, rectRadius: 0.12, shadow: shadow(),
    });
    s.addText(it.n, {
      x, y: 2.05, w: 2.9, h: 0.7,
      fontFace: FONT, fontSize: 22, color: C.white, align: "center", bold: true, margin: 0,
    });
    s.addText(it.l, {
      x: x + 0.2, y: 2.85, w: 2.5, h: 0.7,
      fontFace: FONT, fontSize: 14, color: C.muted, align: "center", margin: 0,
    });
  });
  addFooter(s, 2, TOTAL);
  s.addNotes("同一款硬件，ESP32-C3，彩屏，右边三个键。出厂是电子名片。我们不改电路，只换脑子。");
}

// ---------------------------------------------------------------------------
// 3 Before / after
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "对比", C.orange);
  s.addText("门票还在，用法换了", {
    x: 0.5, y: 0.72, w: 9, h: 0.5,
    fontFace: FONT, fontSize: 28, color: C.white, bold: true, margin: 0,
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.45, w: 4.3, h: 3.35,
    fill: { color: C.card }, rectRadius: 0.12, shadow: shadow(),
  });
  s.addText("出厂", {
    x: 0.75, y: 1.65, w: 3.8, h: 0.35,
    fontFace: FONT, fontSize: 14, color: C.muted, margin: 0,
  });
  s.addText("电子名片", {
    x: 0.75, y: 2.05, w: 3.8, h: 0.45,
    fontFace: FONT, fontSize: 24, color: C.white, bold: true, margin: 0,
  });
  s.addText("头像  ·  Token  ·  GAME  ·  IMAGE\n要网页、要账号、要官方生态", {
    x: 0.75, y: 2.65, w: 3.8, h: 1.5,
    fontFace: FONT, fontSize: 15, color: C.muted, margin: 0,
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.2, y: 1.45, w: 4.3, h: 3.35,
    fill: { color: C.card }, rectRadius: 0.12, shadow: shadow(),
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.2, y: 1.45, w: 0.12, h: 3.35,
    fill: { color: C.blue },
  });
  s.addText("TRAE K2", {
    x: 5.55, y: 1.65, w: 3.7, h: 0.35,
    fontFace: FONT, fontSize: 14, color: C.blue, margin: 0,
  });
  s.addText("口袋遥控器", {
    x: 5.55, y: 2.05, w: 3.7, h: 0.45,
    fontFace: FONT, fontSize: 24, color: C.white, bold: true, margin: 0,
  });
  s.addText("真蓝牙键盘  ·  无伴侣脚本  ·  无云\n开机叫 TRAE K2，配对一次就能用", {
    x: 5.55, y: 2.65, w: 3.7, h: 1.5,
    fontFace: FONT, fontSize: 15, color: C.muted, margin: 0,
  });
  addFooter(s, 3, TOTAL);
  s.addNotes("刷完之后，它在 Windows 里就是一块蓝牙键盘，名字叫 TRAE K2。没有伴侣程序，没有网页，没有账号。");
}

// ---------------------------------------------------------------------------
// 4 Hardware
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "硬件", C.green);
  s.addText("打开就能认出来", {
    x: 0.5, y: 0.72, w: 9, h: 0.5,
    fontFace: FONT, fontSize: 28, color: C.white, bold: true, margin: 0,
  });

  const rows = [
    ["主控", "ESP32-C3 · USB VID 303A PID 1001"],
    ["屏", "ST7789 240×320 · 黑底 UI"],
    ["键", "右边三键共用一路 ADC"],
    ["无线", "BLE 5 · 设备名 TRAE K2"],
  ];
  rows.forEach((r, i) => {
    const y = 1.4 + i * 0.85;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y, w: 9, h: 0.75,
      fill: { color: C.card }, rectRadius: 0.1,
    });
    s.addText(r[0], {
      x: 0.75, y, w: 1.6, h: 0.75,
      fontFace: FONT, fontSize: 16, color: C.blue, valign: "middle", margin: 0, bold: true,
    });
    s.addText(r[1], {
      x: 2.5, y, w: 6.7, h: 0.75,
      fontFace: FONT, fontSize: 16, color: C.white, valign: "middle", margin: 0,
    });
  });
  addFooter(s, 4, TOTAL);
  s.addNotes("硬件不用拆。USB 插上就能烧。屏、三键、蓝牙，都已经焊在牌子上。");
}

// ---------------------------------------------------------------------------
// 5 Three keys
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "按键", C.blue);
  s.addText("最下面那颗，是换挡", {
    x: 0.5, y: 0.72, w: 9, h: 0.5,
    fontFace: FONT, fontSize: 28, color: C.white, bold: true, margin: 0,
  });

  const keys = [
    { t: "上", d: "当前档的「上」\n闪电说开始 · PPT 上一页", c: C.blue },
    { t: "下", d: "当前档的「下」\n回车 · PPT 下一页", c: C.green },
    { t: "确认", d: "短按立刻换挡\n长按才回菜单", c: C.orange },
  ];
  keys.forEach((k, i) => {
    const x = 0.5 + i * 3.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 1.5, w: 2.9, h: 3.15,
      fill: { color: C.card }, rectRadius: 0.12, shadow: shadow(),
    });
    s.addShape(pres.shapes.OVAL, {
      x: x + 1.05, y: 1.8, w: 0.8, h: 0.8,
      fill: { color: k.c },
    });
    s.addText(k.t, {
      x: x + 1.05, y: 1.8, w: 0.8, h: 0.8,
      fontFace: FONT, fontSize: 16, color: C.bg, align: "center", valign: "middle",
      margin: 0, bold: true,
    });
    s.addText(k.d, {
      x: x + 0.2, y: 2.85, w: 2.5, h: 1.4,
      fontFace: FONT, fontSize: 15, color: C.white, align: "center", margin: 0,
    });
  });
  addFooter(s, 5, TOTAL);
  s.addNotes("上面两个键负责干活，最下面确认键负责换挡。短按立刻切模式，屏幕上会写得清清楚楚；长按才回菜单。");
}

// ---------------------------------------------------------------------------
// 6 Why HID
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "原则", C.orange);
  s.addText("闪电说要的是真键盘", {
    x: 0.5, y: 0.72, w: 9, h: 0.5,
    fontFace: FONT, fontSize: 28, color: C.white, bold: true, margin: 0,
  });

  const bad = ["工牌自己录音", "脚本模拟按键", "伴侣程序往窗口贴字"];
  const good = ["BLE HID 键盘", "右 Ctrl 开始 / 结束", "声音走电脑麦克风"];

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.45, w: 4.3, h: 3.3,
    fill: { color: C.card }, rectRadius: 0.12,
  });
  s.addText("走过，不行", {
    x: 0.75, y: 1.65, w: 3.8, h: 0.4,
    fontFace: FONT, fontSize: 16, color: "FF453A", bold: true, margin: 0,
  });
  bad.forEach((t, i) => {
    s.addText(t, {
      x: 0.75, y: 2.25 + i * 0.7, w: 3.8, h: 0.5,
      fontFace: FONT, fontSize: 16, color: C.muted, margin: 0,
    });
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.2, y: 1.45, w: 4.3, h: 3.3,
    fill: { color: C.card }, rectRadius: 0.12,
  });
  s.addText("现在这条", {
    x: 5.45, y: 1.65, w: 3.8, h: 0.4,
    fontFace: FONT, fontSize: 16, color: C.green, bold: true, margin: 0,
  });
  good.forEach((t, i) => {
    s.addText(t, {
      x: 5.45, y: 2.25 + i * 0.7, w: 3.8, h: 0.5,
      fontFace: FONT, fontSize: 16, color: C.white, margin: 0,
    });
  });
  addFooter(s, 6, TOTAL);
  s.addNotes("闪电说不吃模拟按键。脚本、SendInput、工牌自己录音，这条路我们走过，不行。它要的是真的 HID。工牌只发右 Ctrl 和回车，声音走电脑麦克风。");
}

// ---------------------------------------------------------------------------
// 7 Shandian
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "档位 1", C.blue);
  s.addText("Shandian", {
    x: 0.5, y: 0.72, w: 5.5, h: 0.5,
    fontFace: FONT, fontSize: 28, color: C.white, bold: true, margin: 0,
  });
  s.addText("开机默认。蓝色标题。", {
    x: 0.5, y: 1.25, w: 5.5, h: 0.35,
    fontFace: FONT, fontSize: 14, color: C.muted, margin: 0,
  });

  const rows = [
    { k: "上键", v: "Right Ctrl  ·  开始 / 结束听写" },
    { k: "下键", v: "Enter  ·  换行或发送" },
    { k: "声音", v: "电脑麦克风，不是工牌麦" },
  ];
  rows.forEach((r, i) => {
    const y = 1.8 + i * 0.95;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y, w: 5.5, h: 0.85,
      fill: { color: C.card }, rectRadius: 0.1,
    });
    s.addText(r.k, {
      x: 0.7, y, w: 1.3, h: 0.85,
      fontFace: FONT, fontSize: 15, color: C.blue, valign: "middle", margin: 0, bold: true,
    });
    s.addText(r.v, {
      x: 2.1, y, w: 3.7, h: 0.85,
      fontFace: FONT, fontSize: 15, color: C.white, valign: "middle", margin: 0,
    });
  });

  // phone-like UI
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.55, y: 0.7, w: 2.9, h: 4.2,
    fill: { color: "000000" }, rectRadius: 0.2, line: { color: C.line, width: 1.5 },
  });
  s.addText("TRAE K2", {
    x: 6.55, y: 0.95, w: 2.9, h: 0.28,
    fontFace: FONT, fontSize: 11, color: C.muted, align: "center", margin: 0,
  });
  s.addText("Shandian", {
    x: 6.55, y: 1.28, w: 2.9, h: 0.45,
    fontFace: FONT, fontSize: 22, color: C.blue, align: "center", bold: true, margin: 0,
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.9, w: 2.4, h: 0.5,
    fill: { color: C.card }, rectRadius: 0.12,
  });
  s.addText("Connected", {
    x: 6.8, y: 1.9, w: 2.4, h: 0.5,
    fontFace: FONT, fontSize: 12, color: C.green, align: "center", valign: "middle", margin: 0,
  });
  s.addText("UP  Dictate\nDOWN  Enter", {
    x: 6.55, y: 3.05, w: 2.9, h: 0.7,
    fontFace: MONO, fontSize: 12, color: C.muted, align: "center", margin: 0,
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 4.15, w: 2.4, h: 0.42,
    fill: { color: C.card }, rectRadius: 0.12,
  });
  s.addText("OK  switch mode", {
    x: 6.8, y: 4.15, w: 2.4, h: 0.42,
    fontFace: FONT, fontSize: 11, color: C.white, align: "center", valign: "middle", margin: 0,
  });
  addFooter(s, 7, TOTAL);
  s.addNotes("开机默认蓝色 Shandian。上键开始说、再按结束；下键回车。开会、写稿、随口记，都可以。");
}

// ---------------------------------------------------------------------------
// 8 PPT
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "档位 2", C.orange);
  s.addText("PPT", {
    x: 0.5, y: 0.72, w: 5.5, h: 0.5,
    fontFace: FONT, fontSize: 28, color: C.white, bold: true, margin: 0,
  });
  s.addText("短按确认，标题立刻变橙。", {
    x: 0.5, y: 1.25, w: 5.5, h: 0.35,
    fontFace: FONT, fontSize: 14, color: C.muted, margin: 0,
  });

  const rows = [
    { k: "上键", v: "PageUp  ·  上一页" },
    { k: "下键", v: "PageDown  ·  下一页" },
    { k: "适用", v: "放映、PDF、浏览器幻灯片" },
  ];
  rows.forEach((r, i) => {
    const y = 1.8 + i * 0.95;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y, w: 5.5, h: 0.85,
      fill: { color: C.card }, rectRadius: 0.1,
    });
    s.addText(r.k, {
      x: 0.7, y, w: 1.3, h: 0.85,
      fontFace: FONT, fontSize: 15, color: C.orange, valign: "middle", margin: 0, bold: true,
    });
    s.addText(r.v, {
      x: 2.1, y, w: 3.7, h: 0.85,
      fontFace: FONT, fontSize: 15, color: C.white, valign: "middle", margin: 0,
    });
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.55, y: 0.7, w: 2.9, h: 4.2,
    fill: { color: "000000" }, rectRadius: 0.2, line: { color: C.line, width: 1.5 },
  });
  s.addText("TRAE K2", {
    x: 6.55, y: 0.95, w: 2.9, h: 0.28,
    fontFace: FONT, fontSize: 11, color: C.muted, align: "center", margin: 0,
  });
  s.addText("PPT", {
    x: 6.55, y: 1.28, w: 2.9, h: 0.45,
    fontFace: FONT, fontSize: 22, color: C.orange, align: "center", bold: true, margin: 0,
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 1.9, w: 2.4, h: 0.5,
    fill: { color: C.card }, rectRadius: 0.12,
  });
  s.addText("Connected", {
    x: 6.8, y: 1.9, w: 2.4, h: 0.5,
    fontFace: FONT, fontSize: 12, color: C.green, align: "center", valign: "middle", margin: 0,
  });
  s.addText("UP  Prev page\nDOWN  Next page", {
    x: 6.55, y: 3.05, w: 2.9, h: 0.7,
    fontFace: MONO, fontSize: 12, color: C.muted, align: "center", margin: 0,
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.8, y: 4.15, w: 2.4, h: 0.42,
    fill: { color: C.card }, rectRadius: 0.12,
  });
  s.addText("Mode switched", {
    x: 6.8, y: 4.15, w: 2.4, h: 0.42,
    fontFace: FONT, fontSize: 11, color: C.orange, align: "center", valign: "middle", margin: 0,
  });
  addFooter(s, 8, TOTAL);
  s.addNotes("短按确认，标题变成橙色 PPT。上键上一页，下键下一页。同一块牌子，讲稿和翻页都在右手边。");
}

// ---------------------------------------------------------------------------
// 9 Pairing 30s
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "上手", C.green);
  s.addText("现场三十秒", {
    x: 0.5, y: 0.72, w: 9, h: 0.5,
    fontFace: FONT, fontSize: 28, color: C.white, bold: true, margin: 0,
  });

  const steps = [
    { n: "01", t: "USB 供电或电池", d: "屏上是蓝色 Shandian" },
    { n: "02", t: "设置里添加设备", d: "不要用任务栏弹出层" },
    { n: "03", t: "点 TRAE K2", d: "没有 PIN，k= 不是配对码" },
    { n: "04", t: "屏变 Connected", d: "上键就能听写，确认键换挡" },
  ];
  steps.forEach((st, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 4.75;
    const y = 1.4 + row * 1.7;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 4.5, h: 1.5,
      fill: { color: C.card }, rectRadius: 0.12,
    });
    s.addText(st.n, {
      x: x + 0.25, y: y + 0.25, w: 1.0, h: 0.4,
      fontFace: FONT, fontSize: 16, color: C.blue, bold: true, margin: 0,
    });
    s.addText(st.t, {
      x: x + 0.25, y: y + 0.6, w: 4.0, h: 0.35,
      fontFace: FONT, fontSize: 18, color: C.white, bold: true, margin: 0,
    });
    s.addText(st.d, {
      x: x + 0.25, y: y + 0.98, w: 4.0, h: 0.3,
      fontFace: FONT, fontSize: 13, color: C.muted, margin: 0,
    });
  });
  addFooter(s, 9, TOTAL);
  s.addNotes("插上电，Windows 设置里添加 TRAE K2，屏上变 Connected。不用 PIN。网页上那个 k 不是配对码。");
}

// ---------------------------------------------------------------------------
// 10 Pitfalls
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "踩坑", C.orange);
  s.addText("这四条，后来的人不必再走", {
    x: 0.5, y: 0.72, w: 9, h: 0.5,
    fontFace: FONT, fontSize: 26, color: C.white, bold: true, margin: 0,
  });
  const pits = [
    { t: "不要脚本模拟键", d: "闪电说只认 HID" },
    { t: "不要额外 GATT", d: "时间服务会把键盘弄丢" },
    { t: "不要随手擦 NVS", d: "配对信息在里面" },
    { t: "不要用弹出层配对", d: "去系统设置里添加设备" },
  ];
  pits.forEach((p, i) => {
    const x = 0.5 + (i % 2) * 4.75;
    const y = 1.4 + Math.floor(i / 2) * 1.7;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.5, h: 1.5,
      fill: { color: C.card },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.1, h: 1.5,
      fill: { color: C.orange },
    });
    s.addText(p.t, {
      x: x + 0.35, y: y + 0.3, w: 3.9, h: 0.45,
      fontFace: FONT, fontSize: 18, color: C.white, bold: true, margin: 0,
    });
    s.addText(p.d, {
      x: x + 0.35, y: y + 0.8, w: 3.9, h: 0.4,
      fontFace: FONT, fontSize: 14, color: C.muted, margin: 0,
    });
  });
  addFooter(s, 10, TOTAL);
  s.addNotes("这四条是实打实踩过的。模拟按键无效，加蓝牙时间服务会把闪电说弄没，擦 NVS 会让重连死循环，任务栏弹出层经常停在 Connecting。");
}

// ---------------------------------------------------------------------------
// 11 Open source
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "开源", C.blue);
  s.addText("仓库是给人看的，也是给 Agent 看的", {
    x: 0.5, y: 0.72, w: 9, h: 0.55,
    fontFace: FONT, fontSize: 26, color: C.white, bold: true, margin: 0,
  });

  const cards = [
    { t: "from-zero.md", d: "手里刚拿到板：备份、烧录、配对、验收" },
    { t: "AGENTS.md", d: "编码助手从零接管：禁区、键码、改哪几个文件" },
    { t: "release/*.bin", d: "没有 IDF 也能刷，一条 Python 命令" },
  ];
  cards.forEach((c, i) => {
    const y = 1.45 + i * 1.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y, w: 9, h: 0.95,
      fill: { color: C.card }, rectRadius: 0.1,
    });
    s.addText(c.t, {
      x: 0.75, y: y + 0.12, w: 8.5, h: 0.32,
      fontFace: MONO, fontSize: 16, color: C.blue, margin: 0,
    });
    s.addText(c.d, {
      x: 0.75, y: y + 0.48, w: 8.5, h: 0.32,
      fontFace: FONT, fontSize: 15, color: C.white, margin: 0,
    });
  });
  addFooter(s, 11, TOTAL);
  s.addNotes("仓库里有预编译固件，也有源码。更重要的是给 Agent 的说明书：另一台电脑、另一个人、另一个助手，拿到这块板，能从零做完备份、烧录、配对、验收。");
}

// ---------------------------------------------------------------------------
// 12 Close
// ---------------------------------------------------------------------------
{
  const s = pres.addSlide();
  s.background = { path: path.join(ASSETS, "desk.jpg") };
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 5.625,
    fill: { color: "000000", transparency: 42 },
  });
  s.addText("同一块通行证", {
    x: 0.5, y: 1.7, w: 9, h: 0.7,
    fontFace: FONT, fontSize: 36, color: C.white, bold: true, margin: 0,
  });
  s.addText("你可以继续当名片，也可以让它开始干活。", {
    x: 0.5, y: 2.5, w: 9, h: 0.45,
    fontFace: FONT, fontSize: 18, color: "D1D1D6", margin: 0,
  });
  s.addText("github.com/BigQ749/trae-k2-remote", {
    x: 0.5, y: 4.55, w: 9, h: 0.4,
    fontFace: MONO, fontSize: 16, color: C.blue, margin: 0,
  });
  s.addNotes("同一块通行证。你可以继续当名片，也可以让它开始干活。GitHub 在最后一页。");
}

pres.writeFile({ fileName: OUT }).then(() => {
  console.log("wrote", OUT);
});
