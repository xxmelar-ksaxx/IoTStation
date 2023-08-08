'use client'
import { useState } from 'react'
import './css.css'
import Input from '@/app/components/Fields/Input'
import Button from '@/app/components/Button/Button'
import AcceptForm from '@/app/components/AcceptForm/AcceptForm'
import {updateDeviceLabel} from '@/app/api/device'


interface RenameProps{
    id: string
    label:string
}

const RenameDevice=(props:RenameProps)=>{
    const [formVisibility, setFormVisibility] = useState(false);
    const [renameformVisibility, setRenameformVisibility] = useState(false);
    const [acceptFormVisibility, setAcceptFormVisibility] = useState(false);

    const [NewLabel, setNewLabel] = useState(props.label);

    const sendRenameDeviceRequest=()=>{
        const update_json={
            hw_id: props.id,
            t:Date.now().toString(),
            label: NewLabel
        }
        updateDeviceLabel(update_json);
        exitAllForms();
    }

    const openForm=()=>{
        setNewLabel(props.label)
        setFormVisibility(true);
        setRenameformVisibility(true);
    }
    const openAcceptForm=()=>{
        setRenameformVisibility(false);
        setAcceptFormVisibility(true);
    }

    const exitForm=(e:any)=>{
        if(e.currentTarget == e.target){
            exitAllForms();
        }
    }
    
    const exitAllForms=()=>{
        setFormVisibility(false);
        setRenameformVisibility(false);
        setAcceptFormVisibility(false);
    }
    
    const onChange=(e:any)=>{
        setNewLabel(e.target.value);
    }

    const AcceptFormMsg=`Are you sure you want to
    rename the device ${props.id} to -> "${NewLabel}"`;

    return (
        <div>
            <div className="rename-device-form-continer" 
                style={{display: formVisibility? '':'none'}}
                onClick={e => exitForm(e)}>
                
                <AcceptForm 
                    style={{display: acceptFormVisibility? '':'none'}} 
                    children={AcceptFormMsg} id={props.id}
                    onSubmit={sendRenameDeviceRequest}
                    onCancel={exitAllForms}/>

                <div className="rename-device-form"
                    style={{display: renameformVisibility? '':'none'}}>
                    <Input 
                        placeholder='Enter new label'
                        lable='Label'
                        onChange={onChange}
                        value={NewLabel}/>
                    <Button className="rename-device-form-button FormSubmitButton"
                        lable='Rename'
                        onClick={openAcceptForm}/>
                </div>
            </div>
            <div className="rename-device edit-icon" onClick={openForm}>
                {/* |rename| */}
            </div>
        </div>
    )
}
export default RenameDevice