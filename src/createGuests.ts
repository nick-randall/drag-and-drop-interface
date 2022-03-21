import { v4 as uuidv4 } from "uuid";

const numGuestCardsPerType = 5;
const numUnscheinbar = 4;
const guestCardTypes: GuestCardType[] = ["rumgroelerin", "saufnase", "schleckermaul", "taenzerin"];

interface Specials {
  [name: string]: string[];
}

const specials: Specials = {
  rumgroelerin: ["megaphon", "karaoke", "heliumballon", "meinsong", "smile"],
  saufnase: ["shots", "beerpong", "prost", "raucherzimmer", "barkeeperin"],
  schleckermaul: ["eisimbecher", "suessigkeiten", "midnightsnack", "fingerfood", "partypizza"],
  taenzerin: ["nebelmaschine", "lichtshow", "discokugel", "poledance", "playlist"],
};

//startgast
export const createGuests = () => {
  let guests: GameCard[] = [];
  for (let i = 0; i < numUnscheinbar; i++) {
    const unscheibarerGast: GameCard = {
      id: uuidv4(),
      name: `unscheinbar${i}`,
      placeId: "",
      playerId: "",
      index: 0,
      image: `unscheinbar${i}`,
      pointValue: 1,
      cardType: "guest",
      action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
    };
    guests.push(unscheibarerGast);
  }
  for (let i = 0; i < numGuestCardsPerType; i++) {
    const einfacherGuestCard: GameCard = {
      id: uuidv4(),
      name: `einfach${i}`,
      placeId: "",
      playerId: "",
      index: 0,
      image: `einfach${i}`,
      pointValue: 1,
      cardType: "guest",
      action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
    };
    guests.push(einfacherGuestCard);
    const doppelterGuestCard: GameCard = {
      id: uuidv4(),
      name: `doppelt${i}`,
      placeId: "",
      playerId: "",
      index: 0,
      image: `doppelt${i}`,
      pointValue: 2,
      cardType: "guest",
      action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
    };
    guests.push(doppelterGuestCard);
  }

  for (let guestCardType of guestCardTypes) {
    for (let i = 0; i < numGuestCardsPerType; i++) {
      const guestCard: GameCard = {
        id: uuidv4(),
        name: `${guestCardType}${i}`,
        placeId: "",
        playerId: "",
        index: 0,
        image: `${guestCardType}${i}`,
        pointValue: 1,
        cardType: "guest",
        guestCardType: `${guestCardType}`,
        action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "GCZ", targetPlayerType: "self" },
      };
      guests.push(guestCard);
    }
  }
  return guests;
};

export const createSpecials = () => {
  let specialsCards: GameCard[] = [];
  // for (let i = 0; i < numGuestCardsPerType; i++) {
  for (let guestCardType of guestCardTypes) {
    const specialsOfThisType = specials[guestCardType];

    for (let special of specialsOfThisType) {
      const specialsCard: GameCard = {
        id: uuidv4(),
        name: `${special}`,
        playerId: "",
        placeId: "",
        index: 0,
        image: `${special}`,
        cardType: "special",
        pointValue: 0,
        specialsCardType: `${guestCardType}`,
        action: { actionType: "addDragged", highlightType: "place", placeHighlightType: "specialsZone", targetPlayerType: "self" },
      };
      if(Math.floor(Math.random()  + 0.75) === 0)
      specialsCards.push(specialsCard);
    }
  }
  return specialsCards;
};
