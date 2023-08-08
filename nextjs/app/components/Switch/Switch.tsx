'use client'
import './css.css'

interface SwitchProps{
    id: string
    type?: string
    isChecked?: boolean,
    onChange?: (...args: any[]) => any;
    disabled: boolean
}

const SwitchPropsDefaults = {
    type: 'switch-default',
    isChecked: false,
    onChange: () =>{}
}

const Switch=(props:SwitchProps)=>{
    return (
        <div>
            <input 
                type="checkbox" 
                id={`switch_${props.id}`} 
                checked={props.isChecked} 
                onChange={props.onChange||SwitchPropsDefaults.onChange} 
                disabled={props.disabled}/>
            <label 
                htmlFor={`switch_${props.id}`} 
                className={`Switch ${props.type? (props.type||"")+"-"+(props.isChecked?.toString()||""):"switch-default"} disabled-${props.disabled}`}></label>
        </div>
    )
}

export default Switch