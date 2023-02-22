import React, {useState, useEffect} from 'react'
import PropTypes from "prop-types"
import './css/InputField.css'


const InputField = (props) => {

    if (props.type=="text"){
        var pattern="[A-Za-z0-9\_]{4,25}"
        var title="Only allowed (A-Z, a-z, 0-9, _ ), of at least 4 or more characters(max 24)"
    }else if(props.type=="password"){
        var pattern="[A-Za-z0-9\_][^(^)^<^>^?^/^\\^\'^\x22]{5,}"
        var title="Only allowed (A-Z, a-z, 0-9, _, !, @, #, $, %, &, * ), of at least 6 or more characters"
    }
    else if(props.type=="devicekeys"){
        props.type="text"
        var pattern="[A-Z0-9]{6}"
        var title="Only allowed (A-Z, 0-9 ), of 6 characters length"
    }

    if(props.required===true){
        var required_star='*';
    }
    else{
        var required_star='';
    }

    return (

        <div className="InputField-div">
            <div className="InputField-lable-div">
                <label>{props.label}<label style={{color:"red"}}>{required_star}</label></label>
                
                {/* for  two fields matching check*/}
                <label id={props.id+"-check-label"} style={{display:"none", color:"red"}}></label>

            </div>
            <input 
                id={props.id}
                className="InputField"
                type={props.type}
                placeholder={props.placeholder}
                pattern={pattern}
                title={title}
                onChange={props.onChange}
                name={props.name}
                value={props.value}
                required={props.required} />
        </div>


    )
}

export default InputField