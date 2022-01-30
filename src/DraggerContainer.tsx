import React, { Children, Ref, useEffect, useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import createSpecialsAndGuests from "./createGuests";
import { RootState } from "./store";
import { divide, pipe } from "ramda";

interface ContainerProps {
  children: JSX.Element[];
  elementWidth: number;
  id: string;
}

const DraggerContainer = (props: ContainerProps) => {
  const { children, elementWidth, id } = props;
  const [draggedOverIndex, setDraggedOverIndex] = useState(-1);
  const [rowShape, setRowShape] = useState<number[]>([]);
  const containerRef: Ref<HTMLDivElement> = useRef(null);
  const draggedCardId = useSelector((state: RootState) => state).draggedCardId;
  const dragged = draggedCardId !== "";
  const draggedSource = useSelector((state: RootState) => state.draggedCardSource);

  const isRearrange = draggedSource.containerId === id;

  const totalWidth = Children.count(children) * 50;

  const removeSourceIndex = (sourceIndex: number) => (array: any[]) => array.filter((_, index) => index !== sourceIndex);

  const cumulativeSum = (sum: number) => (value: number) => (sum += value);

  const getCumulativeSum = (indexArray: number[]) => indexArray.map(cumulativeSum(0));

  const addZeroAtFirstIndex = (indexArray: number[]) => [0].concat(indexArray);

  const curriedGetCardRowShape = (sourceIndex: number) => (indexArray: number[]) =>
    pipe(removeSourceIndex(sourceIndex), addZeroAtFirstIndex, getCumulativeSum)(indexArray);

  const getCardRowShape2 = (indexArray: number[]) => pipe(addZeroAtFirstIndex, getCumulativeSum)(indexArray);

  //const getCardRowShapeOnRearrange2 = (indexArray: number[]) => curriedGetCardRowShape(indexArray);

  const tweakRowBreakPoints = (indexArray: number[], sourceIndex: number) =>
    indexArray.map((e, i) => (i > sourceIndex ? e - elementWidth / 2 : e + elementWidth / 2));

  const getCardRowShapeOnRearrange = (indexArray: number[], sourceIndex: number) => curriedGetCardRowShape(sourceIndex)(indexArray);

  const handleMouseOver = ({ clientX }: { clientX: number }) => {
    if (!dragged) return;
    const containerElement = containerRef.current;
    if (containerElement) {
      const { left: boundingBoxLeft, width: boundingBoxWidth } = containerElement.getBoundingClientRect();
      if (isRearrange) {
        const rowShapee = getCardRowShape2(
          Children.map(children, child => child.props.size)
          //draggedSource.index
        );
        const tweakedRowShape = tweakRowBreakPoints(rowShapee, draggedSource.index);
        setRowShape(rowShapee);

        const centerOfCard = elementWidth / 2;
        const touchedX = clientX - boundingBoxLeft; //+ toRightOfDraggedSourceOffset;
        
        const earlyMoveOffset = elementWidth / 4

        if (Math.floor((touchedX - earlyMoveOffset) / elementWidth) < draggedOverIndex) {
          setDraggedOverIndex(Math.floor((touchedX - earlyMoveOffset)/ elementWidth));
        } else if (Math.floor((touchedX + earlyMoveOffset) / elementWidth) > draggedOverIndex) {
          setDraggedOverIndex(Math.floor((touchedX + earlyMoveOffset) / elementWidth));
        }
        const newDraggedOverIndex = rowShape.indexOf(rowShape.reduce((prev, curr) => (clientX - boundingBoxLeft < curr ? prev : curr), 0));

        //if (draggedOverIndex !== newDraggedOverIndex) setDraggedOverIndex(newDraggedOverIndex);
      } else {
        const centerOfCard = elementWidth / 2;
        // If rearranging and element is to the right of sourceElement, compensate for missing element
        //const toRightOfDraggedSourceOffset = isRearrange && draggedOverIndex > draggedSource.index ? elementWidth : 0;
        const touchedX = clientX - boundingBoxLeft - centerOfCard; //+ toRightOfDraggedSourceOffset;

        // could use totalWidth instead to not calculate based on query but rather on num elements * elementWidth
        let newDraggedOverIndex = Math.floor(touchedX / elementWidth);
        // if rearranging, remove sourcde index
        // if (draggedSource.containerId === id && draggedSource.index >= newDraggedOverIndex) newDraggedOverIndex--
        // if(draggedSource.containerId === id && draggedSource.index < newDraggedOverIndex) newDraggedOverIndex --
        //if (draggedSource.containerId === id && draggedSource.index === newDraggedOverIndex) newDraggedOverIndex --

        if (draggedOverIndex !== newDraggedOverIndex) setDraggedOverIndex(newDraggedOverIndex);
      }
    }
  };
  //console.log(Children.map(children, child => child.props.draggerId));

  useEffect(() => {
    setDraggedOverIndex(draggedSource.index);
  }, [draggedSource]);

  const figureOutWhetherToExpand = (index: number) => {
    if (!isRearrange) {
      if (draggedOverIndex !== -1) {
        return draggedOverIndex === index ? elementWidth : 0;
      }
    } else if (isRearrange) {
      if (draggedOverIndex !== -1) {
        // The element directly to the left of the dragged card provides expansion for it
        if (draggedOverIndex === index - 1 && draggedSource.index === draggedOverIndex) return elementWidth;
        // Other elements to the left behave normally
        if (index < draggedSource.index) return draggedOverIndex === index ? elementWidth : 0;
        // Elements to the right of the dragged card expand one card early to compensate for the missing dragged card.
        if (index > draggedSource.index && index === draggedOverIndex + 1) return elementWidth;
      }
    }
    // index one below dragSource expands to make up for missing dragged card
    return 0;
  };

  return (
    <div
      // this is the container of all draggers
      ref={containerRef}
      style={{
        display: "flex",
      }}
      onMouseOver={handleMouseOver}
    >
      {/* {rowShape.map((b, i) => (
        <div style={{ width: 1, height: 150, backgroundColor: "red", position: "absolute", left: b, zIndex: 10 }}>{i}</div>
      ))} */}
      {Children.map(children, (child: JSX.Element, index) => (
        <div
          // This is the container of dragger plus placeholder.
          style={{
            display: "flex",
            position: child.props.draggerId === draggedCardId ? "absolute" : undefined,
          }}
          draggable="false"
        >
          <div
            // This is the placeholder (ghost card comes in here)
            // This code causes card before draggedCard to left to expand
            style={{
              width: figureOutWhetherToExpand(index),
              // draggedOverIndex === index
              // ||
              // // index one below dragSource expands to make up for missing dragged card
              // (isRearrange && draggedOverIndex === index - 1 && draggedOverIndex !== -1 && draggedSource.index === draggedOverIndex)
              //   ? elementWidth
              //   : 0,
              height: 100,
              // This code fixes jumpiness for cards to the right of source card
              // transition: draggedOverIndex === index - 1 && draggedSource.index === draggedOverIndex ? "" : "140ms ease",
              transition: "140ms ease",
              transitionDelay: "60ms",
              border: "thin black solid",
              backgroundColor:
                isRearrange && draggedOverIndex === index - 1 && draggedOverIndex !== -1 && draggedSource.index === draggedOverIndex
                  ? "blue"
                  : "transparent",
            }}
            draggable="false"
          />

          {child}
        </div>
      ))}
      {draggedOverIndex}
    </div>
  );
};

export default DraggerContainer;
