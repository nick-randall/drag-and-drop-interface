import React, { CSSProperties, useState } from "react";
import Dragger from "./Dragger";
import CustomDraggable from "./Dragger";
// import { CardInspector } from "./renderPropsComponents/CardInspector";
import GhostCard from "./GhostCard";
// import { TransitionHandler } from "./renderPropsComponents/TransitionHandler";

export interface CardProps {
  id: string;
  index: number;
  image: string;
  dimensions: AllDimensions;
  offsetLeft?: number;
  offsetTop?: number;
  //cardGroupIndex: number;
  showNotAmongHighlights?: boolean;
  containerId: string
}

const Card = (props: CardProps) => {
  const { id, index, dimensions, offsetTop, offsetLeft, image } = props;
  const { tableCardzIndex, cardLeftSpread, cardHeight, cardWidth } = dimensions;

  // const highlights = useSelector((state: RootState) => state.highlights);
  // const highlightTypeIsCard = useSelector((state: RootState) => state.highlightType === "card");

  // const BFFDraggedOverSide = useSelector((state: RootState) => state.BFFdraggedOverSide);
  // const draggedOver = useSelector((state: RootState) => state.dragUpdate.droppableId === id);
  // const draggedHandCard = useSelector((state: RootState) => state.draggedHandCard);

  // const ghostCard = draggedHandCard && draggedOver ? draggedHandCard : undefined;
  // const BFFOffset = !BFFDraggedOverSide ? 0 : BFFDraggedOverSide === "left" ? -0.5 : 0.5;
  // const notAmongHighlights = (highlightTypeIsCard && !highlights.includes(id)) || props.showNotAmongHighlights;

  const normalStyles: CSSProperties = {
    zIndex: tableCardzIndex,
    width: cardWidth,
    height: cardHeight,
    position: "absolute",
    transition: "300ms",
    // transitionDelay: "150ms",
    userSelect: "none",
  };

  

  return (
    <Dragger draggerId={id} index={index} containerId={props.containerId} size={dimensions.cardWidth}>
      {ref => (
        <div>
          <div ref={ref}>
            <img
              // ref={provided.innerRef}
              // {...provided.droppableProps}
              alt={image}
              draggable="false"
              src={`./images/${image}.jpg`}
              //onClick={handleClick}
              //onMouseLeave={handleMouseLeave}
              id={id}
              style={{
            //    WebkitFilter: notAmongHighlights ? "grayscale(100%)" : "",
                boxShadow: "2px 2px 2px black",
                transition: "box-shadow 180ms",
                ...normalStyles,
              }}
            />
          </div>

          {/* {ghostCard ? (
            <GhostCard
              index={0}
              offsetLeft={cardLeftSpread * BFFOffset}
              offsetTop={cardHeight / 2}
              image={ghostCard.image}
              dimensions={dimensions}
              zIndex={5}
            />
          ) : null} */}
          {/* {provided.placeholder} */}
        </div>
      )}
    </Dragger>
  );
};
export default Card;
