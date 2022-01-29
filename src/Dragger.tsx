import React, { Ref, useCallback, useRef, useState } from "react";

interface DraggerProps {
  draggerId: string;
  // customDroppableId?
  //ref: Ref<HTMLDivElement>;
  index: number;
  children: (ref: Ref<HTMLImageElement>, dragState: DragState) => JSX.Element;
}

interface DragState {
  dragged: boolean,
    translateX: number,
    translateY: number,
    offsetX: number,
    offsetY: number,
}

const Dragger = (props: DraggerProps) => {
  const { children, index, draggerId } = props;
  const [dragState, setDragState] = useState({
    dragged: false,
    translateX: 0,
    translateY: 0,
    offsetX: 0,
    offsetY: 0,
  });

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
      }
    } else console.log("error getting html node");
  }, []);

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
    }
  }, [dragState]);

  // adding/cleaning up mouse event listeners
  React.useEffect(() => {
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", handleDragEnd);

    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [handleDrag, handleDragEnd]);

  return (
    <div ref={draggableRef} onClick={handleDragStart} 
    style={{
      border: "black thin solid",
      // position:"relative",
      // transform: dragState.dragged ? `translate(${dragState.translateX}px, 0px)` : ""
    }}
    >
      {children(draggableRef, dragState)}
      <div style={{fontSize: 100, height: 100}} >
      {dragState.translateX}
      {dragState.dragged.toString()}
      </div>
    </div>
  );
};

export default Dragger;
