import React, { CSSProperties, Ref, useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { dragEndThunk, dragStartThunk } from "./dragEventThunks";
import { indexToMapped } from "./dragEventHelperFunctions";
import { RootState } from "./store";
import { number } from "prop-types";

export interface DraggerProps {
  draggerId: string;
  index: number;
  containerId: string;
  // size: number;
  // Whether this dragger is a child of a DraggerContainer
  isOutsideContainer?: boolean;
  isDragDisabled?: boolean;
  numElementsAt?: number[];
  children: (handleDragStart: (event: React.MouseEvent) => void, ref: Ref<HTMLImageElement>, dragged: boolean) => JSX.Element;
}

interface DraggerReduxProps {
  source: DragSourceData | undefined;
  destination: DragDestinationData | undefined;
  dragEndTarget?: DragEndTarget;
}

type CombinedProps = DraggerProps & DraggerReduxProps;

const Dragger: React.FC<CombinedProps> = ({
  children,
  index,
  draggerId,
  containerId,
  isOutsideContainer,
  isDragDisabled,
  numElementsAt,
  source,
  destination,
  dragEndTarget,
}) => {
  const [dragState, setDragState] = useState({
    dragged: false,
    translateX: 0,
    translateY: 0,
    offsetX: 0,
    offsetY: 0,
    draggerContainerOffsetLeft: 0,
  });

  const [isReturning, setIsReturning] = useState(false);
  const [isMovingToDropTarget, setIsMovingToDropTarget] = useState(false);
  const [startLocation, setStartLocation] = useState<{ x: number; y: number } | undefined>(undefined);

  useEffect(() => {
    setIsReturning(false);
  }, [setIsReturning]);

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
    b = b - window.scrollX;
    c = c - window.scrollY;
    return { offsetLeft: b, offsetTop: c };
  };

  const handleDragStart = useCallback(
    ({ clientX, clientY }) => {
      if (isDragDisabled) return;
      if (draggableRef && draggableRef.current) {
        const { left, top, height, width } = draggableRef.current.getBoundingClientRect();
        const { offsetLeft: absoluteOffsetLeft, offsetTop } = getOffset(draggableRef.current);
        const { offsetLeft: simpleOffsetLeft } = draggableRef.current;
        console.log("startLocation: x " + left, ", top : " + top)
        setStartLocation({x: left, y: top})
        if (absoluteOffsetLeft != null && offsetTop != null) {
          setDragState(prevState => ({
            ...prevState,
            dragged: true,
            // if card is at start position, left and top will be zero,
            // offsetting mouse coordinates of mouse pointer.
            // if card is transitioning back to start position,
            // left and top will capture current position of card

            // Body should be set to margin: 0px

            // This is necessary for elements in a DraggerContainer: it offsets based on the left position within the container
            draggerContainerOffsetLeft: isOutsideContainer ? simpleOffsetLeft : absoluteOffsetLeft - left,
            offsetX: left + (clientX - left),
            offsetY: top + (clientY - top),
            translateX: 0,
            translateY: 0,
          }));

          // this gets the middle as 0, above the middle is positive, below is negative
          const touchedPointY = clientY - top;
          const touchedPointX = clientX - left;

          let dragContainerExpand = { height: 0, width: 0 };
          dragContainerExpand.height = height / 2 - touchedPointY;
          // Left and right expand not implemented yet
          //
          dragContainerExpand.width = width / 2 - touchedPointX;

          const mappedSourceIndex = numElementsAt !== undefined ? indexToMapped(numElementsAt, index) : index;
          const numDraggedElements = numElementsAt !== undefined ? numElementsAt[index] : 1;

          const dragSource: DragSourceData = {
            containerId: containerId,
            index: mappedSourceIndex,
            numDraggedElements: numDraggedElements,
          };
          const dragDestination: LocationData = {
            containerId: containerId,
            index: mappedSourceIndex,
          };
          dispatch(dragStartThunk(draggerId, dragSource, dragDestination, dragContainerExpand));
        }
      } else console.log("error getting html node");
    },
    [isDragDisabled, numElementsAt, index, containerId, dispatch, draggerId, isOutsideContainer]
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
    let dropLocation = { left: 0, top: 0 };
    if (draggableRef && draggableRef.current) {
      const { left, top } = draggableRef.current.getBoundingClientRect();
      dropLocation = { left: left, top: top };
    }
    if (dragState.dragged) {
      if (dragEndTarget !== undefined) {
        // setIsReturning(true);

        setIsMovingToDropTarget(true);
        if(startLocation){
          console.log("dragEndTarget x "+ dragEndTarget.x + " - start location x " + startLocation.x  )
        setDragState(prevState => ({
          ...prevState,
          translateX: dragEndTarget.x - startLocation.x,
          translateY: dragEndTarget.y - startLocation.y,
          offsetX: 0,
          offsetY: 0,
          dragged: false,
        }));}
      } else {
        setDragState(prevState => ({
          ...prevState,
          dragged: false,
        }));
        dispatch(dragEndThunk(dropLocation));
        setIsReturning(true);
      }
    }
  }, [dragState.dragged, dragEndTarget, startLocation, dispatch]);

  // adding/cleaning up mouse event listeners
  React.useEffect(() => {
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", handleDragEnd);

    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", handleDragEnd);
    };
  }, [handleDrag, handleDragEnd]);

  const droppedStyles: CSSProperties = {
    transform: `translate(${dragState.translateX}px, ${dragState.translateY}px)`,
    pointerEvents: "none",
    position: "absolute",
    left: dragState.draggerContainerOffsetLeft,
    zIndex: 10,
    transition: "280ms",
  };

  const notDraggedStyles: CSSProperties = {
    transform: "",
    pointerEvents: "auto",
    position: "relative",
    zIndex: isReturning ? 9 : "",
    transition: "280ms",
    left: "",
    cursor: isDragDisabled ? "auto" : "grab",
  };

  const draggedStyles: CSSProperties = {
    transform: `translate(${dragState.translateX}px, ${dragState.translateY}px)`,
    pointerEvents: "none",
    position: "absolute",
    left: dragState.draggerContainerOffsetLeft,
    zIndex: 10,
    transition: "",
  };

  let styles = dragState.dragged ? draggedStyles : notDraggedStyles;
  styles = isMovingToDropTarget ? droppedStyles : styles;

  return <div style={{ ...styles }}>{children(handleDragStart, draggableRef, dragState.dragged)}</div>;
};

// export default Dragger;

const mapStateToProps = (state: RootState) => {
  const { draggedState, dragEndTarget } = state;
  const { source, destination } = draggedState;
  return { source, destination, dragEndTarget };
};

export default connect(mapStateToProps)(Dragger);
