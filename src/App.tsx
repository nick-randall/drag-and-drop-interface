import React from "react";
import createSpecialsAndGuests from "./createGuests";
import Dragger from "./Dragger";
import DraggerContainer from "./DraggerContainer";
import "./App.css";
import Infos from "./Infos";

const CardContainers: React.FC = () => {
  const guestCards: GameCard[] = createSpecialsAndGuests().slice(0, 7);
  const [randomCard]: GameCard[] = createSpecialsAndGuests().slice(0, 1);
  const handCards: GameCard[] = createSpecialsAndGuests().slice(8, 15);
  const elementWidth = 100;
  console.log(guestCards);
  const containerOneId = "xxxy2";
  const containerTwoId = "xxxy1";
  return (
    <div>
      <div style={{ left: 200, position: "absolute", top: 500 }}>
        <DraggerContainer id={containerOneId} elementWidth={elementWidth}>
          {guestCards.map((card, index) => (
            <Dragger draggerId={card.id} index={index} containerId={containerOneId} size={elementWidth} key={card.id}>
              {(handleDragStart, dragged, draggerRef) => (
                <img
                ref={draggerRef}
                  onMouseDown={handleDragStart}
                  alt={card.name}
                  key={card.id}
                  style={{
                    width: elementWidth,
                    // transform: dragged ? "" : "rotate(30deg)",
                    // transition: "300ms"
                  }}
                  src={`./images/${card.image}.jpg`}
                  draggable="false"
                />
              )}
            </Dragger>
          ))}
        </DraggerContainer>
      </div>
      <div className="hand">
      {handCards.map((card, index) => (
        <Dragger draggerId={card.id} index={index} containerId={containerTwoId} size={elementWidth * 1.2} isOutsideContainer>
          {(handleDragStart, dragged, draggerRef) => (
            <img
              ref={draggerRef}
              alt={card.name}
              key={card.id}
              onMouseDown={handleDragStart}
              style={{
                position: "absolute",
                left: index * 30,
                width: elementWidth * 1.2,
                transform: dragged ? "" : `rotate(${10 * index - (handCards.length / 2 - 0.5) * 10}deg)`,
                transition: "300ms",
                zIndex: dragged ? 10: 0,
              }}
              src={`./images/${card.image}.jpg`}
              draggable="false"
            />
          )}
        </Dragger>
      ))}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div>
      <CardContainers />
      <Infos />
    </div>
  );
};
export default App;
