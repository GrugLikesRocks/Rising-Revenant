import { PhaserLayer } from "../../phaser";
import { useDojo } from "../../hooks/useDojo";

import "../../App.css";

import { ClickWrapper } from "../clickWrapper";
import { EntityIndex, getComponentValue, Has} from "@latticexyz/recs";
import { GAME_ID } from "../../phaser/constants";

import {useEntityQuery} from "@latticexyz/react";

type ExampleComponentProps = {
  layer: PhaserLayer;
};

export const DebugMenuSection = ({ layer }: ExampleComponentProps) => {
  const {
    networkLayer: {
      components: {GameEntityCounter},
    },
  } = layer;

  const {
    account: { account },
    networkLayer: {
      systemCalls: {
        create_game,
        set_world_event,
      },
    },
  } = useDojo();

  const gameDataEntities = useEntityQuery([Has(GameEntityCounter)]); // to delete


  if (gameDataEntities.length === 0) 
  {
   return <ClickWrapper className="debug-menu">
    <div className="debug-title">Debug Menu</div>
    <button className="debug-button"  onClick={() => create_game(account)} >Create Game</button>
  </ClickWrapper>
  }
  else
  {
   return <ClickWrapper className="debug-menu">
    <div className="debug-title">Debug Menu</div>
    {/* <button className="debug-button"  onClick={() => create_game(account)} >Create Game</button> */}
    <button className="debug-button" onClick={() => set_world_event(account)} >Run Event</button>
    <button className="debug-button">Number of entities in the game {getComponentValue(GameEntityCounter,gameDataEntities[0])?.outpost_count || 0}</button>
    <button className="debug-button">Number of events in the game {getComponentValue(GameEntityCounter,gameDataEntities[0])?.event_count || 0}</button>
  </ClickWrapper>
  }


};
