import { connect } from "react-redux";
import { RootState } from "./store";

interface ReduxProps  {
  draggedId?: string;
  sourceIndex?: number;
  destinationIndex?: number;
}
interface InfoProps {}

type ComponentProps = ReduxProps & InfoProps;


const Infos: React.FC<ComponentProps> = ({ sourceIndex, destinationIndex }) => {
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
      </div>
    </div>
  );
};

function mapStateToProps(state: RootState) {
  const { draggedState, draggedId } = state;
  const { source, destination } = draggedState;
  let sourceIndex,
    destinationIndex = undefined;
  if (source) sourceIndex = source.index;
  if (destination) destinationIndex = destination.index;
  return { draggedId, sourceIndex, destinationIndex };
}


export default connect(mapStateToProps)(Infos);