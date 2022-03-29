import createEnchantCards from "./createEnchantCards";
import { createGuests, createSpecials } from "./createGuests";
import { CleanUpDragState, SetDragContainerExpand, SetDraggedId, SetInitialDraggedState, UpdateDragDestination } from "./dragEventThunks";

export interface DragDestinationData {
  containerId: string;
  index: number;
 
}

export interface DragSourceData {
  containerId: string;
  index: number;
  numDraggedElements?: number
}

export interface DraggedState {
  source?: DragSourceData;
  destination?: DragDestinationData;
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
  snapshot: { xxxy1: createGuests().slice(8, 10).concat(createEnchantCards().slice(0,2)), xxxy2: createGuests().slice(0, 7), xxxy3: createSpecials() },
};

export const stateReducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case "SET_DRAGGED_ID":
      return { ...state, draggedId: action.payload };
    case "SET_INITIAL_DRAGGED_STATE": {
      console.log(action.payload)
      const { source, destination} = action.payload;
      return { ...state, draggedState: { source: source, destination: destination, isInitialRearrange: true } };
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
