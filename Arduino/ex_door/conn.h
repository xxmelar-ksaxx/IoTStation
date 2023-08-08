#include <WiFiClient.h>
#include <Arduino_JSON.h>
#include <string>
#include "global_vars.h"
#include "auth.h"

String Server_HOST = "192.168.0.190";
int Server_PORT = 8000;

WiFiClient client;


bool is_connected(){
  int max_trys=100; // 10 sec -> 100 ms each
  while(max_trys>0 && !client.connected()){
    max_trys--;
    Serial.println("try to connect..."+String(max_trys));
    client.connect(Server_HOST, Server_PORT);
    delay(100);
  }
  if(!client.connected()){
    return false;
  }
  return true;
}

JSONVar do_GET(String url)
{
    JSONVar myObject;
    if (WiFi.status() == WL_CONNECTED)
    {
        // while (!client.connect(Server_HOST, Server_PORT) || is_connected() );
        
        if(!client.connect(Server_HOST, Server_PORT) && !is_connected()){
          myObject["error"]="Connection To Server Failed";
          return myObject; // failed
        }

        // if (!client.connect(Server_HOST, Server_PORT)) {
        //   myObject["err"]="connection failed";
        //   return myObject; // failed
        // }

        client.println("GET "+url+" HTTP/1.1");
        client.println("Accept: application/json");
        client.println("Host: " + Server_HOST);
        client.println("Cookie: csrftoken=" + auth_CSRF_Token);
//        client.println("Connection: keep-alive");
        client.println();

          bool res_flag=false;
          bool check_flag=false;
          int packet_elipsed_time = 0; //ms
          String res = "";
          while (client.connected()) {
              if (client.available()) {
                char c = client.read();
                if(check_flag && c == '\r'){
                  check_flag=false;
                  res_flag=true;
                }
                else{
                  check_flag=false;
                }
                if (c == '\n') {
                  check_flag=true;
                }
                if (res_flag){
                  packet_elipsed_time=0;
//                  Serial.print(c);
                  res+=c;
                  
                }
              }
              packet_elipsed_time++;
              delay(1); // packet timer delay.
              if(packet_elipsed_time > 1000){
                // then close the connection from this end.
                client.stop();
              }
            }
        myObject = JSON.parse(res);
        if (JSON.typeof(myObject) == "undefined") {
          myObject["error"]="Server Response JSON Failed";
        }
        return myObject;
    }
}

JSONVar do_POST(String url,JSONVar myJSON)
{
    JSONVar myObject;
    if (WiFi.status() == WL_CONNECTED)
    {
        if(!client.connect(Server_HOST, Server_PORT) && !is_connected()){
          myObject["error"]="connection failed";
          return myObject; // failed
        }

        client.println("POST "+url+" HTTP/1.1");
        client.println("Accept: application/json");
        client.println("Host: " + Server_HOST);
        client.println("Cookie: csrftoken=" + auth_CSRF_Token);
        client.println("Connection: Keep-Alive");
        client.println("Content-Type: application/json");
        client.println("Content-Length: "+String(JSON.stringify(myJSON).length()));
        client.println();
        client.println(JSON.stringify(myJSON));
        client.println();
        
        bool res_flag=false;
        bool check_flag=false;
        int packet_elipsed_time = 0; //ms
        String res = "";
        while (packet_elipsed_time < 1000) {
              char c = client.read();
              if(check_flag && c == '\r'){
                check_flag=false;
                res_flag=true;
              }
              else{
                check_flag=false;
              }
              if (c == '\n') {
                check_flag=true;
              }
              if (res_flag){
                res+=c;
              }
            packet_elipsed_time++;
            delay(1); // packet timer delay.
            if(res_flag && int(c)==255){ // end if body has ascii value of 255 (�)
              break;
            }
          }
          myObject = JSON.parse(res);
          if (JSON.typeof(myObject) == "undefined") {
            myObject["error"]="response json failed";
          }
        return myObject;
    }
}
