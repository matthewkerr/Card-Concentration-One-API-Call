import React from 'react';

const startGame = ( props ) => {
    return ( 
        <div className="holder centered">
            <h1>Welcome to Card Concentration</h1>
            <button className="button" onClick={props.clicked}>Start Game</button>
            <p>Choose two cards, a match will remove the cards from the deck. </p>
            <p>No match result will flip the cards back over. <br/>
            How many tries will it take you to clear the board?</p>
        </div>
    );
}

export default startGame;