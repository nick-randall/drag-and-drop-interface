import { useSelector } from "react-redux";
import Card from "./Card";
import Dragger from "./Dragger";
import DraggerContainer from "./DraggerContainer";
import { RootState } from "./store";

const SpecialsZone = () => {
  const containerThreeId = "xxxy3";

  const specialsCards = useSelector((state: RootState) => state.snapshot.xxxy3);
  const specialsCardsColumn0 = specialsCards.slice(0, 2);
  const specialsCardsColumn1 = specialsCards.slice(2, 4);
  const specialsCardsColumn2 = specialsCards.slice(4, 5);

  const specialsColumns = [specialsCardsColumn0, specialsCardsColumn1, specialsCardsColumn2];

  const elementWidth = 100;

  return (
    
      <DraggerContainer
        id={containerThreeId}
        elementWidth={elementWidth}
        // The draggerContainer for the specials columns
      >
        {specialsColumns.map((col, colIndex) => (
          <Dragger
            draggerId={"specialsColumn" + colIndex}
            index={colIndex}
            containerId={containerThreeId}
            size={elementWidth}
            key={"specialsColumn" + colIndex}
          >
            {(handleDragStart, draggerRef) => (
              <div style={{ position: "relative", width: elementWidth }}>
                {col.map((card, index) => (
                  <img
                    ref={draggerRef}
                    onMouseDown={handleDragStart}
                    alt={card.name}
                    key={card.id}
                    style={{
                      width: elementWidth,
                      position: "absolute",
                      top: index * 20,
                      left: 0,
                    }}
                    src={`./images/${card.image}.jpg`}
                    draggable="false"
                  />
                ))}
              </div>
            )}
          </Dragger>
        ))}
      </DraggerContainer>
  );
};

export default SpecialsZone;
