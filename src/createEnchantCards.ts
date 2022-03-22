import { v4 as uuidv4 } from "uuid";

const createEnchantCards = (): GameCard[] => {
  const numEnchantCardsPerType = 2;
  let enchantCards: GameCard[] = [];
  for (let i = 0; i < numEnchantCardsPerType + 1; i++) {
    const bff: GameCard = {
      id: uuidv4(),
      name: `bffs${i}`,
      placeId: "",
      playerId: "",
      index: 0,
      image: `bffs`,
      pointValue: 0,
      cardType: "bff",
      action: { actionType: "enchantWithBff", highlightType: "card", cardHighlightType: "guest", targetPlayerType: "self" },
    };
    enchantCards.push(bff);
    const zwilling: GameCard = {
      id: uuidv4(),
      name: `zwilling${i}`,
      placeId: "",
      playerId: "",
      index: 0,
      image: `zwilling`,
      pointValue: 0,
      cardType: "zwilling",
      action: { actionType: "enchant", highlightType: "card", cardHighlightType: "guest", targetPlayerType: "self" },
    };
    enchantCards.push(zwilling);
  }
  return enchantCards;
};

export default createEnchantCards;
