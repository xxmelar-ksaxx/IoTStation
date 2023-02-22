import React, {useState, useEffect} from 'react'
import {useNavigate, Navigate , Link } from 'react-router-dom';
// import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { register } from '../actions/auth';
import CSRFToken from '../components/CSRFToken';

// style
import './css/RegisterPage.css'
import './css/LoginPage.css'
import '../components/css/globalStyles.css'
import InputField from '../components/InputField';
import Button from '../components/Button';

const RegisterPage = ({register, isAuthenticated }) => {
    
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        re_password: ''
    });
    const [accountCreated, setAccountCreated] = useState(false);

    const { username, password, re_password } = formData;

    const onSubmit = async e => {
        e.preventDefault();

        if (password === re_password) {
            let res = await register(username, password, re_password);
            if(res){
                let invalid_credntials=document.getElementById('invalid-credentials');
                invalid_credntials.innerHTML = res;
                invalid_credntials.style.display='inline';
            }else{
                setAccountCreated(true);
            }
        }
    };

    if (isAuthenticated)
        return <Navigate  to='/home_devices' />;
    else if (accountCreated)
        return <Navigate  to='/login' />;
    

    const checkPasswordMatch = (e)=> {
        console.log('Check Password')
        setFormData({ ...formData, [e.target.name]: e.target.value });
        let target_id="confirm-password-check-label"
        let target_element=document.getElementById(target_id)
        let password = document.getElementById('password').value;
        let confirm_password = document.getElementById('confirm-password').value;
        let register_btn=document.getElementById('register-button')
        if(confirm_password.length>=8){
            if(confirm_password===password){
                console.log('confirm password Ok')
                target_element.style.color = "#02f402";
                target_element.style.display = 'inline';
                target_element.innerHTML = 'Matching';
                register_btn.disabled  = false;
            }
            else{
                target_element.style.color = '#ff0404';
                target_element.style.display = 'inline';
                target_element.innerHTML = 'Not Matching';
                register_btn.disabled  = true;

                console.log("not a math passwords");
            }
        }
    }

    return (
        <div className="LoginForm" id="hi">
            <p className="form-title inline">Register</p>
            <br/>
            
            <h5 
                id="invalid-credentials"
                className="form-error" 
                style={{display: 'none'}}
            >invalid credinsials</h5>
            
            <form onSubmit={e => onSubmit(e)}>
                <CSRFToken />

                <InputField 
                    type="text"  
                    label="Username"
                    onChange={(event) => checkPasswordMatch(event)} // required only for updateing the form state
                    name='username'
                    value={username}
                    required={true}
                />

                <InputField 
                    id="password" 
                    type="password"  
                    label="Password"
                    onChange={(event) => checkPasswordMatch(event)} 
                    name='password' 
                    value={password} 
                    required={true} 
                />

                <InputField 
                    id="confirm-password" 
                    type="password"  
                    label="Confirm Password" 
                    onChange={(event) => checkPasswordMatch(event)} 
                    name='re_password' 
                    value={re_password}
                    required={true} 
                />

                <p 
                    className="underFieldText" 
                    onClick={() => navigate('/login', {replace: true})}
                    
                >have an account? Login</p>
                
                <br/>

                <Button 
                    id="register-button" 
                    label="Register" 
                    type="submit"
                    disabled={true}
                />

            </form>
         
        </div>
    );

};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register })(RegisterPage);