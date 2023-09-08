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
    if (actualMenuState === MenuState.MAP) {
      setOpacity(0);
    } else {
      setOpacity(1);
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
      <div className="main_menu_container">
        <div className="top_menu_container">
          <div className="game_initials_menu">GI</div>
          <div className="game_title_menu">
            CLICK ON THE SELECTED MENU TO RETURN BACK TO THE MAIN MENU
          </div>
          <button className="connect_button_menu">Connect</button>
        </div>
        <div className="navbar_container">
          <Navbar
            menuState={actualMenuState}
            setMenuState={actualSetMenuState}
            layer={layers.phaserLayer}
          />
        </div>
        <div className="page_container">
          {actualMenuState === MenuState.MAIN && (
            <MainReactComp layer={layers.phaserLayer} />
          )}
          {actualMenuState === MenuState.MAP && <MapReactComp />}
          {actualMenuState === MenuState.TRADES && <TradesReactComp />}
          {actualMenuState === MenuState.PROFILE && (
            <ProfilePage layer={layers.phaserLayer} />
          )}
          {actualMenuState === MenuState.STATS && <StatsReactComp />}
          {actualMenuState === MenuState.RULES && <RulesReactComp />}
        </div>
      </div>
    </Wrapper>
  );
};
