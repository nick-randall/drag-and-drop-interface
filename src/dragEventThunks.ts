import { AppDispatch,  RootState } from "./store";

interface LastLocation {
  x: number;
  y: number;
}

export type SetDraggedId = {
  type: "SET_DRAGGED_ID";
  payload: string;
};

export type SetInitialDraggedState = {
  type: "SET_INITIAL_DRAGGED_STATE";
  payload: { containerId: string; index: number };
};

// Action Creators
const setDraggedId = (id: string): SetDraggedId => ({ type: "SET_DRAGGED_ID", payload: id });

const setInitialDraggedState = (sourceAndDestination: LocationData): SetInitialDraggedState => ({
  type: "SET_INITIAL_DRAGGED_STATE",
  payload: sourceAndDestination,

});

// Thunks

export const dragStartThunk = (id: string, source: LocationData) => ( dispatch: Function, getState: () => RootState) => {
  dispatch(setDraggedId(id));
  console.log("id " + id)
  dispatch(setInitialDraggedState(source));
  dispatch({type: "test"})
  

};

export const dragEndThunk = (lastLocation: LastLocation) => (dispatch: Function, getState: Function) => {
  console.log("last location " + lastLocation.x + " " + lastLocation.y);
};
