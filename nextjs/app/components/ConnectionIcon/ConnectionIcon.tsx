import './css.css';

interface ConnectionProps{
    connection:string
}

export const ConnectionIcon=(props:ConnectionProps)=>{
    return(
        <div className={`connection-${props.connection}`}>
        </div>
    )
}

export default ConnectionIcon;