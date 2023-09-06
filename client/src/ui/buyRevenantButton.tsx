import { useEntityQuery } from "@latticexyz/react";
import {
  EntityID,
  EntityIndex,
  Has,
  getComponentValue,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { PhaserLayer } from "../phaser";
import { useDojo } from "../hooks/useDojo";
import { GAME_ID } from "../phaser/constants";
import { getEntityIdFromKeys } from "../dojo/createSystemCalls";
import { useComponentValue } from "@dojoengine/react";

import "../App.css";

type ExampleComponentProps = {
  layer: PhaserLayer;
};

export const BuyRevenantButton = ({ layer }: ExampleComponentProps) => {
  // Always declare hooks at the top level
  const {
    networkLayer: {
      components: { Game, Defence,  GameData  },
    },
  } = layer;

  const {
    account: { account },
    networkLayer: {
      systemCalls: { create_game, create_outpost,life_def_increment, register_player },
    },
  } = useDojo();

  const gameEntities = useEntityQuery([Has(Game)]);
  const outpostEntities = useEntityQuery([Has(Defence)]);

  const gameDataEntities = useEntityQuery([Has(GameData)]);

  let content;

  if (gameEntities.length === 0) {
    content = (
      <button
        className="cool-button"
        onClick={() => create_game(account)}
      >
        create the game
      </button>
    );

  } 
  
  else if (outpostEntities.length === 0) {
    
    content = (

      <div>
      <button
        className="cool-button"
        onClick={() => create_outpost(account, GAME_ID, getComponentValue(GameData, gameDataEntities[0])?.count_outposts || 0)}
      >
        buy revenantdadadaaaddadadada
      </button>

      <button
        className="cool-button"
        onClick={() => register_player(account)}
      >
        register
      </button>
      </div>

    );
  } 
  else {

    content = (
      <button
        className="cool-button"
        onClick={() => create_outpost(account, GAME_ID, getComponentValue(GameData, gameDataEntities[0])?.count_outposts || 0)}
      >
        buy revenaada
      </button>
    );
  
  }

  return <div>{content}</div>;
};
