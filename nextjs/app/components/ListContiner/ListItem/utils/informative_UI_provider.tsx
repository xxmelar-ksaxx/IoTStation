import device_props_interface from '../device_props_interface';
import Door from '@/app/components/Door/Door';
import Lock from '@/app/components/Lock/Lock';

export const informative_ui_provider=(
    informative_type:string, 
    informative_value:any, 
    props:device_props_interface)=>{

    if(informative_type.split('_')[0]=="door"){
        return ui_door(informative_type, informative_value, props);
    }
    if(informative_type.split('_')[0]=="lock"){
        return ui_lock(informative_type, informative_value, props);
    }

    return(
        <div
            id={`${props.json.hw_id}_${informative_type}`}
            key={`${props.json.hw_id}_${informative_type}`} >
            {`${informative_type}:${informative_value}`}
        </div>
    )
}

const ui_door=(
    informative_type:string, 
    informative_value:any, 
    props:device_props_interface)=>{

        return(
            <div
                id={`${props.json.hw_id}_${informative_type}`}
                key={`${props.json.hw_id}_${informative_type}`} >
                
                <Door 
                    id={`${props.json.hw_id}_${informative_type}`}
                    key={`${props.json.hw_id}_${informative_type}`} 
                    type={informative_type.split('_')[1]} 
                    disabled={(props.SSEConnection&&props.json.HW_updates.i?.connected.toString()=='true'?false:true)}
                    isChecked={informative_value=='true' ? true : false} />
            </div>
        )
}

const ui_lock=(
    informative_type:string, 
    informative_value:any, 
    props:device_props_interface)=>{
        return(
            <div
                id={`${props.json.hw_id}_${informative_type}`}
                key={`${props.json.hw_id}_${informative_type}`} >
                
                <Lock 
                    id={`${props.json.hw_id}_${informative_type}`}
                    key={`${props.json.hw_id}_${informative_type}`} 
                    type={informative_type.split('_')[1]} 
                    disabled={(props.SSEConnection&&props.json.HW_updates.i?.connected.toString()=='true'?false:true)}
                    isChecked={informative_value=='true' ? true : false} />
            </div>
        )
}