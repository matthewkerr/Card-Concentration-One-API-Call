import React, { Component } from 'react';
import StartGame from './components/StartGame/StartGame';
import GameOver from './components/GameOver/GameOver';
import Card from './components/Card/Card';
import Scoreboard from './components/Scoreboard/Scoreboard';
import './App.css';

class App extends Component {

  state = {
    deckOfCards: [],
    lastClickedValue: null,
    lastClickedIndex: null,
    gameStarted: false,
    maxMatches: 26,
    numPlayerMatches: 0,
    numPlayerAttempts: 0,
    numOfCardsInDeck: 0,
    deckId: 0,
    loaded: false,
    blockclick: false
  }

  selectAndSuffleCards = ( ) => {
    //could have used axios but we will just use plain Fetch
    //TIP ::: replace <<deck_id>> with "new" to create a shuffled deck and draw cards from that deck in the same request.
    //This cuts it down to one request to the API.
    fetch('https://deckofcardsapi.com/api/deck/new/draw/?count=52')
    .then(res => res.json())
    .then(json => this.setUpGame( json.cards ));
  }

  setUpGame = (cards) => {
    //I want to control the game from this one shuffled deck
    //lets add some properties to our card array
    //forEach is a bit slow but dont want to map( nothing to return here)
    let array = [ ...cards ];
    array.forEach(function(e) { 
      e.facedown = true; 
      e.matched = false;
    });
    const startGame = true;
    this.setState({ deckOfCards: array, gameStarted: startGame })
  }

  onCardClicked = ( event ) => {
    //if we click the same card then we dont to anything
    if ( event === this.state.lastClickedIndex || this.state.blockclick ) { return }
    //lets get our current index , make a copy of the state array, and deep copy card.
    let index = event;
    let lastIndexClicked = this.state.lastClickedIndex;
    let array = [ ...this.state.deckOfCards ];
    let card = { ...array[index] };

    if ( this.state.lastClickedValue === card.value  ) {
      //Here we have a match , let show the second card and call the timeout for Match Complete.
      card.facedown = false;
      array[index] = card;
      this.setState({ deckOfCards: array, blockclick: true })
      setTimeout( this.matchDetected, 500, index, lastIndexClicked, array )
    }
    else if ((this.state.lastClickedValue !== null ) && ( this.state.lastClickedValue !== card.value )) {
      card.facedown = false;
      array[index] = card;
      this.setState({ deckOfCards: array, blockclick: true })
      setTimeout( this.noMatchDetected, 500, index, lastIndexClicked, array )
    }
    else {
      card.facedown = false;
      array[index] = card;
      this.setState({ lastClickedValue: card.value, lastClickedIndex: event, deckOfCards: array, blockclick: false })
    }
  }

  matchDetected = ( index, lastIndex, array ) => {
    //get the cards from the array by deep copy.
    let newCard = { ...array[index] };
    let lastCard = { ...array[lastIndex] };
    newCard.matched = true;
    array[index] = newCard;
    if ( lastIndex !== -1 ) {
      lastCard.matched = true;
      array[lastIndex] = lastCard;
    }
    let numMatches = this.state.numPlayerMatches + 1;
    let numPlayerAttempts = this.state.numPlayerAttempts + 1;
    this.setState({ lastClickedValue: null, lastClickedIndex: null, deckOfCards: array, numPlayerMatches: numMatches, numPlayerAttempts: numPlayerAttempts, blockclick: false })
  }

  noMatchDetected = ( currentIndex, lastIndex, array ) => {
      //get the cards from the array by deep copy.
      let newCard = { ...array[currentIndex] };
      let lastCard = { ...array[lastIndex] };
    
      newCard.matched = false;
      newCard.facedown = true;
      array[currentIndex] = newCard;
      
      if ( this.state.lastClickedIndex !== null ) {
        lastCard.matched = false;
        lastCard.facedown = true;
        array[lastIndex] = lastCard;
      }

      let numPlayerAttempts = this.state.numPlayerAttempts + 1;
      this.setState({ lastClickedValue: null, lastClickedIndex: null, deckOfCards: array, numPlayerAttempts: numPlayerAttempts, blockclick: false })
  }

  onStartButtonClicked = () => {
    this.selectAndSuffleCards();
  }

  onGameOver = () => {
    this.setState({ deckOfCards: [] , gameStarted: false, numPlayerMatches: 0, numPlayerAttempts: 0 })
  }

  render() {
    //create a scoreboard
    let scoreboardHtml = "";
    if ( this.state.gameStarted ) {
      scoreboardHtml = <Scoreboard attempts={this.state.numPlayerAttempts} matches={this.state.numPlayerMatches}/>
    }

    //we will show different things
    //yes this all could be inside its own component GameBoard
    let bodyHtml = '';
    if ( this.state.numPlayerMatches === this.state.maxMatches ) {
      bodyHtml = <GameOver clicked={() => this.onGameOver() } />
    }
    else if (this.state.deckOfCards && this.state.gameStarted )
    {
      bodyHtml = this.state.deckOfCards.map(( card , index ) => {
        return (
          <Card key={index}
            class='col-1'
            imagePath={card.image}
            matched={card.matched}
            facedown={card.facedown}
            clicked={(e) => this.onCardClicked(index, e) } />
        )
      });
    }
    else
    {
      bodyHtml = <StartGame clicked={() => this.onStartButtonClicked() } />
    }

    return (
      <div className="container">
        <div className="grid-container outline">
          {scoreboardHtml}
          {bodyHtml}
        </div>
      </div>
    );
  }
}

export default App;
