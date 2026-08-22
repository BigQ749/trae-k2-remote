#!/usr/bin/env python3
"""Restore a full 8MB dump taken by backup_factory.py. This overwrites everything."""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

VID, PID = 0x303A, 0x1001
FLASH_BYTES = 8 * 1024 * 1024


def badge_port() -> str:
    from serial.tools import list_ports
    hits = [p.device for p in list_ports.comports() if p.vid == VID and p.pid == PID]
    if not hits:
        raise SystemExit("No badge on USB (VID:PID=303A:1001).")
    return hits[0]


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("bin", type=Path)
    ap.add_argument("-p", "--port")
    args = ap.parse_args()
    if not args.bin.is_file():
        raise SystemExit(f"missing {args.bin}")
    size = args.bin.stat().st_size
    if size != FLASH_BYTES:
        raise SystemExit(f"{args.bin} is {size} bytes, expected {FLASH_BYTES}")
    port = args.port or badge_port()
    print("THIS WRITES THE WHOLE CHIP, including NVS.")
    cmd = [
        sys.executable, "-m", "esptool",
        "--chip", "esp32c3",
        "--port", port,
        "-b", "115200",
        "--before", "default_reset",
        "--after", "hard_reset",
        "write_flash",
        "--flash_mode", "dio",
        "--flash_size", "detect",
        "0x0", str(args.bin),
    ]
    subprocess.check_call(cmd)


if __name__ == "__main__":
    main()
