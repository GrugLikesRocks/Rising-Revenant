import { useEntityQuery } from "@latticexyz/react";
import {
  EntityID,
  EntityIndex,
  Has,
  getComponentValue,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { PhaserLayer } from "../../phaser";
import { useDojo } from "../../hooks/useDojo";
import { GAME_ID } from "../../phaser/constants";
import { getEntityIdFromKeys } from "../../dojo/createSystemCalls";

import "../../App.css";

type ExampleComponentProps = {
  layer: PhaserLayer;
};

export const BuyRevenantButton = ({ layer }: ExampleComponentProps) => {
  
  const {
    networkLayer: {
      components: { Game, GameData  },
    },
  } = layer;

  const {
    account: { account },
    networkLayer: {
      systemCalls: { create_game, create_outpost, register_player, set_world_event },
    },
  } = useDojo();

  const gameEntities = useEntityQuery([Has(Game)]);  // to delete
  const gameDataEntities = useEntityQuery([Has(GameData)]);  // to delete

  const entityId = getEntityIdFromKeys([BigInt(GAME_ID), BigInt(account.address)])

  let content;

  if (gameDataEntities.length === 0) {
    if (gameEntities.length === 0) 
    {
      content = (
        <button
          className="cool-button"
          onClick={() => create_game(account)}
        >
          create the game
        </button>
      );
    }
    else
    {
      content = (
        <button
          className="cool-button"
          onClick={() => register_player(account)}
        >
          register player
        </button>
      );
    }
   
  } 
  else {
    content = (<div>
      <button
        className="cool-button"
        onClick={() => create_outpost(account, GAME_ID, getComponentValue(GameData, entityId)?.count_outposts || 0)}
      >
        buy revenant, amount of outposts:{getComponentValue(GameData, entityId)?.count_outposts || 0}
      </button>

      <button
        className="cool-button"
        onClick={() => set_world_event(account)}
      >
        generate Event
      </button>

    </div>

    );
  }

  return <div>{content}</div>;
};
