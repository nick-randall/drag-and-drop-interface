import { useState } from "react";
import { useSelector } from "react-redux";
import Dragger from "./Dragger";
import { NoLayoutDragContainer } from "./NoLayoutDragContainer";
import { RootState } from "./store";
const containerTwoId = "xxxy1";
const elementWidth = 100;

// const handCards: GameCard[] = createSpecialsAndGuests().slice(8, 15);
// eslint-disable-next-line react-hooks/rules-of-hooks

const Hand: React.FC = () => {
  const handCards = useSelector((state: RootState) => state.snapshot.xxxy1)
  const [spread, setSpread] = useState(30);
  return (
    <div
      style={{
        left: 200,
        position: "absolute",
        top: -400,
        width: (handCards.length * spread) / 2,
        paddingLeft: (handCards.length * spread) / 2,
        marginLeft: (-handCards.length * spread) / 2,
        height: elementWidth * 2, // should be width
        // border: "thin black solid",
        // display:"flex"
      }}
      onMouseOver={() => setSpread(120)}
      onMouseOut={() => setSpread(30)}
    >
     <NoLayoutDragContainer>
        {handCards.map((card, index) => (
          <Dragger draggerId={card.id} index={index} containerId={containerTwoId} isOutsideContainer>
            {(handleDragStart, draggerRef, dragged) => (
              <img
                ref={draggerRef}
                alt={card.name}
                key={card.id}
                onMouseDown={handleDragStart}
                style={{
                  position: "absolute",
                  width: elementWidth * 1.2,
                  // Since the Dragger wrapper sets the correct left property when dragged,
                  // here we just have no left property when the element is dragged
                  left: dragged ? "" : spread * index - (spread * handCards.length) / 2,
                  transform: dragged ? "" : `rotate(${10 * index - (handCards.length / 2 - 0.5) * 10}deg)`,
                  transition: dragged ? "transform 300ms" : "left 300ms",
                  zIndex: dragged ? 10 : 0,
                }}
                src={`./images/${card.image}.jpg`}
                draggable="false"
              />
            )}
          </Dragger>
        ))}
      </NoLayoutDragContainer>
    </div>
  );
};

export default Hand;
