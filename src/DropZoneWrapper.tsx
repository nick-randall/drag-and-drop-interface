import React from "react";
import { connect, useDispatch } from "react-redux";
import { RootState } from "./store";

interface ComponentReduxProps {
  draggedId?: string;
  isDraggingOver?: boolean;

  expandAbove: number;
  expandBelow: number;
  expandLeft: number;
  expandRight: number;
}
type DropZoneWrapperProps = {
  children: JSX.Element;
  providedIndex: number;
  id: string;
  isDropDisabled?: boolean;
};
type ComponentProps = ComponentReduxProps & DropZoneWrapperProps;

// This container has only one job:
// 1. It listens to dragEvents and updates the redux dragState (draggedOverIndex and draggedOVerId)
// Unlike the DropZoneWrapper, it can be given an index, and this index is passed into the redux dragState

const DropZoneWrapper: React.FC<ComponentProps> = ({
  children,
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

    dispatch({ type: "UPDATE_DRAG_DESTINATION", payload: { index: providedIndex, containerId: id } });
  };

  const handleMouseLeave = () => {
    if (isDraggingOver) {
      dispatch({ type: "UPDATE_DRAG_DESTINATION", payload: undefined });
    }
  };

  return (
    <div
      style={{
        paddingTop: expandAbove,
        marginTop: -expandAbove,
        paddingBottom: expandBelow,
        marginBottom: -expandBelow,
        // paddingLeft: expandLeft,
        // marginLeft: -expandLeft,
        // paddingRight: expandRight,
        // marginRight: -expandRight,
        border: "thin black solid",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

const mapStateToProps = (state: RootState, ownProps: DropZoneWrapperProps) => {
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
export default connect(mapStateToProps)(DropZoneWrapper);
