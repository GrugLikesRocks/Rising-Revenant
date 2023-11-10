import React, { useEffect, useState } from "react";

import { ClickWrapper } from "../clickWrapper";


export const VideoComponent = ({
  onVideoDone,
}: {
  onVideoDone: () => void;
}) => {

  return (
    <ClickWrapper>
      <div
        style={{
          backgroundColor: "red",
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      >
        {/* <div id="youtube-player" style={{ position: "absolute", top: 0, left: 0 }}></div> */}
       
; 
        <button
          onMouseDown={() => {
            onVideoDone();
          }}
          style={{ position: "absolute", top: "50%", left: "50%" }}
        >
          skip video
        </button>
      </div>
    </ClickWrapper>
  );
};
