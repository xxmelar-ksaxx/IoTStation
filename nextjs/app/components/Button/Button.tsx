import './css.css'
interface ButtonProps{
    lable?:string,
    onClick?:(...args: any[]) => any,
    className?:string
}

const ButtonPropsDefaults:ButtonProps= {
    lable:"Button",
    onClick:()=>{},
    className:""
}

const Button = (props:ButtonProps)=>{
    return (
        <div 
            className={`Button ${(props.className || ButtonPropsDefaults.className)}`} 
            onClick={props.onClick || ButtonPropsDefaults.onClick}>

            {props.lable || ButtonPropsDefaults.lable}
        </div>
    )
}

export default Button