import React, { CSSProperties, Ref, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

export interface DraggerProps {
  draggerId: string;
  index: number;
  containerId: string;
  size: number;
  isOutsideContainer?: boolean;
  isDragDisabled?:boolean;
  children: (handleDragStart: (event: React.MouseEvent) => void, dragged: boolean, ref: Ref<HTMLImageElement>) => JSX.Element;
}

interface DragData {
  dragged: boolean;
  translateX: number;
  translateY: number;
  offsetX: number;
  offsetY: number;
}

const Dragger : React.FC<DraggerProps> = ({ children, index, draggerId, containerId, isOutsideContainer, isDragDisabled }) => {
  const [dragState, setDragState] = useState({
    dragged: false,
    translateX: 0,
    translateY: 0,
    offsetX: 0,
    offsetY: 0,
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
      }
      b += a.offsetLeft;
      c += a.offsetTop;
      a = a.parentElement;
    }
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

            // Body should be set to margin: 0px
            offsetLeft: 0,

            // offsetLeft: offsetLeft - left,

            offsetX: left + (clientX - left) - (offsetLeft - left),
            offsetY: top + (clientY - top),
            // For elements outside of DraggerContainers we need:
            translateX: isOutsideContainer ?  0 : offsetLeft - left , //left - offsetLeft,
            translateY: 0, //top - offsetTop,
          }));

          // this gets the middle as 0, above the middle is positive, below is negative
          const touchedPointY = clientY - top;
          const touchedPointX = clientX - left;
          const dragContainerExpandHeight = (height / 2 - touchedPointY) * 2;
          const dragContainerExpandWidth = width / 2 - touchedPointX;

          dispatch({ type: "SET_DRAG_CONTAINER_EXPAND", payload: { height: dragContainerExpandHeight, width: dragContainerExpandWidth } });
          dispatch({ type: "SET_DRAGGED_CARD_ID", payload: draggerId });
          dispatch({ type: "SET_DRAGGED_STATE", payload: { index: index, containerId: containerId } });
        }
      } else console.log("error getting html node");
    },
    [containerId, dispatch, draggerId, index, isOutsideContainer]
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
    cursor: isDragDisabled? "auto" : "grab",
  };

  const draggedStyles: CSSProperties = {
    transform: `translate(${dragState.translateX}px, ${dragState.translateY}px)`,
    pointerEvents: "none",
    position: "absolute",
    zIndex: 10,
    transition: "",    
  };

  const styles = dragState.dragged ? draggedStyles : notDraggedStyles;

  return <div style={{ ...styles }}>{children(handleDragStart, dragState.dragged, draggableRef)}</div>;
};

export default Dragger;
