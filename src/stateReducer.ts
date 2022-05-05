import createEnchantCards from "./createEnchantCards";
import { createGuests, createSpecials } from "./createGuests";
import { CleanUpDragState, SetDragContainerExpand, SetDragEndTarget, SetDraggedId, SetInitialDraggedState, UpdateDragDestination } from "./dragEventThunks";

interface State {
  draggedId?: string;
  draggedState: DraggedState;
  dragContainerExpand: { width: number; height: number };
  snapshot: Snapshot;
  dragEndTarget?: DragEndTarget
}

type UpdateSnapshot = {
  type: "UPDATE_SNAPSHOT";
  payload: Snapshot;
};

type Action = SetDraggedId | SetInitialDraggedState | UpdateDragDestination | CleanUpDragState | SetDragContainerExpand | SetDragEndTarget;

const initialState = {
  draggedId: undefined,
  draggedState: { source: undefined, destination: undefined },
  dragContainerExpand: { width: 0, height: 0 },
  dragEndTarget: undefined,
  snapshot: { xxxy1: createGuests().slice(8, 10).concat(createEnchantCards().slice(0,3)), xxxy2: createGuests().slice(0, 7), xxxy3: createSpecials() },
};

export const stateReducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case "SET_DRAGGED_ID":
      return { ...state, draggedId: action.payload };
    case "SET_INITIAL_DRAGGED_STATE": {
      console.log(action.payload)
      const { source, destination} = action.payload;
      return { ...state, draggedState: { source: source, destination: destination} };
    }
    case "SET_DRAG_END_TARGET":
      return {...state, dragEndTarget: action.payload}
    case "UPDATE_DRAG_DESTINATION":
      const { destination } = action.payload;
      return { ...state, draggedState: { ...state.draggedState, destination: destination} };
    case "CLEAN_UP_DRAG_STATE":
      return {
        ...state,
        draggedState: initialState.draggedState,
        draggedId: initialState.draggedId,
        dragContainerExpand: initialState.dragContainerExpand,
        dragEndTarget: initialState.dragEndTarget
      };
    case "SET_DRAG_CONTAINER_EXPAND":
      return { ...state, dragContainerExpand: action.payload };
    default:
      return state;
  }
};
