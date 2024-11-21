import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import {gsap} from 'gsap';
import './App.css';


function Card({card, flipped, onClick, index}) {

  const cardRef = useRef(null);

  useEffect(()=> {

    if(flipped){

      // if flipped is true
      gsap.to(cardRef.current,{rotationY:180,duration:0.5});

    } else {

      // if faced down
      gsap.to(cardRef.current,{rotationY:0,duration:0.5});

    }

  },[flipped]);


  return(

    <div ref={cardRef} className='card' onClick={()=>onClick(index)}>

      {/* front shows emoji*/}

      <div className='front'>

        {flipped?card:null}

      </div>

      {/* back shows punctuation*/}

      <div className='back'>

        ?

      </div>

    </div>

  );

} //ending card function


/**
 * const initialCards = ["🦄","🦊","🐸","🪼","🐉",];
 * https://getemoji.com
 */

function MemoryGame(){

  const initialCards = ["🍎", "🍌", "🍒", "🍇", "🍎", "🍌", "🍒", "🍇"];

  const [cards, setCards] = useState(shuffle([...initialCards]));

  // flip card
  const [flippedIndices, setFlippedIndices] = useState([]);
  //match 2 cards at a time
  const [matchedIndices, setMatchedIndices] = useState([]);
  //game over
  const [gameOver, setGameOver] = useState(false);

  //referencing which card is called
  const cardRefs = useRef([]);

  useEffect(()=>{

    //animate all cards face down
    gsap.to(cardRefs.current, {
      rotationY: 0,
      duration: 0.5,
      stagger: 0.1,
    });

// watching card object
  },[cards]);

  const handleCardClick = (index) => {


    if(flippedIndices.length === 2 || // Prevent flipping more than two cards
      flippedIndices.includes(index) || // Prevent flipping the same card
      matchedIndices.includes(index) // Prevent flipping matched cards
    ){
      return;
    }

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if(newFlippedIndices.length === 2){
      const[first, second] = newFlippedIndices;

      if(cards[first] === cards[second])
        {
        //sets/matches pairs
        setMatchedIndices((prev)=> [...prev,first,second]);
      }
      
      //set unmatched cards back to null or 0
      setTimeout(()=> setFlippedIndices([]),1000);

    }

      //check for game over
    if(matchedIndices.length + 2 === cards.length){
      setTimeout(()=> setGameOver(true), 1000);
    }
  };

  // functions to reset, shuffle, etc

  const resetGame = ()=> {

    setCards(shuffle([...initialCards]));

    setFlippedIndices([]);

    setMatchedIndices([]);

    setGameOver(false);

  };


  return (
    <div className="game-container">
      <h1>Memory Game</h1>
      {gameOver && <h2>Congratulations, You Won! 🎉</h2>}
      <div className="game-board">
        {cards.map((card, index) => (
          <div
            ref={(el) => (cardRefs.current[index] = el)}
            key={index}
            className="card-wrapper"
          >
            <Card
              card={card}
              index={index}
              flipped={
                flippedIndices.includes(index) || // Temporarily flipped cards
                matchedIndices.includes(index) // Matched cards
              }
              onClick={handleCardClick}
            />
          </div>
        ))}
      </div>
      <button className="reset-button" onClick={resetGame}>
        Reset Game
      </button>
    </div>
  );


};


// Shuffle helper function
function shuffle(array) {
return array.sort(() => Math.random() - 0.5);
}


export default MemoryGame
