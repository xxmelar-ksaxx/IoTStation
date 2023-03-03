import '../pages/css/RegisterPage.css'
import '../pages/css/LoginPage.css'
import './css/globalStyles.css'
import './css/forms.css'
import Button from './Button';
import { send_add_new_device} from '../actions/devices';
import { connect } from 'react-redux';

const AcceptForm = (props) => {

    return (
        <div className="hover-form-bg-continer" onClick={props.bgOnClick}>
            <div className="Form-continer">
                
                    <p className="form-title inline f-br">{props.formHeader}</p>
                    <p>{props.msg}</p>
                    <p>{props.msg2}</p>
                    <p>{props.msg3}</p>
                    <br/>
                    <div className='flex-hv-align' style={{gap:"10%"}}>
                        <Button label="Cancel" onClick={()=>{props.isAcceptedForm(false)}} className="cancel" type="submit"/>
                        <Button label="Remove" onClick={()=>{props.isAcceptedForm(true)}} className="delete" type="submit"/>
                    </div>

            </div>
        </div>

    );

}
const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {send_add_new_device })(AcceptForm);