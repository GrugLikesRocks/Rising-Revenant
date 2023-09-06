import styled from "styled-components";
import { store } from "../store/store";
import { Wrapper } from "./wrapper";
import { ClickWrapper } from "./clickWrapper";
import {
  DefenceComponent,
  NameComponent,
  LifeComponent,
  ProsperityComponent,
  GetOutpostsReact,
} from "./testComp";
import Navbar from "./navbar";
import React, { useState } from 'react';

import {BuyRevenantButton} from "./buyRevenantButton";



import { MainReactComp } from "./pages/mainPage";
import { RulesReactComp } from "./pages/rulesPage";
import { StatsReactComp } from "./pages/statsPage";
import { TradesReactComp } from "./pages/tradesPage";
import { ProfilePage } from "./pages/profilePage";
import { MapReactComp } from "./pages/mapPage";


enum MenuState {
    MAIN,
    RULES,
    MAP,
    STATS,
    TRADES,
    PROFILE,
  }
  
  export const UI = () => {
    const [menuState, setMenuState] = useState<MenuState>(MenuState.MAIN);
    const layers = store((state) => {
      return {
        networkLayer: state.networkLayer,
        phaserLayer: state.phaserLayer,
      };
    });
  
    if (!layers.networkLayer || !layers.phaserLayer) return <></>;
  
    return (
        <Wrapper>
                <div className="main_menu_container">
                  <div className="top_menu_container">
                    <div className="game_initials_menu">GI</div>
                    <div className="game_title_menu">CLICK ON THE SELECTED MENU TO RETURN BACK TO THE MAIN MENU</div>
                    <button className="connect_button_menu">Connect</button>
                  </div>
                  <div className = "navbar_container">
                    
                    <Navbar menuState={menuState} setMenuState={setMenuState} layer={layers.phaserLayer}/>
                    
                  </div>
                  <div className = "page_container">
                    {menuState === MenuState.MAIN && <MainReactComp  layer={layers.phaserLayer}/>}  
                    {menuState === MenuState.MAP && <MapReactComp/>}
                    {menuState === MenuState.TRADES && <TradesReactComp/>}
                    {menuState === MenuState.PROFILE && <ProfilePage layer={layers.phaserLayer}/>}
                    {menuState === MenuState.STATS && <StatsReactComp/>}
                    {menuState === MenuState.RULES && <RulesReactComp/>}
                  </div>
                </div>
        </Wrapper>
      );
  };

