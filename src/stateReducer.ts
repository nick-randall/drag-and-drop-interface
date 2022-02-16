interface DragLocation {
  containerId: string;
  index: number;
}

export interface DraggedState {
  source: DragLocation | undefined;
  destination: DragLocation | undefined
  }
interface State {
  draggedCardId: string;
  draggedState: DraggedState
}

type SetDraggedCardId = {
  type: "SET_DRAGGED_CARD_ID";
  payload: string;
};

type SetdraggedState = {
  type: "SET_DRAGGED_CARD_SOURCE";
  payload: { containerId: string; index: number };
};

type UpdateDragged = {
  type: "UPDATE_DRAG_DESTINATION";
  // update the destination
  payload: { containerId: string; index: number };
};

type CleanUpDraggedState = {
  type: "CLEAN_UP_DRAG_STATE";
}

type Action = SetDraggedCardId | SetdraggedState | UpdateDragged | CleanUpDraggedState;

const initialState = { draggedCardId: "", draggedState: {source: undefined, destination: undefined}}

export const stateReducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case "SET_DRAGGED_CARD_ID":
      return { ...state, draggedCardId: action.payload };
    case "SET_DRAGGED_CARD_SOURCE":
      return { ...state, draggedState: {  ...state.draggedState, source: action.payload }};
      case "UPDATE_DRAG_DESTINATION":
      return { ...state, draggedState: {  ...state.draggedState, destination: action.payload }}; 
    case "CLEAN_UP_DRAG_STATE":
      return {...state, draggedState: initialState.draggedState}
    default:
      return state;
  }
};
