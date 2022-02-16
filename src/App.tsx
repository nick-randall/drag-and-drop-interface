import React from "react";
import createSpecialsAndGuests from "./createGuests";
import Dragger from "./Dragger";
import DraggerContainer from "./DraggerContainer";
import "./App.css";
import { RootState } from "./store";
import { connect } from "react-redux";
import Infos from "./Infos";

//type CombinedAppProps = AppProps & RootState;

interface ReduxProps {
  draggedCardId: string;
  sourceIndex: number | undefined;
  destinationIndex: number | undefined;
}
interface InfoProps {}

type ComponentProps = ReduxProps & InfoProps;


const CardContainers: React.FC = () => {
  const guestCards: GameCard[] = createSpecialsAndGuests().slice(0, 7);
  const [randomCard]: GameCard[] = createSpecialsAndGuests().slice(0, 1);
  const elementWidth = 100;
  console.log(guestCards);
  const containerOneId = "xxxy2";
  const containerTwoId = "xxxy1";
  return (
    <div>
      <div style={{ left: 200, position: "absolute", top: 500 }}>
        <DraggerContainer id={containerOneId} elementWidth={elementWidth}>
          {guestCards.map((card, index) => (
            <Dragger draggerId={card.id} index={index} containerId={containerOneId} size={elementWidth}>
              {(draggerRef, dragStyles, handleDragStart) => (
                <img
                  ref={draggerRef}
                  onMouseDown={handleDragStart}
                  alt={card.name}
                  key={card.id}
                  style={{
                    width: elementWidth,
                    ...dragStyles,
                  }}
                  src={`./images/${card.image}.jpg`}
                  draggable="false"
                />
              )}
            </Dragger>
          ))}
        </DraggerContainer>
      </div>
      <Dragger draggerId={randomCard.id} index={0} containerId={containerTwoId} size={elementWidth}>
        {(draggerRef, dragStyles, handleDragStart) => (
          <img
            ref={draggerRef}
            alt={randomCard.name}
            key={randomCard.id}
            onMouseDown={handleDragStart}
            style={{
              width: elementWidth,
              ...dragStyles,
            }}
            src={`./images/${randomCard.image}.jpg`}
            draggable="false"
          />
        )}
      </Dragger>
    </div>
  );
};

// const Infos: React.FC<ComponentProps> = ({ sourceIndex, destinationIndex }) => {
//   return (
//     <div>
//       <div style={{ left: 200, position: "absolute", top: 300 }}>
//         source index: {sourceIndex}
//         destination index: {destinationIndex}
//         {/* {props.draggedCardId} */}
//         {/* source id: {props.draggedState.source?.containerId}<br/>
//         source index: {props.draggedState.source?.index}<br/>
//         destination id:{props.draggedState.destination?.containerId}<br/>
//         destination index:{props.draggedState.destination?.index} */}
//       </div>
//     </div>
//   );
// };

 const  App = () => {
  return(
  <div>
    <CardContainers />
    <Infos />
  </div>);
};
export default App;

// function mapStateToProps(state: RootState) {
//   const { draggedState, draggedCardId } = state;
//   const { source, destination } = draggedState;
//   let sourceIndex,
//     destinationIndex = undefined;
//   if (source) sourceIndex = source.index;
//   if (destination) destinationIndex = destination.index;
//   return { draggedCardId, sourceIndex, destinationIndex };
// }

// export default connect(mapStateToProps)(Infos);
// export default App;
