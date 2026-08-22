// BLE HID keyboard. Modes: Dictate (RCtrl/Enter) and PPT (PageUp/PageDown).
#include "ble_hid_kbd.h"
#include "esp_hid_gap.h"
#include <string.h>

#include "esp_log.h"
#include "esp_hidd.h"
#include "esp_hid_common.h"
#include "esp_bt.h"
#include "nvs_flash.h"
#include "host/ble_hs.h"
#include "nimble/nimble_port.h"
#include "nimble/nimble_port_freertos.h"
#include "host/ble_store.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"

static const char *TAG = "ble_hid";

#define HID_MOD_RCTRL  0x10
#define HID_KEY_RCTRL  0xE4
#define HID_KEY_ENTER  0x28
#define HID_KEY_PGUP   0x4B
#define HID_KEY_PGDN   0x4E

enum { CMD_RCTRL = 1, CMD_ENTER = 2, CMD_PGUP = 3, CMD_PGDN = 4 };

static volatile uint8_t s_mode = HID_MODE_DICTATE;

static esp_hidd_dev_t *s_dev;
static volatile bool s_conn;
static volatile int s_last_rc = -1;
static QueueHandle_t s_q;

/* Standard 8-byte keyboard, Report ID 1, 6-key rollover (ESP32-BLE-Keyboard). */
const unsigned char s_kbd_map[] = {
    0x05, 0x01, 0x09, 0x06, 0xA1, 0x01,
    0x85, 0x01,
    0x05, 0x07, 0x19, 0xE0, 0x29, 0xE7,
    0x15, 0x00, 0x25, 0x01,
    0x75, 0x01, 0x95, 0x08, 0x81, 0x02,
    0x95, 0x01, 0x75, 0x08, 0x81, 0x01,
    0x95, 0x06, 0x75, 0x08,
    0x15, 0x00, 0x25, 0x65,
    0x05, 0x07, 0x19, 0x00, 0x29, 0x65, 0x81, 0x00,
    0xC0,
};

static esp_hid_raw_report_map_t s_maps[] = {
    { .data = s_kbd_map, .len = sizeof(s_kbd_map) },
};

static esp_hid_device_config_t s_cfg = {
    .vendor_id         = 0x16C0,
    .product_id        = 0x05DF,
    .version           = 0x0100,
    .device_name       = "TRAE K2",
    .manufacturer_name = "FoloToy",
    .serial_number     = "trae-key-1",
    .report_maps       = s_maps,
    .report_maps_len   = 1,
};

static esp_err_t send_keys(uint8_t modifier, uint8_t key)
{
    if (!s_dev) return ESP_ERR_INVALID_STATE;
    uint8_t buf[8] = { modifier, 0, key, 0, 0, 0, 0, 0 };
    esp_err_t e = esp_hidd_dev_input_set(s_dev, 0, 1, buf, sizeof buf);
    vTaskDelay(pdMS_TO_TICKS(80));
    memset(buf, 0, sizeof buf);
    esp_err_t e2 = esp_hidd_dev_input_set(s_dev, 0, 1, buf, sizeof buf);
    if (e != ESP_OK) return e;
    return e2;
}

static void hid_task(void *arg)
{
    (void)arg;
    uint8_t cmd;
    for (;;) {
        if (xQueueReceive(s_q, &cmd, portMAX_DELAY) != pdTRUE) continue;
        esp_err_t e = ESP_FAIL;
        switch (cmd) {
        case CMD_RCTRL:
            /* Keycode 0xE4 is Right Ctrl; modifier bit alone is often ignored. */
            e = send_keys(HID_MOD_RCTRL, HID_KEY_RCTRL);
            break;
        case CMD_ENTER:
            e = send_keys(0, HID_KEY_ENTER);
            break;
        case CMD_PGUP:
            e = send_keys(0, HID_KEY_PGUP);
            break;
        case CMD_PGDN:
            e = send_keys(0, HID_KEY_PGDN);
            break;
        default:
            break;
        }
        s_last_rc = (int)e;
        ESP_LOGI(TAG, "hid cmd=%u rc=%s conn=%d", cmd, esp_err_to_name(e),
                 (int)(s_dev && esp_hidd_dev_connected(s_dev)));
    }
}

void ble_hid_task_start_up(void)
{
    s_conn = true;
    ESP_LOGI(TAG, "HID ready");
}

void ble_hid_task_shut_down(void)
{
    /* Do not clear s_conn: Windows often sends HID suspend after pair. */
}

static void on_hidd(void *handler_args, esp_event_base_t base, int32_t id, void *event_data)
{
    (void)handler_args;
    (void)base;
    (void)event_data;
    switch ((esp_hidd_event_t)id) {
    case ESP_HIDD_START_EVENT:
        ESP_LOGI(TAG, "START, advertising");
        esp_hid_ble_gap_adv_start();
        break;
    case ESP_HIDD_CONNECT_EVENT:
        ESP_LOGI(TAG, "CONNECT");
        s_conn = true;
        break;
    case ESP_HIDD_DISCONNECT_EVENT:
        ESP_LOGI(TAG, "DISCONNECT");
        s_conn = false;
        esp_hid_ble_gap_adv_start();
        break;
    default:
        break;
    }
}

static void nimble_host_task(void *param)
{
    (void)param;
    nimble_port_run();
    nimble_port_freertos_deinit();
}

void ble_store_config_init(void);

esp_err_t ble_hid_kbd_start(void)
{
    if (s_q) return ESP_OK;
    s_q = xQueueCreate(8, sizeof(uint8_t));
    xTaskCreate(hid_task, "hid_q", 4096, NULL, 5, NULL);

    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        nvs_flash_erase();
        ret = nvs_flash_init();
    }
    if (ret != ESP_OK) return ret;

    ret = esp_hid_gap_init(HID_DEV_MODE);
    if (ret != ESP_OK) return ret;

    ret = esp_hid_ble_gap_adv_init(ESP_HID_APPEARANCE_KEYBOARD, s_cfg.device_name);
    if (ret != ESP_OK) return ret;

    ret = esp_hidd_dev_init(&s_cfg, ESP_HID_TRANSPORT_BLE, on_hidd, &s_dev);
    if (ret != ESP_OK) return ret;

    ble_hs_cfg.sm_io_cap = BLE_SM_IO_CAP_NO_IO;
    ble_hs_cfg.sm_bonding = 1;
    ble_hs_cfg.sm_mitm = 0;
    ble_hs_cfg.sm_sc = 0;

    ble_store_config_init();
    ble_hs_cfg.store_status_cb = ble_store_util_status_rr;
    ret = esp_nimble_enable(nimble_host_task);
    if (ret) ESP_LOGE(TAG, "esp_nimble_enable %d", ret);
    return ret;
}

bool ble_hid_kbd_connected(void)
{
    if (s_dev && esp_hidd_dev_connected(s_dev)) return true;
    return s_conn;
}

int ble_hid_last_rc(void)
{
    return s_last_rc;
}

void ble_hid_mode_cycle(void)
{
    s_mode = (uint8_t)((s_mode + 1) % HID_MODE_COUNT);
    s_last_rc = -1; /* keep dock hint on "Mode switched" until next key */
    ESP_LOGI(TAG, "mode=%s", ble_hid_mode_title());
}

hid_mode_t ble_hid_mode(void)
{
    return (hid_mode_t)s_mode;
}

const char *ble_hid_mode_title(void)
{
    switch (s_mode) {
    case HID_MODE_PPT: return "PPT";
    default:           return "Shandian";
    }
}

const char *ble_hid_mode_help(void)
{
    switch (s_mode) {
    case HID_MODE_PPT: return "UP  Prev page\nDOWN  Next page";
    default:           return "UP  Dictate\nDOWN  Enter";
    }
}

uint32_t ble_hid_mode_color(void)
{
    switch (s_mode) {
    case HID_MODE_PPT: return 0xFF9F0A; /* orange */
    default:           return 0x0A84FF; /* blue */
    }
}

static void enqueue(uint8_t c)
{
    if (s_q) xQueueSend(s_q, &c, 0);
}

void ble_hid_tap_up(void)
{
    enqueue(s_mode == HID_MODE_PPT ? CMD_PGUP : CMD_RCTRL);
}

void ble_hid_tap_down(void)
{
    enqueue(s_mode == HID_MODE_PPT ? CMD_PGDN : CMD_ENTER);
}

void ble_hid_tap_rctrl(void)
{
    enqueue(CMD_RCTRL);
}

void ble_hid_tap_enter(void)
{
    enqueue(CMD_ENTER);
}
