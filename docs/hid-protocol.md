# HID 与档位

## 报告

8 字节，Report ID 1（`esp_hidd_dev_input_set(..., 1, buf, 8)`）：

```
[0] modifier
[1] reserved
[2] keycode 0
[3..7] 其余键
```

一次 tap：非零包 → 延时 80ms → 全零包。

## 档位表

实现：`firmware/ai-passport/main/ble_hid_kbd.c`

| `s_mode` | 屏上标题 | 颜色 | UP | DOWN |
|---|---|---|---|---|
| 0 DICTATE | Shandian | `#0A84FF` | modifier `0x10` + `0xE4` | `0x28` |
| 1 PPT | PPT | `#FF9F0A` | `0x4B` PageUp | `0x4E` PageDown |

循环：`(mode + 1) % HID_MODE_COUNT`。现在只有两档。加档见 [extend-modes.md](extend-modes.md)。

## 和闪电说的关系

闪电说把「开始/停止听写」绑在右 Ctrl 上（用户侧快捷键）。它认 **HID 键盘**，不认：

- AutoHotkey / `SendInput`
- 本机脚本把文字贴进输入框
- 工牌麦克风（那是另一条失败产品路径）

听写音频走 **电脑麦克风**。工牌只当遥控器。

Enter 用来在听写结束后换行或发送，看你焦点在哪个窗口。

## 和 PPT 的关系

PowerPoint 放映中，PageUp / PageDown 是上一页 / 下一页。浏览器幻灯片、PDF 全屏通常也认这两个键。

不要用方向键替代，除非改档位表：方向键在 PPT 编辑模式会动光标，放映模式才翻页；PageUp/PageDown 语义更稳。
