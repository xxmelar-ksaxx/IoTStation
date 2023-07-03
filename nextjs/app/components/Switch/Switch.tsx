'use client'
import './css.css'
import { useRef } from 'react';

interface SwitchProps{
    id: string
    type?: string
    isChecked?: boolean,
    onChange?: (...args: any[]) => any;
}

const SwitchPropsDefaults = {
    type: 'switch-default',
    isChecked: false,
    onChange: () =>{}
}

const Switch=(props:SwitchProps)=>{
    const inputRef = useRef(null);
    return (
        <div>
            <input type="checkbox" id={`switch_${props.id}`} checked={props.isChecked} onChange={props.onChange||SwitchPropsDefaults.onChange}/>
            <label htmlFor={`switch_${props.id}`} className={`Switch ${props.type? (props.type||"")+"-"+(props.isChecked?.toString()||""):"switch-default"}`}></label>
        </div>
    )
}

export default Switch