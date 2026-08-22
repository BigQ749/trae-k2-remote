#pragma once
#include "esp_err.h"
#include <stdbool.h>
#include <stdint.h>

esp_err_t ble_hid_kbd_start(void);
bool ble_hid_kbd_connected(void);
int ble_hid_last_rc(void);

/* Gear shifter: short OK cycles these. Long OK stays in main.c (back to menu). */
typedef enum {
    HID_MODE_DICTATE = 0,  /* UP = Right Ctrl, DOWN = Enter */
    HID_MODE_PPT,          /* UP = PageUp,     DOWN = PageDown */
    HID_MODE_COUNT
} hid_mode_t;

void ble_hid_mode_cycle(void);
hid_mode_t ble_hid_mode(void);
const char *ble_hid_mode_title(void);
const char *ble_hid_mode_help(void);
uint32_t ble_hid_mode_color(void);

void ble_hid_tap_up(void);
void ble_hid_tap_down(void);
void ble_hid_tap_rctrl(void);
void ble_hid_tap_enter(void);
