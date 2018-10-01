import React from 'react';

const startButton = ( props ) => {
    return ( 
        <div className="scoreboard">
            <span className="left">NUMBER OF MATCHES : {props.matches}</span>
            <span className="right">NUMBER OF ATTEMPTS : {props.attempts}</span>
        </div>
    );
}

export default startButton;