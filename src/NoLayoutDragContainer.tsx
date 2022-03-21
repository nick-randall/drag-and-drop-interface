import React from "react";

export const NoLayoutDragContainer: React.FC = ({ children }) => (
  <div
    // this is necessary to get correct leftOffset when dragging the card items inside
    // since it is not in a container
    style={{ position: "absolute", display: "flex" }}
  >
    {children}
  </div>
);
