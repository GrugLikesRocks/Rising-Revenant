import React, { useState, useEffect } from 'react';

import { TradesReactComp } from './pages/tradesPage';
import { StatsReactComp } from './pages/statsPage';
import { ProfilePage } from './pages/profilePage';

import { ClickWrapper } from './clickWrapper';
import "../App.css"
import { PhaserLayer } from "../phaser";

enum MenuState {
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

const Navbar: React.FC<NavbarProps> = ({ menuState, setMenuState, layer }) => {
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
      <ClickWrapper shouldUnmount={false} className="main_menu_navbar_container">
      <button className={`navbar_button ${menuState === MenuState.RULES ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.RULES)}>Rules</button>
      <div className="navbar-divider"></div>
      <button className={`navbar_button ${menuState === MenuState.MAP ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.MAP)}>Map</button>
      <div className="navbar-divider"></div>
      <button className={`navbar_button ${menuState === MenuState.STATS ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.STATS)}>Stats</button>
      <div className="navbar-divider"></div>
      <button className={`navbar_button ${menuState === MenuState.TRADES ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.TRADES)}>Trades</button>
      <div className="navbar-divider"></div>
      <button className={`navbar_button ${menuState === MenuState.PROFILE ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.PROFILE)}>Profile</button>
      </ClickWrapper>
  );
};

export default Navbar;
