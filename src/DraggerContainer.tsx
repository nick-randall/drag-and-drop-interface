import React, { Children, Ref, useRef } from "react";
import { useState } from "react";
import createSpecialsAndGuests from "./createGuests";

interface ContainerProps {
  children: JSX.Element[];
  elementWidth: number;
  id: string;
}

const DraggerContainer = (props: ContainerProps) => {
  const { children, elementWidth } = props;
  const [draggedOverIndex, setDraggedOverIndex] = useState(-1);
  const [touchedX, setTouchedX] = useState(0);
  const containerRef: Ref<HTMLDivElement> = useRef(null);

  const totalWidth = Children.count(children) * 50;
  console.log(totalWidth);

  const handleMouseOver = ({ clientX }: { clientX: number }) => {
    console.log(clientX);
    const containerElement = containerRef.current;
    if (containerElement) {
      const { left: boundingBoxLeft, width: boundingBoxWidth } = containerElement.getBoundingClientRect();
      const centerOfCard = elementWidth / 2;
      const touchedX = clientX - boundingBoxLeft;
      setTouchedX(touchedX);

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
          }}
        >
          <div
          // This is the placeholder (ghost card comes in here)
            style={{
              width: draggedOverIndex === index ? elementWidth : 0,
              height: 100,
              position: "relative",
              transition: "140ms ease"
              // border: "thin dotted red",
            }}
          />
          {child}
        </div>
      ))}
      {touchedX}
    </div>
  );
};

export default DraggerContainer;
