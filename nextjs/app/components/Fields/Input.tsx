import './css.css'
interface InputProps{
    lable?:string,
    placeholder?:string,
    className?:string,
    IclassName?:string,
    LclassName?:string,
}

const InputPropsDefaults:InputProps={
    lable:"default",
    placeholder:"default",
    className:"",
    IclassName:"",
    LclassName:"",
}

const Input=(props:InputProps) =>{
    return (
        <div className={`${props.className || InputPropsDefaults.className}`}>
            <div 
                className={`flex ${props.LclassName || InputPropsDefaults.LclassName}`}>
                    {(props.lable || InputPropsDefaults.lable)}
            </div>
            <input 
                type="text"
                placeholder={(props.placeholder || InputPropsDefaults.placeholder)}
                className={`flex Input ${props.IclassName || InputPropsDefaults.IclassName}`} />
        </div>
    )
}

export default Input