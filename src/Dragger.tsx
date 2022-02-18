import React, { CSSProperties, Ref, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

export interface DraggerProps {
  draggerId: string;
  // customDroppableId?
  //ref: Ref<HTMLDivElement>;
  index: number;
  containerId: string;
  size: number;
  // children: (ref: Ref<HTMLImageElement>, dragStyles: CSSProperties, handleDragStart: (event: React.MouseEvent) => void) => JSX.Element;
  children: (handleDragStart: (event: React.MouseEvent) => void, dragged: boolean) => JSX.Element;
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

  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    setIsReturning(false);
  }, [setIsReturning, index]);

  const dispatch = useDispatch();

  const draggableRef: Ref<HTMLImageElement> = useRef(null);

  const getOffset = (a: HTMLElement | null) => {
    //var a: Element | null = new Element,
    let b = 0,
      c = 0;
    while (a) {
      if (a) {
        console.log("here");
        console.log(a.parentElement?.offsetLeft);
      }
      b += a.offsetLeft;
      c += a.offsetTop;
      a = a.parentElement;
    }
    console.log(b, c);
    return { offsetLeft: b, offsetTop: c };
  };

  const handleDragStart = useCallback(
    ({ clientX, clientY }) => {
      if (draggableRef && draggableRef.current) {
        const { left, top, height, width } = draggableRef.current.getBoundingClientRect();
        const { offsetLeft, offsetTop } = getOffset(draggableRef.current);

        if (offsetLeft != null && offsetTop != null) {
          setDragState(prevState => ({
            ...prevState,
            dragged: true,
            // if card is at start position, left and top will be zero,
            // offsetting mouse coordinates of mouse pointer.
            // if card is transitioning back to start position,
            // left and top will capture current position of card

            // Boddy should be set to margin: 0px
            offsetLeft: offsetLeft - left,
            offsetX: left + (clientX - left),
            offsetY: top + (clientY - top),
            translateX: 0, //left - offsetLeft,
            translateY: 0, //top - offsetTop,
          }));

           // // this gets the middle as 0, above the middle is positive, below is negative
          const touchedPointY = (clientY - top);
          const touchedPointX = (clientX - left);
          const dragContainerExpandHeight = (height / 2 - touchedPointY) * 2;
          const dragContainerExpandWidth = (width / 2 - touchedPointX);


          dispatch({type:"SET_DRAG_CONTAINER_EXPAND", payload: {height: dragContainerExpandHeight, width: dragContainerExpandWidth}})
          dispatch({ type: "SET_DRAGGED_CARD_ID", payload: draggerId });
          dispatch({ type: "SET_DRAGGED_STATE", payload: { index: index, containerId: containerId } });
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
      dispatch({ type: "CLEAN_UP_DRAG_STATE" });
      setIsReturning(true);
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

  const notDraggedStyles: CSSProperties = {
    transform: "",
    pointerEvents: "auto",
    left: "",
    position: "relative",
    zIndex: isReturning ? 9 : "",
    transition: isReturning ? "280ms" : "",
  };

  const draggedStyles: CSSProperties = {
    transform: `translate(${dragState.translateX}px, ${dragState.translateY}px)`,
    pointerEvents: "none",
    left: dragState.offsetLeft,
    position: "absolute",
    zIndex: 10,
    transition: "",
  };

  const styles = dragState.dragged ? draggedStyles : notDraggedStyles;

  return (
    <div ref={draggableRef} style={{ ...styles }}>
      {children(handleDragStart, dragState.dragged)}
    </div>
  );
};

export default Dragger;
