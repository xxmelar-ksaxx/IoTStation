from threading import Thread
import time
from flask import Flask, Response, render_template, jsonify, send_file, request
import requests
import json
import datetime
from time import sleep
from flask_sse import sse
app = Flask(__name__)

app.config['REDIS_URL'] = 'redis://localhost'
# app.config['REDIS_CHAN'] = 'sse'
app.register_blueprint(sse, url_prefix='/stream')


# Light state
is_on_light_1=str(False)

# Auth
auth_Device_id="A2"
auth_Device_access_key="UEY734"

# // timestamp tracker
device_last_update_date=""

# // HW data dictionaries
update_request_dic={}
auth_dic={}
HW_data_dic={}
info_dic={}
main_menu_dic={}
sub_menu_dic={}
main_informative_states_dic={}
main_controller_states_dic={}
sub_informative_states_dic={}
sub_controller_states_dic={}

# // Add your informative and controller states here
# // Front end will handel them if configerd properly.
# // prep json to send to the server
def prep_dics_to_send():
#   // -- desired informative states ex:
#   main_informative_states_dic["door"]=(bool) door_states_dic["is_closed"];
#   main_informative_states_dic["door_look"]=(bool) door_states_dic["is_locked"];

#   // -- desired controller states ex:
  main_controller_states_dic["switch_light_1"]=is_on_light_1

#  // -- backend related, DON'T TOUCH IT!
  info_dic["connected"]="true" # // refers to connection state
  
#   // i = informative_states
  main_menu_dic["i"] = main_informative_states_dic
#   // c = controller_states
  main_menu_dic["c"] = main_controller_states_dic
  
  sub_menu_dic["i"]=sub_informative_states_dic
  sub_menu_dic["c"]=sub_controller_states_dic

#   // m = main_menu
  HW_data_dic["m"]= main_menu_dic
#   // s = sub_menu
  HW_data_dic["s"]= sub_menu_dic
#  // i = info_dic
  HW_data_dic["i"]= info_dic



#   // auth info
  auth_dic["id"]=auth_Device_id
  auth_dic["key"]=auth_Device_access_key
#   // to send dic
  update_request_dic["auth"]=auth_dic
  update_request_dic["data"]=HW_data_dic



def update_controllers(updates_json):
    # // is_on_light_1 state update
    if(updates_json.get("u").get("switch_light_1")):
        global is_on_light_1
        is_on_light_1=updates_json.get("u").get("switch_light_1")
        print(f"state updated: is_on_light_1: {is_on_light_1}")

# distripute informative & controller state updates
def updates_distriputer(updates_json):
    if(updates_json.get("t")):
        global device_last_update_date
        device_last_update_date=updates_json["t"]
    if(updates_json.get("u")):
        update_controllers(updates_json)

# POST to update hardware states
@app.route("/update", methods=["POST"])
def UI_updates():
    updates_json=json.loads((request.data).decode("utf-8"))
    updates_distriputer(updates_json)
    prep_dics_to_send()
    return {"state":"ok"}



# SSE to send hardware updates
@app.route('/sse-updates')
def stream():
    print("SSE:stream requested!!")
    def generate():
        prep_dics_to_send()
        old_state="none"
        old_keep_alive_time= round(time.time() * 1000)
        while True:
            print("SSE: yields..")
            yield f'event: updates\ndata: {json.dumps(update_request_dic)}\n\n'
            while old_state==str(update_request_dic):
              if(round(time.time() * 1000)-old_keep_alive_time>10000):
                yield f'event: keepalive\ndata: alive\n\n'
                old_keep_alive_time=round(time.time() * 1000)
                  
            old_state=str(update_request_dic.copy())
    return Response(generate(), mimetype='text/event-stream')


import socket   
@app.route("/ping", methods=["POST","GET"])
def pingRoute():
    print("ping")
    msg={"info":{
        "org":"iotstation",
        "id":auth_Device_id,
        "type":"light",
    }}
    return msg

@app.route("/")
def defaultRoute():
    print("default route")
    return render_template('index.html')


if __name__=="__main__":
    # app.run(debug=True)
    app.run(debug=True, host='0.0.0.0', port=5000)