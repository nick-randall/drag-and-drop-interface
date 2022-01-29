import React, { CSSProperties, Ref, useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";

interface DraggerProps {
  draggerId: string;
  // customDroppableId?
  //ref: Ref<HTMLDivElement>;
  index: number;
  containerId: string;
  children: (ref: Ref<HTMLImageElement>, dragStyles: CSSProperties, handleDragStart: (event: React.MouseEvent) => void) => JSX.Element;
}

interface DragState {
  dragged: boolean,
    translateX: number,
    translateY: number,
    offsetX: number,
    offsetY: number,
}

const Dragger = (props: DraggerProps) => {
  const { children, index, draggerId, containerId } = props;
  const [dragState, setDragState] = useState({
    dragged: false,
    translateX: 0,
    translateY: 0,
    offsetX: 0,
    offsetY: 0,
  });
  const dispatch = useDispatch();

  const draggableRef: Ref<HTMLImageElement> = useRef(null);

  const handleDragStart = useCallback(({ clientX, clientY }) => {
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
          offsetX: offsetLeft + (clientX - left),
          offsetY: offsetTop + (clientY - top),
          translateX: left - offsetLeft,
          translateY: top - offsetTop,
        }));
        dispatch({type: "SET_DRAGGED_CARD_ID", payload: draggerId })
      }
    } else console.log("error getting html node");
  }, [dispatch, draggerId]);

  const handleDrag = useCallback(
    ({ clientX, clientY }) => {
      if (dragState.dragged) {
        setDragState((prevState) => ({
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
      dispatch({type: "SET_DRAGGED_CARD_ID", payload: "" })
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
  }

  return (  
      children(draggableRef, dragStyles, handleDragStart)
  );
};

export default Dragger;
