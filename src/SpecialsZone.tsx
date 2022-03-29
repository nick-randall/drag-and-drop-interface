import { useSelector } from "react-redux";
import Card from "./Card";
import Dragger from "./Dragger";
import DraggerContainer from "./DraggerContainer";
import { RootState } from "./store";
import * as R from "ramda";
const sortSpecials = (array: GameCard[]) => R.groupWith<GameCard>((a, b) => a.specialsCardType === b.specialsCardType, array);

const SpecialsZone = () => {
  const containerThreeId = "xxxy3";

  const specialsCards = useSelector((state: RootState) => state.snapshot.xxxy3);

  const elementWidth = 100;

  const specialsColumns = sortSpecials(specialsCards);

  const specialsIndexMap = specialsColumns.map(col => col.length);
  const specialsWidthMap = specialsColumns.map(e => 1);

  return (
    <DraggerContainer
      id={containerThreeId}
      elementWidth={elementWidth}
      numElementsAt={specialsIndexMap}
      elementWidthAt={specialsWidthMap}
      // The draggerContainer for the specials columns
    >
      {specialsColumns.map((col, colIndex) => (
        <Dragger
          draggerId={"specialsColumn" + colIndex}
          index={colIndex}
          containerId={containerThreeId}
          key={"specialsColumn" + colIndex}
          numElementsAt={specialsIndexMap}
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
                    border: "thin black solid",
                    borderRadius: 10,
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
