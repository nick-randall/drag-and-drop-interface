interface GhostCardProps {
  index: number;
  image: string;
  offsetLeft?: number;
  offsetTop?: number;
  dimensions: AllDimensions;
  rotation?: number;
  zIndex: number;
}

export const GhostCard = (props: GhostCardProps) => {
  const { dimensions, rotation, image, index, offsetLeft, offsetTop, zIndex } = props;
  const {cardLeftSpread, cardWidth} = dimensions;
  const id = "ghostCard" + image;

  return (
        <img
          alt={image}
          src={`./images/${image}.jpg`}
          id={id}
          style={{
            WebkitFilter: "grayscale(100%)",
            opacity: 0.7,
            width: cardWidth,
            border: "thin solid",
            left: (index) * cardLeftSpread + (offsetLeft || 0),
            top: (offsetTop || 0),
            rotate: rotation + "deg" || "0deg",
            position: "absolute",
            transition: "left 250ms ease",
            zIndex: zIndex,
          }}
        />
  )
  };
export default GhostCard;
