# Agent playbook — TRAE K2

You are working on a **FoloToy TRAE AI Passport** contest badge (ESP32-C3).
This repo turns it into a **BLE HID keyboard remote** with two gears.

Read this file before touching firmware, NVS, or Windows pairing.

If a human just handed you the badge and this repo, follow
[docs/from-zero.md](docs/from-zero.md) in order. Do not skip the factory backup.

---

## Hardware identity (do not guess pins)

| Item | Value |
|---|---|
| Chip | ESP32-C3 QFN32 rev v1.1, no PSRAM, 8MB embedded flash |
| USB | Native USB-Serial/JTAG **VID `303A` PID `1001`** |
| Display | ST7789P3 240×320, 4-wire SPI |
| Keys | 3 buttons on **one ADC pin GPIO0 / ADC1_CH0** (voltage ladder) |
| Audio | ES8311 on I2C+I2S (unused by this HID firmware) |
| Gauge | CW2017 on the same I2C bus |
| Console | USB-Serial/JTAG. UART0 TX is GPIO21 = backlight. Never use UART0 console. |

Pin table lives in `firmware/ai-passport/components/bsp/include/bsp_pins.h`.
That file is the single source of truth.

Key map on the **right edge**, top to bottom:

1. UP
2. DOWN
3. OK (confirm)

ADC windows (mV): UP `{0,150}` · DOWN `{150,447}` · OK `{447,1900}` · released ~3300.

Only one key at a time. The ladder cannot chord.

---

## What the product is

Bluetooth name: **`TRAE K2`**.

The badge is a **real HID keyboard**. No PC companion. No Google STT.
No on-device speech model. 闪电说 (Shandian) listens to the **PC microphone**
and is toggled by **Right Ctrl** as a physical HID event.

| Gear | Screen title | UP | DOWN |
|---|---|---|---|
| 0 `HID_MODE_DICTATE` | `Shandian` (blue) | Right Ctrl (`mod 0x10` + key `0xE4`) | Enter `0x28` |
| 1 `HID_MODE_PPT` | `PPT` (orange) | PageUp `0x4B` | PageDown `0x4E` |

- Short **OK / CLICK** cycles gears immediately and updates the labels.
- Long **OK** returns to the BSP demo menu (`main.c` intercepts `BSP_BTN_LONG`).
- Cycle on **CLICK**, never on **PRESS**, or a long-OK would also change gear.

HID send for UP/DOWN happens in `main.c` **before** the LVGL lock.
Do not move those taps behind `bsp_lvgl_lock` — keys will vanish.

---

## Non-negotiables

These were learned the hard way. Treat them as invariants.

1. **Backup factory flash before the first custom flash.** This repo does not
   ship `factory_full.bin`. Each badge has unique NVS / cardid / cloud secrets.
   `python scripts/backup_factory.py` → `backups/` (gitignored).
2. **Do not `erase_flash` after a good pair.** Bonds live in NVS
   (`CONFIG_BT_NIMBLE_NVS_PERSIST=y`). Erasing forces a reconnect loop or a
   full re-pair.
3. **Do not add extra GATT services** (clock, time, battery-as-GATT, UART).
   Extra attributes broke 闪电说 even when the keyboard still “connected”.
4. **Do not change the HID report map** unless you are ready to delete the
   Windows device and re-pair. Current map is the standard 8-byte keyboard,
   Report ID 1, logical max `0x65`. PageUp/PageDown already fit.
5. **Do not inject keys from a PC script** (`SendInput`, etc.). 闪电说 ignores
   them. It wants a real HID keyboard.
6. **Do not restore official TRAE web `k=` as a Windows PIN.** It is a device
   KEY for the vendor site, not a Bluetooth passkey. Pairing is Just Works
   (`BLE_SM_IO_CAP_NO_IO`).
7. **Do not use the Windows taskbar Bluetooth flyout as the pairing UI.**
   It often sticks on Connecting. Use Settings → Bluetooth → Add device.
8. **Do not put a clock on the UI** unless the user asks again. USB time,
   compile-time time, and GATT time all failed or hurt HID.
9. **Do not fetch LVGL from github.com** in China. Use
   `IDF_COMPONENT_STORAGE_URL=https://components-file.espressif.cn`
   (already in `firmware/ai-passport/idf_component_manager.yml`).
10. **UI strings stay ASCII.** LVGL is Montserrat only. No CJK glyphs.
11. **Keep the BLE name `TRAE K2`.** `TRAE Key` was poisoned in Windows caches.
    `esp_hid_gap.c` also xors the last public MAC byte with `0x02` so Windows
    sees a fresh identity.

---

## From-zero procedure (badge in hand)

1. Plug USB-C. Confirm a COM port with `VID:PID=303A:1001`.
   `python scripts/find_port.py`
2. Backup 8MB flash. Takes a while on USB-JTAG. Do not skip.
   `python scripts/backup_factory.py`
3. Flash **app + bootloader + table only** (not NVS):
   `python scripts/flash.py`
4. Badge reboots into Talk page, title `Shandian`.
5. Windows Settings → Add Bluetooth device → **TRAE K2**.
6. Screen shows `Connected`.
7. Accept:
   - Shandian + UP → 闪电说 toggles
   - Shandian + DOWN → Enter
   - short OK → title becomes `PPT` (orange)
   - PPT + UP/DOWN → previous/next slide in PowerPoint
   - long OK → BSP menu, Talk is still first item
8. Power-cycle. It must auto-reconnect without re-pairing.

If pairing flaps (connect 1s / disconnect): the NVS bond is stale **and**
Windows still has an old device. Remove **TRAE K2** (and old **TRAE Key** if
present) in Windows, then pair again. Only erase NVS if the human agrees;
it is a last resort.

---

## Build

ESP-IDF **5.5.3**, target `esp32c3`.

```bat
cd firmware\ai-passport
idf.py set-target esp32c3
idf.py build
```

Incremental helper used in development:

```bat
scripts\build.bat
```

Flash the just-built images:

```bat
python scripts\flash.py --from-build
```

Do not raise LVGL buffers or enable PSRAM. The chip has neither the RAM nor
the hardware.

---

## Code map (change these, not random files)

| Goal | File |
|---|---|
| Add a third gear / new HID key | `main/ble_hid_kbd.h`, `main/ble_hid_kbd.c` |
| Labels, colors, help text | `main/demo_talk.c` + `ble_hid_mode_*()` |
| When HID is sent vs when UI updates | `main/main.c` `on_key()` |
| BLE name, bonding, MAC tweak | `main/esp_hid_gap.c` |
| Pins, ADC windows | `components/bsp/include/bsp_pins.h` |
| NimBLE persist | `sdkconfig.defaults` `CONFIG_BT_NIMBLE_NVS_PERSIST` |

HID keycodes used today (all `<= 0x65`):

```
Right Ctrl modifier 0x10, key 0xE4
Enter               0x28
PageUp              0x4B
PageDown            0x4E
```

Queue commands in `ble_hid_kbd.c`: RCTRL=1 ENTER=2 PGUP=3 PGDN=4.

---

## Tests on device (there is no PC unit test that proves HID)

After every firmware change that touches BLE or keys:

1. Screen boots Talk, not a black flicker loop.
2. Battery percent updates (I2C CW2017).
3. Windows Device Manager shows a keyboard under Bluetooth.
4. Notepad: DOWN types a newline in Shandian gear.
5. 闪电说: UP toggles dictation (PC mic).
6. Gear switch is immediate; help lines change.
7. PowerPoint slideshow: PPT gear turns pages.
8. Long OK still opens the menu.
9. Unplug USB, run on battery, BLE still works.
10. Reboot: reconnects without a new pair.

---

## Out of scope unless the human asks

- Factory TRAE avatar / GAME / IMAGE firmware restore (needs **their** dump)
- On-device ASR, Google STT, USB PCM streaming
- Extra modes (Meet / Media / System) — design is ready, see `docs/extend-modes.md`
- iOS / macOS as first-class (HID should work; pairing UI differs)
- Changing report map to consumer-control / media keys
