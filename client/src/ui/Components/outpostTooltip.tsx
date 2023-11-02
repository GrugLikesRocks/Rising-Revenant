import React, { useState } from "react";

import "./ComponentsStyles/OutpostTooltipStyles.css";

import { MenuState } from "../Pages/mainMenuContainer";

import { ClickWrapper } from "../clickWrapper";

interface OutpostTooltipProps {}

export const OutpostTooltipComponent: React.FC<OutpostTooltipProps> = ({}) => {
  const [multiOutpost, setMultiOutpost] = useState(true);

  return (
    <div className="outpost-tooltip-container">
      <div className="outpost-data-container">
        <div
          className="top-right-button"
          style={{ fontSize: "2rem", top: "8px", right: "8px" }}
        >
          X
        </div>
        <h1>OUTPOST DATA</h1>
        <h3>X:6362, Y:8127</h3>
        <h3>Reinforcements: 4</h3>
        <h3>State: In Event</h3>
        <ClickWrapper className="outpost-data-event-button">Confirm Event</ClickWrapper>
      </div>

      <div className="revenant-data-container">
        <h1>REVENANT DATA</h1>
        <h3>Owner: 0x635...732</h3>
        <h3>Name: Rev Name</h3>
        <h3>ID: 231</h3>
      </div>

      {multiOutpost === true && (
        <ClickWrapper className="multi-out-container">
          <button className="outpost-data-event-button ">{"<"}</button>
          <div>
            <h3>Outposts: 2/4</h3>
          </div>
          <button className="outpost-data-event-button "> {">"} </button>
        </ClickWrapper>
      )}
    </div>
  );
};
