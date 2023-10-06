import React from "react";
import "../../App.css";
import "../styles/StatsPageStyles.css";

import { ClickWrapper } from "../clickWrapper";

export const StatsReactComp: React.FC = () => {
  return (
    // THIS NEEDS THE CLICKWRAPPER COMPONENT IMPLEMENTED FOR THE SCROLL AND THE TEXTFIELD

    <div className="stats-page-container">
      <ClickWrapper className="search-container">
        <div className="search-box">Search:</div>
        <input
          type="text"
          className="text-field"
          placeholder="Type Revenant or outpost ID"
        />
      </ClickWrapper>
      <div className="list-container">
        <div className="individual-list">
          <div className="list-title">strongest outpost</div>
          <ul className="list-element-stats-page">
            <li>null</li>
          </ul>
        </div>

        <div className="individual-list">
          <div className="list-title">major lords</div>
          <ul className="list-element-stats-page">
            <li>null</li>
          </ul>
        </div>

        <div className="individual-list">
          <div className="list-title">tbd</div>
          <ul className="list-element-stats-page">
            <li>null</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
