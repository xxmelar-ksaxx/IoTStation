import PropTypes from "prop-types"
import './css/Button.css'


const Button = (props) => {
    return (

        <input 
            id={props.id}
            className={"Button "+props.className}
            type={props.type}
            value={props.label}
            onClick={props.onClick}
            disabled={props.disabled}
        />


    )

    
}

// Button.protoType={
// placeholder: PropTypes.string,
// label: PropTypes.string,
// // color: PropTypes.string,
// // onClick: PropTypes.func,
// }

Button.defaultProps ={
    className: '',
    
}

export default Button