'use client'
import { useState } from 'react'
import './css.css'

import Switch from '@/app/components/Switch/Switch'

interface ListItemProps{
    // id:string, //list index
    json:{
        hw_id:string,
        label:string,
        HW_updates:{
            m?: {
                i?:any,
                c?:any
          },
            s?: {
                i?: any,
                c?: any
          }
        },
        last_update?:string
      }
}

const ListItem=(props:ListItemProps)=>{

    const [isActiveSubMenu, setIsActiveSubMenu]= useState(false);
    const [isChecked1, setIsChecked1]= useState(false);

    const handleClick=async()=>{
        if(isActiveSubMenu==true){setIsActiveSubMenu(false)}
        else{setIsActiveSubMenu(true)}

        console.log("Click")

    }

    const handleChange =(e:any) => {
        if(isChecked1){
            setIsChecked1(false)
        }else{
            setIsChecked1(true)
        }
    }

    function timeSince(last_update?:string) {
        /**
         * takes time in ms,
         * Returns last update in sec, min, hr, day, etc...
         */
        var seconds = Math.floor((Date.now()-(last_update ? Date.parse(last_update): Date.now())) / 1000);
      
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

    const handle_UI_update=(item:any) => {
        const device_id=item.target.id.split('_')[1]
        const controller_name=item.target.id.split('_').slice(2, 4 + 1).join('_')
        console.log(controller_name)


    }


    const mainMenuItems=(items:any)=>{
        const itemsList = Object.entries(items.m ?? {}).map(([key, value])=>{
            let resultItems:any=[];

            if(key=='c'){
                const controllersList = Object.entries(value ?? {}).map(([ckey, cvalue])=>{
                    if(ckey.split('_')[0]=="switch"){
                        return (<Switch id={`${props.json.hw_id}_${ckey}`} key={`${props.json.hw_id}_${ckey}`} type={ckey.split('_')[1]} isChecked={cvalue} onChange={handle_UI_update} />)
                    }
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
                        icon
                    </div>
                </div>
                <div className="li-info-font">Devide ID: {props.json.hw_id}</div>
                <div className="li-info-font">Last Updated: {timeSince(props.json.last_update)}</div>
            </div>
            <div className="continer-right-side">
                <Switch id={`${props.json.hw_id}`} key={1} type="light" isChecked={isChecked1} onChange={handleChange} />
                {mainMenuItems(props.json.HW_updates)}

            </div>
            <div className={`sub-menu-container ${isActiveSubMenu ? 'visible' : ''}`}>
                <div className="sub-menu-left-side">Left</div>
                <div className="sub-menu-right-side">Right</div>
            </div>
        </div>
    )
}

export default ListItem;