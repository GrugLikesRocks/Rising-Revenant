import React, { useEffect } from 'react';

import { ClickWrapper } from '../clickWrapper';
import "../../App.css"
import { PhaserLayer } from "../../phaser";

import { menuEvents } from '../../phaser/systems/eventSystems/eventEmitter';

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
}

export const Navbar: React.FC<NavbarProps> = ({ menuState, setMenuState, layer, passedTimer }) => {

  const toggleMenu = (newState: MenuState) => {
    setMenuState((prevState) => (prevState === newState ? MenuState.MAIN : newState));
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // setNavbarVisible(true);
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

  if (!passedTimer) 
  {
    return (
      <div className="main-menu-navbar-container">
      <button className={`navbar-button ${menuState === MenuState.RULES ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.RULES)}>rules</button>
      <div className="navbar-divider"></div>
      <button className={`navbar-button ${menuState === MenuState.MAP ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.MAP)}>map</button>
      <div className="navbar-divider"></div>
      <button className={`navbar-button ${menuState === MenuState.STATS ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.STATS)}>stats</button>
      <div className="navbar-divider"></div>
      <button className={`navbar-button ${menuState === MenuState.TRADES ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.TRADES)}>trades</button>
      <div className="navbar-divider"></div>
      <button className={`navbar-button ${menuState === MenuState.PROFILE ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.PROFILE)}>profile</button>
      </div>
    );
  }
  else
  {
    // this is probably not the best idea 
    // if ()
    // {
    //   return (
    //     <div className="main-menu-navbar-container">
    //     <ClickWrapper className={`navbar-button ${menuState === MenuState.RULES ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.RULES)}>rules</ClickWrapper>
    //     <div className="navbar-divider"></div>
    //     <button className={`navbar-button ${menuState === MenuState.MAP ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.MAP)}>map</button>
    //     <div className="navbar-divider"></div>
    //     <button className={`navbar-button ${menuState === MenuState.STATS ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.STATS)}>stats</button>
    //     <div className="navbar-divider"></div>
    //     <button className={`navbar-button ${menuState === MenuState.TRADES ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.TRADES)}>trades</button>
    //     <div className="navbar-divider"></div>
    //     <button className={`navbar-button ${menuState === MenuState.PROFILE ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.PROFILE)}>profile</button>
    //     </div>
    // );
    // }
    // else
    // {
      return (
        <ClickWrapper className="main-menu-navbar-container">
        <button className={`navbar-button ${menuState === MenuState.RULES ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.RULES)}>rules</button>
        <div className="navbar-divider"></div>
        <button className={`navbar-button ${menuState === MenuState.MAP ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.MAP)}>map</button>
        <div className="navbar-divider"></div>
        <button className={`navbar-button ${menuState === MenuState.STATS ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.STATS)}>stats</button>
        <div className="navbar-divider"></div>
        <button className={`navbar-button ${menuState === MenuState.TRADES ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.TRADES)}>trades</button>
        <div className="navbar-divider"></div>
        <button className={`navbar-button ${menuState === MenuState.PROFILE ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.PROFILE)}>profile</button>
        </ClickWrapper>
    );
    // }
  }
};

