#include "HardwareSerial.h"
#include <Arduino_JSON.h>
#include <string>
#include "utils.h"
#include "global_vars.h"
#include "HW_states_checkers.h"

int door_state_is_closed_pin_number = 5; // Degital Signal Pin GPIO5 (D1 in HW label)
int door_state_is_locked_pin_number = 4; // Degital Signal Pin GPIO4 (D2 in HW label)
bool is_closed=false;
bool is_locked=false;

// bool informative_state_has_updates=false;
unsigned long lastUpdate = millis();
unsigned long informative_state_has_updates = millis(); // Get the current time in milliseconds


void pins_setup(){
  pinMode(door_state_is_closed_pin_number, INPUT);
  pinMode(door_state_is_locked_pin_number, INPUT);
}

void device_states_prep(){
  // -- desired controller states ex:
  main_informative_states_dic["door"]=bool_to_str(is_closed);
  main_informative_states_dic["lock"]=bool_to_str(is_locked);

}

void check_door_state(){
  if(has_update_pin_state_TF(door_state_is_locked_pin_number, is_locked)){
    if(is_locked){
      is_locked = false;
    }else{
      is_locked = true;
    }
    informative_state_has_updates= millis();
  }
  if(has_update_pin_state_TF(door_state_is_closed_pin_number, is_closed)){
    if(is_closed){
      is_closed = false;
      // digitalWrite(0, HIGH); // test led
    }else{
      is_closed = true;
      // digitalWrite(0, LOW); // test led
    }
    informative_state_has_updates= millis();
  }
}

void run_sensors_update_checks(){
  check_door_state();
}

void update_controllers(JSONVar updates_json){
  // if(updates_json["u"].hasOwnProperty("switch_light_1")){
  //   is_on_light_1=str_to_bool(String(updates_json["u"]["switch_light_1"]));
  // } 
}

// End of user defined stuff -------------------
// ---------------------------------------------

// prep JSON's to send to the server
// Add your informative and controller states here
// Front end will handel them if configerd properly.
void prep_dics_to_send(){
  device_states_prep(); // prep user defined states

  // -- backend related, DON'T TOUCH IT!
  info_dic["connected"]=String("true"); // refers to connection state

  // i = informative_states
  main_menu_dic["i"] = main_informative_states_dic;
  // c = controller_states
  main_menu_dic["c"] = main_controller_states_dic;
  sub_menu_dic["i"]=sub_informative_states_dic;
  sub_menu_dic["c"]=sub_controller_states_dic;

  // m = main_menu
  HW_data_dic["m"]= main_menu_dic;
  // s = sub_menu
  HW_data_dic["s"]= sub_menu_dic;
  // i = info_dic
  HW_data_dic["i"]= info_dic;

  // auth info
  auth_dic["id"]=auth_Device_id;
  auth_dic["key"]=auth_Device_access_key;
  // to send dic
  update_request_dic["auth"]=auth_dic;
  update_request_dic["data"]=HW_data_dic;
}

void write_server_updates(JSONVar updates_json){
  if (updates_json.hasOwnProperty("t")) { // t = device last update time
    device_last_update_date=(String) updates_json["t"];
  }
  if (updates_json.hasOwnProperty("u")) { // u = device controller states update
    update_controllers(updates_json);
  }
}

void handle_user_POST_updates(JSONVar res){
  write_server_updates(res);
  prep_dics_to_send();
  
  // onbord led
  // digitalWrite(2, LOW);
  // delay(20);
  // digitalWrite(2, HIGH); 
}
// continus update
void check_HW_updates(){
  run_sensors_update_checks(); // checks pin states
  if(lastUpdate != informative_state_has_updates){
    lastUpdate=informative_state_has_updates;
    prep_dics_to_send();
  }
}