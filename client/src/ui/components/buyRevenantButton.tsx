import { useEntityQuery } from "@latticexyz/react";
import { EntityIndex, Has, getComponentValueStrict } from "@latticexyz/recs";
import { PhaserLayer } from "../../phaser";
import { useDojo } from "../../hooks/useDojo";

import "../../App.css";
import { GAME_CONFIG } from "../../phaser/constants";

// ALL DEBUG TO DELETE ONCE DONE

type ExampleComponentProps = {
  layer: PhaserLayer;
  timerPassed: boolean;
};

export const BuyRevenantButton = ({ layer,timerPassed }: ExampleComponentProps) => {
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

  return (
    <div>
    <div className={` ${timerPassed ? "opaque-on" : "opaque-off"}`}>
        <button
          className="buy-revenant-button"  
          onClick={() =>
            create_revenant(
              account,
              "name " + getComponentValueStrict(GameEntityCounter, getComponentValueStrict(ClientGameData,GAME_CONFIG).current_game_id as EntityIndex).revenant_count as string, 
            )
          }
        >
          Buy a Revenant
        </button>
      </div>
    </div>
  );
};
