import { createGuests, createSpecials } from "./createGuests";
import { CleanUpDragState, SetDragContainerExpand, SetDraggedId, SetInitialDraggedState, UpdateDragDestination } from "./dragEventThunks";

export interface DragLocation {
  containerId: string;
  index: number;
}

export interface DraggedState {
  source?: DragLocation;
  destination?: DragLocation;
  isInitialRearrange?: boolean;
}

export interface Snapshot {
  [id: string]: GameCard[];
}

interface State {
  draggedId?: string;
  draggedState: DraggedState;
  dragContainerExpand: { width: number; height: number };
  snapshot: Snapshot;
}

type UpdateSnapshot = {
  type: "UPDATE_SNAPSHOT";
  payload: Snapshot;
};

type Action = SetDraggedId | SetInitialDraggedState | UpdateDragDestination | CleanUpDragState | SetDragContainerExpand;

const initialState = {
  draggedId: undefined,
  draggedState: { source: undefined, destination: undefined },
  dragContainerExpand: { width: 0, height: 0 },
  snapshot: { xxxy1: createGuests().slice(8, 15), xxxy2: createGuests().slice(0, 7), xxxy3: createSpecials() },
};

export const stateReducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case "SET_DRAGGED_ID":
      return { ...state, draggedId: action.payload };
    case "SET_INITIAL_DRAGGED_STATE": {
      return { ...state, draggedState: { source: action.payload, destination: action.payload, isInitialRearrange: true } };
    }
    case "UPDATE_DRAG_DESTINATION":
      const { destination } = action.payload;
      return { ...state, draggedState: { ...state.draggedState, destination: destination, isInitialRearrange: false } };
    case "CLEAN_UP_DRAG_STATE":
      return {
        ...state,
        draggedState: initialState.draggedState,
        draggedId: initialState.draggedId,
        dragContainerExpand: initialState.dragContainerExpand,
      };
    case "SET_DRAG_CONTAINER_EXPAND":
      return { ...state, dragContainerExpand: action.payload };
    default:
      return state;
  }
};
