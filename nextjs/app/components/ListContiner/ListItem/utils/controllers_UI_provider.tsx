import device_props_interface from '../device_props_interface';
import Switch from '@/app/components/Switch/Switch';
import {ui_switch_action} from './controllers_action_handler'

export const controller_ui_provider=(
    controller_type:string, 
    controller_value:any, 
    props:device_props_interface)=>{

    if(controller_type.split('_')[0]=="switch"){
        return ui_switch(controller_type, controller_value, props);
    }

    return(
        <div
            id={`${props.json.hw_id}_${controller_type}`}
            key={`${props.json.hw_id}_${controller_type}`} >
            {`${controller_type}:${controller_value}`}
        </div>
    )
}


const ui_switch=(
    controller_type:string, 
    controller_value:any, 
    props:device_props_interface)=>{

    return (<Switch 
        id={`${props.json.hw_id}_${controller_type}`}
        key={`${props.json.hw_id}_${controller_type}`} 
        type={controller_type.split('_')[1]} 
        isChecked={controller_value=='true' ? true : false} 
        onChange={(e)=>ui_switch_action(e, (controller_value.toString()=='true'? 'false':'true'), props)} />)
    
}