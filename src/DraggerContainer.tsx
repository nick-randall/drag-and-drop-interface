import React, { Children, Ref, useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import createSpecialsAndGuests from "./createGuests";
import { RootState } from "./store";

interface ContainerProps {
  children: JSX.Element[];
  elementWidth: number;
  id: string;
}

const DraggerContainer = (props: ContainerProps) => {
  const { children, elementWidth } = props;
  const [draggedOverIndex, setDraggedOverIndex] = useState(-1);
  const containerRef: Ref<HTMLDivElement> = useRef(null);
  const draggedCard = useSelector((state: RootState) => state).draggedCardId;
  const dragged = draggedCard !== "";

  const totalWidth = Children.count(children) * 50;
  // console.log(Children.map(children, child => child.props.draggerId === draggedCard))

  const handleMouseOver = ({ clientX }: { clientX: number }) => {
    if (!dragged) return;
    const containerElement = containerRef.current;
    if (containerElement) {
      const { left: boundingBoxLeft, width: boundingBoxWidth } = containerElement.getBoundingClientRect();
      const centerOfCard = elementWidth / 2;
      const touchedX = clientX - boundingBoxLeft;

      // could use totalWidth instead to not calculate based on query but rather on num elements * elementWidth
      const newDraggedOverIndex = Math.floor(touchedX / elementWidth);
      if (draggedOverIndex !== newDraggedOverIndex) setDraggedOverIndex(newDraggedOverIndex);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        //flexDirection: "row",
        // border: "thin black solid",
      }}
      onMouseOver={handleMouseOver}
    >
      {Children.map(children, (child, index) => (
        <div
          style={{
            display: "flex",
            //position: "relative",
            transform: draggedCard === child.props.draggerId ? `transformX(${-1}px)` : `transformX(${-elementWidth}px)`,
          }}
        >
          <div
            // This is the placeholder (ghost card comes in here)
            style={{
              width: draggedOverIndex === index && dragged? elementWidth : 0,
              
              height: 100,
              position: "relative",
              transition: "140ms ease",
              transitionDelay: "60ms",
            }}
          />
          {child}
        </div>
      ))}
    </div>
  );
};

export default DraggerContainer;
