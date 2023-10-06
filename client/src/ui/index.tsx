import { store } from "../store/store";
import { Wrapper } from "./wrapper";

import { MenuState } from "./components/navbar";
import { useState, useEffect } from "react";

import { menuEvents, tooltipEvent } from "../phaser/systems/eventSystems/eventEmitter";

import "../App.css";

import { MainMenuComponent } from "./components/mainMenuComponent";

export const UI = () => {
  const [phaserLayerOpacity, setPhaserLayerOpacity] = useState(1);
  const [menuState, setMenuState] = useState<MenuState>(MenuState.MAIN);

  const layers = store((state) => {
    return {
      networkLayer: state.networkLayer,
      phaserLayer: state.phaserLayer,
    };
  });

  const SetMenuState = (state: MenuState) => {
    console.log("called state change for menu", state);
    setMenuState(state);
  };

  //opacity control based on menu state
  useEffect(() => {

    if (menuState !== MenuState.MAP) {
      setPhaserLayerOpacity(0.9);

      tooltipEvent.emit("closeTooltip", false);
    } else {
      setPhaserLayerOpacity(0);
    }

    menuEvents.on("setMenuState", SetMenuState);

    return () => {
      menuEvents.off("setMenuState", SetMenuState);
    };
  }, [menuState]);

  if (!layers.networkLayer || !layers.phaserLayer) return <></>;

  return (
    <Wrapper>
      <div
        className="phaser-fadeout-background"
        style={{ opacity: phaserLayerOpacity }}
      ></div>

      <MainMenuComponent layer={layers.phaserLayer} />
    </Wrapper>
  );
};
