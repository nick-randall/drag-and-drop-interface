import React, { useEffect, useState } from "react";
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
  const draggedId = useSelector((state: RootState) => state.draggedId);
  const draggedCard = useSelector(
    (state: RootState) => state.snapshot.xxxy1.find(card => card.id === draggedId) ?? state.snapshot.xxxy2.find(card => card.id === draggedId)
  );
  const elementWidth = 100;
  const containerOneId = "xxxy2";

  const [indexMap, setIndexMap] = useState<number[]>([]);

  useEffect(() => {
    if (indexMap.length === 0) {
      const newIndexMap = guestCards.map(c => (Math.floor(Math.random() + 0.5) === 1 ? 2 : 1));
      setIndexMap(newIndexMap);
    }
  }, [guestCards, indexMap.length]);

  const isGCZHighlighted = draggedCard?.cardType === "guest";

  const isGuestsHighlighted = draggedCard?.action.actionType === "enchant" || draggedCard?.action.actionType === "enchantWithBff";

  return (
    <div>
      <div style={{ position: "absolute", top: 300, left: 600 }}>
        <SpecialsZone />
      </div>
      <div style={{ left: 200, position: "absolute", top: 500 }}>
        <DraggerContainer
          id={containerOneId}
          elementWidth={elementWidth}
          numElementsAt={indexMap}
          elementWidthAt={indexMap}
          isDropDisabled={!isGCZHighlighted}
          containerStyles={
            isGCZHighlighted
              ? {
                  backgroundColor: "greenyellow",
                  boxShadow: "0px 0px 30px 30px yellowgreen",
                  transition: "background-color 180ms, box-shadow 180ms, left 180ms",
                }
              : {}
          }
        >
          {guestCards.map((card, index) => (
            <Dragger draggerId={card.id} index={index} containerId={containerOneId} key={card.id} numElementsAt={indexMap} >
              {(handleDragStart, draggerRef) => (
                <div ref={draggerRef}>
                  <DropZoneWrapper id={card.id} providedIndex={index} isDropDisabled={!isGuestsHighlighted}>
                    {isDraggingOver => (
                      <img
                        onMouseDown={handleDragStart}
                        alt={card.name}
                        key={card.id}
                        style={{
                          transition: "background-color 180ms, box-shadow 180ms, left 180ms",

                          width: indexMap[index] * elementWidth,
                          backgroundColor: isDraggingOver ? "greenyellow" : "",
                          boxShadow: isDraggingOver ? "0px 0px 30px 30px yellowgreen" : "",
                        }}
                        src={`./images/${card.image}.jpg`}
                        draggable="false"
                      />
                    )}
                  </DropZoneWrapper>
                </div>
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
