#include <ESP8266WiFi.h>
#include <string>
#include "device.h"


const char* wifi_ssid = auth_wifi_ssid;
const char* wifi_password = auth_wifi_password;


void setup()
{
    pinMode(door_state_is_closed_pin_number, INPUT);
    pinMode(door_state_is_locked_pin_number, INPUT);
    pinMode(0, OUTPUT); // door test led
    pinMode(2, OUTPUT); // onbord led


    Serial.begin(115200);
    delay(100);

    WiFi.begin(wifi_ssid, wifi_password);
    delay(3000);
    
    init_states_dic();
}

void loop()
{
    check_HW_updates();
    
    delay(100);
}
