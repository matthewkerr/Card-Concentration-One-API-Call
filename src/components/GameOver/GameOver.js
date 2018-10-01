import React from 'react';

const gameOver = ( props ) => {
    return ( 
        <div className="holder centered">
            <h1>You Made It! Congratulations</h1>
            <button className="button" onClick={props.clicked}>Play Again</button>
        </div>
    );
}

export default gameOver;