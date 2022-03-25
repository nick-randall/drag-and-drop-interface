import { AppDispatch, RootState } from "./store";

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
  payload: { containerId: string; index: number };
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

// Action Creators
const setDraggedId = (id: string): SetDraggedId => ({ type: "SET_DRAGGED_ID", payload: id });

const setInitialDraggedState = (sourceAndDestination: LocationData): SetInitialDraggedState => ({
  type: "SET_INITIAL_DRAGGED_STATE",
  payload: sourceAndDestination,
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
  (id: string, source: LocationData, dragContainerExpand: { width: number; height: number }) => (dispatch: Function, getState: () => RootState) => {
    dispatch(setDraggedId(id));
    dispatch(setInitialDraggedState(source));
    dispatch(setDragContainerExpand(dragContainerExpand));
  };

export const dragUpateThunk = (destinationLocationUpdate : LocationData | undefined) => (dispatch: Function, getState: () => RootState) => {
  dispatch(updateDragDestination(destinationLocationUpdate))
};

export const dragEndThunk = (lastLocation: LastLocation) => (dispatch: Function, getState: () => RootState) => {
  const { source, destination } = getState().draggedState;
  console.log("drag source " + source);
  console.log("drag destination " + destination);
  console.log(lastLocation);

  dispatch(setDraggedId(""));
  dispatch(cleanUpDragState());
};
