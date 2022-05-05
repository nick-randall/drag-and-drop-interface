import { number } from "prop-types";
import { RootState } from "./store";

interface LastLocation {
  left: number;
  top: number;
}

export type SetDraggedId = {
  type: "SET_DRAGGED_ID";
  payload: string;
};

export type SetInitialDraggedState = {
  type: "SET_INITIAL_DRAGGED_STATE";
  payload: { source: DragSourceData; destination: LocationData };
};

export type CleanUpDragState = {
  type: "CLEAN_UP_DRAG_STATE";
};

export type SetDragContainerExpand = {
  type: "SET_DRAG_CONTAINER_EXPAND";
  payload: { width: number; height: number };
};

export type UpdateDragDestination = {
  type: "UPDATE_DRAG_DESTINATION";
  payload: { destination: LocationData | undefined };
};

export type SetDragEndTarget = {
  type: "SET_DRAG_END_TARGET";
  payload: DragEndTarget  | undefined;
};

// Action Creators
const setDraggedId = (id: string): SetDraggedId => ({ type: "SET_DRAGGED_ID", payload: id });

const setInitialDraggedState = (source: DragSourceData, destination: LocationData): SetInitialDraggedState => ({
  type: "SET_INITIAL_DRAGGED_STATE",
  payload: { source: source, destination: destination },
});
const cleanUpDragState = (): CleanUpDragState => ({ type: "CLEAN_UP_DRAG_STATE" });
const setDragContainerExpand = (dragContainerExpand: { width: number; height: number }): SetDragContainerExpand => ({
  type: "SET_DRAG_CONTAINER_EXPAND",
  payload: dragContainerExpand,
});
const updateDragDestination = (destinationLocationUpdate: LocationData | undefined): UpdateDragDestination => ({
  type: "UPDATE_DRAG_DESTINATION",
  payload: { destination: destinationLocationUpdate },
});

// Thunks

export const dragStartThunk =
  (id: string, source: DragSourceData, destination: LocationData, dragContainerExpand: { width: number; height: number }) =>
  (dispatch: Function, getState: () => RootState) => {
    dispatch(setDraggedId(id));
    dispatch(setInitialDraggedState(source, destination));
    dispatch(setDragContainerExpand(dragContainerExpand));
  };

export const dragUpateThunk = (destinationLocationUpdate: LocationData | undefined) => (dispatch: Function, getState: () => RootState) => {
  dispatch(updateDragDestination(destinationLocationUpdate));
};

export const dragEndThunk = () => (dispatch: Function, getState: () => RootState) => {
  const { source, destination } = getState().draggedState;
  // console.log("drag source " + source);
  // console.log("drag destination " + destination);
  // console.log(lastLocation);

  dispatch(setDraggedId(""));
  dispatch(cleanUpDragState());
};

export const setDragEndTarget = (x: number, y: number): SetDragEndTarget => ({
  type: "SET_DRAG_END_TARGET",
  payload: { x: x, y: y },
});

export const resetDragEndTarget = (): SetDragEndTarget => ({
  type: "SET_DRAG_END_TARGET",
  payload: undefined,
});
