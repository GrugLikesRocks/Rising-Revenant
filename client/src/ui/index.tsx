import { store } from "../store/store";
import { Wrapper } from "./wrapper";

import { PreFakeIndex } from "./preFakeIndex";

export const UI = () => {
  const layers = store((state) => {
    return {
      networkLayer: state.networkLayer,
      phaserLayer: state.phaserLayer,
    };
  });

  if (!layers.networkLayer || !layers.phaserLayer) return <></>;

  return (
    <Wrapper>
      <PreFakeIndex />
    </Wrapper>
  );
};
