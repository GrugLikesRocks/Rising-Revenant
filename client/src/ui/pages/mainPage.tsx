import React from "react";
import { BuyRevenantButton } from "../components/buyRevenantButton";
import { PhaserLayer } from "../../phaser";
import "../../App.css";
import { ClickWrapper } from "../clickWrapper";
import "../styles/MainPageStyle.css";

import { EventList } from "../components/eventFeedMainMenu";

import { DebugMenuSection } from "../components/debugMenuSection";
import { getComponentValueStrict } from "@latticexyz/recs";

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
          <EventList layer={layer} timerPassed={timerPassed}/>

                  {/* <div className={`main-menu-list-container ${timerPassed ? "opaque-on" : "opaque-off"}`}>
                    <div className="main-menu-event-list-title">event feed</div>
                    <ClickWrapper >
                      <EventList layer={layer}/>
                    </ClickWrapper>
                  </div>
                  </div> */}
        </div>
      </div>

      <div
        className={`main-menu-button-container ${
          timerPassed ? "grey-scale-off" : "grey-scale-on"
        }`}
      >
        <ClickWrapper>
          <BuyRevenantButton layer={layer} timerPassed={timerPassed} />
        </ClickWrapper>
      </div>
    </div>
  );
};
