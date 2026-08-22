# 从零：手里刚拿到这块工牌

对象：FoloToy TRAE AI Passport（大赛通行证）。  
目标：刷成 TRAE K2 遥控器，用闪电说和 PPT。

整条路径大约 15–25 分钟，其中备份出厂最耗时。

---

## 0. 你需要什么

- 工牌本体 + USB-C 线（要能传数据，不要是纯充电线）
- Windows 10/11 电脑
- Python 3.10+（`pip install esptool pyserial`）
- 可选：闪电说、PowerPoint（验收用）

**不要**在刷机前拆官方 App / 官方网页当配对密码。那个 `k=` 不是 Windows PIN。

---

## 1. 认出这块板

插上 USB。设备管理器里应出现 **USB 串行设备**，硬件 ID：

```
VID_303A&PID_1001
```

本仓库脚本按这个 VID/PID 找口，不写死 COM7（每台电脑 COM 号会变）。

```bat
python scripts\find_port.py
```

应打印类似：

```
COM7  USB VID:PID=303A:1001
```

屏还是出厂「名片」也没关系，先备份再刷。

---

## 2. 备份出厂（必做）

自定义固件会盖掉门票界面。出厂镜像 **不在 GitHub**。每块牌子的 NVS、卡号、云密钥都是自己的。

```bat
python scripts\backup_factory.py
```

会在 `backups/` 写下大约 **8MB** 的 `factory_<MAC>.bin`。USB-JTAG 读 Flash 不快，请等它跑完。

确认文件大约 `8388608` 字节再进入下一步。

以后要救回出厂：

```bat
python scripts\restore_factory.py backups\factory_XXXXXXXXXXXX.bin
```

---

## 3. 烧 TRAE K2

```bat
python scripts\flash.py
```

写入三个文件（见 `release/`），**不擦 NVS**。

板子会复位。屏变成黑底：

- 顶上灰字 `TRAE K2`
- 大字蓝色 **Shandian**
- 连接卡片：`Pair: TRAE K2`
- 电量百分比
- `UP  Dictate` / `DOWN  Enter`
- 底栏 `OK  switch mode`

---

## 4. 配对

1. Windows **设置 → 蓝牙和设备 → 添加设备 → 蓝牙**
2. 点 **TRAE K2**
3. 不要去任务栏那个小弹出层里死等 Connecting
4. 屏上变成绿色 **Connected**

若列表里还有旧的 `TRAE Key`，删掉它，只留 K2。

---

## 5. 验收（五件事）

1. 打开记事本，**下键**应打出回车。
2. 打开闪电说，**上键**应开始/结束听写（用电脑麦克风）。
3. **短按确认**，屏顶变成橙色 **PPT**，说明文字变成 Prev / Next page。
4. PowerPoint 放映中，上键上一页、下键下一页。
5. 拔掉 USB，靠电池，蓝牙仍在；关机再开，应自己连上，不用重新配对。

长按确认会进 BSP 菜单（Display / Button / Audio / Battery）。再进 Talk 即可。

---

## 6. 出问题先看这里

| 现象 | 先做 |
|---|---|
| 找不到 COM | 换线；确认 VID 303A；关掉占用该口的串口监视器 |
| 烧录 `Could not open COMx` | 关 `idf.py monitor` / 其他串口工具后重试 |
| 屏黑 / 闪 | 不要用 UART0 控制台；确认烧的是本仓库 `release/` |
| 一直 Pair，连不上 | 设置里添加设备；删掉旧 TRAE Key |
| 已 Connected 但不打字 | 焦点在输入框；闪电说要 HID 不是脚本 |
| 连上立刻掉 | 不要 erase NVS；删除 Windows 里旧设备再配对 |
| 确认键没换挡 | 短按，不要按住；按住是回菜单 |

更完整：[windows.md](windows.md) · [pitfalls.md](pitfalls.md)
