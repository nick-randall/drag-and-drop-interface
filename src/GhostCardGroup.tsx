import GhostCard from "./GhostCard";

export interface GhostCardGroupProps {
  index: number;
  ghostCardGroup: CardGroupObj;
  dimensions: AllDimensions;
}

interface CardOffset {
  left: number;
  top: number;
}

const GhostCardGroup = (props: GhostCardGroupProps) => {
  const { ghostCardGroup, index, dimensions } = props;
  const { cardHeight, cardLeftSpread } = dimensions;

  const getOffset = (card: GameCard, ghostCardGroupIndex: number): CardOffset => {
    if (card.cardType === "bff") return { top: cardHeight / 2, left: cardLeftSpread / 2 };
    if (card.cardType === "zwilling") return { top: cardHeight / 2, left: 0 };
    if (ghostCardGroupIndex > 0) return { top: 0, left: cardLeftSpread };
    else return { top: 0, left: 0 };
  };

  return (
    <div id={`ghostcard-absolute-positioning-container${ghostCardGroup}`} style={{ position: "absolute", zIndex: 0 }}>
      <div id={`ghostcard-relative-positioning-container${ghostCardGroup}`} style={{ position: "relative" }}>
        {ghostCardGroup.cards.map((ghostCard, ghostCardGroupIndex) => (
          <GhostCard
            index={index}
            image={ghostCard.image}
            dimensions={dimensions}
            key={ghostCard.id}
            offsetLeft={getOffset(ghostCard, ghostCardGroupIndex).left}
            offsetTop={getOffset(ghostCard, ghostCardGroupIndex).top}
            zIndex={5}
          />
        ))}
      </div>
    </div>
  );
};
export default GhostCardGroup;
