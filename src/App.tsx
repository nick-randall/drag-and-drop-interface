import React from "react";
import createSpecialsAndGuests from "./createGuests";
import Dragger from "./Dragger";
import DraggerContainer from "./DraggerContainer";
import "./App.css";

function App() {
  const guestCards: GameCard[] = createSpecialsAndGuests().slice(0, 7);
  const [randomCard]: GameCard[] = createSpecialsAndGuests().slice(0, 1);
  const elementWidth = 100;
  console.log(guestCards);
  const containerOneId = "xxxy2"
  const containerTwoId = "xxxy1"


  return (
    <div>
      <div style={{left: 200, position:"absolute", top:500}}>
      <DraggerContainer id={containerOneId} elementWidth={elementWidth}>
        {guestCards.map((card, index) => (
          <Dragger draggerId={card.id} index={index} containerId = {containerOneId} size={elementWidth}>
            {(draggerRef, dragStyles, handleDragStart) => (
              <img
                ref={draggerRef}
                onMouseDown={handleDragStart}
                alt={card.name}
                key={card.id}
                style={{
                  width: elementWidth,
                  ...dragStyles,
                }}
                src={`./images/${card.image}.jpg`}
                draggable="false"
              />
            )}
          </Dragger>
        ))}
      </DraggerContainer>
      </div>
      <Dragger draggerId={randomCard.id} index={0} containerId={containerTwoId} size={elementWidth}>
        {(draggerRef, dragStyles, handleDragStart) => (
          <img
            ref={draggerRef}
            alt={randomCard.name}
            key={randomCard.id}
            onMouseDown={handleDragStart}
            style={{
              width: elementWidth,
              ...dragStyles,
            }}
            src={`./images/${randomCard.image}.jpg`}
            draggable="false"
          />
        )}
      </Dragger>
    </div>
  );
}

export default App;
