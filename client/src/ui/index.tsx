import { store } from "../store/store";
import { Wrapper } from "./wrapper";
import React, { useState } from "react";
import { MainMenuContainer } from "./Pages/mainMenuContainer";
import { VideoComponent } from "./videoPage";


export const UI = () => {
  const layers = store((state) => {
    return {
      networkLayer: state.networkLayer,
      phaserLayer: state.phaserLayer,
    };
  });

  const [loadingComplete, setLoadingState] = useState(false);

  
  const handleLoadingComplete = () => {
    setLoadingState(true);
  };

  if (!layers.networkLayer || !layers.phaserLayer) return <></>;

  return (
    <Wrapper>
      {loadingComplete === false ? <VideoComponent onLoadingComplete={handleLoadingComplete}/>  :  <MainMenuContainer/>}
    </Wrapper>
  );
};
