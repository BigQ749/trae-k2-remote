idf_component_register(
    SRCS "main.c"
         "ui_pixel.c"
         "ui_pixel_math.c"
         "demo_display.c"
         "demo_button.c"
         "demo_audio.c"
         "demo_battery.c"
         "demo_talk.c"
         "ble_hid_kbd.c"
         "esp_hid_gap.c"
    INCLUDE_DIRS "."
    REQUIRES bsp
    PRIV_REQUIRES esp_timer nvs_flash esp_hid bt esp_driver_usb_serial_jtag

)
