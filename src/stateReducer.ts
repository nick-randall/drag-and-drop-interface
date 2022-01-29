interface State {
  draggedCardId: string;
}

type SetDraggedCardId = {
  type: "SET_DRAGGED_CARD_ID";
  payload: string;
};

type Action = SetDraggedCardId;

export const stateReducer = (state: State = { draggedCardId: "" }, action: Action) => {
  switch (action.type) {
    case "SET_DRAGGED_CARD_ID":
      return { ...state, draggedCardId: action.payload };
  default: return state;}
};
