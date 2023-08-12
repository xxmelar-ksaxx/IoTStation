'use client'
import { useState } from 'react'
import './css.css'
import AcceptForm from '@/app/components/AcceptForm/AcceptForm'
import {deleteDeviceLabel} from '@/app/api/device'


interface DeleteProps{
    id: string
    label:string
}

const DeleteDevice=(props:DeleteProps)=>{
    const [formVisibility, setFormVisibility] = useState(false);
    const [acceptFormVisibility, setAcceptFormVisibility] = useState(false);

    const [NewLabel, setNewLabel] = useState(props.label);

    const sendDeleteDeviceRequest=()=>{
        const update_json={
            hw_id: props.id,
            t:Date.now().toString(),
            label: NewLabel
        }
        deleteDeviceLabel(update_json);
        exitAllForms();
    }

    const openForm=()=>{
        setNewLabel(props.label)
        setFormVisibility(true);
        setAcceptFormVisibility(true);
    }

    const exitForm=(e:any)=>{
        if(e.currentTarget == e.target){
            exitAllForms();
        }
    }
    
    const exitAllForms=()=>{
        setFormVisibility(false);
        setAcceptFormVisibility(false);
    }
    
    const AcceptFormMsg=`Are you sure you want to
    Delete the device -> ${props.id} ?`;
    return (
        <div>
            <div className="delete-device-form-continer" 
                style={{display: formVisibility? '':'none'}}
                onClick={e => exitForm(e)}>
                
                <AcceptForm 
                    style={{display: acceptFormVisibility? '':'none'}} 
                    children={AcceptFormMsg} id={props.id}
                    onSubmit={sendDeleteDeviceRequest}
                    onCancel={exitAllForms}/>
            </div>
            <div className="delete-device delete-icon" onClick={openForm}>
            </div>
        </div>
    )
}
export default DeleteDevice