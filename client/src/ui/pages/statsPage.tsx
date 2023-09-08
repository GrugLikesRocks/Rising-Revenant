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
      <input type="text" className="text-field" placeholder="Search..." />
      <div className="list-container">
        <div className="individual-list">
          <div className="list-title">List 1</div>
          <ul className="scrollable-list">
            <li>Add the click wrapper</li>
          </ul>
        </div>
        <div className="individual-list">
          <div className="list-title">List 2</div>
          <ul className="scrollable-list">
          <li>when the style and comp</li>
          </ul>
        </div>
        <div className="individual-list">
          <div className="list-title">List 3</div>
          <ul className="scrollable-list">
            <li>is finalized</li>
            <li>daiojad</li>
            <li>daiojad</li>
            <li>daiojad</li>
            <li>daiojad</li>
            <li>daiojad</li>
            <li>daiojad</li><li>daiojad</li>
            <li>daiojad</li>
            <li>daiojad</li>
            <li>daiojad</li>
            <li>daiojad</li>
            <li>daiojad</li>
            <li>daiojad</li>
            <li>daiojad</li><li>daiojad</li>
            <li>daiojad</li>
            <li>daiojad</li>
            <li>daiojad</li>
            <li>daiojad</li>
            <li>daiojad</li>
            <li>daiojad</li>
            <li>daiojad</li><li>daiojad</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
