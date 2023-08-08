#include <string>
// read pin lib
// #include <wprogram.h>
#include <wiring_private.h>
#include <pins_arduino.h>

int digitalReadOutputPin(uint8_t pin){
  uint8_t bit = digitalPinToBitMask(pin);
  uint8_t port = digitalPinToPort(pin);
  if (port == NOT_A_PIN) 
    return LOW;

  return (*portOutputRegister(port) & bit) ? HIGH : LOW;
}

bool has_update_pin_state_TF(int pin_number, bool pin_old_state){
  // # check if pin state changes from old one
  // # pin_current_state != pin_old_state -> has update
  // pin_current_state == true && pin_old_state == false
  if(String(digitalRead(pin_number)) == "1" && pin_old_state == false){
    return true;
  }
  // pin_current_state == false && pin_old_state == true
  else if(String(digitalRead(pin_number)) == "0" && pin_old_state == true){
    return true;
  }
  return false; // no update
}

bool has_update_output_pin_state_TF(int pin_number, bool pin_old_state){
  // # check if pin state changes from old one
  // # pin_current_state != pin_old_state -> has update
  // pin_current_state == true && pin_old_state == false
  if(String(digitalReadOutputPin(pin_number)) == "1" && pin_old_state == false){
    return true;
  }
  // pin_current_state == false && pin_old_state == true
  else if(String(digitalReadOutputPin(pin_number)) == "0" && pin_old_state == true){
    return true;
  }
  return false; // no update
}