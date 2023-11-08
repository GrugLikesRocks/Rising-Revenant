import { store } from "../store/store";
import { Wrapper } from "./wrapper";
import React, { useState } from "react";
import { MainMenuContainer } from "./Pages/mainMenuContainer";
import { VideoComponent } from "./videoPage";

import {getComponentValueStrict} from "@latticexyz/recs";

import { LoadingComponent } from "./loadingComponent";
import { decimalToHexadecimal } from "../utils";
import { GAME_CONFIG } from "../phaser/constants";


export const UI = () => {
  const layers = store((state) => {
    return {
      networkLayer: state.networkLayer,
      phaserLayer: state.phaserLayer,
    };
  });

  const [loadingComplete, setLoadingState] = useState(false);
  const [gamePhase, setGamePhase] = useState(3); 

  if (!layers.networkLayer || !layers.phaserLayer) return <></>;

  const handleLoadingComplete = () => {
    setLoadingState(true);
    const clientGameData = getComponentValueStrict(layers.networkLayer!.network.clientComponents.ClientGameData, decimalToHexadecimal(GAME_CONFIG));

    setGamePhase(clientGameData.current_game_state);
    console.log("setting the game phase at ", clientGameData.current_game_state);
  };


  const onVideoDone = () => {
    setGamePhase(2);
  };

  return (
    <Wrapper>

      {gamePhase === 3 && <LoadingComponent handleLoadingComplete={handleLoadingComplete}></LoadingComponent>}

      {gamePhase === 1 && <VideoComponent onVideoDone={onVideoDone}></VideoComponent>}
      {gamePhase === 2 && <MainMenuContainer></MainMenuContainer> }
    </Wrapper>
  );
};


 // {loadingComplete === false ? <VideoComponent onLoadingComplete={handleLoadingComplete}/>  :  <MainMenuContainer/>}