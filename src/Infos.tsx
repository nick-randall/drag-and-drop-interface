import { connect } from "react-redux";
import { RootState } from "./store";

interface ReduxProps  {
  draggedId?: string;
  sourceIndex?: number;
  destinationIndex?: number;
  isInitialRearrange?: boolean 
}
interface InfoProps {}

type ComponentProps = ReduxProps & InfoProps;


const Infos: React.FC<ComponentProps> = ({ sourceIndex, destinationIndex, isInitialRearrange }) => {
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
        isInitialRearrange: {isInitialRearrange? "true": "false"}
      </div>
    </div>
  );
};

function mapStateToProps(state: RootState) {
  const { draggedState, draggedId } = state;
  const { source, destination, isInitialRearrange} = draggedState;
  let sourceIndex,
  trueSourceIndex,
    destinationIndex= undefined;
  if (source) {sourceIndex = source.index}//; trueSourceIndex = source.trueIndex}
  if (destination) destinationIndex = destination.index;
  return { draggedId, sourceIndex, destinationIndex, isInitialRearrange, trueSourceIndex };
}


export default connect(mapStateToProps)(Infos);