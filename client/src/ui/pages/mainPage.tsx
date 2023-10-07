import React from "react";
import { SummonRevenantButton } from "../components/summonRevenantButton";
import { PhaserLayer } from "../../phaser";
import "../../App.css";
import "../styles/MainPageStyle.css";

// import { EventList } from "../components/eventFeedMainMenu";
import { EventFeed } from "../components/eventFeedComponent";

import { DebugMenuSection } from "../components/debugMenuSection";

export const MainReactComp: React.FC<{
  layer: PhaserLayer;
  timerPassed: boolean;
}> = ({ layer, timerPassed }) => {

  const onDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("Div clicked");
  };

  return (
    <div className="main-page-container">
      <div className="main-page-central-container">
        <div className="main-menu-side-section-container">
          <DebugMenuSection layer={layer} />
        </div>

        <div
          className={`main-menu-middle-section-image ${
            timerPassed ? "blurred-off" : "blurred-on"
          }`}
          onClick={onDivClick}
        ></div>

        <div className="main-menu-side-section-container">
        </div>
      </div>

      <EventFeed layer={layer} timerPassed={timerPassed}/>
      
      <div
        className={`main-menu-button-container ${
          timerPassed ? "grey-scale-off" : "grey-scale-on"
        }`}
      >

          <SummonRevenantButton layer={layer} timerPassed={timerPassed} />
      
      </div>
    </div>
  );
};
