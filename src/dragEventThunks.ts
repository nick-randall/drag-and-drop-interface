import { AppDispatch,  RootState } from "./store";

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

// Action Creators
const setDraggedId = (id: string): SetDraggedId => ({ type: "SET_DRAGGED_ID", payload: id });

const setInitialDraggedState = (sourceAndDestination: LocationData): SetInitialDraggedState => ({
  type: "SET_INITIAL_DRAGGED_STATE",
  payload: sourceAndDestination,

});

// Thunks

export const dragStartThunk = (id: string, source: LocationData) => ( dispatch: Function, getState: () => RootState) => {
  dispatch(setDraggedId(id));
  dispatch(setInitialDraggedState(source));
};

export const dragEndThunk = (lastLocation: LastLocation) => (dispatch: Function, getState: ()=>RootState) => {
  const {source, destination} = getState().draggedState;
  console.log("source === destination " +  (source === destination))
  
  console.log("last location " + lastLocation.left + " " + lastLocation.top);
};
