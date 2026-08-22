# Firmware tree

ESP-IDF 5.5.x project for the FoloToy AI Passport (ESP32-C3).

Human and agent entry points live in the **repository root**, not here:

- [`../../README.md`](../../README.md)
- [`../../AGENTS.md`](../../AGENTS.md)
- [`../../docs/from-zero.md`](../../docs/from-zero.md)

Build from `firmware/ai-passport` after `export.bat` / `export.sh`:

```bat
idf.py set-target esp32c3
idf.py build
```

China: this folder already sets `idf_component_manager.yml` to
`https://components-file.espressif.cn`. Do not fetch LVGL from github.com.
