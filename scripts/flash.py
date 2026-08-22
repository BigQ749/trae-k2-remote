#!/usr/bin/env python3
"""Flash TRAE K2 without erasing NVS. Auto-detects VID 303A PID 1001."""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RELEASE = ROOT / "release"
BUILD = ROOT / "firmware" / "ai-passport" / "build"

VID, PID = 0x303A, 0x1001


def badge_port() -> str:
    from serial.tools import list_ports
    hits = [p.device for p in list_ports.comports() if p.vid == VID and p.pid == PID]
    if not hits:
        raise SystemExit("No badge on USB (VID:PID=303A:1001).")
    if len(hits) > 1:
        print("multiple badges:", ", ".join(hits), file=sys.stderr)
    return hits[0]


def bins(from_build: bool) -> tuple[Path, Path, Path]:
    if from_build:
        boot = BUILD / "bootloader" / "bootloader.bin"
        table = BUILD / "partition_table" / "partition-table.bin"
        app = BUILD / "FoloToy-AI-Passport.bin"
    else:
        boot = RELEASE / "bootloader.bin"
        table = RELEASE / "partition-table.bin"
        app = RELEASE / "FoloToy-AI-Passport.bin"
    for p in (boot, table, app):
        if not p.is_file():
            raise SystemExit(f"missing {p}")
    return boot, table, app


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--from-build", action="store_true")
    ap.add_argument("-p", "--port")
    args = ap.parse_args()
    port = args.port or badge_port()
    boot, table, app = bins(args.from_build)
    cmd = [
        sys.executable, "-m", "esptool",
        "--chip", "esp32c3",
        "--port", port,
        "-b", "460800",
        "--before", "default_reset",
        "--after", "hard_reset",
        "write_flash",
        "--flash_mode", "dio",
        "--flash_size", "detect",
        "--flash_freq", "80m",
        "0x0", str(boot),
        "0x8000", str(table),
        "0x10000", str(app),
    ]
    print("port", port)
    print("boot", boot)
    print("table", table)
    print("app", app)
    print("NVS is not erased.")
    subprocess.check_call(cmd)


if __name__ == "__main__":
    main()
