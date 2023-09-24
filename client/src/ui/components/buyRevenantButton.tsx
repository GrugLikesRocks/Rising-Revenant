import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";
import { PhaserLayer } from "../../phaser";
import { useDojo } from "../../hooks/useDojo";
import { GAME_ID, currentGameId } from "../../phaser/constants";
import { getEntityIdFromKeys } from "../../dojo/createSystemCalls";

import "../../App.css";

// ALL DEBUG TO DELETE ONCE DONE

type ExampleComponentProps = {
  layer: PhaserLayer;
  timerPassed: boolean;
};

export const BuyRevenantButton = ({ layer,timerPassed }: ExampleComponentProps) => {
  const {
    networkLayer: {
      components: {GameEntityCounter },
    },
  } = layer;

  const {
    account: { account },
    networkLayer: {
      systemCalls: {
        create_outpost,
        create_revenant,
      },
    },
  } = useDojo();

  const gameDataEntities = useEntityQuery([Has(GameEntityCounter)]); // to delete

  return (
    <div>
    <div className={` ${timerPassed ? "opaque-on" : "opaque-off"}`}>
        <button
          className="buy-revenant-button"
          onClick={() =>
            create_outpost(
              account,
              GAME_ID,
              getComponentValueStrict(GameEntityCounter, gameDataEntities[0]).revenant_count
            )
          }
        >
          Buy an Outpost
        </button>
        <button
          className="buy-revenant-button"  
          onClick={() =>
            create_revenant(
              account,
              GAME_ID,
              "name" + (1) as string, 
            )
          }
        >
          Buy a Revenant
        </button>
      </div>
    </div>
  );
};
