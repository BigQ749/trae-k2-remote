#!/usr/bin/env python3
"""Print USB-Serial/JTAG COM ports for the FoloToy badge (VID 303A PID 1001)."""
from __future__ import annotations

VID = 0x303A
PID = 0x1001


def list_badge_ports():
    try:
        from serial.tools import list_ports
    except ImportError as e:
        raise SystemExit("pip install pyserial") from e
    found = []
    for p in list_ports.comports():
        if p.vid == VID and p.pid == PID:
            found.append(p)
    return found


def main() -> None:
    ports = list_badge_ports()
    if not ports:
        raise SystemExit("No badge found (USB VID:PID=303A:1001). Plug USB-C data cable.")
    for p in ports:
        print(f"{p.device}\tUSB VID:PID={p.vid:04X}:{p.pid:04X}\t{p.serial_number or ''}")


if __name__ == "__main__":
    main()
