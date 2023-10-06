import { EntityIndex, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";
import { PhaserLayer } from "../../phaser";
import { useDojo } from "../../hooks/useDojo";

import "../../App.css";
import { GAME_CONFIG } from "../../phaser/constants";
import { ClickWrapper } from "../clickWrapper";

type ExampleComponentProps = {
  layer: PhaserLayer;
  timerPassed: boolean;
};

export const SummonRevenantButton = ({ layer,timerPassed }: ExampleComponentProps) => {
  const {
    networkLayer: {
      components: {GameEntityCounter,ClientGameData },
    },
  } = layer;

  const {
    account: { account },
    networkLayer: {
      systemCalls: {
        create_revenant,
      },
    },
  } = useDojo();

  const clientGameDataEntity = getComponentValue(ClientGameData,GAME_CONFIG) 
   
  if (clientGameDataEntity === undefined || clientGameDataEntity.current_game_state === 2 ) { return null;}
  
  return (
    <ClickWrapper className={` ${timerPassed ? "opaque-on" : "opaque-off"}`}>
        <button
          className="buy-revenant-button"  
          onClick={() =>
            create_revenant(
              account,
              "name " + getComponentValueStrict(GameEntityCounter, getComponentValueStrict(ClientGameData,GAME_CONFIG).current_game_id as EntityIndex).revenant_count as string, 
            )
          }
        >
          Summon a Revenant
        </button>
      </ClickWrapper>
  );
};
