import { store } from "../store/store";
import { Wrapper } from "./wrapper";

import { Navbar, MenuState } from "./components/navbar";
import React, { useState, useEffect } from "react";

import { MainReactComp } from "./pages/mainPage";
import { RulesReactComp } from "./pages/rulesPage";
import { StatsReactComp } from "./pages/statsPage";
import { TradesReactComp } from "./pages/tradesPage";
import { ProfilePage } from "./pages/profilePage";
import { MapReactComp } from "./pages/mapPage";

import { ToolTipData } from "./components/gameToolTip";
import {EventCircle} from "./components/eventCircle";

import { gameEvents } from "../phaser/systems/eventSystems/eventEmitter";
// import {CircleOutline} from "./components/eventDrawer";

interface UIProps {
  menuState?: MenuState;
  setMenuState?: React.Dispatch<React.SetStateAction<MenuState>>;
}

// this state passing thing needs to be changed to an event if thats a thing
export const UI = ({ menuState: externalMenuState, setMenuState: externalSetMenuState }: UIProps) => {
  const [internalMenuState, internalSetMenuState] = useState<MenuState>(MenuState.MAIN);
  const [opacity, setOpacity] = useState(1); // New State for opacity
  

  useEffect(() => {
    if (externalMenuState !== undefined) {
      internalSetMenuState(externalMenuState);
    }
  }, [externalMenuState]);

  const actualSetMenuState = externalSetMenuState || internalSetMenuState;
  const actualMenuState = externalMenuState !== undefined ? externalMenuState : internalMenuState;
  
  useEffect(() => {
    const closeTooltip = () => {
      gameEvents.emit("closeTooltip");
    };
    
    if (actualMenuState !== MenuState.MAP) {
      setOpacity(0.85);
      
      // this doesnt work
      closeTooltip();

    } else {
      setOpacity(0);
    }
  }, [actualMenuState]);
  

  const layers = store((state) => {
    return {
      networkLayer: state.networkLayer,
      phaserLayer: state.phaserLayer,
    };
  });

  if (!layers.networkLayer || !layers.phaserLayer) return <></>;

  return (
    <Wrapper>
      <div className="phaser-fadeout-background" style={{ opacity: opacity }}></div>
      <div className="main-menu-container">
        <div className="top-menu-container">
          <div className="game-initials-menu">
          <div className="game-initials-menu-image-background">
            <div className="game-initials-menu-image"></div>
          </div>
          </div>
          <div className="game-title-menu">
            <div className="game-title-menu-text"></div>
          </div>
          <button className="connect-button-menu">Connect</button>
        </div>
        <div className="navbar-container">
          <Navbar
            menuState={actualMenuState}
            setMenuState={actualSetMenuState}
            layer={layers.phaserLayer}
          />
        </div>
        <div className="page-container">
          {actualMenuState === MenuState.MAIN && (
            <MainReactComp layer={layers.phaserLayer} />
          )}
          {actualMenuState === MenuState.MAP && <MapReactComp layer={layers.phaserLayer} />}
          {actualMenuState === MenuState.TRADES && <TradesReactComp />}
          {actualMenuState === MenuState.PROFILE && (
            <ProfilePage layer={layers.phaserLayer} />
          )}
          {actualMenuState === MenuState.STATS && <StatsReactComp />}
          {actualMenuState === MenuState.RULES && <RulesReactComp />}
        </div>

        <ToolTipData layer={layers.phaserLayer} />
        <EventCircle layer={layers.phaserLayer} />
        {/* <CircleOutline layer = {layers.phaserLayer} /> */}

      </div>
    </Wrapper>
  );
};
