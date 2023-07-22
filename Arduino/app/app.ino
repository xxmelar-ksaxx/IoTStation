#include <ESP8266WiFi.h>
#include <string>
#include "device.h"
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>

const char* wifi_ssid = auth_wifi_ssid;
const char* wifi_password = auth_wifi_password;

// Create AsyncWebServer object on port 80
AsyncWebServer server(5000);

// Create an Event Source on /events
AsyncEventSource events("/sse-updates");

void wifi_setup(){
  // Connect to the WiFi network
  WiFi.begin(wifi_ssid, wifi_password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP().toString());
}

void webServer_setup(){
  char ping_json_str[256];
  sprintf(ping_json_str, "{\"info\":{\"org\":\"iotstation\",\"id\":\"%s\",\"type\":\"light\"}}", auth_Device_id);

  // PING
  server.on("/ping", HTTP_GET, [ping_json_str](AsyncWebServerRequest *request){
    Serial.print("/ping -> ");
    Serial.println(millis());
    AsyncWebServerResponse *response = request->beginResponse(Serial, "text/plain", 12);
    request->send(200, "application/json", ping_json_str);
  });

  // Recive user POST updates
  AsyncCallbackJsonWebHandler* handler = new AsyncCallbackJsonWebHandler("/update", [](AsyncWebServerRequest *request, JsonVariant &json) {
    Serial.println("/update");
    // Convert the JsonVariant object to a String
    String json_str;
    Serial.println("Update: serializeJson...");
    serializeJson(json, json_str);
    Serial.println("Update: handle_user_POST_updates...");
    handle_user_POST_updates(JSON.parse(json_str));
    Serial.println("Update: request->send(200...");
    request->send(200, "application/json","{\"state\": \"update -> ok\"}");
  });
  
  // SSE
  events.onConnect([](AsyncEventSourceClient *client){
    Serial.println("/onConnect");
    if(client->lastId()){
      Serial.printf("Client reconnected! Last message ID that it got is: %u\n", client->lastId());
    }
    brodcast_updates(update_request_dic);
  });
  
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*"); 
  server.addHandler(handler);
  server.addHandler(&events);
  server.begin();
}

unsigned long old_time_ms = millis();
char keep_alive_json_char[256] = "{\"data\":\"alive\"}";
void brodcast_keep_alive(){
  if ((millis()-old_time_ms)>5000){
    old_time_ms = millis();
    events.send(keep_alive_json_char, "keepalive", millis());
  }
}

void brodcast_updates(JSONVar json){
  String json_str = JSON.stringify(json);
  StaticJsonDocument<512> json_doc;
  DeserializationError error = deserializeJson(json_doc, json_str);
  if (error) {
    Serial.print("deserializeJson() failed: ");
  } else {
    char json_char[512];
    serializeJson(json_doc, json_char);
    Serial.println("sending SSE update ...");
    events.send(json_char, "updates", millis());
  }
  json_str.clear();
  json_doc.clear();
}

JSONVar OLD_update_request_dic="";
void monitor_change(){
  if ((OLD_update_request_dic == update_request_dic)==false) {
    OLD_update_request_dic = update_request_dic;
    brodcast_updates(update_request_dic);
  }
  brodcast_keep_alive();
}

void setup()
{
    pins_setup();
    Serial.begin(115200);
    delay(100);

    prep_dics_to_send();
    wifi_setup();
    webServer_setup();
}

void loop()
{
    check_HW_updates();
    delay(50);
    monitor_change();
    delay(50);
}
