import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom';
import '../pages/css/RegisterPage.css'
import '../pages/css/LoginPage.css'
import './css/globalStyles.css'
import InputField from './InputField';
import Button from './Button';

const AddDeviceForm = () => {
    
    const navigate = useNavigate();

    useEffect(() => {
        // code to run after render goes here
    //    if(isInvalidCredintials===false || isInvalidCredintials===undefined){
    //     document.getElementById('invalid-credentials').style.display = 'none';
    //     }
    });

    function gotoLogin(e){
        // history stack gets replaced with the new one, when replace = true.
        navigate('/login', {replace: true}); 
    }

    const checkPasswordMatch = (e)=> {
        let target_id="device-password-key-match-label"
        let name_key = document.getElementById('device-name-key').value;
        let password_key = document.getElementById('device-password-key').value;
        if(password_key.length==6 && name_key.length==6){
            if(verfyKeys(name_key,password_key)){
                console.log('confirm password Ok')
                document.getElementById(target_id).style.color = "#02f402";
                document.getElementById(target_id).style.display = 'inline';
                document.getElementById(target_id).innerHTML = 'Valid';
                document.getElementById('register-button').disabled  = false;
            }
            else{
                document.getElementById(target_id).style.color = '#ff0404';
                document.getElementById(target_id).style.display = 'inline';
                document.getElementById(target_id).innerHTML = 'Not Valid';
                document.getElementById('register-button').disabled  = true;

                console.log("not valid keys");
            }
        }
    }

    function verfyKeys(name_key, password_key){
        if(name_key=='AAAAAA' && password_key=='SSSSSS')
            return true;
        else
            return false;
    }
    function addSubmit(e){
        alert('Submit is hit!!');
    }

    return (
        <div className="bg-Absolute-Shadow">

        <div className="LoginForm" id="hi">
            <p className="form-title inline">Register</p>
            <br/>
            <h5 id="invalid-credentials" className="form-error">invalid credinsials</h5>
            
            <form onSubmit={(e) => addSubmit(e)} method="get">

            <InputField type="text"  label="Username" required={true}/>
            {/* <br/> */}
            
            <InputField id="device-name-key" type="devicekeys"  label="Device Name" required={true} 
            onChange={(event) => checkPasswordMatch(event)} />
            
            <InputField id="device-password-key" type="devicekeys"  label="Device Key" 
            required={true} onChange={(event) => checkPasswordMatch(event)} />
            
            {/* <p className="underFieldText" onClick={(event) => gotoLogin(event)}
            >have an account? Login</p> */}
            
            <br/>

            <Button id="register-button" label="Add" type="submit" />


            </form>
         
        </div>
        </div>

    );

}

export default AddDeviceForm