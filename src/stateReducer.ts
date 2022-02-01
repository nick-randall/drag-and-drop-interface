interface DragLocation {
  containerId: string;
  index: number;
}

interface State {
  draggedCardId: string;
  draggedState: { source: DragLocation; destination: DragLocation };
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

type Action = SetDraggedCardId | SetdraggedState | UpdateDragged;

export const stateReducer = (state: State = { draggedCardId: "", draggedState: {source: { containerId: "", index: -1 }, destination: { containerId: "", index: -1 } }}, action: Action) => {
  switch (action.type) {
    case "SET_DRAGGED_CARD_ID":
      return { ...state, draggedCardId: action.payload };
    case "SET_DRAGGED_CARD_SOURCE":
      return { ...state, draggedState: {  ...state.draggedState, source: action.payload }};
      case "UPDATE_DRAG_DESTINATION":
      return { ...state, draggedState: {  ...state.draggedState, destination: action.payload }}; 
    default:
      return state;
  }
};
