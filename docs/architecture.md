# 固件结构

```
开机
  nvs_flash_init
  ble_hid_kbd_start          NimBLE HID + 广播 TRAE K2
  I2C / 屏 / LVGL / 按键 / 电量
  直接进入 Talk 页（不先停在菜单）

Talk 页
  定时器 400ms：连接状态、电量、上次 HID 结果
  短按 OK → ble_hid_mode_cycle() → 改标题和说明
  上/下 PRESS → ble_hid_tap_up/down() 入队

HID 任务
  队列取出命令 → 8 字节键盘 report（ID 1）按下 80ms → 全零抬起
```

## 模块

### `ble_hid_kbd.c`

- 标准 Boot 键盘描述符，Report ID 1，6KRO，逻辑最大 `0x65`
- 设备名 `TRAE K2`，VID `0x16C0` PID `0x05DF`（常见开源 HID 键盘身份，避免和出厂冲突）
- 档位状态 `s_mode`
- `send_keys(modifier, key)` 一次完整 tap
- Right Ctrl **必须**同时带 modifier 位 `0x10` 和键码 `0xE4`，只发 modifier 位 Windows 经常不理

### `esp_hid_gap.c`

- 只跑 BLE（释放 Classic 内存）
- 广播 Appearance = Keyboard，UUID `0x1812`
- `SM_IO_CAP_NO_IO` + bonding，无 MITM，无 Secure Connections
- 已绑定的连接会 `ble_gap_security_initiate`
- `REPEAT_PAIRING` 时删对端再配（见源码后半）
- 把 efuse MAC 最后一字节 `xor 0x02` 再 `esp_base_mac_addr_set`，让 Windows 把 K2 当成新设备

### `demo_talk.c`

屏上元素（240×320，黑底）：

1. `TRAE K2`
2. 档位名 `Shandian` / `PPT`（蓝 / 橙）
3. 连接卡片
4. 电量数字 + 条 + mV
5. 当前档的上/下说明
6. 底栏提示（换挡 / Key sent）

### `main.c`

`on_key` 分两段：

```
if Talk && PRESS && (UP|DOWN):  ble_hid_tap_*()     // 无 LVGL 锁
lock LVGL
  if LONG OK: 回菜单
  else 交给当前页 key()
```

Talk 页的 `demo_talk_key` 处理 OK 的 CLICK 以及底栏文案。

## 为什么 HID 描述符不能随便改

Windows 把 report map 和绑定绑在一起。改描述符 = 用户必须删除设备再添加。PageUp/PageDown 能塞进现有 `0x00–0x65` 空间，所以加 PPT 档不必改 map。

## 内存

ESP32-C3 无 PSRAM。`CONFIG_LV_MEM_SIZE_KILOBYTES=24`。不要加大 LVGL 缓冲「让动画好看」。
