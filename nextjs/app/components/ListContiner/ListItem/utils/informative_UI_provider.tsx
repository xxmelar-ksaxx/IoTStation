import device_props_interface from '../device_props_interface';

export const informative_ui_provider=(
    informative_type:string, 
    informative_value:any, 
    props:device_props_interface)=>{

    if(informative_type.split('_')[0]=="door"){
        return ui_door(informative_type, informative_value, props);
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
                
                🚪:{`${informative_type}:${informative_value}`}
            </div>
        )
}