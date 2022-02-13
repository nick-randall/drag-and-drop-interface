import React, { CSSProperties, Ref, useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from 'prop-types'

export interface DraggerProps {
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
    offsetLeft: 0,
  });
  const dispatch = useDispatch();

  const draggableRef: Ref<HTMLImageElement> = useRef(null);

  const getOffset = (a: HTMLElement | null) => {
    //var a: Element | null = new Element,
    let b = 0,
      c = 0;
    while (a) {
      if(a){
        console.log("here");
        console.log(a.parentElement?.offsetLeft)}
      b += a.offsetLeft;
      c += a.offsetTop;
      a = a.parentElement;
      
    }
    console.log(b, c)
    return { offsetLeft: b, offsetTop: c };
  };

  const handleDragStart = useCallback(
    ({ clientX, clientY }) => {
      if (draggableRef && draggableRef.current) {
        const { left, top } = draggableRef.current.getBoundingClientRect();
        const { offsetLeft, offsetTop } = getOffset(draggableRef.current);
        console.log(left, top)

        if (offsetLeft != null && offsetTop != null) {
          setDragState(prevState => ({
            ...prevState,
            dragged: true,
            // if card is at start position, left and top will be zero,
            // offsetting mouse coordinates of mouse pointer.
            // if card is transitioning back to start position,
            // left and top will capture current position of card
            offsetLeft: offsetLeft - left - 16,
            offsetX: left + (clientX - left) ,
            offsetY: top + (clientY - top),
            translateX: 0,//left - offsetLeft,
            translateY: top - offsetTop  + 16,
          }));
          dispatch({ type: "SET_DRAGGED_CARD_ID", payload: draggerId });
          dispatch({ type: "SET_DRAGGED_CARD_SOURCE", payload: { index: index, containerId: containerId } });
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
      dispatch({ type: "CLEAR_DRAGGED"});
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
    position: "relative",
  };

  const draggedStyles: CSSProperties = {
    transform: `translate(${dragState.translateX}px, ${dragState.translateY}px)`,
    pointerEvents: "none",
    left: dragState.offsetLeft,
    position: "absolute",
    zIndex: 9,
  };
  if (!dragState.dragged) return children(draggableRef, notDraggedStyles, handleDragStart);
  else return children(draggableRef, draggedStyles, handleDragStart);
};

// Dragger.propTypes = {
//   draggerId: PropTypes.string,
//   // customDroppableId?
//   //ref: Ref<HTMLDivElement>;
//   index: PropTypes.number,
//   containerId: PropTypes.string,
//   size: PropTypes.number,
// }


export default Dragger;
