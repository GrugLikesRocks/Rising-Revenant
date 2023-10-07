import React from "react";
import "../../App.css";
import "../styles/StatsPageStyles.css";

import { ClickWrapper } from "../clickWrapper";

export const StatsReactComp: React.FC = () => {
  return (
    // THIS NEEDS THE CLICKWRAPPER COMPONENT IMPLEMENTED FOR THE SCROLL AND THE TEXTFIELD

    <div className="stats-page-container">
      <ClickWrapper className="search-container">
        <div className="search-box font-size-mid-titles">Search:</div>
        <input
          type="text"
          className="text-field font-size-mid-titles"
          placeholder="Type Revenant or outpost ID"
        />
      </ClickWrapper>
      <div className="list-container">
        <div className="individual-list">
          <div className="list-title font-size-mid-titles">Strongest outpost</div>
          <ul className="list-element-stats-page font-size-texts">
            <li>null</li>
          </ul>
        </div>

        <div className="individual-list">
          <div className="list-title font-size-mid-titles">Major lords</div>
          <ul className="list-element-stats-page font-size-texts">
            <li>null</li>
          </ul>
        </div>

        <div className="individual-list">
          <div className="list-title font-size-mid-titles">TBD</div>
          <ul className="list-element-stats-page font-size-texts">
            <li>null</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
