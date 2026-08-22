const pptxgen = require("pptxgenjs");
const path = require("path");

const ASSETS = path.join(__dirname, "..", "assets");
const DEVICE = path.join(ASSETS, "device");
const OFFICIAL = path.join(ASSETS, "official");
const APPS = path.join(ASSETS, "apps");
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

function addFooter(slide, page) {
  slide.addText("TRAE K2  ·  实物", {
    x: 0.5, y: 5.28, w: 5, h: 0.22,
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
    x: 0.5, y: 0.28, w, h: 0.28,
    fill: { color: color }, rectRadius: 0.08,
  });
  slide.addText(text, {
    x: 0.5, y: 0.28, w, h: 0.28,
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

// 1 Title
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.15, w: 1.7, h: 0.32,
    fill: { color: C.blue }, rectRadius: 0.08,
  });
  s.addText("社区固件", {
    x: 0.5, y: 1.15, w: 1.7, h: 0.32,
    fontFace: FONT, fontSize: 12, color: C.white, align: "center", valign: "middle",
    margin: 0, bold: true,
  });
  s.addText("TRAE K2", {
    x: 0.5, y: 1.6, w: 4.6, h: 0.8,
    fontFace: FONT, fontSize: 44, color: C.white, bold: true, margin: 0,
  });
  s.addText("一块真通行证，变成口袋遥控器", {
    x: 0.5, y: 2.45, w: 4.6, h: 0.4,
    fontFace: FONT, fontSize: 16, color: C.white, margin: 0,
  });
  s.addText("闪电说快捷键  ·  PPT 翻页  ·  确认键换挡", {
    x: 0.5, y: 4.7, w: 4.6, h: 0.3,
    fontFace: FONT, fontSize: 13, color: C.muted, margin: 0,
  });
  s.addImage({
    path: path.join(DEVICE, "front-flat.jpg"),
    x: 5.35, y: 0.35, w: 4.2, h: 4.9,
    sizing: { type: "contain", w: 4.2, h: 4.9 },
  });
  s.addNotes("这就是实物。透明壳、TRAΕ 标、右边三键。屏上已经是我们刷的 TRAE K2，现在停在 PPT 档。");
}

// 2 Official hardware
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "硬件", C.blue);
  s.addText("官网就是这块板", {
    x: 0.5, y: 0.68, w: 9, h: 0.42,
    fontFace: FONT, fontSize: 26, color: C.white, bold: true, margin: 0,
  });
  s.addImage({
    path: path.join(OFFICIAL, "showcase.png"),
    x: 0.4, y: 1.2, w: 5.5, h: 3.85,
    sizing: { type: "contain", w: 5.5, h: 3.85 },
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.1, y: 1.45, w: 3.4, h: 3.35,
    fill: { color: C.card }, rectRadius: 0.12, shadow: shadow(),
  });
  s.addText("FoloToy AI Passport", {
    x: 6.3, y: 1.7, w: 3.0, h: 0.35,
    fontFace: FONT, fontSize: 14, color: C.blue, margin: 0,
  });
  s.addText("60 × 95 × 8.5 mm\n约 50 g  ·  500 mAh\n透明壳  ·  三键  ·  NFC", {
    x: 6.3, y: 2.2, w: 3.0, h: 1.5,
    fontFace: FONT, fontSize: 15, color: C.white, margin: 0,
  });
  s.addText("棚拍来自 ai-passport.folotoy.cn\n屏上是出厂名片，不是 K2。", {
    x: 6.3, y: 3.85, w: 3.0, h: 0.7,
    fontFace: FONT, fontSize: 12, color: C.muted, margin: 0,
  });
  addFooter(s, 2);
  s.addNotes("FoloToy 官网和淘宝卖的就是这个外形。大赛门票是 TRAE 定制版，壳子、屏、三键都一样。");
}

// 3 Our firmware on the real badge
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "刷完", C.orange);
  s.addText("同一块牌子，屏上换成 K2", {
    x: 0.5, y: 0.68, w: 9, h: 0.42,
    fontFace: FONT, fontSize: 26, color: C.white, bold: true, margin: 0,
  });
  s.addImage({
    path: path.join(DEVICE, "front-hand.jpg"),
    x: 0.4, y: 1.2, w: 4.5, h: 3.85,
    sizing: { type: "contain", w: 4.5, h: 3.85 },
  });
  s.addImage({
    path: path.join(DEVICE, "front-flat.jpg"),
    x: 5.1, y: 1.2, w: 4.5, h: 3.85,
    sizing: { type: "contain", w: 4.5, h: 3.85 },
  });
  addFooter(s, 3);
  s.addNotes("刷完之后，它还是这块 TRAE 工牌。屏上写 TRAE K2，橙色 PPT，Connected，电量 99%。没有伴侣程序。");
}

// 4 Four sides
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "多角度", C.green);
  s.addText("按键在右，充电在左，背面是名片", {
    x: 0.5, y: 0.68, w: 9, h: 0.4,
    fontFace: FONT, fontSize: 24, color: C.white, bold: true, margin: 0,
  });
  const shots = [
    { f: "side-buttons.jpg", l: "右 · 上/下/确认" },
    { f: "side-usbc.jpg", l: "左 · Type-C" },
    { f: "back.jpg", l: "背 · FoloToy / NFC" },
    { f: "back-usb.jpg", l: "背 · 插着充电" },
  ];
  shots.forEach((it, i) => {
    const x = 0.35 + i * 2.4;
    s.addImage({
      path: path.join(DEVICE, it.f),
      x, y: 1.2, w: 2.25, h: 3.35,
      sizing: { type: "cover", w: 2.25, h: 3.35 },
    });
    s.addText(it.l, {
      x, y: 4.6, w: 2.25, h: 0.35,
      fontFace: FONT, fontSize: 12, color: C.muted, align: "center", margin: 0,
    });
  });
  addFooter(s, 4);
  s.addNotes("右边三颗键从上到下是上、下、确认。左边 Type-C 只负责供电和烧录，HID 走蓝牙。背面印着官方 GitHub。");
}

// 5 Keys
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "按键", C.blue);
  s.addText("最下面那颗，是换挡", {
    x: 0.5, y: 0.68, w: 5.2, h: 0.42,
    fontFace: FONT, fontSize: 26, color: C.white, bold: true, margin: 0,
  });
  s.addImage({
    path: path.join(DEVICE, "side-buttons.jpg"),
    x: 5.3, y: 0.55, w: 4.3, h: 4.55,
    sizing: { type: "contain", w: 4.3, h: 4.55 },
  });
  const keys = [
    { t: "上", d: "当前档的「上」" },
    { t: "下", d: "当前档的「下」" },
    { t: "确认", d: "短按换挡 · 长按回菜单" },
  ];
  keys.forEach((k, i) => {
    const y = 1.3 + i * 1.15;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y, w: 4.5, h: 1.0,
      fill: { color: C.card }, rectRadius: 0.1,
    });
    s.addText(k.t, {
      x: 0.7, y, w: 1.3, h: 1.0,
      fontFace: FONT, fontSize: 20, color: C.blue, valign: "middle", margin: 0, bold: true,
    });
    s.addText(k.d, {
      x: 2.1, y, w: 2.7, h: 1.0,
      fontFace: FONT, fontSize: 15, color: C.white, valign: "middle", margin: 0,
    });
  });
  addFooter(s, 5);
  s.addNotes("上面两颗干活，最下面确认键换挡。短按立刻切模式，屏幕马上改名字；长按才回菜单。");
}

// 6 Why HID
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "原则", C.orange);
  s.addText("闪电说要的是真键盘", {
    x: 0.5, y: 0.68, w: 9, h: 0.42,
    fontFace: FONT, fontSize: 26, color: C.white, bold: true, margin: 0,
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.5, y: 1.3, w: 4.4, h: 3.5,
    fill: { color: C.card }, rectRadius: 0.12,
  });
  s.addText("走过，不行", {
    x: 0.75, y: 1.5, w: 3.9, h: 0.4,
    fontFace: FONT, fontSize: 16, color: "FF453A", bold: true, margin: 0,
  });
  s.addText("工牌自己录音\n脚本模拟按键\n伴侣往窗口贴字", {
    x: 0.75, y: 2.15, w: 3.9, h: 2.2,
    fontFace: FONT, fontSize: 18, color: C.muted, margin: 0,
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 5.1, y: 1.3, w: 4.4, h: 3.5,
    fill: { color: C.card }, rectRadius: 0.12,
  });
  s.addText("现在这条", {
    x: 5.35, y: 1.5, w: 3.9, h: 0.4,
    fontFace: FONT, fontSize: 16, color: C.green, bold: true, margin: 0,
  });
  s.addText("BLE HID 键盘\n右 Ctrl 开始 / 结束\n声音走电脑麦克风", {
    x: 5.35, y: 2.15, w: 3.9, h: 2.2,
    fontFace: FONT, fontSize: 18, color: C.white, margin: 0,
  });
  addFooter(s, 6);
  s.addNotes("闪电说不吃模拟按键。工牌只发右 Ctrl 和回车，声音走电脑麦。");
}

// 7 Shandian + 闪电说 UI
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "档位 1", C.blue);
  s.addText("Shandian  →  闪电说", {
    x: 0.5, y: 0.68, w: 9, h: 0.4,
    fontFace: FONT, fontSize: 26, color: C.white, bold: true, margin: 0,
  });
  s.addImage({
    path: path.join(APPS, "shandianshuo.jpg"),
    x: 0.4, y: 1.2, w: 6.3, h: 3.7,
    sizing: { type: "contain", w: 6.3, h: 3.7 },
  });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.85, y: 1.35, w: 2.7, h: 3.4,
    fill: { color: C.card }, rectRadius: 0.12,
  });
  s.addText("上键", {
    x: 7.05, y: 1.55, w: 2.3, h: 0.3,
    fontFace: FONT, fontSize: 13, color: C.blue, margin: 0, bold: true,
  });
  s.addText("右 Ctrl\n开始 / 结束听写", {
    x: 7.05, y: 1.9, w: 2.3, h: 0.75,
    fontFace: FONT, fontSize: 14, color: C.white, margin: 0,
  });
  s.addText("下键", {
    x: 7.05, y: 2.8, w: 2.3, h: 0.3,
    fontFace: FONT, fontSize: 13, color: C.blue, margin: 0, bold: true,
  });
  s.addText("Enter 换行", {
    x: 7.05, y: 3.15, w: 2.3, h: 0.4,
    fontFace: FONT, fontSize: 14, color: C.white, margin: 0,
  });
  s.addText("电脑麦克风\n不是工牌麦", {
    x: 7.05, y: 3.7, w: 2.3, h: 0.7,
    fontFace: FONT, fontSize: 13, color: C.muted, margin: 0,
  });
  addFooter(s, 7);
  s.addNotes("开机默认蓝色 Shandian。上键就是闪电说的右 Ctrl：按一下开始说，再按结束。下键回车。");
}

// 8 PPT + PowerPoint UI
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "档位 2", C.orange);
  s.addText("PPT  →  PowerPoint 翻页", {
    x: 0.5, y: 0.68, w: 9, h: 0.4,
    fontFace: FONT, fontSize: 26, color: C.white, bold: true, margin: 0,
  });
  s.addImage({
    path: path.join(APPS, "powerpoint.jpg"),
    x: 0.4, y: 1.15, w: 5.7, h: 3.75,
    sizing: { type: "contain", w: 5.7, h: 3.75 },
  });
  s.addImage({
    path: path.join(DEVICE, "front-flat.jpg"),
    x: 6.25, y: 1.15, w: 3.3, h: 3.75,
    sizing: { type: "contain", w: 3.3, h: 3.75 },
  });
  addFooter(s, 8);
  s.addNotes("短按确认，工牌变成橙色 PPT。上键 PageUp 上一页，下键 PageDown 下一页。左边是 PowerPoint 放映，右边是这块真机。");
}

// 9 Pairing
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "上手", C.green);
  s.addText("现场三十秒", {
    x: 0.5, y: 0.68, w: 9, h: 0.4,
    fontFace: FONT, fontSize: 26, color: C.white, bold: true, margin: 0,
  });
  const steps = [
    { n: "01", t: "USB 或电池", d: "屏上是 TRAE K2" },
    { n: "02", t: "设置里添加设备", d: "不要用任务栏弹出层" },
    { n: "03", t: "点 TRAE K2", d: "没有 PIN" },
    { n: "04", t: "变成 Connected", d: "上键听写，确认换挡" },
  ];
  steps.forEach((st, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 4.75;
    const y = 1.25 + row * 1.75;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w: 4.5, h: 1.55,
      fill: { color: C.card }, rectRadius: 0.12,
    });
    s.addText(st.n, {
      x: x + 0.25, y: y + 0.2, w: 1.0, h: 0.35,
      fontFace: FONT, fontSize: 16, color: C.blue, bold: true, margin: 0,
    });
    s.addText(st.t, {
      x: x + 0.25, y: y + 0.55, w: 4.0, h: 0.35,
      fontFace: FONT, fontSize: 18, color: C.white, bold: true, margin: 0,
    });
    s.addText(st.d, {
      x: x + 0.25, y: y + 0.98, w: 4.0, h: 0.3,
      fontFace: FONT, fontSize: 13, color: C.muted, margin: 0,
    });
  });
  addFooter(s, 9);
  s.addNotes("Windows 设置里添加 TRAE K2。网页上那个 k 不是配对码。");
}

// 10 Pitfalls
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "踩坑", C.orange);
  s.addText("这四条，后来的人不必再走", {
    x: 0.5, y: 0.68, w: 9, h: 0.4,
    fontFace: FONT, fontSize: 24, color: C.white, bold: true, margin: 0,
  });
  const pits = [
    { t: "不要脚本模拟键", d: "闪电说只认 HID" },
    { t: "不要额外 GATT", d: "时间服务会把键盘弄丢" },
    { t: "不要随手擦 NVS", d: "配对信息在里面" },
    { t: "不要用弹出层配对", d: "去系统设置里添加设备" },
  ];
  pits.forEach((p, i) => {
    const x = 0.5 + (i % 2) * 4.75;
    const y = 1.25 + Math.floor(i / 2) * 1.75;
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 4.5, h: 1.55,
      fill: { color: C.card },
    });
    s.addShape(pres.shapes.RECTANGLE, {
      x, y, w: 0.1, h: 1.55,
      fill: { color: C.orange },
    });
    s.addText(p.t, {
      x: x + 0.35, y: y + 0.35, w: 3.9, h: 0.4,
      fontFace: FONT, fontSize: 18, color: C.white, bold: true, margin: 0,
    });
    s.addText(p.d, {
      x: x + 0.35, y: y + 0.85, w: 3.9, h: 0.35,
      fontFace: FONT, fontSize: 14, color: C.muted, margin: 0,
    });
  });
  addFooter(s, 10);
  s.addNotes("模拟按键无效，加蓝牙时间服务会把闪电说弄没，擦 NVS 会让重连死循环，任务栏弹出层经常停在 Connecting。");
}

// 11 Open source
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  addKicker(s, "开源", C.blue);
  s.addText("仓库里现在是真机照片", {
    x: 0.5, y: 0.68, w: 9, h: 0.4,
    fontFace: FONT, fontSize: 24, color: C.white, bold: true, margin: 0,
  });
  const cards = [
    { t: "assets/device/", d: "你手里这块 TRAE 工牌的多角度实物" },
    { t: "assets/official/", d: "FoloToy 官网棚拍，对照外形" },
    { t: "assets/apps/", d: "闪电说、PowerPoint 界面，讲清遥控对象" },
  ];
  cards.forEach((c, i) => {
    const y = 1.25 + i * 1.15;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.5, y, w: 9, h: 1.0,
      fill: { color: C.card }, rectRadius: 0.1,
    });
    s.addText(c.t, {
      x: 0.75, y: y + 0.14, w: 8.5, h: 0.3,
      fontFace: MONO, fontSize: 16, color: C.blue, margin: 0,
    });
    s.addText(c.d, {
      x: 0.75, y: y + 0.5, w: 8.5, h: 0.32,
      fontFace: FONT, fontSize: 15, color: C.white, margin: 0,
    });
  });
  addFooter(s, 11);
  s.addNotes("GitHub 上已经换成实物图。Agent 打开仓库就能看见这块牌子长什么样、键在哪、在控哪两个软件。");
}

// 12 Close
{
  const s = pres.addSlide();
  s.background = { color: C.bg };
  s.addImage({
    path: path.join(DEVICE, "back.jpg"),
    x: 5.4, y: 0.4, w: 4.2, h: 4.85,
    sizing: { type: "contain", w: 4.2, h: 4.85 },
  });
  s.addText("同一块通行证", {
    x: 0.5, y: 1.7, w: 4.7, h: 0.7,
    fontFace: FONT, fontSize: 32, color: C.white, bold: true, margin: 0,
  });
  s.addText("你可以继续当名片，也可以让它开始干活。", {
    x: 0.5, y: 2.5, w: 4.7, h: 0.7,
    fontFace: FONT, fontSize: 16, color: "D1D1D6", margin: 0,
  });
  s.addText("github.com/BigQ749/trae-k2-remote", {
    x: 0.5, y: 4.55, w: 4.7, h: 0.35,
    fontFace: MONO, fontSize: 13, color: C.blue, margin: 0,
  });
  s.addNotes("背面还写着 FoloToy 和官方仓库。我们做的是社区固件。GitHub 在这一页。");
}

pres.writeFile({ fileName: OUT }).then(() => {
  console.log("wrote", OUT);
});
