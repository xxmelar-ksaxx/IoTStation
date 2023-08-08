'use client'
import './css.css'

interface DoorProps{
    id: string
    type?: string
    isChecked?: boolean,
    disabled: boolean
}

const Door=(props:DoorProps)=>{
    return (
        <div 
            id={props.id}
            className={`Door door-${props.isChecked ? "true":"false"}
            door-opasity-${props.disabled}`}
            >
        </div>
    )
}

export default Door