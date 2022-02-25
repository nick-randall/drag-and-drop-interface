import React, { CSSProperties, useState } from "react";
import createSpecialsAndGuests from "./createGuests";
import Dragger from "./Dragger";
import DraggerContainer from "./DraggerContainer";
import "./App.css";
import Infos from "./Infos";
import Hand from "./Hand";
import { useSelector } from "react-redux";
import { RootState } from "./store";

const CardContainers: React.FC = () => {
  const guestCards = useSelector((state: RootState) => state.snapshot.xxxy2)
  const [randomCard]: GameCard[] = createSpecialsAndGuests().slice(0, 1);
  const elementWidth = 100;
  // console.log(guestCards);
  const containerOneId = "xxxy2";
 
  return (
    <div>
      <div style={{ left: 200, position: "absolute", top: 500 }}>
        <DraggerContainer id={containerOneId} elementWidth={elementWidth}>
          {guestCards.map((card, index) => (
            <Dragger draggerId={card.id} index={index} containerId={containerOneId} size={elementWidth} key={card.id}>
              {(handleDragStart, draggerRef) => (
                <img
                  ref={draggerRef}
                  onMouseDown={handleDragStart}
                  alt={card.name}
                  key={card.id}
                  style={{
                    width: elementWidth,
                  }}
                  src={`./images/${card.image}.jpg`}
                  draggable="false"
                />
              )}
            </Dragger>
          ))}
        </DraggerContainer>
        <Hand />
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
