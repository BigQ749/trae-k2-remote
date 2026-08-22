# 踩过的坑

给后来的人和 Agent：这些不是猜测，是这块板上发生过的事。

| 症状 | 根因 | 正确做法 |
|---|---|---|
| 闪电说完全没反应，记事本能打字 | 用了 `SendInput` / 伴侣脚本 | 走 BLE HID |
| 能连上但不打字 | HID 发送放在 LVGL 锁后面 | `main.c` 里 PRESS 先入队 |
| 连 1 秒掉 1 秒 | NVS persist 关着，或 persist 开了但债券是旧的 | persist 保持开；必要时只删 Windows 设备，不要动 erase |
| 加了时间服务后闪电说挂了 | 额外 GATT + 轮询占用 HID | 不要加 GATT |
| 屏上 `--:--`、对时差一分钟 | 编译期时间 / USB DTR 复位 | 本产品不做时钟 |
| 任务栏 Connecting 转圈 | Windows 弹出层 + 旧名字缓存 | 设置里添加设备；名字 K2 |
| 官网 KEY 当 PIN 无效 | `k=` 是厂商设备 KEY | Just Works |
| GitHub 拉 LVGL 极慢 | 国际源 | `components-file.espressif.cn` |
| 编译成功但板子还是门票 | 只 build 没 flash | `scripts/flash.py` |
| 确认键切档又进菜单 | 在 PRESS 上切档 | 必须 CLICK |
| 三键乱跳 | 内部上拉 / 窗口不对 | 外部 10k + `BSP_BTN_MV_TABLE` |
| USB 烧录时屏闪黑 | 第二个 USB-JTAG 驱动抢控制台 | 只用 IDF 自带 USB Serial/JTAG |
| `nvs_flash_erase` 当万能药 | 债券没了 | 配对成功后禁止随手擦 |

## 明确不做的功能

- 工牌本地语音识别
- Google STT
- 把录音从 UART 塞进电脑
- 在 HID 之外再挂一个时间 Profile
