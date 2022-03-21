import React, { Children, Ref, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { dragUpateThunk } from "./dragEventThunks";
import { RootState } from "./store";

const usePrevious = (value: any) => {
  const ref = React.useRef();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const cumulativeSum = (sum: number) => (value: number) => (sum += value);

export const getCumulativeSum = (indexArray: number[]) => indexArray.map(cumulativeSum(0));

export const removeSourceIndex = (sourceIndex: number, array: any[]) => array.filter((_, index) => index !== sourceIndex);
// export const removeSourceIndex = (sourceIndex: number) => (array: any[]) => array.filter((_, index) => index !== sourceIndex);

const addZeroAtFirstIndex = (indexArray: number[]) => [0].concat(indexArray);

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
interface ComponentReduxProps {
  draggedId?: string;
  draggedOverIndex?: number;
  sourceIndex?: number;
  isRearrange?: boolean;
  isDraggingOver?: boolean;
  expandAbove: number;
  expandBelow: number;
  expandLeft: number;
  expandRight: number;
}
type DraggerContainerProps = {
  // children: React.FC<DraggerProps>[];
  children: JSX.Element[];
  elementWidth: number;
  id: string;
  isLayoutDisabled?: boolean;
  isDropDisabled?: boolean;
  // The index map is an array of the number of elements
  // in each index. Using it allows returning meaningful indexes
  // from elements that are stacked on top of one another, for example
  indexMap: number[];
  widthMap?: number[];
};
type ComponentProps = ComponentReduxProps & DraggerContainerProps;

// This container has several jobs:
// 1. It listens to dragEvents and updates the redux dragState (draggedOverIndex and draggedOVerId)
// 2. It moves its children around to give the user feedback about where they are placing the dragged item
// 3. to improve UX, it expands a hidden box so that dragEvents can be detected no based on the dragged item position,
// NOT based only on the mouse position

const DraggerContainer: React.FC<ComponentProps> = ({
  children,
  elementWidth,
  id,
  draggedId,
  draggedOverIndex,
  sourceIndex,
  isRearrange,
  expandAbove,
  expandBelow,
  expandLeft,
  expandRight,
  isLayoutDisabled = false,
  isDraggingOver,
  isDropDisabled = false,
  indexMap,
  widthMap = indexMap,
}) => {
  const dispatch = useDispatch();
  const [rowShape, setRowShape] = useState<number[][]>([]);
  const containerRef: Ref<HTMLDivElement> = useRef(null);
  const dragged = draggedId !== undefined;
  const isInitialRearrange = usePrevious(sourceIndex) === undefined;
  // const isDragEnd = usePrevious(sourceIndex) !== undefined && sourceIndex === undefined;

  useEffect(() => {
    if (!sourceIndex) setRowShape([]);
  }, [sourceIndex]);

  const handleMouseMove = ({ clientX }: { clientX: number }) => {
    if (!dragged) return;
    if (isDropDisabled) return;
    let newDraggedOverIndex = 0;

    const containerElement = containerRef.current;
    if (containerElement) {
      const { left: boundingBoxLeft } = containerElement.getBoundingClientRect();
      const touchedX = clientX - boundingBoxLeft;

      let newIndexMap = getCumulativeSum(addZeroAtFirstIndex(indexMap));

      // Set rowShape if this is the first time the container is being dragged over
      if (rowShape.length === 0) {
        // Caclulate the left position of each element, add it to an array
        //
        let newRowShape = widthMap; //= //widthMap.map(e => e * elementWidth);
        // let newRowShape = indexMap?.map(e => e * elementWidth) ?? [];
        console.log(newRowShape);
        // Handle non-rearrange case (ie. if dragged element comes from outside of this drag container):
        //
        if (!isRearrange) {
          newRowShape = addZeroAtFirstIndex(newRowShape);
          // newRowShape = newRowShape.map(ele => (ele += elementWidth / 2));
        }

        newRowShape = getCumulativeSum(newRowShape.map(e => e * elementWidth));
        console.log(newRowShape);
        // Create break points which when dragging over them causes draggedOverIndex to ++ or --
        //
        // indexMap makes this a bit more complex
        const leftBreakPointFactor = 0.35 * elementWidth;
        const rightBreakPointFactor = 0.35 * elementWidth;
        const initialRightBreakPoint = 0.25 * elementWidth;
        const newRowShapeWithUpperLowerBounds: number[][] = newRowShape.map(e =>
          e > 0 ? [e - leftBreakPointFactor, e + rightBreakPointFactor] : [0, initialRightBreakPoint]
        );
        setRowShape(newRowShapeWithUpperLowerBounds);
        console.log(newRowShapeWithUpperLowerBounds);
      } else {
        newDraggedOverIndex = findNewDraggedOverIndex(rowShape, touchedX);
      }
      if (draggedOverIndex !== newDraggedOverIndex && newDraggedOverIndex !== -1) {
        if (sourceIndex !== undefined && isRearrange) {
          newIndexMap = getCumulativeSum(addZeroAtFirstIndex(removeSourceIndex(sourceIndex, indexMap)));
        }
        if (!isRearrange) {
          newIndexMap = getCumulativeSum(addZeroAtFirstIndex(indexMap));
        }
        dispatch(dragUpateThunk({ index: newIndexMap[newDraggedOverIndex], containerId: id }, false));
      }
    }
  };

  const handleMouseLeave = () => {
    if (isDraggingOver) {
      dispatch(dragUpateThunk(undefined, false));
      setRowShape([]);
    }
  };

  const figureOutWhetherToExpand = (index: number) => {
    // let index = addZeroAtFirstIndex(removeSourceIndex(i, widthMap)).indexOf(i)

    if (!isRearrange && draggedOverIndex !== undefined) {
      return draggedOverIndex === index ? elementWidth : 0;
    }

    if (draggedOverIndex !== undefined && sourceIndex !== undefined) {
      // The element directly to the left of the dragged card provides expansion for it
      if (draggedOverIndex === index - 1 && draggedOverIndex === sourceIndex - 1) return elementWidth;
      // Other elements to the left behave normally
      if (index < sourceIndex) return draggedOverIndex === index ? elementWidth : 0;
      // Elements to the right of the dragged card expand one card early to compensate for the missing dragged card.
      if (index > sourceIndex && index === draggedOverIndex + 1) return elementWidth;
    }
    return 0;
  };

  return (
    <div
      // This is the container of all draggers
      ref={containerRef}
      style={{
        position: "absolute",
        display: isLayoutDisabled ? "block" : "flex",
        paddingTop: isDropDisabled ? 0 : expandAbove,
        marginTop: isDropDisabled ? 0 : -expandAbove,
        paddingBottom: isDropDisabled ? 0 : expandBelow,
        marginBottom: isDropDisabled ? 0 : -expandBelow,
        // Allows dragOver listener to trigger when on the right side of the DraggerContainer
        paddingRight: elementWidth,
        marginRight: elementWidth,
        // paddingLeft: expandLeft,
        // marginLeft: -expandLeft,
        // paddingRight: expandRight,
        // marginRight: -expandRight,
        // backgroundColor: "black",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
              height: 150,
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
      {draggedOverIndex}
    </div>
  );
};

const mapStateToProps = (state: RootState, ownProps: DraggerContainerProps) => {
  const { draggedState, draggedId, dragContainerExpand } = state;
  const { indexMap } = ownProps;
  let draggedOverIndex,
    sourceIndex,
    isRearrange,
    isDraggingOver = undefined;
  // Assign sourceIndex as local prop and check if rearranging
  if (draggedState.source) {
    sourceIndex = draggedState.source.index;
    isRearrange = draggedState.source.containerId === ownProps.id;
  }
  // Assign draggedOverIndex as local prop and check if draggingOver
  if (draggedState.destination) {
    isDraggingOver = draggedState.destination.containerId === ownProps.id;

    // issue with initialDrag: could fix with "initial" boolean
    // Set draggedOverIndex based on the DragContainer's indexMap and whether it is a rearrange
    let mappedIndexes;
    if (isRearrange) {
      mappedIndexes = addZeroAtFirstIndex(getCumulativeSum(removeSourceIndex(sourceIndex ?? 0, indexMap)));
    }
    else {
      mappedIndexes = addZeroAtFirstIndex(getCumulativeSum(indexMap))
    }
    draggedOverIndex = isDraggingOver
      ? mappedIndexes.indexOf(draggedState.destination.index)
      : undefined;
    console.log(draggedOverIndex);
  }
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
  else expandLeft = dragContainerExpand.width * -1;
  return { draggedOverIndex, draggedId, sourceIndex, isRearrange, isDraggingOver, expandAbove, expandBelow, expandLeft, expandRight };
};
export default connect(mapStateToProps)(DraggerContainer);
