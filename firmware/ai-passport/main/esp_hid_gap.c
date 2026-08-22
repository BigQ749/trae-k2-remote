/*
 * NimBLE-only HID GAP (trimmed from ESP-IDF esp_hid_device example).
 */
#include "esp_hid_gap.h"
#include <string.h>
#include <inttypes.h>
#include "esp_log.h"
#include "esp_bt.h"
#include "esp_mac.h"
#include "host/ble_hs.h"
#include "nimble/nimble_port.h"
#include "host/ble_gap.h"
#include "host/ble_hs_adv.h"
#include "nimble/ble.h"
#include "host/ble_sm.h"
#include "host/ble_store.h"
#include "esp_hid_common.h"

static const char *TAG = "HID_GAP";
#define GATT_SVR_SVC_HID_UUID 0x1812

extern void ble_hid_task_start_up(void);

static struct ble_hs_adv_fields s_fields;

esp_err_t esp_hid_ble_gap_adv_init(uint16_t appearance, const char *device_name)
{
    (void)appearance;
    memset(&s_fields, 0, sizeof s_fields);
    s_fields.flags = BLE_HS_ADV_F_DISC_GEN | BLE_HS_ADV_F_BREDR_UNSUP;
    s_fields.appearance = ESP_HID_APPEARANCE_KEYBOARD;
    s_fields.appearance_is_present = 1;
    s_fields.tx_pwr_lvl_is_present = 1;
    s_fields.tx_pwr_lvl = BLE_HS_ADV_TX_PWR_LVL_AUTO;
    s_fields.name = (uint8_t *)device_name;
    s_fields.name_len = strlen(device_name);
    s_fields.name_is_complete = 1;

    static ble_uuid16_t uuid16;
    uuid16 = (ble_uuid16_t) BLE_UUID16_INIT(GATT_SVR_SVC_HID_UUID);
    s_fields.uuids16 = &uuid16;
    s_fields.num_uuids16 = 1;
    s_fields.uuids16_is_complete = 1;

    /* NoInputNoOutput => Windows Just Works, no "type PIN on keyboard". */
    ble_hs_cfg.sm_io_cap = BLE_SM_IO_CAP_NO_IO;
    ble_hs_cfg.sm_bonding = 1;
    ble_hs_cfg.sm_mitm = 0;
    ble_hs_cfg.sm_sc = 0;
    ble_hs_cfg.sm_our_key_dist = BLE_SM_PAIR_KEY_DIST_ID | BLE_SM_PAIR_KEY_DIST_ENC;
    ble_hs_cfg.sm_their_key_dist = BLE_SM_PAIR_KEY_DIST_ID | BLE_SM_PAIR_KEY_DIST_ENC;
    return ESP_OK;
}

static int nimble_hid_gap_event(struct ble_gap_event *event, void *arg)
{
    (void)arg;
    struct ble_gap_conn_desc desc;
    int rc;

    switch (event->type) {
    case BLE_GAP_EVENT_CONNECT:
        ESP_LOGI(TAG, "connect %s status=%d",
                 event->connect.status == 0 ? "ok" : "fail", event->connect.status);
        if (event->connect.status != 0) {
            esp_hid_ble_gap_adv_start();
            return 0;
        }
        rc = ble_gap_conn_find(event->connect.conn_handle, &desc);
        if (rc == 0 && desc.sec_state.bonded && !desc.sec_state.encrypted) {
            ble_gap_security_initiate(event->connect.conn_handle);
        }
        return 0;
    case BLE_GAP_EVENT_DISCONNECT:
        ESP_LOGI(TAG, "disconnect reason=%d", event->disconnect.reason);
        esp_hid_ble_gap_adv_start();
        return 0;
    case BLE_GAP_EVENT_ADV_COMPLETE:
        ESP_LOGI(TAG, "adv complete reason=%d", event->adv_complete.reason);
        esp_hid_ble_gap_adv_start();
        return 0;
    case BLE_GAP_EVENT_ENC_CHANGE:
        ESP_LOGI(TAG, "enc change status=%d", event->enc_change.status);
        if (event->enc_change.status == 0) ble_hid_task_start_up();
        return 0;
    case BLE_GAP_EVENT_REPEAT_PAIRING:
        rc = ble_gap_conn_find(event->repeat_pairing.conn_handle, &desc);
        if (rc == 0) {
            ble_store_util_delete_peer(&desc.peer_id_addr);
        }
        return BLE_GAP_REPEAT_PAIRING_RETRY;
    case BLE_GAP_EVENT_PASSKEY_ACTION:
        if (event->passkey.params.action == BLE_SM_IOACT_NUMCMP) {
            struct ble_sm_io pkey = {0};
            pkey.action = event->passkey.params.action;
            pkey.numcmp_accept = 1;
            ble_sm_inject_io(event->passkey.conn_handle, &pkey);
        }
        return 0;
    default:
        return 0;
    }
}

esp_err_t esp_hid_ble_gap_adv_start(void)
{
    struct ble_gap_adv_params adv = {0};
    int rc = ble_gap_adv_set_fields(&s_fields);
    if (rc != 0) {
        ESP_LOGE(TAG, "adv set fields %d", rc);
        return ESP_FAIL;
    }
    adv.conn_mode = BLE_GAP_CONN_MODE_UND;
    adv.disc_mode = BLE_GAP_DISC_MODE_GEN;
    adv.itvl_min = BLE_GAP_ADV_ITVL_MS(30);
    adv.itvl_max = BLE_GAP_ADV_ITVL_MS(50);
    rc = ble_gap_adv_start(BLE_OWN_ADDR_PUBLIC, NULL, BLE_HS_FOREVER,
                           &adv, nimble_hid_gap_event, NULL);
    if (rc != 0) {
        ESP_LOGE(TAG, "adv start %d", rc);
        return ESP_FAIL;
    }
    return ESP_OK;
}

static esp_err_t init_low_level(uint8_t mode)
{
    /* New BT MAC so Windows drops the poisoned "TRAE Key" pairing cache. */
    uint8_t base[6];
    if (esp_efuse_mac_get_default(base) == ESP_OK) {
        base[5] ^= 0x02;
        esp_base_mac_addr_set(base);
        ESP_LOGI(TAG, "BT MAC tweak %02X:%02X:%02X:%02X:%02X:%02X",
                 base[0], base[1], base[2], base[3], base[4], base[5]);
    }
    esp_bt_controller_config_t bt_cfg = BT_CONTROLLER_INIT_CONFIG_DEFAULT();
    esp_err_t ret = esp_bt_controller_mem_release(ESP_BT_MODE_CLASSIC_BT);
    if (ret) {
        ESP_LOGW(TAG, "mem_release classic %d", ret);
    }
    ret = esp_bt_controller_init(&bt_cfg);
    if (ret) return ret;
    ret = esp_bt_controller_enable(mode);
    if (ret) return ret;
    ret = esp_nimble_init();
    return ret;
}

esp_err_t esp_hid_gap_init(uint8_t mode)
{
    if (!mode) return ESP_FAIL;
    return init_low_level(mode);
}
