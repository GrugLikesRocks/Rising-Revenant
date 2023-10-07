import React, { useEffect } from 'react';

import { ClickWrapper } from '../clickWrapper';
import "../../App.css"
import { PhaserLayer } from "../../phaser";

import { menuEvents } from '../../phaser/systems/eventSystems/eventEmitter';
import { getComponentValueStrict } from '@latticexyz/recs';
import { GAME_CONFIG } from '../../phaser/constants';

export enum MenuState {
  MAIN,
  RULES,
  MAP,
  STATS,
  TRADES,
  PROFILE,
}

interface NavbarProps {
  menuState: MenuState;
  setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
  layer: PhaserLayer;
  passedTimer: boolean;
  navbarOpacity: number;
}

export const Navbar: React.FC<NavbarProps> = ({ menuState, setMenuState, layer, passedTimer, navbarOpacity }) => {

  const toggleMenu = (newState: MenuState) => {
    setMenuState((prevState) => (prevState === newState ? MenuState.MAIN : newState));
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuState(MenuState.MAIN);
      }
    };


    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    menuEvents.emit('setMenuState', menuState);
  }, [menuState]);

  const {
    networkLayer: {
      components: { ClientGameData },
    },
  } = layer;

  if (!passedTimer || navbarOpacity === 0) {
    return (
      <div className="main-menu-navbar-container">
        <button className="navbar-button">RULES</button>
        <div className="navbar-divider"></div>
        <button className="navbar-button">MAP</button>
        <div className="navbar-divider"></div>
        <button className="navbar-button" >STATS</button>
        <div className="navbar-divider"></div>
        <button className="navbar-button " >TRADES</button>
        <div className="navbar-divider"></div>
        <button className="navbar-button" >PROFILE</button>
      </div>
    );
  }
 
  else { 
    const clientGameData = getComponentValueStrict(ClientGameData, GAME_CONFIG);

    if (clientGameData.current_game_state === 1) {
      return (
        <ClickWrapper className="main-menu-navbar-container">
        <button className={`navbar-button ${menuState === MenuState.RULES ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.RULES)}>RULES</button>
        <div className="navbar-divider"></div>
        <div className="navbar-button-disabled" >MAP</div>
        <div className="navbar-divider"></div>
        <div className="navbar-button-disabled" >STATS</div>
        <div className="navbar-divider"></div>
        <div className="navbar-button-disabled" >TRADES</div>
        <div className="navbar-divider"></div>
        <button className={`navbar-button ${menuState === MenuState.PROFILE ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.PROFILE)}>PROFILE</button>
      </ClickWrapper>
      );
    }
    else {
      return (
        <ClickWrapper className="main-menu-navbar-container">
          <button className={`navbar-button ${menuState === MenuState.RULES ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.RULES)}>RULES</button>
          <div className="navbar-divider"></div>
          <button className={`navbar-button ${menuState === MenuState.MAP ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.MAP)}>MAP</button>
          <div className="navbar-divider"></div>
          <button className={`navbar-button ${menuState === MenuState.STATS ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.STATS)}>STATS</button>
          <div className="navbar-divider"></div>
          <button className={`navbar-button ${menuState === MenuState.TRADES ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.TRADES)}>TRADES</button>
          <div className="navbar-divider"></div>
          <button className={`navbar-button ${menuState === MenuState.PROFILE ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.PROFILE)}>PROFILE</button>
        </ClickWrapper>
      );
    }
  };
}





