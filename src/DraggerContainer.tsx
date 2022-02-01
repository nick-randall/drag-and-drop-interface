import React, { Children, Ref, useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import createSpecialsAndGuests from "./createGuests";
import { RootState } from "./store";
import { divide, flatten, pipe } from "ramda";


const usePrevious = (value: any) => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
interface ContainerProps {
  children: JSX.Element[];
  elementWidth: number;
  id: string;
}

const DraggerContainer = (props: ContainerProps) => {
  const { children, elementWidth, id } = props;
  const [draggedOverIndex, setDraggedOverIndex] = useState(-1);
  const [initialTransitionSuppressed, setInitialTransitionSuppressed] = useState(false);
  const dispatch = useDispatch()
  const containerRef: Ref<HTMLDivElement> = useRef(null);
  const draggedCardId = useSelector((state: RootState) => state).draggedCardId;
  const dragged = draggedCardId !== "";
  const draggedState = useSelector((state: RootState) => state.draggedState);
  const prevdraggedState = useRef(draggedState);

  const isRearrange = draggedState.source.containerId === id;

  const totalWidth = Children.count(children) * 50;

  const removeSourceIndex = (sourceIndex: number) => (array: any[]) => array.filter((_, index) => index !== sourceIndex);

  const cumulativeSum = (sum: number) => (value: number) => (sum += value);

  const getCumulativeSum = (indexArray: number[]) => indexArray.map(cumulativeSum(0));

  const addZeroAtFirstIndex = (indexArray: number[]) => [0].concat(indexArray);

  const curriedGetCardRowShape = (sourceIndex: number) => (indexArray: number[]) =>
    pipe(removeSourceIndex(sourceIndex), addZeroAtFirstIndex, getCumulativeSum)(indexArray);

  const getCardRowShape2 = (indexArray: number[]) => pipe(getCumulativeSum)(indexArray);

  const getRowShapeWithUpperLowerBounds = (indexArray: number[]): number[][] => indexArray.map(e => (e > 0 ? [e - 35, e + 15] : [0, 25]));

  const getCardRowShapeOnRearrange = (indexArray: number[], sourceIndex: number) => curriedGetCardRowShape(sourceIndex)(indexArray);

  const handleMouseOver = ({ clientX }: { clientX: number }) => {
    if (!dragged) return;
    const containerElement = containerRef.current;
    if (containerElement) {
      const { left: boundingBoxLeft, width: boundingBoxWidth } = containerElement.getBoundingClientRect();
      if (isRearrange) {
        const rowShape = getCardRowShape2(Children.map(children, child => child.props.size));
        const rowShapeWithUpperLowerBounds = getRowShapeWithUpperLowerBounds(
          rowShape
          //draggedState.index
        );

        const touchedX = clientX - boundingBoxLeft; //+ toRightOfdraggedStateOffset;

        const isInBounds = (breakPointsPair: number[]): boolean => {
          const lowerBound = breakPointsPair[0];
          const upperBound = breakPointsPair[1];
          return touchedX >= lowerBound && touchedX <= upperBound;
        };

        const findNewDraggedOverIndex = (breakPointsPairs: number[][]): number => {
          for (let i = 0; i < breakPointsPairs.length; i++) {
            if (isInBounds(breakPointsPairs[i])) return i;
            const lowerBound = breakPointsPairs[i][0];
            const upperBound = breakPointsPairs[i][1];
            if (i === 0) {
              if (isInBounds([0, lowerBound])) return 0;
            }
            if (i > 0) {
              const leftUpperBound = breakPointsPairs[i - 1][1];
              if (isInBounds([leftUpperBound, lowerBound])) return i - 1;
            }

            if (i < breakPointsPairs.length - 1) {
              const rightLowerBound = breakPointsPairs[i + 1][0];
              if (isInBounds([upperBound, rightLowerBound])) return i + 1;
            }
          }
          return -1;
        };
        const newDraggedOverIndex = findNewDraggedOverIndex(rowShapeWithUpperLowerBounds);

        if (draggedOverIndex !== newDraggedOverIndex && newDraggedOverIndex !== -1) {
          setDraggedOverIndex(newDraggedOverIndex);
          dispatch({type:"UPDATE_DRAG_DESTINATION"})
        }
      } else {
        const centerOfCard = elementWidth / 2;
        // If rearranging and element is to the right of sourceElement, compensate for missing element
        //const toRightOfdraggedStateOffset = isRearrange && draggedOverIndex > draggedState.index ? elementWidth : 0;
        const touchedX = clientX - boundingBoxLeft - centerOfCard; //+ toRightOfdraggedStateOffset;

        // could use totalWidth instead to not calculate based on query but rather on num elements * elementWidth
        let newDraggedOverIndex = Math.floor(touchedX / elementWidth);
        // if rearranging, remove sourcde index
        // if (draggedState.containerId === id && draggedState.index >= newDraggedOverIndex) newDraggedOverIndex--
        // if(draggedState.containerId === id && draggedState.index < newDraggedOverIndex) newDraggedOverIndex --
        //if (draggedState.containerId === id && draggedState.index === newDraggedOverIndex) newDraggedOverIndex --

        if (draggedOverIndex !== newDraggedOverIndex) setDraggedOverIndex(newDraggedOverIndex);
      }
    }
  };
  //console.log(Children.map(children, child => child.props.draggerId));

  const isFirstClick = prevdraggedState.current.source.containerId === "" && isRearrange;

  useEffect(() => {
    if (isFirstClick) {
      //setInitialTransitionSuppressed(false);
      setDraggedOverIndex(draggedState.source.index);
    }
  }, [draggedState.source.index, isFirstClick, initialTransitionSuppressed]);

  // useEffect(() => {
  //   if (draggedState.index === -1) {
  //     setDraggedOverIndex(-1);
  //   }
  // })

  useEffect(() => {
    // currently does nothing
    if (prevdraggedState.current.source.containerId === "" && isRearrange) {
      setInitialTransitionSuppressed(true);
    }
  }, [draggedState, isRearrange]);

  console.log(prevdraggedState.current.source.containerId, " prevdraggedState container id")

  const figureOutWhetherToExpand = (index: number) => {
    if (!isRearrange) {
      if (draggedOverIndex !== -1) {
        return draggedOverIndex === index ? elementWidth : 0;
      }
    } else if (isRearrange) {
      //if(initialTransitionSuppressed)
      if (draggedOverIndex !== -1) {
        // The element directly to the left of the dragged card provides expansion for it
        if (draggedOverIndex === index - 1 && draggedState.source.index === draggedOverIndex) return elementWidth;
        // Other elements to the left behave normally
        if (index < draggedState.source.index) return draggedOverIndex === index ? elementWidth : 0;
        // Elements to the right of the dragged card expand one card early to compensate for the missing dragged card.
        if (index > draggedState.source.index && index === draggedOverIndex + 1) return elementWidth;
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
      onMouseMove={handleMouseOver}
    >
      {/* {rowShape.map((b, i) => (
        <div>
          <div style={{ width: 1, height: 150, backgroundColor: "red", position: "absolute", left: b[0], zIndex: 10 }}>{b[0]}</div>
          <div style={{ width: 1, height: 150, backgroundColor: "blue", position: "absolute", left: b[1], zIndex: 10 }}>{b[i]}</div>
        </div>
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
              height: 150,
              // This code fixes jumpiness for cards to the right of source card
              // transition: draggedOverIndex === index - 1 && draggedState.index === draggedOverIndex ? "" : "140ms ease",
              transition: //(prevdraggedState.current.source.containerId === "" && isRearrange) ? "" : 
              "140ms ease",
              transitionDelay: //(prevdraggedState.current.source.containerId === "" && isRearrange) ? "" : 
              "60ms",
              //   backgroundColor:
              //     isRearrange && draggedOverIndex === index - 1 && draggedOverIndex !== -1 && draggedState.index === draggedOverIndex
              //       ? "blue"
              //       : "transparent",
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
