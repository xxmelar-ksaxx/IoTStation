#include "auth.h"
#include <ArduinoJson.h>
#include "AsyncJson.h"

// HW data dictionaries
JSONVar update_request_dic;
JSONVar auth_dic;
JSONVar HW_data_dic;
JSONVar info_dic;
JSONVar main_menu_dic;
JSONVar sub_menu_dic;
JSONVar main_informative_states_dic;
JSONVar main_controller_states_dic;
JSONVar sub_informative_states_dic;
JSONVar sub_controller_states_dic;

String device_last_update_date="";
