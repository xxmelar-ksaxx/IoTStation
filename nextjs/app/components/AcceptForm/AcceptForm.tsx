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
        <div className="Accept-form" style={props.style}>
            <p className="Accept-form-msg">
                {props.children}
            </p>
            <div className="flex justify-center gap-5 mt-5">
                <Button lable="Yes" className="Button-Green" onClick={props.onSubmit}/>
                <Button lable="No"  className="Button-Red" onClick={props.onCancel}/>
            </div>
        </div>
    )
}
export default AcceptForm