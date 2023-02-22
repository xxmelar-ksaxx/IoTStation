/*
  Rui Santos
  Complete project details at Complete project details at https://RandomNerdTutorials.com/esp8266-nodemcu-http-get-post-arduino/

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files.
  The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  
  Code compatible with ESP8266 Boards Version 3.0.0 or above 
  (see in Tools > Boards > Boards Manager > ESP8266)
*/

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include "auth.h"

const char* ssid = auth_wifi_ssid; 
const char* password = auth_wifi_password;

String Device_namekey = auth_Device_namekey;
String Device_passkey = auth_Device_passkey;

// Door status
bool is_closed=true;
bool is_locked=true;


//Your Domain name with URL path or IP address with path
String serverName = "http://192.168.0.190:8000/api/hwsu";
int isServerUpdated = false;
int SignalPin7 = 5; // Degital Signal Pin 7 (pin 7 is acctully number 13)
String SignalPin7State;
bool lastPinState = true;
// the following variables are unsigned longs because the time, measured in
// milliseconds, will quickly become a bigger number than can be stored in an int.
unsigned long lastTime = 0;
// Timer set to 10 minutes (600000)
//unsigned long timerDelay = 600000;
// Set timer to 5 seconds (5000)
unsigned long timerDelay = 5000;

void setup() {
  pinMode(SignalPin7, INPUT);


  Serial.begin(115200); 

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
 
  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
}

int sendStateUpdate(){
      WiFiClient client;
      HTTPClient http;
      http.begin(client, serverName.c_str());
      http.addHeader("Content-Type", "application/json");
      http.addHeader("Cookie", "csrftoken="+auth_CSRF_Token);
//      http.addHeader("body","{ \"namekey\":\"RR4598\",\"passkey\":\"K23339\",\"is_closed\":\"true\",\"is_locked\":\"false\"}");
      String is_LCK_str="false";
      if(is_locked == true){is_LCK_str="true";}
      String body="{ \"namekey\":\""+Device_namekey+"\",\"passkey\":\""+Device_passkey+"\",\"is_closed\":\""+String(is_closed)+"\",\"is_locked\":\""+is_LCK_str+"\"}";
      
//      String serverPath = serverName + "?arg1="+String(lastPinState);
//      String serverPath = serverName;
      
      // Your Domain name with URL path or IP address with path
//      http.begin(client, serverPath.c_str());
      
      // Send HTTP GET request
//      int httpResponseCode = http.PUT();
        
        int httpCode = http.sendRequest("PUT", body);
        String payload = http.getString();

        
      // Free resources
      http.end();
  return 1;
}

void checkSignalState(){
  SignalPin7State=String(digitalRead(SignalPin7));

  // Serial.println("pin state: "+String(digitalRead(SignalPin7)));
  //  Door Lock state
  if(String(digitalRead(SignalPin7)) == "1"){
    if(is_locked == false){
      is_locked = true;
      isServerUpdated=false;
    }
  }
  else{
    if(is_locked == true){
      is_locked = false;
      isServerUpdated=false;
    }
  }
}

void loop() {
  delay(1000);
  checkSignalState();
  Serial.println("last pin state: "+String(lastPinState)+" || is server updated: "+String(isServerUpdated)+" Direct read: "+String(digitalRead(SignalPin7)));
  // Send an HTTP POST request depending on timerDelay
  // if ((millis() - lastTime) > timerDelay) {
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){
      
      if(isServerUpdated==false){
        Serial.println("state updateing...");
        if (sendStateUpdate()>0) {
          Serial.println("data send to server successfully");
          isServerUpdated=true;
        }
        else {
          Serial.println("ERROR: Cannot see the server server !!");
          isServerUpdated=false;
        }
      }

      // WiFiClient client;
      // HTTPClient http;

      // String serverPath = serverName + "?arg1=hi%20me";
      
      // // Your Domain name with URL path or IP address with path
      // http.begin(client, serverPath.c_str());
      
      // // Send HTTP GET request
      // int httpResponseCode = http.GET();
      
      // if (httpResponseCode>0) {
      //   Serial.print("HTTP Response code: ");
      //   Serial.println(httpResponseCode);
      //   String payload = http.getString();
      //   Serial.println(payload);
      // }
      // else {
      //   Serial.print("Error code: ");
      //   Serial.println(httpResponseCode);
      // }
      // // Free resources
      // http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
      isServerUpdated=false;
    }
  //   lastTime = millis();
  // }
}
