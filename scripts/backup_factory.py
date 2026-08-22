#!/usr/bin/env python3
"""Dump the full 8MB flash. Unique per badge. Do this BEFORE the first custom flash."""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BACKUPS = ROOT / "backups"
VID, PID = 0x303A, 0x1001
FLASH_BYTES = 8 * 1024 * 1024


def badge():
    from serial.tools import list_ports
    hits = [p for p in list_ports.comports() if p.vid == VID and p.pid == PID]
    if not hits:
        raise SystemExit("No badge on USB (VID:PID=303A:1001).")
    return hits[0]


def main() -> None:
    p = badge()
    BACKUPS.mkdir(exist_ok=True)
    mac = (p.serial_number or "unknown").replace(":", "").replace("-", "").lower()
    out = BACKUPS / f"factory_{mac}.bin"
    print("port", p.device)
    print("writing", out)
    print("USB-JTAG read is slow. Wait for 8388608 bytes.")
    cmd = [
        sys.executable, "-m", "esptool",
        "--chip", "esp32c3",
        "--port", p.device,
        "read_flash", "0x0", hex(FLASH_BYTES), str(out),
    ]
    subprocess.check_call(cmd)
    size = out.stat().st_size
    if size != FLASH_BYTES:
        raise SystemExit(f"backup size {size}, expected {FLASH_BYTES}")
    print("ok", size, "bytes")


if __name__ == "__main__":
    main()
