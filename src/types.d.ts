type CardGroup = GameCard[];

type PlaceDimensions = {
  cardHeight: number;
  cardWidth: number;
  cardLeftSpread: number;
  cardTopSpread: number;
  leftOffset: number;
  topOffset: number;
  zIndex: number;
  featuredCardScale: number;
};

type CardDimensions = {
  cardHeight: number;
  cardWidth: number;
  cardLeftSpread: number;
  cardTopSpread: number;
  leftOffset: number;
  topOffset: number;
  draggedCardScale: number;
  draggedCardWidth: number;
  draggedCardzIndex: number;
  tableCardzIndex: number;
  rotation: number;
  featuredCardScale: number;
};

type AllDimensions = {
  cardHeight: number;
  cardWidth: number;
  cardLeftSpread: number;
  cardTopSpread: number;
  maxCardLeftSpread?: number;
  draggedCardScale: number;
  draggedCardWidth: number;
  draggedCardzIndex: number;
  tableCardzIndex: number;
  rotation: (index: number) => number;
  scale: number
  featuredCardScale: number;
  zIndex: number;
  handToTableScaleFactor: number;
  tableCardHeight: number;
  tableCardWidth: number;
  // leftOffset: number;
  // topOffset: number;
};

type LegalTargetCardStatus = "noLegalTargets" | "legalTarget" | "notAmongLegalTargets" | "placeIsLegalTarget" | "placeIsRearranging";
type LegalTargetPlaceStatus = "noLegalTargets" | "legalTarget" | "notAmongLegalTargets" | "rearranging" | "enchantmentsRowRearranging";

type OriginalStyles = {
  left: number;
  top: number;
  height?: number;
  width?: number;
};

type LegalTargetType = "player" | "place" | "card";

type GameCard = {
  [key: string]: value;
  id: string;
  name: string;
  playerId?: string; // player should be an id ??
  placeId: string; // place should be an id ??
  index: number;
  image: string;
  cardType: CardType;
  pointValue: number;
  guestCardType?: GuestCardType;
  specialsCardType?: GuestCardType;
  blitzAction?: BlitzActionType;
  numGuestPlaces?: number;
  action: CardAction;
};

type PlaceActionType = "addDragged";

type CardActionType = "destroy" | "steal" | "enchantWithBff" | "enchant" | "swap";

type PlayerActionType = "protectSelf";

type BlitzActionType = "";

type ActionType = PlaceActionType | CardActionType | PlayerActionType;

type HighlightType = "card" | "place" | "player" | "";

type TargetPlayerType = "enemy" | "self";

type CardAction = {
  actionType: ActionType;
  highlightType: HighlightType;
  targetPlayerType: TargetPlayerType;
  cardHighlightType?: CardType;
  placeHighlightType?: PlaceType;
};

type LocationData = {droppableId: string, index: number}

type DropResultEvent = {
  source: LocationData,
  destination: LocationData
}

// type TablePositionLocator = {
//   targetIndex: number;
//   targetPlace: PlaceType;
//   targetPlayer: number;
// };

type CardType = "guest" | "unwanted" | "instant" | "interrupt" | "bff" | "zwilling" | "fillCard" | "ghostCard" | "special";

type GuestCardType = "saufnase" | "taenzerin" | "schleckermaul" | "rumgroelerin" | "";

type GhostCard = {
  index: number;
  player: number;
  place: PlaceType;
};

type PlaceType = "GCZ" | "UWZ" | "specialsZone" | "hand" | "deck" | "discardPile" | "enchantmentsRow";

// DB prototype
type Place = {
  id: string;
  maxNumCards: number;
  acceptedCardType: CardType;
  player: number;
};
// Game object
type GamePlace = {
  id: string;
  placeType: PlaceType;
  playerId?: string;
  cards: GameCard[];
  acceptedCardType?: CardType;
  // numCards should be INFERRED from GameCards
  // but where does this happen? useEffect of app?
  // => gameState can still be interpreted from database--which we do after every DB update
  //numCards: number;
};

type GamePlayer = {
  id: string;
  name: string;
  // current: boolean;
  // currentPhase: Phase;
  // draws: number;
  // plays: number;
  // rolls: number;

  places: PlayerPlaces;

  //points:number;//??????
  glitzaglitza: boolean;
  skipNextTurn: boolean;
};
// type Phase = "normalDrawPhase" | "normalActionPhase" | "normalRollPhase" | "specialDrawOrPlayPhase";
type Phase = "normalPhase" |  "rollPhase" |"counterPhase" ;


type PlayerPlaces = {
  [type: string]: GamePlace;
};
// type PlayerPlaces = {
//  "GCZ" : GamePlace
// , "UWZ": GamePlace
// , "specialsZone": GamePlace
// , "hand": GamePlace
// , "enchantmentsRow": GamePlace;
// }

type NonPlayerPlaces = {
  [type: string]: GamePlace;
};
// type NonPlayerPlaces = {
//   deck: GamePlace;
//   discardPile: GamePlace;
// };

// type Phase = "normal" | "roll" | "counter";

type Current = {
  player: number,
  phase: Phase,
  plays: number,
  draws: number,
  rolls: number, 
}

type GameSnapshot = {
  current: Current;
  players: GamePlayer[];
  nonPlayerPlaces: NonPlayerPlaces;
};

type CardTransitionData = {
  origin: TopLeftCoordinates;
  wait: number; // if transition is not first in the queue
  duration: number;
  animation: AnimationData;
};

type TransitionData = {
  cardId: string;
  originDelta: TopLeftCoordinates;
  wait: number; // if transition is not first in the queue
  duration: number;
  curve: string;
  originDimensions: AllDimensions;
  cardInitialrotation: number;
  startAnimationDuration: number
  startAnimation: string;
};

type TransitionDataEvents = {
  card: GameCard;
  origin: TopLeftCoordinates;
  animation: AnimationData;
  duration: number;
}[];

type LegalTarget = {
  type: LegalTargetType;
  targetId: string;
  draggedCard: GameCard;
  isRearrange?: boolean;
  placeOffset?: number;
  draggedOverIndex?: number;
};

type Refs = {
  [id: string]: HTMLElement;
};

type CardGroupObj = {
  id: string;
  size: number;
  cards: CardGroup;
};

type Hover = "shortHover" | "longHover" | "none";
