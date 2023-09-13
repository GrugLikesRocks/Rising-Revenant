
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

/*
 * Wrap any piece of UI that needs to receive click events with this.
 * Make sure it is unmounted when the click events are no longer needed.
 */

// Modified ClickWrapper with shouldUnmount prop
// this prob can be delete the unmount
type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { shouldUnmount?: boolean };

export const ClickWrapper = (props: Props) => {
  const { children, style } = props;

  const handleClick = (e: React.MouseEvent) => {
    //console.log("Click event in ClickWrapper:", e);
  };
  
  return (
    <div {...props} style={{ pointerEvents: "all", ...style }} onClick={handleClick}>
      {children}
    </div>
  );
};
