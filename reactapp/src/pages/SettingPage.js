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
import UpdateAccessTokenForm from '../components/UpdateAccessTokenForm';



const SettingPage = ({isAuthenticated, logout, get_devices, has_update}) => {
    const navigate = useNavigate();

    const [isAccessTokenVisable, setIsAccessTokenVisable]= useState(false)

    const close_AccessTokenForm_byBg=(e)=>{
        /**
         * Close delete device form
         */
        if(e.currentTarget == e.target){
            setIsAccessTokenVisable(false);
        }
    }
    const close_AccessTokenForm=()=>{
        /**
         * Close delete device form
         */
        setIsAccessTokenVisable(false);
    }
    const getIsAccessTokenVisable=()=>{
        /**
         * get form visiblity state, to show it or not
         */
        if(!isAccessTokenVisable){return 'none'}
        return '';
    }



    return (
        <div className="center">
            <div className='home-heading-continer'>
                <div className='width-100 hover-pointer'><MdKeyboardBackspace size="33px" color="#ECDBBA"  onClick={() => navigate('/home_devices', {replace: true})}/></div>
                <div className='width-100'><h1 className="page-title">Settings</h1></div>
                <div className='width-100'></div>
            </div>

            <div style={{display: getIsAccessTokenVisable()}}>
                <UpdateAccessTokenForm 
                    
                    bgOnClick={(e)=>close_AccessTokenForm_byBg(e)}
                    closeForm={close_AccessTokenForm}
                />
            </div>
            <div>
                <Button label="Account access token" type="button" onClick={()=>setIsAccessTokenVisable(true)} />
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