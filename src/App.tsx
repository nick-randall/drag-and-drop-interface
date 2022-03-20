import React, {  } from "react";
import Dragger from "./Dragger";
import DraggerContainer from "./DraggerContainer";
import "./App.css";
import Infos from "./Infos";
import Hand from "./Hand";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import SpecialsZone from "./SpecialsZone";

const CardContainers: React.FC = () => {
  const guestCards = useSelector((state: RootState) => state.snapshot.xxxy2);
  const elementWidth = 100;
  const containerOneId = "xxxy2";

  return (
    <div>
      <div style={{ position: "absolute", top: 300 }}>
      <SpecialsZone/>
      </div>
      <div style={{ left: 200, position: "absolute", top: 500 }}>
      
        <DraggerContainer id={containerOneId} elementWidth={elementWidth}>
          {guestCards.map((card, index) => (
            <Dragger draggerId={card.id} index={index} containerId={containerOneId} size={elementWidth} key={card.id}>
              {(handleDragStart, draggerRef) => (
                // <DropZoneWrapper id={card.id} providedIndex={index}>
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
                // </DropZoneWrapper>
              )}
            </Dragger>
          ))}
        </DraggerContainer>
        
        
        <Hand />
        {/* <div style={{left:100, top:300}}><DropZone/></div> */}
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
