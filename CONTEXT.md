# CONTEXT — why this firmware exists

## Product

Contest attendees all received the same FoloToy **TRAE AI Passport** badge.
Factory firmware is a TRAE-themed e-name-card (avatar, Token, GAME, IMAGE).

This project keeps the **same hardware** and replaces the application with a
pocket remote that people actually use in talks:

- **Shandian gear** — drive 闪电说 with Right Ctrl / Enter
- **PPT gear** — previous / next slide
- **OK key** — gear shifter, not “confirm”

The screen always names the current gear. No companion process on the PC.

## Decisions that stuck

| Decision | Why |
|---|---|
| BLE HID keyboard, not USB gadget | Badge is worn; USB cable is not the product |
| Real HID, not `SendInput` | 闪电说 ignores injected keys |
| Right Ctrl, not Left Ctrl / Win+H | Matches the 闪电说 shortcut the user already uses; PC mic, not badge mic |
| NimBLE + `esp_hid`, not Bluedroid | Working stack on this board |
| Bond persist in NVS | Reboot must reconnect |
| BLE name `TRAE K2` + MAC last-byte xor `0x02` | Windows had a poisoned `TRAE Key` cache that stuck on Connecting |
| Just Works, no MITM, no PIN | Badge has no number pad |
| No extra GATT | Time service + a looping Python host stole the HID path; 闪电说 died |
| No clock on UI | Compile-time clock drifted; USB time reset on DTR; GATT time hurt HID |
| PageUp / PageDown for PPT | Fits existing report map (`<= 0x65`); means “previous/next page” in PPT/PDF |
| Gear cycle on OK **CLICK** | Long OK must still mean “back to menu” |
| HID tap before LVGL lock | Waiting on the UI lock dropped keys |
| ASCII UI | Montserrat has no CJK |
| Do not ship factory dump | Unique secrets per badge; also not ours to redistribute |

## Paths that failed (do not revive without a new reason)

1. USB PCM → PC → Google STT → paste. Slow, 502s, encoding-broken launchers, and 闪电说 still wants its own mic.
2. Faster-Whisper companion typing into the focused window. Easy to miss the focus; still not HID.
3. `SendInput` / hotkey scripts. 闪电说 ignores them.
4. Extra BLE time characteristic + `pythonw` poller. HID broke.
5. Clock via compile timestamp. About a minute slow, then worse.
6. Pairing via the Windows flyout. Connecting forever.
7. `nvs_flash_erase` as a “fix”. Destroys the bond; reconnect loop.

## Version lineage (local, not all published)

| Tag | What it was |
|---|---|
| v0 | Factory TRAE ticket UI |
| v2 | Voice Link: badge records, PC companion transcribes |
| v3 | BLE HID, name `TRAE Key`, no battery, re-pair every boot |
| v4 | `TRAE K2`, battery, persist bond, no clock |
| **this repo** | v4 + OK gear shifter + PPT PageUp/PageDown |

## Related upstream

- Hardware / BSP origin: https://github.com/FoloToy/ai-passport
- Official TRAE web (factory product, not this firmware): https://ai-passport.folotoy.cn/trae/
