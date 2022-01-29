import React from "react";
import createSpecialsAndGuests from "./createGuests";
import Dragger from "./Dragger";
import DraggerContainer from "./DraggerContainer";

function App() {
  const guestCards: GameCard[] = createSpecialsAndGuests().slice(0, 7);
  const [randomCard]: GameCard[] = createSpecialsAndGuests().slice(0, 1);
  const elementWidth = 100;
  console.log(guestCards);

  return (
    <div>
      <DraggerContainer id="xxyy2" elementWidth={elementWidth}>
        {guestCards.map((card, index) => (
          <img
            alt={card.name}
            key={card.id}
            style={{
              width: elementWidth,
            }}
            src={`./images/${card.image}.jpg`}
          />
        ))}
      </DraggerContainer>
      <Dragger draggerId={"only"} index={0}>
        {(draggerRef, dragState) => (
          <img
            ref={draggerRef}
            alt={randomCard.name}
            key={randomCard.id}
            style={{
              width: elementWidth,
              border: "black thin solid",
             // position:"relative",
              transform: dragState.dragged ? `translate(${dragState.translateX}px, ${dragState.translateY}px)` : "",
              pointerEvents: dragState.dragged ? "none" : "auto"
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
