# IoT Device

### ESP8266 wifi
i'm using the NodeMCU-ESP8266.

## Setup

In the Arduino example (`ex_door` or `ex_light`), at the root dir, create a file named `auth.h` as the following:
```
const char* auth_wifi_ssid="Your_WIFI_SSID";
const char* auth_wifi_password="Your_WIFI_Password";

String auth_Device_id="A1"; // id of your choice
String auth_Device_access_key="ASD123"; //access_key of your choice
```