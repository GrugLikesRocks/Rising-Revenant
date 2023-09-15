import React, { useState, useEffect } from 'react';

import { ClickWrapper } from '../clickWrapper';
import "../../App.css"
import { PhaserLayer } from "../../phaser";

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
}

export const Navbar: React.FC<NavbarProps> = ({ menuState, setMenuState, layer }) => {
  const [isNavbarVisible, setNavbarVisible] = useState(true);

  const toggleMenu = (newState: MenuState) => {
    if (newState === MenuState.MAP) {
      setNavbarVisible(false);
    } else {
      setNavbarVisible(true);
    }
    setMenuState((prevState) => (prevState === newState ? MenuState.MAIN : newState));
  };

  useEffect(() => {

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNavbarVisible(true);
        setMenuState(MenuState.MAIN);  
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

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
};

