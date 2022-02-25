import { SetDraggedId } from "./dragEventThunks";

export interface DragLocation {
  containerId: string;
  index: number;
}

export interface DraggedState {
  source?: DragLocation;
  destination?: DragLocation;
}
interface State {
  draggedId?: string;
  draggedState: DraggedState;
  dragContainerExpand: { width: number; height: number };
}

type SetDraggedSource = {
  type: "SET_DRAGGED_CARD_SOURCE";
  payload: { containerId: string; index: number };
};

type SetDraggedState = {
  type: "SET_DRAGGED_STATE";
  payload: { containerId: string; index: number };
};

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

type Action = SetDraggedId | SetDraggedSource | SetDraggedState | UpdateDraggedDestination | CleanUpDraggedState | SetDragContainerExpand;

const initialState = {
  draggedId: undefined,
  draggedState: { source: undefined, destination: undefined },
  dragContainerExpand: { width: 0, height: 0 },
};

export const stateReducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case "SET_DRAGGED_ID":
      console.log(action.payload + " set")
      return { ...state, draggedId: action.payload };
    case "SET_DRAGGED_STATE": {
      return { ...state, draggedState: { source: action.payload, destination: action.payload } };
    }
    case "SET_DRAGGED_CARD_SOURCE":
      return { ...state, draggedState: { ...state.draggedState, source: action.payload } };
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
