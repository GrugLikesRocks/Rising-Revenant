import { PhaserLayer } from "../../phaser";
import { useDojo } from "../../hooks/useDojo";

import "../../App.css";

import { ClickWrapper } from "../clickWrapper";

type ExampleComponentProps = {
  layer: PhaserLayer;
};

export const DebugMenuSection = ({ layer }: ExampleComponentProps) => {
  const {
    networkLayer: {
      components: {},
    },
  } = layer;

  const {
    account: { account },
    networkLayer: {
      systemCalls: {
        create_game,
        register_player,
        set_world_event,
      },
    },
  } = useDojo();

  return (
    <ClickWrapper className="debug-menu">
      <div className="debug-title">Debug Menu</div>
      <button className="debug-button"  onClick={() => create_game(account)} > Create Game</button>
      <button className="debug-button"  onClick={() => register_player(account)} > Register Player</button>
      <button className="debug-button"  onClick={() => set_world_event(account)} > Run Event</button>
    </ClickWrapper>
  );
};
