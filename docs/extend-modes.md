# 加第三档

档位是内存里的一个 `uint8_t`，短按 OK 循环。不要新开一个 GATT「模式服务」。

## 改哪里

1. `firmware/ai-passport/main/ble_hid_kbd.h`  
   在 `HID_MODE_PPT` 后加枚举，例如 `HID_MODE_MEDIA`。`HID_MODE_COUNT` 会自动变。
2. `ble_hid_kbd.c`  
   - 新 `CMD_*` 和 HID 键码（必须 `<= 0x65`，否则先改 report map，那会迫使所有人重新配对）  
   - `hid_task` 的 `switch`  
   - `ble_hid_mode_title/help/color`  
   - `ble_hid_tap_up/down` 按 `s_mode` 分支
3. `demo_talk.c` 几乎不用改，它只显示 `ble_hid_mode_*()`。

## 键码建议（仍在 0x65 内）

| 想法 | UP | DOWN | 备注 |
|---|---|---|---|
| 浏览器幻灯片 | PageUp | PageDown | 和 PPT 档重复，不必新档 |
| 会议静音（若软件认快捷键） | 自定义修饰键 | — | 先在 PC 上确认软件吃 HID |
| 系统音量 | 不行 | 不行 | 消费类按键要改 report map（Consumer Control） |

媒体键（音量、播放）走 Usage Page `0x0C`，**不在**当前键盘 map 里。要加媒体档，就接受「全员重新配对」。

## UI

Montserrat 没有中文。标题用短英文：`Meet`、`Media`、`System`。颜色从现有蓝/橙再分一档即可，例如绿 `#30D158`。

长按 OK 仍然回菜单，不要占用。
