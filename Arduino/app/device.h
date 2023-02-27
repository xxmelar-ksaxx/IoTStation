#include "HardwareSerial.h"
#include <Arduino_JSON.h>
#include <string>
#include "conn.h"
// #include "global_vars.h" <- imported in conn.h
#include "HW_states_checkers.h"

void init_states_dic(){
  door_states_dic["is_closed"]=true;
  door_states_dic["is_locked"]=true;
}

String bool_to_str(bool val){
  if(val){
    return "true";
  }
  return "false";
}
// Add your informative and controller states here
// Front end will handel them if configerd properly.
// prep json to send to the server
void prep_dics_to_send(){
  // -- desired informative states ex:
  main_informative_states_dic["door"]=(bool) door_states_dic["is_closed"];
  main_informative_states_dic["door_look"]=(bool) door_states_dic["is_locked"];
  // -- desired controller states ex:
  main_controller_states_dic["switch-light"]=bool_to_str(is_on_light_1);
  
  
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



  // auth info
  auth_dic["id"]=auth_Device_id;
  auth_dic["key"]=auth_Device_access_key;
  // to send dic
  update_request_dic["auth"]=auth_dic;
  update_request_dic["data"]=HW_data_dic;
}

// Door sensor
void update_door_state(){
  if(has_update_pin_state_TF(door_state_is_locked_pin_number, (bool) door_states_dic["is_locked"])){
    if((bool) door_states_dic["is_locked"]){
      door_states_dic["is_locked"] = false;
    }else{
      door_states_dic["is_locked"] = true;
    }
    isServerUpdated=false;
  }
  if(has_update_pin_state_TF(door_state_is_closed_pin_number, (bool) door_states_dic["is_closed"])){
    if((bool) door_states_dic["is_closed"]){
      door_states_dic["is_closed"] = false;
      // digitalWrite(0, HIGH); // test led
    }else{
      door_states_dic["is_closed"] = true;
      // digitalWrite(0, LOW); // test led
    }
    isServerUpdated=false;
  }
}

// Light sensor/switch
void update_light_1_state(){
  if(has_update_output_pin_state_TF(light_1_state_on_off_pin_number, is_on_light_1)){
    if(is_on_light_1){
      digitalWrite(light_1_state_on_off_pin_number, HIGH);
    }else{
      digitalWrite(light_1_state_on_off_pin_number, LOW);
    }
    isServerUpdated=false;
  }
}

void run_sensors_update_checks(){
  update_door_state();
  update_light_1_state();

}


// int update(){
    
//     JSONVar res=do_GET("/api/hwsu");
//     // Serial.println(res);
//     if (res.hasOwnProperty("bat")) {
//         String res1=String((const char*) res["bat"]);
//         if (res1!=""){
//             Serial.println("bat_val "+res1);
//         }
//     }
//     return 1;
// }

void error_delay(int delay_time){
  int elipsed_time=0; //ms
  while(elipsed_time < delay_time){
    digitalWrite(2, LOW);
    delay(100);
    digitalWrite(2, HIGH);
    delay(100);
    elipsed_time+=200;
  }

}

bool error_resolver(String error){
  // Local errors
  if (error == "Connection To Server Failed") {
        Serial.println("Error msg: Connection To Server Failed -> 10 sec delay...");
        error_delay(10000);
        return false;
    }
  if (error == "Server Response JSON Failed") {
        Serial.println("Error msg: Server Response JSON Failed -> 10 sec delay...");
        error_delay(10000);
        return false;
    }
  
  // Remote errors
  if (error == "CSRF denied") {
        Serial.println("Error msg: CSRF denied -> 10 sec delay...");
        error_delay(10000);
        return false;
    }
}



bool str_to_bool(String bool_val){
  if(bool_val=="true"){
    return true;
  }
  return false;
}

void update_controllers(JSONVar updates_json){
  if(updates_json["u"].hasOwnProperty("switch-light")){
    is_on_light_1=str_to_bool((String) updates_json["u"]["switch-light"]);
  } 
}

void write_server_updates(JSONVar updates_json){
  if (updates_json.hasOwnProperty("t")) { // t = device last update time
    device_last_update_date=(String) updates_json["t"];
  }
  if (updates_json.hasOwnProperty("u")) { // u = device controller states update
    update_controllers(updates_json);
  }
}

void check_server_has_updates(){
  JSONVar res=do_GET("/api/hwsu?id="+auth_Device_id+"&key="+auth_Device_access_key);
  if (res.hasOwnProperty("error")) {
    error_resolver((String) res["error"]);
  }
  else if (res.hasOwnProperty("t")) {
    if(device_last_update_date != (String) res["t"]){
      isServerUpdated=false;
    }
  }
}

bool send_and_get_updates(){
    prep_dics_to_send();
    JSONVar res=do_POST("/api/hwsu", update_request_dic);
    Serial.println(res);
    if (res.hasOwnProperty("error")) {
        return error_resolver((String) res["error"]);
    }
    write_server_updates(res);
    return true;
}


// void check_HW_updates(){
//     run_sensors_update_checks(); // checks pin states

//     if(is_controller_device){
//       delay(server_update_interval);
//       check_server_has_updates();
//     }
//     if(isServerUpdated==false){
//         // Serial.println("state updateing...");
//         if (send_and_get_updates()) {
//           Serial.println("Local: Server Updated Successfully");
//           // onbord led
//           digitalWrite(2, LOW);
//           delay(20);
//           digitalWrite(2, HIGH); 
          
//           isServerUpdated=true;
//         }
//         else {
//           Serial.println("Local Error: Server NOT Updated !!");
//           isServerUpdated=false;
//         }
//     }
// }

// continus update
void check_HW_updates(){
    run_sensors_update_checks(); // checks pin states
    if (send_and_get_updates()) {
      Serial.println("Local: Server Updated Successfully");
      // onbord led
      digitalWrite(2, LOW);
      delay(20);
      digitalWrite(2, HIGH); 
      
      // isServerUpdated=true;
    }
    else {
      Serial.println("Local Error: Server NOT Updated !!");
      // isServerUpdated=false;
    }
}