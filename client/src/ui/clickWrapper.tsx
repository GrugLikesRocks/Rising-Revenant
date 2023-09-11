
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

/*
 * Wrap any piece of UI that needs to receive click events with this.
 * Make sure it is unmounted when the click events are no longer needed.
 */

// Modified ClickWrapper with shouldUnmount prop
type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { shouldUnmount?: boolean };

export const ClickWrapper = (props: Props) => {
  const { children, style, shouldUnmount } = props;

  const handleClick = (e: React.MouseEvent) => {
    //console.log("Click event in ClickWrapper:", e);
  };

  if (shouldUnmount) return null;

  return (
    <div {...props} style={{ pointerEvents: "all", ...style }} onClick={handleClick}>
      {children}
    </div>
  );
};
