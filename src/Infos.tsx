import { connect } from "react-redux";
import { RootState } from "./store";

interface ReduxProps  {
  draggedId?: string;
  sourceIndex?: number;
  destinationIndex?: number;
  numDraggedElements?: number
}
interface InfoProps {}


type ComponentProps = ReduxProps & InfoProps;


const Infos: React.FC<ComponentProps> = ({ sourceIndex, destinationIndex, draggedId, numDraggedElements }) => {
  return (
    <div>
      <div style={{ left: 200, position: "absolute", top: 300 }}>
        source index: {sourceIndex}
        destination index: {destinationIndex}
        draggedId: {draggedId}
        numDraggedElements:{numDraggedElements}
        {/* source id: {props.draggedState.source?.containerId}<br/>
        source index: {props.draggedState.source?.index}<br/>
        destination id:{props.draggedState.destination?.containerId}<br/>
        destination index:{props.draggedState.destination?.index} */}
      </div>
    </div>
  );
};

function mapStateToProps(state: RootState) {
  const { draggedState, draggedId } = state;
  const { source, destination} = draggedState;
  let sourceIndex,
    numDraggedElements,
    destinationIndex= undefined;
  if (source) {sourceIndex = source.index; numDraggedElements = source.numDraggedElements}//; trueSourceIndex = source.trueIndex}
  if (destination) destinationIndex = destination.index;
  return { draggedId, sourceIndex, destinationIndex, numDraggedElements };
}


export default connect(mapStateToProps)(Infos);