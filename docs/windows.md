# Windows 蓝牙

## 正确配对

1. 工牌已刷 TRAE K2，屏上是 `Pair: TRAE K2` 或已经 `Connected`
2. **设置 → 蓝牙和设备 → 添加设备 → 蓝牙**
3. 选 **TRAE K2**
4. 无 PIN。点一下即可

不要：

- 只点任务栏蓝牙弹出层（经常停在 Connecting）
- 去官网 `k=……` 当配对码
- 在「打印机和扫描仪」里找

配对成功后，设备管理器里应出现 HID 键盘。屏上 `Connected`。

## 重连

`CONFIG_BT_NIMBLE_NVS_PERSIST=y`。关机再开，Windows 应自动连。

若每次开机都要重新添加：

1. 确认没在用 `erase_flash`
2. 确认 `sdkconfig` 里 persist 仍是 y
3. 删除 Windows 里 TRAE K2 后只通过「添加设备」再配一次

## 缓存被毒化（历史问题）

旧固件名叫 `TRAE Key`。部分 Windows（含 MediaTek 蓝牙适配器）会把这个名字停在 Connecting。

现行固件：

- 改名为 `TRAE K2`
- 把蓝牙 MAC 最后一字节异或 `0x02`

如果你仍看到 `TRAE Key`：在设置里删除该设备，再搜 K2。

## 闪电说

- 用电脑麦，不是工牌麦
- 快捷键保持右 Ctrl
- 焦点要在能输入的窗口
- 工牌必须显示 Connected，否则上键只是本地 UI

## 同时插着 USB

USB 只是供电和烧录。HID 走蓝牙。烧录时串口被 esptool 占用是正常的，烧完会复位。不要开着 `idf.py monitor` 再烧。
