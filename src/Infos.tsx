import { connect } from "react-redux";
import { RootState } from "./store";

interface ReduxProps  {
  draggedId?: string;
  sourceIndex?: number;
  destinationIndex?: number;
  isDropZone?: boolean 
}
interface InfoProps {}

type ComponentProps = ReduxProps & InfoProps;


const Infos: React.FC<ComponentProps> = ({ sourceIndex, destinationIndex, isDropZone }) => {
  return (
    <div>
      <div style={{ left: 200, position: "absolute", top: 300 }}>
        source index: {sourceIndex}
        destination index: {destinationIndex}
        {/* {props.draggedId} */}
        {/* source id: {props.draggedState.source?.containerId}<br/>
        source index: {props.draggedState.source?.index}<br/>
        destination id:{props.draggedState.destination?.containerId}<br/>
        destination index:{props.draggedState.destination?.index} */}
        isDropZone: {isDropZone? "true": "false"}
      </div>
    </div>
  );
};

function mapStateToProps(state: RootState) {
  const { draggedState, draggedId } = state;
  const { source, destination, isDropZone} = draggedState;
  let sourceIndex,
    destinationIndex= undefined;
  if (source) sourceIndex = source.index;
  if (destination) destinationIndex = destination.index;
  return { draggedId, sourceIndex, destinationIndex, isDropZone };
}


export default connect(mapStateToProps)(Infos);