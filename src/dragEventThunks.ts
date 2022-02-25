import { AppDispatch, AppThunk } from "./store";

interface LastLocation {
  x: number;
  y: number;
}

export type SetDraggedId = {
  type: "SET_DRAGGED_ID";
  payload: string;
};

export const setDraggedId = (id: string) : SetDraggedId => ({type: "SET_DRAGGED_ID", payload: id})

export const dragStartThunk = (id: string) => (getState: Function, dispatch: AppDispatch) => {
  setDraggedId(id);  
};

export const endDrawThunk = (lastLocation: LastLocation) => (getState: Function, dispatch: Function) => {
  console.log("last location " + lastLocation.x + " " + lastLocation.y)

};
