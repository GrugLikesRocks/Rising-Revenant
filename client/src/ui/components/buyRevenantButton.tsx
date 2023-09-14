import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { PhaserLayer } from "../../phaser";
import { useDojo } from "../../hooks/useDojo";
import { GAME_ID } from "../../phaser/constants";
import { getEntityIdFromKeys } from "../../dojo/createSystemCalls";

import "../../App.css";

// ALL DEBUG TO DELETE ONCE DONE

type ExampleComponentProps = {
  layer: PhaserLayer;
};

export const BuyRevenantButton = ({ layer }: ExampleComponentProps) => {
  const {
    networkLayer: {
      components: { Game, GameData },
    },
  } = layer;

  const {
    account: { account },
    networkLayer: {
      systemCalls: {
        create_game,
        create_outpost,
        register_player,
        set_world_event,
      },
    },
  } = useDojo();

  const gameEntities = useEntityQuery([Has(Game)]); // to delete
  const gameDataEntities = useEntityQuery([Has(GameData)]); // to delete

  const entityId = getEntityIdFromKeys([
    BigInt(GAME_ID),
    BigInt(account.address),
  ]);

  let content;

  if (gameDataEntities.length === 0 || gameEntities.length === 0) {
    content = (
      <div>
        <button
          className="buy-revenant-button"
        >
          No Game Detected
        </button>
      </div>
    );
  } else {
    content = (
      <div>
        <button
          className="buy-revenant-button"
          onClick={() =>
            create_outpost(
              account,
              GAME_ID,
              getComponentValue(GameData, entityId)?.count_outposts || 0
            )
          }
        >
          Buy an Outpost
        </button>
      </div>
    );
  }

  return <div>{content}</div>;
};
