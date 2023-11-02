import React, { useEffect, useState } from "react";
import { MenuState } from "../Pages/mainMenuContainer";


import "./ComponentsStyles/NavBarStyles.css";

import { ClickWrapper } from "../clickWrapper";



interface NavbarProps {
  menuState: MenuState;
  setMenuState: (menuState: MenuState) => void;
  onIconClick?: (menuState: MenuState) => void;
}

export const NavbarComponent: React.FC<NavbarProps> = ({ menuState, setMenuState, onIconClick }) => {

  const handleIconClick = (selectedState: MenuState) => {
    if (menuState === selectedState) {
      setMenuState(MenuState.NONE);
    } else {
      setMenuState(selectedState);
      if (onIconClick) {
        onIconClick(selectedState);
      }
    }
  };

  useEffect(() => { console.log(menuState) }, [menuState]);

  return (
    <ClickWrapper className="navbar-container">
      <div className={`navbar-icon ${menuState === MenuState.PROFILE ? "active" : "not-active"}`} onClick={() => handleIconClick(MenuState.PROFILE)}>
        <img src="Icons/PROFILE.png" alt="" />
      </div>
      <div className={`navbar-icon ${menuState === MenuState.STATS ? "active" : "not-active"}`} onClick={() => handleIconClick(MenuState.STATS)}>
        <img src="Icons/STATISTICS.png" alt="" />
      </div>
      <div className={`navbar-icon ${menuState === MenuState.SETTINGS ? "active" : "not-active"}`} onClick={() => handleIconClick(MenuState.SETTINGS)}>
        <img src="Icons/SETTINGS.png" alt="" />
      </div>
      <div className={`navbar-icon ${menuState === MenuState.TRADES ? "active" : "not-active"}`} onClick={() => handleIconClick(MenuState.TRADES)}>
        <img src="Icons/TRADES.png" alt="" />
      </div>
      <div className={`navbar-icon ${menuState === MenuState.RULES ? "active" : "not-active"}`} onClick={() => handleIconClick(MenuState.RULES)}>
        <img src="Icons/RULES.png" alt="" />
      </div>
    </ClickWrapper>
  );
};
