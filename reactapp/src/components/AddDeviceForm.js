import React, {useState, useEffect, Component } from 'react'
import {useNavigate, Navigate , Link } from 'react-router-dom';
import '../pages/css/RegisterPage.css'
import '../pages/css/LoginPage.css'
import './css/globalStyles.css'
import './css/forms.css'
import InputField from './InputField';
import Button from './Button';
import { send_add_new_device} from '../actions/devices';
import { connect } from 'react-redux';

const AddDeviceForm = (props) => {
    
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        label: '',
        hw_id: '',
        access_key: ''
    });

    const { label, hw_id, access_key } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const [isValidCredintials, setIsValidCredintials] = useState(true);

    const getisValidCredintials=()=>{
        if(isValidCredintials){return 'none'}
        return '';
    }

    const onSubmit = async e => {
        e.preventDefault();
        let res = await props.send_add_new_device(formData);
        alert(res)
        props.setIsAddDevice(false);
    };

    return (
        <div className="hover-form-bg-continer" onClick={props.bgOnClick}>
            <div className="Form-continer">
                
                <form onSubmit={e => onSubmit(e)}>

                    <p className="form-title inline f-br">Add new device</p>
                    <br/>
                    <h5 className="form-error" style={{display: getisValidCredintials()}}>invalid credinsials</h5>
                    <br/>
                    <InputField 
                        type="labeltext" 
                        label="Label"
                        onChange={e => onChange(e)}
                        value={label}
                        name="label"
                        required={true}
                    />
                    <InputField 
                        type="devicekeys" 
                        label="ID"
                        onChange={e => onChange(e)}
                        value={hw_id}
                        name="hw_id"
                        required={true}
                    />
                    <InputField 
                        type="devicekeys" 
                        label="Access-Key"
                        onChange={e => onChange(e)}
                        name="access_key"
                        required={true}
                    />
                    <br/>
                    <span>Only allowed (A-Z, 0-9 ), of 6 characters length</span>
                    <br/>
                    <br/>
                    <Button label="Add" type="submit"/>
                    
                </form>

            </div>
        </div>

    );

}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {send_add_new_device })(AddDeviceForm);