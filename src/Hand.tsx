import { useState } from "react";
import createSpecialsAndGuests from "./createGuests";
import Dragger from "./Dragger";
const containerTwoId = "xxxy1";
const elementWidth = 100;

const handCards: GameCard[] = createSpecialsAndGuests().slice(8, 15);
// eslint-disable-next-line react-hooks/rules-of-hooks

const Hand:React.FC = () => {
  const [spread, setSpread] = useState(30);
  return (
    <div style={{ left: 200, position: "absolute", top: -300 }} >
      {handCards.map((card, index) => (
        <Dragger draggerId={card.id} index={index} containerId={containerTwoId} size={elementWidth * 1.2} isOutsideContainer>
          {(handleDragStart, draggerRef, dragged) => (
            <img
              ref={draggerRef}
              alt={card.name}
              key={card.id}
              onMouseDown={handleDragStart}
              onMouseMove={() => setSpread(120)} onMouseLeave={() => setSpread(30)}
              style={{
                position: "absolute",
                width: elementWidth * 1.2,
                // Since the Dragger wrapper sets the correct left property when dragged, here we just have no left
                // when the element is dragged
                left: dragged ? "" : spread * index - (spread * handCards.length / 2),
                transform: dragged ? "" : `rotate(${10 * index - (handCards.length / 2 - 0.5) * 10}deg)`,
                transition: dragged ? "transform 300ms" : "left 300ms" ,
                zIndex: dragged ? 10: 0,
              }}
              src={`./images/${card.image}.jpg`}
              draggable="false"
            />
          )}
        </Dragger>
      ))}
    </div>
  );
};

export default Hand;
