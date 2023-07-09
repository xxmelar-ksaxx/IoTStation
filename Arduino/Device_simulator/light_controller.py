from threading import Thread
from flask import Flask, Response, render_template, send_file, request
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
auth_Device_id="AAS34S"
auth_Device_access_key="UEY734"

# // timestamp tracker
device_last_update_date=""

# // HW data dictionaries
update_request_dic={}
auth_dic={}
HW_data_dic={}
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



#   // auth info
  auth_dic["id"]=auth_Device_id
  auth_dic["key"]=auth_Device_access_key
#   // to send dic
  update_request_dic["auth"]=auth_dic
  update_request_dic["data"]=HW_data_dic





data={"light_state":str(False)}

def light_controller():
    while True:
        state=input("1-On  2-Off: ")
        if(state=='1'):
            data['light_state']=str(True)
        elif(state=='2'):
            data['light_state']=str(False)
        sleep(1)

def state_monitoring():
    old_state=data
    while True:
        while old_state==data:pass
        print("state changed")

@app.route("/set", methods=["GET", "POST"])
def setState():
    req_data=json.loads((request.data).decode('utf-8'))
    # print(req_data["light_state"])
    global is_on_light_1
    is_on_light_1=req_data["light_state"]
    prep_dics_to_send()
    return update_request_dic


def update_controllers(updates_json):
    # // is_on_light_1 state update
    if(updates_json.get("u").get("is_on_light_1")):
        global is_on_light_1
        is_on_light_1=updates_json.get("u").get("is_on_light_1")
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
    print("stream requested!!")
    def generate():
        prep_dics_to_send()
        old_state=str(update_request_dic.copy())
        while True:
            yield f'event: myevent\ndata: {update_request_dic}\n\n'
            while old_state==str(update_request_dic):pass
            old_state=str(update_request_dic.copy())
            # sleep(1)
    return Response(generate(), mimetype='text/event-stream')


@app.route("/")
def defaultRoute():
    print("default route")
    return render_template('index.html')


if __name__=="__main__":
    app.run(debug=True)
    app.run(host='0.0.0.0', port=5000)