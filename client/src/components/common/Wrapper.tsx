import React from "react";

interface Props {}

export const Wrapper: React.FC<Props> = children => (
  <div>
    <div>header</div>
    <div>{children}</div>
    <div>footer</div>
  </div>
);
