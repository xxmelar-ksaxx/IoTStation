import './css/Button.css'
import './css/ListItem.css'
import './css/globalStyles.css'

// icons Libs
import { FaDoorClosed, FaDoorOpen } from "react-icons/fa";
import { TiLockClosedOutline, TiLockOpenOutline } from "react-icons/ti";
import { MdSignalWifiConnectedNoInternet0, MdSignalWifiStatusbar3Bar } from "react-icons/md";

import React, {useState} from "react";
import { useEffect } from "react";


const ListItem = ({theItem}) => {

    // const [oldDic, newDic] = useState(getdic[item_key])
    
    // const [type, setType] = useState(getdic[item_key].type)
    // const [label, setLabel] = useState(getdic[item_key].label)
    // const [namekey, setNamekey] = useState(getdic[item_key].namekey)
    // const [updated, srtUpdated] = useState(getdic[item_key].created)

    // const [doorState,setdoorState] = useState((getdic[item_key].is_closed === 'true'));
    // // const [lockState,setlockState] = useState((getdic[item_key].is_locked === 'true'));
    // const [connState,setConnState] = useState(true);

    // const [itemState, setItemState] = useState({
    //     type:getdic[item_key].type,
    //     label:getdic[item_key].label,
    //     namekey:getdic[item_key].namekey,
    //     updated:getdic[item_key].updated,

    //     doorState:(getdic[item_key].is_closed === 'true'),
    //     lockState:(getdic[item_key].is_locked === 'true'),
    //     connState:true
    // });



    // useEffect(() => {

        


    //     // if(getdic[item_key].updated !== itemState.updated){
    //     //     setItemState({
    //     //         type:getdic[item_key].type,
    //     //         label:getdic[item_key].label,
    //     //         namekey:getdic[item_key].namekey,
    //     //         updated:getdic[item_key].updated,
        
    //     //         doorState:(getdic[item_key].is_closed === 'true'),
    //     //         lockState:(getdic[item_key].is_locked === 'true'),
    //     //         connState:true
    //     //     })
    //     // }
    //     // if(oldDic !== getdic[item_key]) {
    //     //     newDic(getdic[item_key]);
    //     //     setlockState((oldDic.is_locked === 'true'));
    //     //     console.log("new stuff")
    //     // }
    //     // to capture parent component state change
    //     // setdoorState((getdic[item_key].is_closed === 'true'));
    //     // setlockState((getdic[item_key].is_locked === 'true'));

    //     // setType(getdic[item_key].type)
    //     // setLabel(getdic[item_key].label)
    //     // setNamekey(getdic[item_key].namekey)
    //     // srtUpdated(getdic[item_key].updated)


    //     // console.log("List item got some updates")
    // });
    
    const door_icon = (is_closed) =>{
        if(is_closed){
            return(
                <div className="green-shadow"><FaDoorClosed color={'#000'} size={'31px'} title="Closed" /></div>
                )
            }
            else{
                return(
                <div className="red-shadow"><FaDoorOpen color={'#000'} size={'31px'} title="Open" /></div>
            )
        }
    }
    const lock_icon = (is_locked) =>{
        if(is_locked){
            return(
                <div><TiLockClosedOutline className="green-shadow" color={'#000'} size={'31px'} title='Locked' /></div>
                )
            }
            else{
                return(
                <div><TiLockOpenOutline className="red-shadow" color={'#000'} size={'31px'} title='Un-Locked' /></div>
            )
        }
    }
    const conn_icon = (is_connected) =>{
        if(is_connected){
            return(
                <div className="green-shadow"><MdSignalWifiStatusbar3Bar color={'#000'} size={'25px'}/></div>
                )
            }
            else{
                return(
                <div className="red-shadow"><MdSignalWifiConnectedNoInternet0 color={'#000'} size={'25px'}/></div>
            )
        }
    }

    return (
        <div className="list-item-div">
           
            <div className="list-item-div-1">
                <div>
                    <div className="list-item-div-0">
                        <p id="device-lable">{theItem.label}</p>
                        <span>
                        {conn_icon(true)}
                        </span>

                    </div>

                    <div className="list-item-div-2">
                        <p>Device Type : {theItem.type}</p>
                        <p>Device Name : {theItem.namekey}</p>
                        <p>Register Date : {theItem.updated}</p>
                    </div>
                </div>

                <div className="door-state-icons-div">
                    <div>
                    {door_icon((theItem.is_closed === 'true'))}
                    {lock_icon((theItem.is_locked === 'true'))}
                    </div>
                </div>

            </div>
        </div>


    )

    
}


export default ListItem