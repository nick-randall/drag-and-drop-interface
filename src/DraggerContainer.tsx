import React, { Ref, useRef } from "react";
import { connect, useDispatch } from "react-redux";
import { RootState } from "./store";
import { pipe } from "ramda";

const usePrevious = (value: any) => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
interface ComponentReduxProps {
  //draggedState: DraggedState;
  draggedCardId: string;
  draggedOverIndex: number | undefined;
  originIndex: number | undefined;
  isRearrange: boolean | undefined;
  isDraggingOver: boolean | undefined;
}
type DraggerContainerProps = {
  // children: React.FC<DraggerProps>[];
  children: JSX.Element[];
  elementWidth: number;
  id: string;
};
type ComponentProps = ComponentReduxProps & DraggerContainerProps;

const DraggerContainer: React.FC<ComponentProps> = ({
  children,
  elementWidth,
  id,
  draggedCardId,
  draggedOverIndex,
  originIndex,
  isRearrange,
  isDraggingOver,
}) => {
  const dispatch = useDispatch();
  const containerRef: Ref<HTMLDivElement> = useRef(null);
  const dragged = draggedCardId !== "";

  const removeSourceIndex = (sourceIndex: number) => (array: any[]) => array.filter((_, index) => index !== sourceIndex);

  const cumulativeSum = (sum: number) => (value: number) => (sum += value);

  const getCumulativeSum = (indexArray: number[]) => indexArray.map(cumulativeSum(0));

  const addZeroAtFirstIndex = (indexArray: number[]) => [0].concat(indexArray);

  const curriedGetCardRowShape = (sourceIndex: number) => (indexArray: number[]) =>
    pipe(removeSourceIndex(sourceIndex), addZeroAtFirstIndex, getCumulativeSum)(indexArray);

  const getCardRowShape2 = (indexArray: number[]) => pipe(getCumulativeSum)(indexArray);

  const getRowShapeWithUpperLowerBounds = (indexArray: number[]): number[][] => indexArray.map(e => (e > 0 ? [e - 35, e + 15] : [0, 25]));

  const getCardRowShapeOnRearrange = (indexArray: number[], sourceIndex: number) => curriedGetCardRowShape(sourceIndex)(indexArray);

  const isInBounds = (breakPointsPair: number[], touchedX: number): boolean => {
    const lowerBound = breakPointsPair[0];
    const upperBound = breakPointsPair[1];
    return touchedX >= lowerBound && touchedX <= upperBound;
  };

  const findNewDraggedOverIndex = (breakPointsPairs: number[][], touchedX: number): number => {
    for (let i = 0; i < breakPointsPairs.length; i++) {
      if (isInBounds(breakPointsPairs[i], touchedX)) return i;
      const lowerBound = breakPointsPairs[i][0];
      const upperBound = breakPointsPairs[i][1];
      if (i === 0) {
        if (isInBounds([0, lowerBound], touchedX)) return 0;
      }
      if (i > 0) {
        const leftUpperBound = breakPointsPairs[i - 1][1];
        if (isInBounds([leftUpperBound, lowerBound], touchedX)) return i - 1;
      }

      if (i < breakPointsPairs.length - 1) {
        const rightLowerBound = breakPointsPairs[i + 1][0];
        if (isInBounds([upperBound, rightLowerBound], touchedX)) return i + 1;
      }
    }
    return -1;
  };

  const handleMouseOver = ({ clientX }: { clientX: number }) => {
    if (!dragged) return;
    const containerElement = containerRef.current;
    if (containerElement) {
      const { left: boundingBoxLeft } = containerElement.getBoundingClientRect();
      if (isRearrange) {
        const childrenSizes = children.map(child => child.props.size ?? 0);

        const rowShape = getCardRowShape2(childrenSizes);
        const rowShapeWithUpperLowerBounds = getRowShapeWithUpperLowerBounds(
          rowShape
          //draggedState.index
        );

        const touchedX = clientX - boundingBoxLeft;

        const newDraggedOverIndex = findNewDraggedOverIndex(rowShapeWithUpperLowerBounds, touchedX);

        if (draggedOverIndex !== newDraggedOverIndex && newDraggedOverIndex !== -1) {
          // setDraggedOverIndex(newDraggedOverIndex);
          dispatch({ type: "UPDATE_DRAG_DESTINATION", payload: { index: newDraggedOverIndex, containerId: id } });
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

        if (draggedOverIndex !== newDraggedOverIndex)
          //setDraggedOverIndex(newDraggedOverIndex);
          dispatch({ type: "UPDATE_DRAG_DESTINATION", payload: { index: newDraggedOverIndex, containerId: id } });
      }
    }
  };

  const handleMouseLeave = () => {
    if (isDraggingOver) {
      dispatch({ type: "UPDATE_DRAG_DESTINATION", payload: undefined });
    }
  };

  //const isRearrangeStart = prevdraggedState.current.source && prevdraggedState.current.source.containerId === "" && isRearrange;

  // useEffect(() => {
  //   dispatch(draggedState.source.index)
  // }, [draggedState.source.index]);

  // useEffect(() => {
  //   // currently does nothing
  //   if (prevdraggedState.current.source.containerId === "" && isRearrange) {
  //     setInitialTransitionSuppressed(true);
  //   }
  // }, [draggedState, isRearrange]);

  //console.log(prevdraggedState.current.source.containerId, " prevdraggedState container id");

  const figureOutWhetherToExpand = (index: number) => {
    if (!isRearrange && draggedOverIndex !== undefined) {
      // index 0 is handled as a special case
      if (draggedOverIndex === 0) return 0;
      return draggedOverIndex === index ? elementWidth : 0;
    }

    if (draggedOverIndex !== undefined && originIndex !== undefined) {
      // if (originIndex === 0 && draggedOverIndex === index) {console.log("blah"); return elementWidth}

      // The element directly to the left of the dragged card provides expansion for it
      if (draggedOverIndex === index - 1 && draggedOverIndex === originIndex - 1) return elementWidth;
      // Other elements to the left behave normally
      if (index < originIndex) return draggedOverIndex === index ? elementWidth : 0;
      // Elements to the right of the dragged card expand one card early to compensate for the missing dragged card.
      if (index > originIndex && index === draggedOverIndex + 1) return elementWidth;
    }
    // index one below dragSource expands to make up for missing dragged card
    return 0;
  };

  //console.log(isRearrangeStart)

  return (
    <div
      // this is the container of all draggers
      ref={containerRef}
      style={{
        display: "flex",
      }}
      onMouseMove={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      {/* {rowShape.map((b, i) => (
        <div>
          <div style={{ width: 1, height: 150, backgroundColor: "red", position: "absolute", left: b[0], zIndex: 10 }}>{b[0]}</div>
          <div style={{ width: 1, height: 150, backgroundColor: "blue", position: "absolute", left: b[1], zIndex: 10 }}>{b[i]}</div>
        </div>
      ))} */}

      {/*speical index 0 case*/}
      <div style={{ transition: "140ms ease", width: !isRearrange && draggedOverIndex === 0 ? elementWidth : 0 }}></div>
      {children.map((child, index) => (
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
              //(prevdraggedState.current.source.containerId === "" && isRearrange) ? "" :
              //isRearrangeStart && index === draggedState.source.index  ?  "" :
              transition: "140ms ease",
              //(prevdraggedState.current.source.containerId === "" && isRearrange) ? "" :
              //transitionDelay: "60ms",
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

// export default DraggerContainer;

const mapStateToProps = (state: RootState, ownProps: DraggerContainerProps) => {
  const { draggedState, draggedCardId } = state;
  let draggedOverIndex,
    originIndex,
    isRearrange,
    isDraggingOver = undefined;
  if (draggedState.source) {
    originIndex = draggedState.source.index;
    isRearrange = draggedState.source.containerId === ownProps.id;
  }
  if (draggedState.destination) {
    isDraggingOver = draggedState.destination.containerId === ownProps.id;
    draggedOverIndex = isDraggingOver ? draggedState.destination.index : undefined;
  }
  return { draggedOverIndex, draggedCardId, originIndex, isRearrange, isDraggingOver };
};
export default connect(mapStateToProps)(DraggerContainer);
