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

const DraggerContainer: React.FC<ComponentProps> = ({
  children,
  elementWidth,
  id,
  draggedId,
  draggedOverIndex,
  originIndex,
  isRearrange,
  isLayoutDisabled = false,
  isDraggingOver,
  isDropDisabled = false,
}) => {
  const dispatch = useDispatch();
  const containerRef: Ref<HTMLDivElement> = useRef(null);
  const dragged = draggedId !== undefined;
  const prevDraggedOverIndex = usePrevious(draggedOverIndex);
  const isInitialRearrange = prevDraggedOverIndex === undefined && isRearrange;

  const handleMouseMove = ({ clientX }: { clientX: number }) => {
    if (!dragged) return;
    if (isDropDisabled) return;

    const containerElement = containerRef.current;
    if (containerElement) {
      const { left: boundingBoxLeft } = containerElement.getBoundingClientRect();
      const touchedX = clientX - boundingBoxLeft;

      //
      // Caclulate the left position of each element , add it to an array
      const childrenSizes = children.map(child => child.props.size ?? 0);
      let rowShape = getCumulativeSum(childrenSizes);

      // Handle non-rearrange case:
      if (!isRearrange) {
        rowShape = addZeroAtFirstIndex(rowShape);
        rowShape = rowShape.map(ele => (ele += elementWidth / 2));
      }

      // Create break points where dragging over causes draggedOverIndex to ++ or --
      const leftBreakPointFactor = 0.35 * elementWidth;
      const rightBreakPointFactor = 0.15 * elementWidth;
      const initialRightBreakPoint = 0.25 * elementWidth;
      const rowShapeWithUpperLowerBounds: number[][] = rowShape.map(e =>
        e > 0 ? [e - leftBreakPointFactor, e + rightBreakPointFactor] : [0, initialRightBreakPoint]
      );

      const newDraggedOverIndex = findNewDraggedOverIndex(rowShapeWithUpperLowerBounds, touchedX);

      if (draggedOverIndex !== newDraggedOverIndex && newDraggedOverIndex !== -1) {
        dispatch({ type: "UPDATE_DRAG_DESTINATION", payload: { index: newDraggedOverIndex, containerId: id } });
      }
    }
  };

  const handleMouseLeave = () => {
    if (isDraggingOver) {
      dispatch({ type: "UPDATE_DRAG_DESTINATION", payload: undefined });
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
        display: isLayoutDisabled ? "block" : "flex",
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
              transition: !isInitialRearrange ? "140ms ease" : "",
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
  const { draggedState, draggedId } = state;
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
  return { draggedOverIndex, draggedId, originIndex, isRearrange, isDraggingOver };
};
export default connect(mapStateToProps)(DraggerContainer);
