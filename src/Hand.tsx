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
    <div style={{ left: 200, position: "absolute", top: -300 }} onMouseMove={() => setSpread(120)} onMouseLeave={() => setSpread(30)}>
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
                width: elementWidth * 1.2,
                left: dragged ? 0 : spread * index,
                transform: dragged ? "" : `rotate(${10 * index - (handCards.length / 2 - 0.5) * 10}deg)`,
                transition: dragged ? "transform 300ms" : "left 300ms" ,
                zIndex: dragged ? 10: 0,
                // ...innerStyles
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
