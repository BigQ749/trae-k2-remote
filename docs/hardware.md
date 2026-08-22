# 硬件

FoloToy AI Passport / 大赛 TRAE 主题电子工牌。工程名历史上叫 `trae_card`，LampVersion C1.1。

开源硬件参考：[FoloToy/ai-passport](https://github.com/FoloToy/ai-passport)。

## 芯片与接口

| 项 | 规格 |
|---|---|
| MCU | ESP32-C3 QFN32 rev v1.1，单核 160 MHz |
| 无线 | Wi-Fi + BLE 5 LE |
| Flash | 片内 8MB（XMC），无 PSRAM |
| USB | Type-C 原生 USB-Serial/JTAG，VID `303A` PID `1001` |
| 安全 | 出厂未开 Secure Boot / Flash Encryption（所以能刷自定义固件） |
| 晶振 | 40 MHz |

USB 串口描述符里的 Serial 往往就是 MAC，例如 `4C:11:AE:xx:xx:xx`。每块板不同。

## 屏

ST7789P3，240×320，SPI2。

| 信号 | GPIO |
|---|---|
| MOSI | 9 |
| SCLK | 8 |
| CS | 1 |
| DC | 20 |
| RST | 未接 MCU，软复位 |
| BL | 21（LEDC PWM） |

出厂需要 `INVON` 反色（`BSP_LCD_INVERT_COLOR 1`）。SPI mode 0。

## 三键（右边，上 → 下）

共用 **GPIO0 / ADC1_CH0**，外部 10k 上拉 + 分压：

| 键 | 分压 | 大约电压 | 固件窗口 |
|---|---|---|---|
| 上 | 0Ω | ~0 mV | 0–150 |
| 下 | 1k | ~300 mV | 150–447 |
| 确认 | 2.2k | ~595 mV | 447–1900 |
| 松开 | — | ~3300 mV | — |

不能改成内部上拉：三档会挤在一起。换电阻后去 BSP 的 Button 页读 mV，再改 `BSP_BTN_MV_TABLE`。

事件（`iot_button`）：

- `PRESS` 按下瞬间 → 上/下发 HID
- `CLICK` 短按抬起 → 确认换挡
- `LONG` 长按 → 回菜单

## 其它外设（本固件几乎不用）

| 外设 | 总线 | 用途 |
|---|---|---|
| ES8311 | I2C `0x18` + I2S | 喇叭/麦。HID 遥控不录音 |
| CW2017 | I2C `0x63` | 电量百分比，Talk 页显示 |
| I2C | SDA 10, SCL 7 | 上面两个设备共用 |

I2S：MCLK 6, BCLK 5, WS 3, DOUT 2, DIN 4。

## Flash 规划（本仓库自定义固件）

IDF `PARTITION_TABLE_SINGLE_APP_LARGE`：

- `0x0` bootloader
- `0x8000` 分区表
- NVS（绑定信息在这里）
- `0x10000` application

出厂门票是另一套分区（头像 PNG、cardid、audio 资源）。**两套不能混着按地址猜。** 救出厂只能刷你自己备份的整片 8MB。
