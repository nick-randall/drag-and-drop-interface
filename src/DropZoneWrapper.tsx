import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { dragUpateThunk } from "./dragEventThunks";
import { indexToMapped } from "./dragHelperFunctions";
import { RootState } from "./store";

interface ComponentReduxProps {
  draggedId?: string;
  // isDraggingOver?: boolean;

  expandAbove: number;
  expandBelow: number;
  expandLeft: number;
  expandRight: number;
}
type DropZoneWrapperProps = {
  children: (isDraggingOver: boolean) => JSX.Element;
  providedIndex: number;
  id: string;
  isDropDisabled?: boolean;
  numElementsAt?: number[]
  insertToTheRight?: boolean
};
type ComponentProps = ComponentReduxProps & DropZoneWrapperProps;

/** This container has only one job:
 * 1. It listens to dragEvents and updates the redux dragState (draggedOverIndex and draggedOVerId)
 * Unlike the DraggerContainer, it can be given an index, and this index is passed into the redux dragState
 * when dragged over
 * @param props.providedIndex An array representing the number of elements at each index.
   * Supplying this allows the dragger to return its calculated position in 
   * the array of elements. 
 * @param props.insertToTheRight If true, the calculated destination index will be adjusted
   * so an inserted element would be placed to the right of the element wrapped by this
   * DropZoneWrapper. By default elements would be added to the left of the wrapped element.
 * @returns 
 */

const DropZoneWrapper: React.FC<ComponentProps> = ({
  children,
  id,
  draggedId,
  isDropDisabled,
  expandAbove,
  expandBelow,
  numElementsAt,
  expandLeft,
  expandRight,
  insertToTheRight,
  providedIndex,
}) => {
  const dispatch = useDispatch();
  const dragged = draggedId !== undefined;
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleMouseMove = () => {
    if (!dragged) return;
    if (isDropDisabled) return;
    setIsDraggingOver(true);
    let calculatedIndex;
    if(insertToTheRight) {
      calculatedIndex = numElementsAt !== undefined ? indexToMapped(numElementsAt, providedIndex + 1) : providedIndex + 1
    }
    else {
      calculatedIndex = numElementsAt !== undefined ? indexToMapped(numElementsAt, providedIndex) : providedIndex
    }
    dispatch(dragUpateThunk({ index: calculatedIndex, containerId: id }));
  };

  const handleMouseLeave = () => {
    if (isDraggingOver) {
      dispatch(dragUpateThunk(undefined));
    }
    setIsDraggingOver(false);
  };

  return (
    <div
      style={{
        paddingTop: isDropDisabled ? 0 : expandAbove,
        marginTop: isDropDisabled ? 0 : -expandAbove,
        paddingBottom: isDropDisabled ? 0 : expandBelow,
        marginBottom: isDropDisabled ? 0 : -expandBelow,
        // paddingLeft: expandLeft,
        // marginLeft: -expandLeft,
        // paddingRight: expandRight,
        // marginRight: -expandRight,
        // border: "thin black solid",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children(isDraggingOver)}
    </div>
  );
};

const mapStateToProps = (state: RootState, ownProps: DropZoneWrapperProps) => {
  const { draggedId, dragContainerExpand } = state;
  // let isDraggingOver = undefined;

  // if (draggedState.destination) {
  //   isDraggingOver = draggedState.destination.containerId === ownProps.id;
  // }
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
  return { draggedId, expandAbove, expandBelow, expandLeft, expandRight };
};
export default connect(mapStateToProps)(DropZoneWrapper);
