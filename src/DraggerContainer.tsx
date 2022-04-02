import { pipe } from "ramda";
import React, { CSSProperties, Ref, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { dragUpateThunk } from "./dragEventThunks";
import {
  addZeroAtFirstIndex,
  getCumulativeSum,
  draggedOverindexToMapped,
  draggedOverindexFromMapped,
  findNewDraggedOverIndex,
  indexFromMapped,
  removeSourceIndex,
} from "./dragEventHelperFunctions";
import { RootState } from "./store";

const usePrevious = (value: any) => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

interface ComponentReduxProps {
  draggedId?: string;
  draggedOverIndex?: number;
  sourceIndex: number;
  isRearrange: boolean;
  isDraggingOver?: boolean;
  expandAbove: number;
  expandBelow: number;
  expandLeft: number;
  expandRight: number;
  distFromLeftMap: number[];
  placeHolder?: JSX.Element;
}
type DraggerContainerProps = {
  // children: React.FC<DraggerProps>[];
  children: JSX.Element[];
  elementWidth: number;
  id: string;
  isLayoutDisabled?: boolean;
  isDropDisabled?: boolean;
  /**
   *  The index map is an array of the number of elements
   *  in each index. Using it allows returning meaningful indexes
   *  from elements that are stacked on top of one another, for example.
   *  eg. [1, 1, 3, 4]
   */

  numElementsAt: number[];
  /** The width map is an array of the width of each elemnt */
  elementWidthAt?: number[];
  containerStyles?: CSSProperties;
};
type ComponentProps = ComponentReduxProps & DraggerContainerProps;

// This Component has several jobs:
// 1. It listens to dragEvents and updates the redux dragState (draggedOverIndex and draggedOVerId)
// 2. It moves its children around to give the user feedback about where they are placing the dragged item
// 3. to improve UX, it expands a hidden box so that dragEvents can be detected based on the dragged item position,
// NOT based only on the mouse position

const DraggerContainer: React.FC<ComponentProps> = ({
  children,
  elementWidth,
  id,
  draggedId,
  draggedOverIndex,
  sourceIndex,
  isRearrange,
  distFromLeftMap,
  expandAbove,
  expandBelow,
  expandLeft,
  expandRight,
  isLayoutDisabled = false,
  isDraggingOver,
  isDropDisabled = false,
  numElementsAt,
  elementWidthAt = numElementsAt,
  placeHolder,
  containerStyles,
}) => {
  const dispatch = useDispatch();
  const [breakPoints, setBreakPoints] = useState<number[][]>([]);
  const containerRef: Ref<HTMLDivElement> = useRef(null);
  const dragged = draggedId !== undefined;
  const isInitialRearrange = usePrevious(draggedId) === undefined && draggedId !== undefined;

  console.log(distFromLeftMap);
  console.log(draggedOverIndex);
  console.log(distFromLeftMap[draggedOverIndex ?? 0]);

  useEffect(() => {
    if (!draggedOverIndex) setBreakPoints([]);
  }, [draggedOverIndex]);

  const handleMouseMove = ({ clientX }: { clientX: number }) => {
    if (!dragged) return;
    if (isDropDisabled) return;
    let newDraggedOverIndex = 0;

    const containerElement = containerRef.current;
    if (containerElement) {
      const { left: boundingBoxLeft } = containerElement.getBoundingClientRect();
      const touchedX = clientX - boundingBoxLeft;

      // Set rowShape if this is the first time the container is being dragged over
      // rowShape is an array of breakpoint pairs.
      if (breakPoints.length === 0) {
        let newBreakPoints: any[] = [];

        const insetFromElementEdgeFactor = 0.15;
        for (let i = 0; i < distFromLeftMap.length; i++) {
          // let insetFromElementEdge = elementWidthAt[i] * insetFromElementEdgeFactor;
          // // Adding the final value as the width of the final element
          // if (!insetFromElementEdge) insetFromElementEdge = elementWidthAt[i - 1] * insetFromElementEdgeFactor;

          let left = distFromLeftMap[i];
          let right = distFromLeftMap[i + 1];
          // if(i === sourceIndex){
          //   left -=  1
          //   right += 1
          // }

          left = left * elementWidth + elementWidth * insetFromElementEdgeFactor + expandLeft; //* insetFromElementEdgeFactor; // / left;
          right = right * elementWidth - elementWidth * insetFromElementEdgeFactor - expandRight; //* insetFromElementEdgeFactor; // / right;
          if (!right) right = Infinity;

          if (i === 0) newBreakPoints.push([0, right]);
          else newBreakPoints.push([left, right]);
        }
        setBreakPoints(newBreakPoints);
        newDraggedOverIndex = findNewDraggedOverIndex(newBreakPoints, touchedX);
      } else {
        newDraggedOverIndex = findNewDraggedOverIndex(breakPoints, touchedX);
      }
      if (draggedOverIndex !== newDraggedOverIndex) {
        newDraggedOverIndex = draggedOverindexToMapped(newDraggedOverIndex, numElementsAt, isRearrange, sourceIndex);
        dispatch(dragUpateThunk({ index: newDraggedOverIndex, containerId: id }));
      }
    }
  };

  const handleMouseLeave = () => {
    if (isDraggingOver) {
      dispatch(dragUpateThunk(undefined));
      setBreakPoints([]);
    }
  };
  const draggedElementWidth = isRearrange ? elementWidthAt[sourceIndex] * elementWidth : elementWidth;
  const figureOutWhetherToExpand = (index: number) => {
    if (!isRearrange && draggedOverIndex !== undefined) {
      return draggedOverIndex === index ? elementWidth : 0;
    }

    if (draggedOverIndex !== undefined && sourceIndex !== undefined) {
      // The element directly to the left of the dragged card provides expansion for it
      if (draggedOverIndex === index - 1 && draggedOverIndex === sourceIndex - 1) return draggedElementWidth;
      // Other elements to the left behave normally
      if (index < sourceIndex) return draggedOverIndex === index ? draggedElementWidth : 0;
      // Elements to the right of the dragged card expand one card early to compensate for the missing dragged card.
      if (index > sourceIndex && index === draggedOverIndex + 1) return draggedElementWidth;
    }
    return 0;
  };

  const figureOutWhetherToExpandFinal = () => {
    const finalIndex = isRearrange ? elementWidthAt.length - 1 : elementWidthAt.length;
    if (draggedOverIndex === finalIndex) {
      return draggedElementWidth;
    } else return 0;
  };

  return (
    <div
      // this container listens for mouse events
      ref={containerRef}
      style={{
        position: "absolute",
        paddingTop: isDropDisabled ? 0 : expandAbove,
        marginTop: isDropDisabled ? 0 : -expandAbove,
        paddingBottom: isDropDisabled ? 0 : expandBelow,
        marginBottom: isDropDisabled ? 0 : -expandBelow,
        // Allows dragOver listener to trigger when on the right side of the DraggerContainer
        paddingRight: elementWidth,
        marginRight: elementWidth,
        width: elementWidthAt.reduce((prev, curr) => prev + curr, 0) * elementWidth,
        // height: 200,
        // backgroundColor: "black",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* {breakPoints.map(e => (
        <div>
          <div style={{ height: 150, width: 1, backgroundColor: "blue", left: e[0], position: "absolute", zIndex: 100 }}> {e[0]}</div>
          <div style={{ height: 150, width: 1, backgroundColor: "red", left: e[1], position: "absolute", zIndex: 100 }}> {e[1]}</div>
        </div>
      ))} */}
      <div
        style={{ position: "absolute", display: isLayoutDisabled ? "block" : "flex", ...containerStyles }}
        // This is the container of all draggers
      >
        {children.map((child, index) => (
          <div
            key={id + "-container-" + index}
            // This is the container of dragger plus placeholder.
            style={{
              display: "flex",
              position: child.props.draggerId === draggedId ? "absolute" : undefined,
            }}
            draggable="false"
          >
            <div
              // This is the placeholder (ghost card comes in here)
              // This code causes card before dragged element to left to expand
              style={{
                width: figureOutWhetherToExpand(index),
                // height: 150,
                // Suppress transition if this is the first time an element is being dragged in this container
                // transition: isInitialRearrange || isDragEnd ? "" : "200ms ease",
                transition: isInitialRearrange ? "" : "200ms ease",

                // transitionDelay: "120ms"
              }}
              draggable="false"
            />

            {child}
          </div>
        ))}
        <div
          // Far-right of container, expands for new cards
          style={{
            width: figureOutWhetherToExpandFinal(),
            height: 150,
            // Suppress transition if this is the first time an element is being dragged in this container
            // transition: isInitialRearrange || isDragEnd ? "" : "200ms ease",
            transition: isInitialRearrange ? "" : "200ms ease",

            // transitionDelay: "120ms"
          }}
          draggable="false"
        />
        {draggedOverIndex !== undefined && (
          <div style={{ position: "absolute", left: distFromLeftMap[draggedOverIndex] * elementWidth, transition: "200ms ease" }}>{placeHolder}</div>
        )}
        {draggedOverIndex}
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState, ownProps: DraggerContainerProps) => {
  const { draggedState, draggedId, dragContainerExpand } = state;
  const { numElementsAt, elementWidthAt } = ownProps;
  let draggedOverIndex,
    sourceIndex = 0,
    isRearrange = false,
    isDraggingOver = undefined;
  // Assign sourceIndex as local prop and check if rearranging
  if (draggedState.source) {
    sourceIndex = draggedState.source.index;
    sourceIndex = numElementsAt !== undefined ? indexFromMapped(numElementsAt, sourceIndex) : sourceIndex;
    isRearrange = draggedState.source.containerId === ownProps.id;
  }
  // Assign draggedOverIndex as local prop and check if draggingOver
  if (draggedState.destination) {
    isDraggingOver = draggedState.destination.containerId === ownProps.id;

    // Set draggedOverIndex based on the DragContainer's numElementsAt and whether it is a rearrange
    if (isDraggingOver) draggedOverIndex = draggedOverindexFromMapped(draggedState.destination.index, numElementsAt, sourceIndex, isRearrange);
  }

  const distFromLeftMap = isRearrange
    ? pipe(removeSourceIndex(sourceIndex), addZeroAtFirstIndex, getCumulativeSum)(elementWidthAt ?? numElementsAt)
    : pipe(addZeroAtFirstIndex, getCumulativeSum)(elementWidthAt ?? numElementsAt);
  let expandAbove = 0;
  let expandBelow = 0;
  let expandLeft = 0;
  let expandRight = 0;
  if (dragContainerExpand.height > 0) {
    expandAbove = dragContainerExpand.height * 2;
  } else {
    expandBelow = dragContainerExpand.height * -2;
  }
  // Left and right expand not implemented yet
  if (dragContainerExpand.width < 0) expandRight = dragContainerExpand.width;
  else expandLeft = dragContainerExpand.width;
  return {
    draggedOverIndex,
    draggedId,
    sourceIndex,
    isRearrange,
    isDraggingOver,
    distFromLeftMap,
    expandAbove,
    expandBelow,
    expandLeft,
    expandRight,
  };
};
export default connect(mapStateToProps)(DraggerContainer);
