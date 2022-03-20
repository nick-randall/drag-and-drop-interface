import React, { Ref, useRef, useState } from "react";
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

const cumulativeSum = (sum: number) => (value: number) => (sum += value);

const getCumulativeSum = (indexArray: number[]) => indexArray.map(cumulativeSum(0));

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
  originIndex?: number;
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
  originIndex,
  isRearrange,
  expandAbove,
  expandBelow,
  expandLeft,
  expandRight,
  isLayoutDisabled = false,
  isDraggingOver,
  isDropDisabled = false,
}) => {
  const dispatch = useDispatch();
  const [rowShape, setRowShape] = useState<number[][]>([]);
  const containerRef: Ref<HTMLDivElement> = useRef(null);
  const dragged = draggedId !== undefined;
  const isInitialRearrange = usePrevious(originIndex) === undefined;
  // const isDragEnd = usePrevious(originIndex) !== undefined && originIndex === undefined;

  const handleMouseMove = ({ clientX }: { clientX: number }) => {
    if (!dragged) return;
    if (isDropDisabled) return;
    let newDraggedOverIndex = 0;

    const containerElement = containerRef.current;
    if (containerElement) {
      const { left: boundingBoxLeft } = containerElement.getBoundingClientRect();
      const touchedX = clientX - boundingBoxLeft;

      // Set rowShape if this is the first time the container is being dragged over
      if (rowShape.length === 0) {
        // Caclulate the left position of each element, add it to an array
        //
        const childrenSizes = children.map(child => child.props.size ?? 0);
        let newRowShape = getCumulativeSum(childrenSizes);

        // Handle non-rearrange case (ie. if dragged element comes from outside of this drag container):
        //
        if (!isRearrange) {
          newRowShape = addZeroAtFirstIndex(newRowShape);
          newRowShape = newRowShape.map(ele => (ele += elementWidth / 2));
        }

        // Create break points where dragging over causes draggedOverIndex to ++ or --
        //
        const leftBreakPointFactor = 0.35 * elementWidth;
        const rightBreakPointFactor = 0.15 * elementWidth;
        const initialRightBreakPoint = 0.25 * elementWidth;
        const newRowShapeWithUpperLowerBounds: number[][] = newRowShape.map(e =>
          e > 0 ? [e - leftBreakPointFactor, e + rightBreakPointFactor] : [0, initialRightBreakPoint]
        );
        setRowShape(newRowShapeWithUpperLowerBounds);
      } else {
        newDraggedOverIndex = findNewDraggedOverIndex(rowShape, touchedX);
      }

      if (draggedOverIndex !== newDraggedOverIndex && newDraggedOverIndex !== -1) {
        dispatch(dragUpateThunk({index: newDraggedOverIndex, containerId:id}, false))
      }
    }
  };

  const handleMouseLeave = () => {
    if (isDraggingOver) {
      dispatch(dragUpateThunk(undefined, false))
    }
  };

  const figureOutWhetherToExpand = (index: number) => {
    if (!isRearrange && draggedOverIndex !== undefined) {
      return draggedOverIndex === index ? elementWidth : 0;
    }

    if (draggedOverIndex !== undefined && originIndex !== undefined) {
      // The element directly to the left of the dragged card provides expansion for it
      if (draggedOverIndex === index - 1 && draggedOverIndex === originIndex - 1) return elementWidth;
      // Other elements to the left behave normally
      if (index < originIndex) return draggedOverIndex === index ? elementWidth : 0;
      // Elements to the right of the dragged card expand one card early to compensate for the missing dragged card.
      if (index > originIndex && index === draggedOverIndex + 1) return elementWidth;
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
  return { draggedOverIndex, draggedId, originIndex, isRearrange, isDraggingOver, expandAbove, expandBelow, expandLeft, expandRight };
};
export default connect(mapStateToProps)(DraggerContainer);
