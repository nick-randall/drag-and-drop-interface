interface State {
  draggedCardId: string;
  draggedCardSource: { containerId: string; index: number };
}

type SetDraggedCardId = {
  type: "SET_DRAGGED_CARD_ID";
  payload: string;
};

type SetDraggedCardSource = {
  type: "SET_DRAGGED_CARD_SOURCE";
  payload: { containerId: string; index: number };
};

type Action = SetDraggedCardId | SetDraggedCardSource;

export const stateReducer = (state: State = { draggedCardId: "", draggedCardSource: { containerId: "", index: -1 } }, action: Action) => {
  switch (action.type) {
    case "SET_DRAGGED_CARD_ID":
      return { ...state, draggedCardId: action.payload };
    case "SET_DRAGGED_CARD_SOURCE":
      return { ...state, draggedCardSource: action.payload };
    default:
      return state;
  }
};
