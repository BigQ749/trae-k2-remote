// BLE remote: OK cycles Shandian (RCtrl/Enter) and PPT (PageUp/PageDown).
#include "demo.h"
#include "ble_hid_kbd.h"
#include "bsp_battery.h"
#include "bsp_display.h"
#include "lvgl.h"
#include "esp_log.h"

static const char *TAG = "talk";

#define COLOR_BG     0x000000
#define COLOR_CARD   0x1C1C1E
#define COLOR_MUTED  0x8E8E93
#define COLOR_WHITE  0xFFFFFF
#define COLOR_BLUE   0x0A84FF
#define COLOR_GREEN  0x30D158
#define COLOR_RED    0xFF3B30
#define COLOR_ORANGE 0xFF9F0A

static lv_obj_t *s_scr, *s_status, *s_hint, *s_soc, *s_mv, *s_fill;
static lv_obj_t *s_mode, *s_help;
static lv_timer_t *s_tm;
static int s_bat_tick;

static void apply_mode_ui(void)
{
    if (s_mode) {
        lv_label_set_text(s_mode, ble_hid_mode_title());
        lv_obj_set_style_text_color(s_mode, lv_color_hex(ble_hid_mode_color()), 0);
    }
    if (s_help) lv_label_set_text(s_help, ble_hid_mode_help());
}

static lv_obj_t *mk_label(lv_obj_t *p, const lv_font_t *font, uint32_t color)
{
    lv_obj_t *l = lv_label_create(p);
    lv_obj_set_style_text_font(l, font, 0);
    lv_obj_set_style_text_color(l, lv_color_hex(color), 0);
    lv_obj_set_style_text_align(l, LV_TEXT_ALIGN_CENTER, 0);
    return l;
}

static uint32_t soc_color(int soc)
{
    if (soc < 0) return COLOR_MUTED;
    if (soc <= 15) return COLOR_RED;
    if (soc <= 30) return COLOR_ORANGE;
    return COLOR_GREEN;
}

static void refresh_battery(void)
{
    if (!s_soc) return;
    int soc = bsp_battery_soc();
    int mv  = bsp_battery_mv();
    uint32_t col = soc_color(soc);

    if (soc < 0) lv_label_set_text(s_soc, "-- %");
    else         lv_label_set_text_fmt(s_soc, "%d %%", soc);
    lv_obj_set_style_text_color(s_soc, lv_color_hex(col), 0);

    if (mv < 0) lv_label_set_text(s_mv, "-- mV");
    else        lv_label_set_text_fmt(s_mv, "%d mV", mv);

    int w = 0;
    if (soc > 0) {
        w = (soc * 120) / 100;
        if (w < 2) w = 2;
        if (w > 120) w = 120;
    }
    if (s_fill) {
        lv_obj_set_width(s_fill, w);
        lv_obj_set_style_bg_color(s_fill, lv_color_hex(col), 0);
    }
}

static void tick(lv_timer_t *t)
{
    (void)t;
    if (!s_status) return;
    if (ble_hid_kbd_connected()) {
        lv_label_set_text(s_status, "Connected");
        lv_obj_set_style_text_color(s_status, lv_color_hex(COLOR_GREEN), 0);
    } else {
        lv_label_set_text(s_status, "Pair: TRAE K2");
        lv_obj_set_style_text_color(s_status, lv_color_hex(COLOR_BLUE), 0);
    }
    int rc = ble_hid_last_rc();
    if (s_hint && rc >= 0) {
        lv_label_set_text(s_hint, rc == 0 ? "Key sent" : "Send fail");
        lv_obj_set_style_text_color(s_hint,
            lv_color_hex(rc == 0 ? COLOR_GREEN : COLOR_RED), 0);
    }
    if (++s_bat_tick >= 3) {
        s_bat_tick = 0;
        refresh_battery();
    }
}

void demo_talk_enter(void)
{
    s_scr = lv_obj_create(NULL);
    lv_obj_remove_flag(s_scr, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_style_bg_color(s_scr, lv_color_hex(COLOR_BG), 0);
    lv_obj_set_style_border_width(s_scr, 0, 0);
    lv_obj_set_style_pad_all(s_scr, 0, 0);

    lv_obj_t *k = mk_label(s_scr, &lv_font_montserrat_14, COLOR_MUTED);
    lv_label_set_text(k, "TRAE K2");
    lv_obj_align(k, LV_ALIGN_TOP_MID, 0, 10);

    s_mode = mk_label(s_scr, &lv_font_montserrat_20, COLOR_BLUE);
    lv_label_set_text(s_mode, ble_hid_mode_title());
    lv_obj_align(s_mode, LV_ALIGN_TOP_MID, 0, 32);

    lv_obj_t *card = lv_obj_create(s_scr);
    lv_obj_remove_flag(card, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_size(card, 216, 52);
    lv_obj_align(card, LV_ALIGN_TOP_MID, 0, 68);
    lv_obj_set_style_radius(card, 16, 0);
    lv_obj_set_style_bg_color(card, lv_color_hex(COLOR_CARD), 0);
    lv_obj_set_style_border_width(card, 0, 0);
    s_status = mk_label(card, &lv_font_montserrat_14, COLOR_BLUE);
    lv_label_set_text(s_status, "Pair: TRAE K2");
    lv_obj_center(s_status);

    s_soc = mk_label(s_scr, &lv_font_montserrat_20, COLOR_GREEN);
    lv_label_set_text(s_soc, "-- %");
    lv_obj_align(s_soc, LV_ALIGN_TOP_MID, 0, 132);

    lv_obj_t *shell = lv_obj_create(s_scr);
    lv_obj_remove_flag(shell, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_size(shell, 128, 16);
    lv_obj_align(shell, LV_ALIGN_TOP_MID, 0, 164);
    lv_obj_set_style_radius(shell, 8, 0);
    lv_obj_set_style_bg_color(shell, lv_color_hex(0x2C2C2E), 0);
    lv_obj_set_style_border_width(shell, 0, 0);
    lv_obj_set_style_pad_all(shell, 2, 0);
    s_fill = lv_obj_create(shell);
    lv_obj_remove_flag(s_fill, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_size(s_fill, 40, 12);
    lv_obj_align(s_fill, LV_ALIGN_LEFT_MID, 0, 0);
    lv_obj_set_style_radius(s_fill, 6, 0);
    lv_obj_set_style_bg_color(s_fill, lv_color_hex(COLOR_GREEN), 0);
    lv_obj_set_style_border_width(s_fill, 0, 0);

    s_mv = mk_label(s_scr, &lv_font_montserrat_14, COLOR_MUTED);
    lv_label_set_text(s_mv, "-- mV");
    lv_obj_align(s_mv, LV_ALIGN_TOP_MID, 0, 188);

    s_help = mk_label(s_scr, &lv_font_montserrat_14, COLOR_MUTED);
    lv_label_set_text(s_help, ble_hid_mode_help());
    lv_obj_set_style_text_align(s_help, LV_TEXT_ALIGN_CENTER, 0);
    lv_obj_align(s_help, LV_ALIGN_TOP_MID, 0, 216);

    lv_obj_t *dock = lv_obj_create(s_scr);
    lv_obj_remove_flag(dock, LV_OBJ_FLAG_SCROLLABLE);
    lv_obj_set_size(dock, 220, 32);
    lv_obj_align(dock, LV_ALIGN_BOTTOM_MID, 0, -8);
    lv_obj_set_style_radius(dock, 16, 0);
    lv_obj_set_style_bg_color(dock, lv_color_hex(COLOR_CARD), 0);
    lv_obj_set_style_border_width(dock, 0, 0);
    s_hint = mk_label(dock, &lv_font_montserrat_14, COLOR_WHITE);
    lv_label_set_text(s_hint, "OK  switch mode");
    lv_obj_center(s_hint);

    apply_mode_ui();
    s_bat_tick = 99;
    s_tm = lv_timer_create(tick, 400, NULL);
    lv_screen_load(s_scr);
    ESP_LOGI(TAG, "BLE key UI + battery, mode=%s", ble_hid_mode_title());
}

void demo_talk_exit(void)
{
    if (s_tm) { lv_timer_delete(s_tm); s_tm = NULL; }
    if (s_scr) {
        lv_obj_delete(s_scr);
        s_scr = s_status = s_hint = s_soc = s_mv = s_fill = NULL;
        s_mode = s_help = NULL;
    }
}

void demo_talk_key(bsp_btn_t btn, bsp_btn_ev_t ev)
{
    /* Short OK: shift gear immediately. Long OK is intercepted in main.c. */
    if (btn == BSP_BTN_OK && ev == BSP_BTN_CLICK) {
        ble_hid_mode_cycle();
        apply_mode_ui();
        if (s_hint) {
            lv_label_set_text(s_hint, "Mode switched");
            lv_obj_set_style_text_color(s_hint, lv_color_hex(COLOR_ORANGE), 0);
        }
        return;
    }
    if (ev != BSP_BTN_PRESS) return;
    if (!s_hint) return;
    if (btn == BSP_BTN_UP) {
        lv_label_set_text(s_hint,
            ble_hid_mode() == HID_MODE_PPT ? "UP  Prev page" : "UP  RightCtrl");
        lv_obj_set_style_text_color(s_hint, lv_color_hex(COLOR_WHITE), 0);
    } else if (btn == BSP_BTN_DOWN) {
        lv_label_set_text(s_hint,
            ble_hid_mode() == HID_MODE_PPT ? "DOWN  Next page" : "DOWN  Enter");
        lv_obj_set_style_text_color(s_hint, lv_color_hex(COLOR_WHITE), 0);
    }
}
