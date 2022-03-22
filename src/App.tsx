import React from "react";
import Dragger from "./Dragger";
import DraggerContainer from "./DraggerContainer";
import "./App.css";
import Infos from "./Infos";
import Hand from "./Hand";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import SpecialsZone from "./SpecialsZone";
import DropZoneWrapper from "./DropZoneWrapper";

const CardContainers: React.FC = () => {
  const guestCards = useSelector((state: RootState) => state.snapshot.xxxy2);
  const draggedId = useSelector((state: RootState) => state.draggedId)
  const draggedCard = useSelector((state: RootState) => state.snapshot.xxxy1.find(card => card.id === draggedId) ?? state.snapshot.xxxy2.find(card => card.id === draggedId));
  const elementWidth = 100;
  const containerOneId = "xxxy2";

  const indexMap = [2, 1, 1, 2, 1, 1, 1];

  const isGCZHighlighted = draggedCard?.cardType === "guest"

  const isGuestsHighlighted = draggedCard?.action.actionType === "enchant" || draggedCard?.action.actionType === "enchantWithBff"

  return (
    <div>
      <div style={{ position: "absolute", top: 300, left: 600 }}>
        <SpecialsZone />
      </div>
      <div style={{ left: 200, position: "absolute", top: 500 }}>
        <DraggerContainer id={containerOneId} elementWidth={elementWidth} indexMap={indexMap} isDropDisabled={!isGCZHighlighted}
        // highlightStyle={isGCZHighlighted ? {backgroundColor: "greenyellow", boxShadow:"20px 20px 20px 2px yellowgreen", height: elementWidth*2}:{}}
        >
          {guestCards.map((card, index) => (
            <Dragger draggerId={card.id} index={index} containerId={containerOneId} key={card.id}>
              {(handleDragStart, draggerRef) => (
                <DropZoneWrapper id={card.id} providedIndex={index} isDropDisabled={!isGuestsHighlighted}>
                <img
                  ref={draggerRef}
                  onMouseDown={handleDragStart}
                  alt={card.name}
                  key={card.id}
                  style={{
                    width: indexMap[index] * elementWidth,
                  }}
                  src={`./images/${card.image}.jpg`}
                  draggable="false"
                />
                </DropZoneWrapper>
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
