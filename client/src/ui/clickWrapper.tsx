import React, { DetailedHTMLProps, HTMLAttributes } from "react";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const ClickWrapper = (props: Props) => {
  const { children, style, ...restProps } = props;

  const handleClick = (e: React.MouseEvent) => {
    // Handle click event
  };

  return (
    <div {...restProps} style={{ pointerEvents: "all", ...style }} onClick={handleClick}>
      {children}
    </div>
  );
};
