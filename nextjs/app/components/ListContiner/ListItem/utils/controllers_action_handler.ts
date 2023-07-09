import {updateDeviceState} from '@/app/api/device'
import device_props_interface from '../device_props_interface'

export const ui_switch_action=(
    item:any, 
    json:any,
    props:device_props_interface)=>{
    const device_id=item.target.id.split('_')[1];
    const controller_name=item.target.id.split('_').slice(2, 4 + 1).join('_');
    
    let device_controllers={...props.json.HW_updates.m?.c, ...props.json.HW_updates.s?.c}
    device_controllers[controller_name] = json;

    const update_json={
        hw_id: device_id,
        t:Date.now().toString(),
        u:device_controllers
    }
    updateDeviceState(update_json)
}