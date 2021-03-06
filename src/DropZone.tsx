import React from "react";
import { connect, useDispatch } from "react-redux";
import { dragUpateThunk } from "./dragEventThunks";
import { RootState } from "./store";

interface ComponentReduxProps {
  draggedId?: string;
  isDraggingOver?: boolean;
  expandAbove: number;
  expandBelow: number;
  expandLeft: number;
  expandRight: number;
}
type DropZoneProps = {
  dimensions: AllDimensions;
  providedIndex: number;
  id: string;
  isDropDisabled?: boolean;
};
type ComponentProps = ComponentReduxProps & DropZoneProps;

// This container has only one job:
// 1. It listens to dragEvents and updates the redux dragState (draggedOverIndex and draggedOVerId)
// Unlike the DraggerContainer, it can be given an index, and this index is passed into the redux dragState

const DropZone: React.FC<ComponentProps> = ({
  children,
  dimensions,
  id,
  draggedId,
  isDropDisabled,
  expandAbove,
  expandBelow,
  expandLeft,
  expandRight,
  isDraggingOver,
  providedIndex,
}) => {
  const dispatch = useDispatch();
  const dragged = draggedId !== undefined;

  const handleMouseMove = () => {
    if (!dragged) return;
    if (isDropDisabled) return;

    dispatch(dragUpateThunk({index: providedIndex, containerId:id}))
  };

  const handleMouseLeave = () => {
    if (isDraggingOver) {
      dispatch(dragUpateThunk(undefined));
    }
  };

  return (
    <div
      style={{
        width: dimensions.cardWidth,
        height: dimensions.cardHeight,
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
    ></div>
  );
};

const mapStateToProps = (state: RootState, ownProps: DropZoneProps) => {
  const { draggedState, draggedId, dragContainerExpand } = state;
  let isDraggingOver = undefined;

  if (draggedState.destination) {
    isDraggingOver = draggedState.destination.containerId === ownProps.id;
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
  return { draggedId, isDraggingOver, expandAbove, expandBelow, expandLeft, expandRight };
};
export default connect(mapStateToProps)(DropZone);
