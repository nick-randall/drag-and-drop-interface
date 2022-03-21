import Card from "./Card";
import Dragger from "./Dragger";

export interface CardGroupProps {
  cardGroup: CardGroupObj;
  index: number;
  dimensions: AllDimensions;
  containerId: string
}

interface CardOffset {
  left: number;
  top: number;
}

const CardGroup = (props: CardGroupProps) => {
  const { cardGroup, index, dimensions } = props;
  const { cardHeight, cardLeftSpread } = dimensions;

  const getOffset = (card: GameCard, cardGroupIndex: number): CardOffset => {
    if (card.cardType === "bff") return { top: cardHeight / 2, left: cardLeftSpread / 2 };
    if (card.cardType === "zwilling") return { top: cardHeight / 2, left: 0 };
    if (cardGroupIndex > 0) return { top: 0, left: cardLeftSpread };
    else return { top: 0, left: 0 };
  };

  return (
    <Dragger draggerId={cardGroup.id} index={index} containerId={props.containerId}>
      {ref => (
        <div
          // Container only the size of cardLeftSpread ie. able to be smaller
          // than the size of the cardGroups and allows overlapping cardGroups.
          // It represents the matrix of draggable elements
          style={{
            // transition: "300ms",
            width: cardGroup.size === 2 ? cardLeftSpread * 2 : cardLeftSpread,
            // this here determines height of GCZ dragover area
            height: cardHeight * 1.5,
          }}
        >
          <div
            // This relative container allows the cards to be positioned absolutely within the CardGroup
            style={{ position: "relative" }}
          >
            {cardGroup.cards.map((card, cardGroupIndex) => (
              <Card
                containerId={props.containerId}
                offsetTop={getOffset(card, cardGroupIndex).top}
                offsetLeft={getOffset(card, cardGroupIndex).left}
                //cardGroupIndex={cardGroupIndex}
                id={card.id}
                image={card.image}
                index={index}
                dimensions={dimensions}
                key={card.id}
              />
            ))}
          </div>
        </div>
      )}
    </Dragger>
  );
};
export default CardGroup;
