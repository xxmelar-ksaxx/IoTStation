import './css/Button.css'
import './css/ListItem.css'
import './css/globalStyles.css'

// https requests
import { send_device_update } from '../actions/devices';

// icons Libs
import { FaDoorClosed, FaDoorOpen } from "react-icons/fa";
import { TiLockClosedOutline, TiLockOpenOutline } from "react-icons/ti";
import { MdSignalWifiConnectedNoInternet0, MdSignalWifiStatusbar3Bar } from "react-icons/md";
import { BsLightbulb, BsLightbulbOff } from "react-icons/bs";

// https://mui.com/material-ui/react-switch/
import Switch from '@mui/material/Switch';

import React, {useState} from "react";
import { useEffect } from "react";
import { connect } from 'react-redux';


const ListItem = ({theItem, send_device_update}) => {
    const [uiUpdateTimer, setUiUpdateTimer]= useState(Date.now());
    const [isConnected, setIsConnected] = useState(false);

    const [bfirst_component_call, bsetfirst_component_call] =  useState(false);
    const [UI_updates_json, setUI_updates_json] =  useState({});

    // -------------------------------------------
    // Start-of -> Informative states Stuff

    const ui_icon=(key, val)=>{
        switch(key+"-"+val){
            case "door-true":
                return (<div className="green-shadow"><FaDoorClosed color={'#000'} size={'31px'} title="Closed" /></div>)
            case "door-false":
                return (<div className="red-shadow"><FaDoorOpen color={'#000'} size={'31px'} title="Open" /></div>)
            case "door_look-true":
                return (<div><TiLockClosedOutline className="green-shadow" color={'#000'} size={'31px'} title='Locked' /></div>)
            case "door_look-false":
                return (<div><TiLockOpenOutline className="red-shadow" color={'#000'} size={'31px'} title='Un-Locked' /></div>)
            case "connection-true":
                return (<div className="green-shadow"><MdSignalWifiStatusbar3Bar color={'#000'} size={'25px'}/></div>)
            case "connection-false":
                return (<div className="red-shadow"><MdSignalWifiConnectedNoInternet0 color={'#000'} size={'25px'}/></div>)
            case "light-true":
                return (<div className="green-shadow"><BsLightbulb color={'#000'} size={'25px'}/></div>)
            case "light-false":
                return (<div  className="red-shadow"><BsLightbulbOff color={'#000'} size={'25px'}/></div>)
            default:
                return (<div>{key}:{val}</div>) 
        }
    }


    const prep_informative_state=(key, val)=>{
        return ui_icon(key, val)
    }

    // End-of -> Informative states Stuff
    //----------------------------------------------
    // Start-of -> Controller states Stuff
    
    const controller_ui_element = (key, val)=>{
        /**
         * Identify the controller type
         * note: currently we support simple switch,
         * later my add multistate controller(options),
         * and RGP light controller :).
         */
        let controller_type=is_switch_controller(key);
        switch(controller_type){
            case "switch":
                return controller_switches_ui_elements(key, val);
            default:
                return (<div>{key}:{val}</div>)
        }
    }

    const prep_UI_update_json=() =>{
        /**
         *  Prepare the json that will be sent to HW
         *  (Carring UI updates)
         */
        const updates_dic = Object.create(null)
        try {
            for(let key in theItem.HW_updates.m.c){
                updates_dic[key]=theItem.HW_updates.m.c[key]
            }
            for(let key in theItem.HW_updates.s.c){
                updates_dic[key]=theItem.HW_updates.s.c[key]
            }
            setUI_updates_json(updates_dic);
        } catch (error) {
                
        }

    }

    const prep_controller_state=(key, val)=>{
        return controller_ui_element(key=key, val=val)
    }

    // End-of -> Controller states Stuff
    //----------------------------------------------
    // Start-of -> Controllers ( Switch type )
    
    const controller_switches_ui_elements = (key, val)=>{
        /**
         * Switch UI elements + icons 
         */
        switch(key){
            case "switch-light":
                return (
                    <div className='flex-hv-align f-black'>
                        {ui_icon('light' ,val)}
                        <Switch 
                        checked={val ==='true'} 
                        disabled={!isConnected} 
                        onClick={(e) => send_switch_update(e, key)}
                        />
                    </div>)
            default:
                return (<div>{key}:{val}</div>)
        }
    }

    const is_switch_controller=(str)=>{
        /**
         * break down the key text, and find out
         * if it containes 'switch' at the begining
         * of the text.
         * ex: 
         *  [switch-light] -> yes
         *  [somthingElse-light] -> no
         * 
         *  'switch' => type of (ON/OFF switch)
         */
        let buffer='';
        for(let c=0;c<str.length;c++){
            if(str[c] == '-'){
                if(buffer=='switch'){
                    return 'switch';
                }
                buffer='';
            }
            buffer+=str[c];
        }
        return false;
    }

    const send_switch_update = (event, key) => {
        /**
         * notify the server that the switch has flipped
         */
        let update_json_2=Object.create(null);
        if(UI_updates_json[key]=='true'){
            UI_updates_json[key]='false';
        }else{
            UI_updates_json[key]='true';
        }
        update_json_2["u"]=UI_updates_json;
        update_json_2["hw_id"]=theItem.hw_id;
        send_device_update(update_json_2);
    };
    
    

    // End-of ->  Controllers ( Switch type )
    //----------------------------------------------
    // Start-of -> icons prep area
    
    const prep_main_menu_items=(json)=>{
        let main_menu_items=[]
        
        for(let mKeys in json){
            if(mKeys == "i"){
                for(let iKeys in json.i){
                    main_menu_items.push(prep_informative_state(iKeys, json.i[iKeys]))
                }
            }
            else if(mKeys == "c"){
                for(let cKeys in json.c){
                    main_menu_items.push(prep_controller_state(cKeys, json.c[cKeys]))
                }
            }
        }
        
        return main_menu_items
    }
    const prep_sub_menu_items=()=>{
        
    }

    // End-of -> icons prep area
    //---------------------------------------
    // Clean code, kind of :)
    
    const is_still_connected=()=>{
       /**
        * Returns Connection UI icon
        */
        let last_update=Date.parse(theItem.updated)
        let current_time=Date.now()
        
        if(current_time-last_update<5000){
            if(!isConnected){
                setIsConnected(true);
            }
            return ui_icon("connection","true");
        }
        if(isConnected){
            setIsConnected(false);
        }
        return ui_icon("connection","false");
    }

    const first_component_call=()=>{
        /**
         * Do some work when component first mounting
         */

        prep_UI_update_json(); // json that will be sent to HW
    }

    function timeSince(last_update) {
        /**
         * takes time in ms,
         * Returns last update in sec, min, hr, day, etc...
         */
        var seconds = Math.floor((Date.now()-Date.parse(last_update)) / 1000);
      
        var interval = seconds / 31536000;
      
        if (interval > 1) {
          return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
          return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
          return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
      }

    useEffect(() => {
        
        if(!bfirst_component_call){
            first_component_call();
            bsetfirst_component_call(true);
        }

        const interval = setInterval(async () => {
            if(Date.now()-uiUpdateTimer>5000){
                // update ui evry 5 sec ( mainly for connection state update )
                setUiUpdateTimer(Date.now());
            }
          }, 1000); // ms
          return () => clearInterval(interval);
    });

    return (
        <div className="list-item-div">
           
            <div className="list-item-div-1">
                <div>
                    <div className="list-item-div-0">
                        <p id="device-lable">{theItem.label}</p>
                        <span className="f-black">
                            {/* Returns Connection icon */}
                            {is_still_connected()}
                        </span>

                    </div>

                    <div className="list-item-div-2">
                        <p>Device ID : {theItem.hw_id}</p>
                        <p>Last Update : {timeSince(theItem.last_update)}</p>
                    </div>
                </div>

                <div className="door-state-icons-div">
                    <div> {/* main menu states div */}
                    {prep_main_menu_items(theItem.HW_updates.m)}
                    </div>
                </div>
            </div>
        </div>


    )

    
}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { send_device_update })(ListItem)