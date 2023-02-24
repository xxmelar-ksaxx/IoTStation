
// HW data dictionaries
JSONVar HW_data_dic;
JSONVar main_menu_dic;
JSONVar sub_menu_dic;
JSONVar main_informative_states_dic;
JSONVar main_controller_states_dic;
JSONVar sub_informative_states_dic;
JSONVar sub_controller_states_dic;

// Updates
bool is_controller_device=true;
int server_update_interval=3000; //ms
String device_last_update_date="";

// Door status
JSONVar door_states_dic;
int door_state_is_closed_pin_number = 5; // Degital Signal Pin 5 (1 in HW label)
int door_state_is_locked_pin_number = 4; // Degital Signal Pin 4 (2 in HW label)
bool is_closed=true;
bool is_locked=true;

// Light state
int light_1_state_on_off_pin_number = 0; // Degital Signal Pin 0 (3 in HW label)
bool is_on_light_1=true;


int isServerUpdated = false;
// int SignalPin7 = 5; // Degital Signal Pin 7 (pin 7 is acctully number 13)
String SignalPin7State;
bool lastPinState = true;

// Error handlers



