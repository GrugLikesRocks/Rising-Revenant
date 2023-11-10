import { store } from "../store/store";
import { Wrapper } from "./wrapper";

import { MainStateManager } from "./fakeIndex";

import { LoadingComponent } from "./loadingComponent";
import { useState } from "react";

export const UI = () => {
  const [loadingComplete, setLoadingState] = useState(false);

  const layers = store((state) => {
    return {
      networkLayer: state.networkLayer,
      phaserLayer: state.phaserLayer,
    };
  });


  if (!layers.networkLayer || !layers.phaserLayer) return <></>;

  const handleLoadingComplete = () => {
    setLoadingState(true);
  };

  return (
    <Wrapper>
      {loadingComplete === false && <LoadingComponent handleLoadingComplete={handleLoadingComplete}></LoadingComponent>}
      {loadingComplete && <MainStateManager />}
    </Wrapper>
  );
};

