'use client'
import { useState } from 'react'
import './css.css'
import device_props_interface from './device_props_interface'
import {controller_ui_provider} from './utils/controllers_UI_provider'
import { informative_ui_provider } from './utils/informative_UI_provider'
import ConnectionIcon from '../../ConnectionIcon/ConnectionIcon'
import AcceptForm from '../../AcceptForm/AcceptForm'
import RenameDevice from './RenameDevice/RenameDevice'

const ListItem=(props:device_props_interface)=>{

    const [isActiveSubMenu, setIsActiveSubMenu]= useState(false);

    const handleClick=async()=>{
        if(isActiveSubMenu==true){setIsActiveSubMenu(false)}
        else{setIsActiveSubMenu(true)}
    }

    function timeSince(last_update?:string) {
        /**
         * takes time in ms,
         * Returns last update in sec, min, hr, day, etc...
         */
        var seconds = Math.floor((Date.now()-(last_update ? parseInt(last_update): Date.now())) / 1000);
      
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

    const mainMenuItems=(items:any)=>{
        const itemsList = Object.entries(items.m ?? {}).map(([key, value])=>{
            let resultItems:any=[];
            if(key=='i'){
                const controllersList = Object.entries(value ?? {}).map(([ikey, ivalue])=>{
                    return informative_ui_provider(ikey, ivalue, props)
                })
                resultItems.push(controllersList)
            }
            if(key=='c'){
                const controllersList = Object.entries(value ?? {}).map(([ckey, cvalue])=>{
                    return controller_ui_provider(ckey, cvalue, props)
                })
                resultItems.push(controllersList)
            }
            return resultItems
        })
        return (
            itemsList
        )
    }
    const subMenuItems=(items:any)=>{
        const itemsList = Object.entries(items.s ?? {}).map(([key, value])=>{
            let resultItems:any=[];
            if(key=='i'){
                const controllersList = Object.entries(value ?? {}).map(([ikey, ivalue])=>{
                    return informative_ui_provider(ikey, ivalue, props)
                })
                resultItems.push(controllersList)
            }
            if(key=='c'){
                const controllersList = Object.entries(value ?? {}).map(([ckey, cvalue])=>{
                    return controller_ui_provider(ckey, cvalue, props)
                })
                resultItems.push(controllersList)
            }
            return resultItems
        })
        return (
            itemsList
        )
    }


    return (
        <div className="li-continer">
            <div className="continer-left-side" onClick={handleClick}>
                <div className="li-lable-continer" id="li-lable">
                    <div className="li-lable">{props.json.label}</div>
                    <div className="li-connection-icon">
                        <ConnectionIcon connection={(props.SSEConnection&&props.json.HW_updates.i?.connected.toString()=='true'?'true':'false')}/>
                    </div>
                </div>
                <div className="li-info-font">Devide ID: {props.json.hw_id}</div>
                <div className="li-info-font">Last Updated: {timeSince(props.json.last_update)}</div>
            </div>
            <div className="continer-right-side">
                {mainMenuItems(props.json.HW_updates)}

            </div>
            <div className={`sub-menu-container ${isActiveSubMenu ? 'visible' : ''}`}>
                <div className="sub-menu-left-side">
                    <RenameDevice id={props.json.hw_id} label={props.json.label}/>
                </div>
                <div className="sub-menu-right-side">
                    {subMenuItems(props.json.HW_updates)}
                </div>
            </div>
        </div>
    )
}

export default ListItem;