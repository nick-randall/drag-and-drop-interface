import createSpecialsAndGuests from "./createGuests";
import { SetDraggedId, SetInitialDraggedState } from "./dragEventThunks";

export interface DragLocation {
  containerId: string;
  index: number;
}

export interface DraggedState {
  source?: DragLocation;
  destination?: DragLocation;
}

export interface Snapshot  {
  [id: string] : GameCard[],

}

interface State {
  draggedId?: string;
  draggedState: DraggedState;
  dragContainerExpand: { width: number; height: number };
  snapshot: Snapshot
}
type UpdateDraggedDestination = {
  type: "UPDATE_DRAG_DESTINATION";
  // update the destination
  payload: { containerId: string; index: number };
};

type CleanUpDraggedState = {
  type: "CLEAN_UP_DRAG_STATE";
};

type SetDragContainerExpand = {
  type: "SET_DRAG_CONTAINER_EXPAND";
  payload: { width: number; height: number };
};

type UpdateSnapshot = {
  type: "UPDATE_SNAPSHOT",
  payload: Snapshot
}

type Action = SetDraggedId | SetInitialDraggedState | UpdateDraggedDestination | CleanUpDraggedState | SetDragContainerExpand;

const initialState = {
  draggedId: undefined,
  draggedState: { source: undefined, destination: undefined },
  dragContainerExpand: { width: 0, height: 0 },
  snapshot: {"xxxy1" : createSpecialsAndGuests().slice(8, 15), 
  "xxxy2" : createSpecialsAndGuests().slice(0, 7)}
};

export const stateReducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case "SET_DRAGGED_ID":
      return { ...state, draggedId: action.payload };
    case "SET_INITIAL_DRAGGED_STATE": {
      return { ...state, draggedState: { source: action.payload, destination: action.payload } };
    }
    case "UPDATE_DRAG_DESTINATION":
      return { ...state, draggedState: { ...state.draggedState, destination: action.payload } };
    case "CLEAN_UP_DRAG_STATE":
      return {
        ...state,
        draggedState: initialState.draggedState,
        draggedId: initialState.draggedId,
        dragContainerExpandY: initialState.dragContainerExpand,
      };
    case "SET_DRAG_CONTAINER_EXPAND":
      console.log(action.payload);
      return { ...state, dragContainerExpand: action.payload };
    default:
      return state;
  }
};
