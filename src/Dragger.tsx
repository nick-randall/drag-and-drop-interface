import React, { CSSProperties, Ref, useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";

interface DraggerProps {
  draggerId: string;
  // customDroppableId?
  //ref: Ref<HTMLDivElement>;
  index: number;
  containerId: string;
  size: number;
  children: (ref: Ref<HTMLImageElement>, dragStyles: CSSProperties, handleDragStart: (event: React.MouseEvent) => void) => JSX.Element;
}

interface DragData {
  translateX: number;
  translateY: number;
  offsetX: number;
  offsetY: number;
}

const Dragger = (props: DraggerProps) => {
  const { children, index, draggerId, containerId } = props;
  const [dragState, setDragState] = useState({
    dragged: false,
    translateX: 0,
    translateY: 0,
    offsetX: 0,
    offsetY: 0,
    offsetLeft:0
  });
  const dispatch = useDispatch();

  const draggableRef: Ref<HTMLImageElement> = useRef(null);

  const handleDragStart = useCallback(
    ({ clientX, clientY }) => {
      if (draggableRef && draggableRef.current) {
        const { left, top } = draggableRef.current.getBoundingClientRect();
        const { offsetLeft, offsetTop } = draggableRef.current;
        if (offsetLeft != null && offsetTop != null) {
          setDragState(prevState => ({
            ...prevState,
            dragged: true,
            // if card is at start position, left and top will be zero,
            // offsetting mouse coordinates of mouse pointer.
            // if card is transitioning back to start position,
            // left and top will capture current position of card
            offsetLeft: offsetLeft,
            offsetX: offsetLeft + (clientX - left),
            offsetY: offsetTop + (clientY - top),
            translateX: left - offsetLeft,
            translateY: top - offsetTop,
          }));
          dispatch({ type: "SET_DRAGGED_CARD_ID", payload: draggerId });
          dispatch({ type: "SET_DRAGGED_CARD_SOURCE", payload: {index: index, containerId: containerId} });
        }
      } else console.log("error getting html node");
    },
    [containerId, dispatch, draggerId, index]
  );

  const handleDrag = useCallback(
    ({ clientX, clientY }) => {
      if (dragState.dragged) {
        setDragState(prevState => ({
          ...prevState,
          translateX: clientX - dragState.offsetX,
          translateY: clientY - dragState.offsetY,
        }));
      }
    },
    [dragState]
  );

  const handleDragEnd = useCallback(() => {
    if (dragState.dragged) {
      setDragState(prevState => ({
        ...prevState,
        dragged: false,
      }));
      dispatch({ type: "SET_DRAGGED_CARD_ID", payload: "" });
      dispatch({ type: "SET_DRAGGED_CARD_SOURCE", payload: {index: -1, containerId: ""} });

    }
  }, [dragState, dispatch]);

  // adding/cleaning up mouse event listeners
  React.useEffect(() => {
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", handleDragEnd);

    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [handleDrag, handleDragEnd]);

  const dragStyles: CSSProperties = {
    transform: dragState.dragged ? `translate(${dragState.translateX}px, ${dragState.translateY}px)` : "",
    pointerEvents: dragState.dragged ? "none" : "auto",
    //position:"absolute"
    // draggable : "false"
  };

  const notDraggedStyles: CSSProperties = {
    transform: "",
    pointerEvents: "auto",
    left: "",
    position:"relative"
  };

  const draggedStyles: CSSProperties = {
    transform: `translate(${dragState.translateX}px, ${dragState.translateY}px)`,
    pointerEvents: "none",
    left: dragState.offsetLeft,
    position: "absolute",
    zIndex: 9
  }
  if(!dragState.dragged)
  return children(draggableRef, notDraggedStyles, handleDragStart);
  else return children(draggableRef, draggedStyles, handleDragStart);
};

export default Dragger;
