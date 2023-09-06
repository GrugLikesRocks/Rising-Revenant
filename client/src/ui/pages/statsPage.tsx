import React from 'react';
import "../../App.css"

export const StatsReactComp: React.FC = () => {
  return (
    <div className="stats-page-container">
      <div className="search-box">
        Search
      </div>
      <input type="text" className="text-field" placeholder="Search..." />
      <div className="list-container">
        <div className="individual-list">
          <div className="list-title">List 1</div>
          <ul className="scrollable-list">
            {/* Your list items */}
          </ul>
        </div>
        <div className="individual-list">
          <div className="list-title">List 2</div>
          <ul className="scrollable-list">
            {/* Your list items */}
          </ul>
        </div>
        <div className="individual-list">
          <div className="list-title">List 3</div>
          <ul className="scrollable-list">
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
