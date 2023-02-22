import React, {useState, useEffect} from 'react'
import {useNavigate, Navigate , Link } from 'react-router-dom';
import { connect } from 'react-redux';
import CSRFToken from '../components/CSRFToken';
import { login } from '../actions/auth';

// styles
import './css/LoginPage.css'
import InputField from '../components/InputField';
import Button from '../components/Button';


const LoginPage = ({login, isAuthenticated}) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const { username, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

       let res= await login(username, password);
       if(res){
            let invalid_credntials=document.getElementById('invalid-credentials');
            invalid_credntials.innerHTML = res;
            invalid_credntials.style.display='inline';
        }
    };

    if (isAuthenticated){

        // alert('Authentication');
        return <Navigate to='/home_devices' />;
    }
        




    return (
        <div className="LoginForm" id="hi">
            <p className="form-title inline">Login</p>
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
                    onChange={e => onChange(e)}
                    name="username"
                    value={username}
                    required={true}
                />
                
                <InputField 
                    type="password"  
                    label="Password"
                    onChange={e => onChange(e)}
                    name="password" 
                    value={password}
                    required={true}
                />

                <p 
                    className="underFieldText" 
                    onClick={() => navigate('/register', {replace: true})}

                >Don't have an account? Register</p>
                
                <br/>
                <Button label="Login" type="submit" />

            </form>
        </div>
    );

}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(LoginPage);