import React from "react";
import createSpecialsAndGuests from "./createGuests";
import Dragger from "./Dragger";
import DraggerContainer from "./DraggerContainer";
import "./App.css";
import { RootState } from "./store";
import { connect } from "react-redux";



//type CombinedAppProps = AppProps & RootState;



function App() {
  const guestCards: GameCard[] = createSpecialsAndGuests().slice(0, 7);
  const [randomCard]: GameCard[] = createSpecialsAndGuests().slice(0, 1);
  const elementWidth = 100;
  console.log(guestCards);
  const containerOneId = "xxxy2"
  const containerTwoId = "xxxy1"
  


  return (
    <div>
      <div style={{left: 200, position:"absolute", top:300}}>
        {/* {props.draggedCardId} */}
        {/* source id: {props.draggedState.source?.containerId}<br/>
        source index: {props.draggedState.source?.index}<br/>
        destination id:{props.draggedState.destination?.containerId}<br/>
        destination index:{props.draggedState.destination?.index} */}
      </div>
      <div style={{left: 200, position:"absolute", top:500}}>
      <DraggerContainer id={containerOneId} elementWidth={elementWidth}>
        {guestCards.map((card, index) => (
          <Dragger draggerId={card.id} index={index} containerId = {containerOneId} size={elementWidth}>
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
}
function mapStateToProps(state: RootState) {
  const { draggedState, draggedCardId } = state
  return { draggedCardId, draggedState }
}

export default connect(mapStateToProps)(App)
// export default App;
