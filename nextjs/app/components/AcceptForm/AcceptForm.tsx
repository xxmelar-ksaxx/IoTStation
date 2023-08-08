import Button from "../Button/Button";
import './css.css';

interface FormProps{
    id: string;
    onSubmit?: (...args: any[]) => any;
    onCancel?: (...args: any[]) => any;
    children: React.ReactNode;
    style:any
}

const AcceptForm=(props:FormProps)=>{

    return(
        <div style={props.style}>
            <p className="Accept-form-msg">
                {props.children}
            </p>
            <Button lable="Yes" onClick={props.onSubmit}/>
            <Button lable="No" onClick={props.onCancel}/>
        </div>
    )
}
export default AcceptForm