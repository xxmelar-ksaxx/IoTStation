'use client'
import './css.css'

interface LockProps{
    id: string
    type?: string
    isChecked?: boolean,
    disabled: boolean
}

const Lock=(props:LockProps)=>{
    return (
        <div 
            id={props.id}
            className={`Lock lock-${props.isChecked ? "true":"false"}
            lock-opasity-${props.disabled}`}
            >
        </div>
    )
}

export default Lock