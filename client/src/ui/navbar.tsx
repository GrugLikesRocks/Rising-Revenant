import React, { useState, useEffect } from 'react';
import { Page1 } from './Page1';
import { Page2 } from './Page2';
import { ProfilePage } from './profilePage';
import { ClickWrapper } from './clickWrapper';
import "../App.css"
import { PhaserLayer } from "../phaser";
import { set } from 'mobx';

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
    <div>
      
        <div className={`navbar-container ${!isNavbarVisible ? 'fade-out' : ''}`}>
          {/* <div className="navbar-background"> */}
            <ClickWrapper shouldUnmount={!isNavbarVisible} className="navbar-background">
            <button className={`navbar-button ${menuState === MenuState.RULES ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.RULES)}>Rules</button>
            <div className="navbar-divider"></div>
            <button className={`navbar-button ${menuState === MenuState.MAP ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.MAP)}>Map</button>
            <div className="navbar-divider"></div>
            <button className={`navbar-button ${menuState === MenuState.STATS ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.STATS)}>Stats</button>
            <div className="navbar-divider"></div>
            <button className={`navbar-button ${menuState === MenuState.TRADES ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.TRADES)}>Trades</button>
            <div className="navbar-divider"></div>
            <button className={`navbar-button ${menuState === MenuState.PROFILE ? 'selected' : ''}`} onClick={() => toggleMenu(MenuState.PROFILE)}>Profile</button>
            </ClickWrapper>
        </div>

        <div className={`background ${!isNavbarVisible ? 'background-fade-out' : ''}`}></div>

        <div>
          {menuState === MenuState.MAIN && <div></div>}
          {menuState === MenuState.MAP && <Page1 />}
          {menuState === MenuState.TRADES && <Page2 />}
          {menuState === MenuState.PROFILE && <ProfilePage layer={layer} />}

          {/* ... other pages */}
        </div>
    </div>
  );
};

export default Navbar;
