import React from "react";
import { BuyRevenantButton } from "../components/buyRevenantButton";
import { PhaserLayer } from "../../phaser";
import "../../App.css";
import { ClickWrapper } from "../clickWrapper";
import "../styles/MainPageStyle.css";

import {EventList} from "../components/eventListMainMenu";

import {DebugMenuSection} from "../components/debugMenuSection";

export const MainReactComp: React.FC<{ layer: PhaserLayer }> = ({ layer }) => {

  const onDivClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log("Div clicked");
  };

  return (
    <div className="main-page-container">
      <div className="main-page-central-container">
        <div className="main-menu-side-section-container">

          <DebugMenuSection layer={layer} />

        </div>

        <div className="main-menu-middle-section-image" onClick={onDivClick}></div>
        
        <div className="main-menu-side-section-container">
          <div className="main-menu-list-container">
            <div className="main-menu-event-list-title">event feed</div>
            <ClickWrapper> 
            <EventList layer={layer} />
            </ClickWrapper>
          </div>
        </div>


      </div>

      <div className="main-menu-button-container">
        <ClickWrapper>
          <BuyRevenantButton layer={layer} />
        </ClickWrapper>
      </div>
    </div>
  );
};
