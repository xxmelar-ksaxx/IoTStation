import '../pages/css/RegisterPage.css'
import '../pages/css/LoginPage.css'
import './css/globalStyles.css'
import './css/forms.css'
import Button from './Button';
import InputField from '../components/InputField';
import AcceptForm from './AcceptForm';

import { connect } from 'react-redux';

import { update_account_access_token, get_account_access_token } from '../actions/devices';
import { useEffect, useState } from 'react';

const UpdateAccessTokenForm = (props) => {

    const [AccessToken, setAccessToken] = useState("");
    const [updatedAccessToken, setUpdatedAccessToken] = useState("");
    const [isComponentFirstCall, setIsComponentFirstCall] = useState(true);

    const [isAcceptFormActive, setIsAcceptFormActive]= useState(false);

    const send_update_access_token = async (closeForm) => {
        let res = await props.update_account_access_token(updatedAccessToken)
        alert(res)
        closeForm()
        update_token_data()
    }

    const getAccountAccessToken = async () =>{
        let res = await props.get_account_access_token();
        setAccessToken(res.data);
    }

    const update_token_data=() => {
        getAccountAccessToken();
    }

    

    useEffect(()=>{
        if(isComponentFirstCall){
            update_token_data()
            setIsComponentFirstCall(false);
        }

    })


    const show_AcceptForm=()=>{
        setIsAcceptFormActive(true);
    }

    const close_AcceptForm=()=>{
        setIsAcceptFormActive(false);
    }

    const get_isAcceptFormActive=()=>{
        /**
         * get form visiblity state, to show it or not
         */
        if(!isAcceptFormActive){return 'none'}
        return '';
    }

    const isAccepted_AcceptForm=(isAccepted)=>{
        if(isAccepted){

            send_update_access_token(props.closeForm)
            
            close_AcceptForm()
        }else{
            close_AcceptForm()
        }
    }


    return (
        <div className="hover-form-bg-continer" onClick={props.bgOnClick}>
            <div className="Form-continer">
                    <div style={{display:get_isAcceptFormActive()}}><AcceptForm 
                        formHeader="Confirm Update"
                        msg="are sure you want to update your access token"
                        isAcceptedForm={isAccepted_AcceptForm}
                        acceptBtnType="accept"
                        />
                    </div>
                
                    <p className="form-title inline f-br">Account Access Token</p>
                    <p>Current account access token:</p>
                    <div className="text-box-100">{AccessToken}</div>
                    <hr style={{backgroundColor:'#ECDBBA', height:"1px", border:"none"}}/>
                    <h2>Update Token</h2>
                    <InputField 
                        type="text"  
                        label="New Token"
                        value={updatedAccessToken}
                        required={true}
                        onChange={(e)=>{
                            setUpdatedAccessToken(e.target.value);
                        }}
                    />
                    <br/>
                    <div className='flex-hv-align' style={{gap:"10%"}}>
                        <Button label="Cancel" onClick={props.closeForm} className="cancel" type="submit"/>
                        <Button label="Update" onClick={()=>show_AcceptForm()} type="submit"/>
                    </div>

            </div>
        </div>

    );

}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {update_account_access_token, get_account_access_token })(UpdateAccessTokenForm);