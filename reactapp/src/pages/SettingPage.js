import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom';
import './css/HomePage.css'
import '../components/css/globalStyles.css'
import { logout } from '../actions/auth';
import { get_devices } from '../actions/devices';
import { has_update } from '../actions/devices';
import { connect } from 'react-redux';

// icons lib
import { MdKeyboardBackspace } from "react-icons/md";

import Button from '../components/Button';



const SettingPage = ({isAuthenticated, logout, get_devices, has_update}) => {
    const navigate = useNavigate();

    return (
        <div className="center">
            <div className='home-heading-continer'>
                <div className='width-100 hover-pointer'><MdKeyboardBackspace size="33px" color="#ECDBBA"  onClick={() => navigate('/home_devices', {replace: true})}/></div>
                <div className='width-100'><h1 className="page-title">Settings</h1></div>
                <div className='width-100'></div>
            </div>
            <div>
                <br/>
                <br/>
                <br/>
                <br/>
                <Button label="Logout" type="button" onClick={()=>logout()} />
            </div>

        </div>
    );

}

// export default HomePage();
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { logout, get_devices, has_update })(SettingPage);