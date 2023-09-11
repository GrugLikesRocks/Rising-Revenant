import React from 'react';
import "../../App.css"
import "../styles/StatsPageStyles.css";

export const StatsReactComp: React.FC = () => {
  return (

    // THIS NEEDS THE CLICKWRAPPER COMPONENT IMPLEMENTED FOR THE SCROLL AND THE TEXTFIELD
    <div className="stats-page-container">
      <div className="search-box">
        Search
      </div>
      <input type="text" className="text-field" placeholder="Type Revenant or outpost ID" />
      <div className="list-container">

        
        <div className="individual-list">
          <div className="list-title">Strongest Outpost</div>
          <ul className="list-element-stats-page">
            <li>Add the click wrapper</li>
          </ul>
        </div>




        <div className="individual-list">
          <div className="list-title">Major Lords</div>
          <ul className="list-element-stats-page">
          <li>when the style and comp</li>
          </ul>
        </div>
        <div className="individual-list">
          <div className="list-title">TBD</div>
          <ul className="list-element-stats-page">
            <li>is finalized</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
