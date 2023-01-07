//based on https://www.oreilly.com/library/view/react-16-essentials/9781787126046/ch08s04.html

import React from 'react';
import "../components.styling/button-styling.css";
/*const buttonStyle = {
    margin: '10px 0'
};*/

const Button = ({ className,label, clickHandler, disabled}) => (
    <button
        type="button"
        className={className}
        //style={buttonStyle}
        onClick={clickHandler}
        disabled={disabled}
    >
        {label}
    </button>
);

export default Button;