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

import "../App.css";

type ExampleComponentProps = {
  layer: PhaserLayer;
};

export const BuyRevenantButton = ({ layer }: ExampleComponentProps) => {
  // Always declare hooks at the top level
  const {
    networkLayer: {
      components: { Game, Defence },
    },
  } = layer;

  const {
    account: { create, list, get, account, select, isDeploying },
    networkLayer: {
      systemCalls: { create_game, create_outpost,life_def_increment },
    },
  } = useDojo();

  const gameEntities = useEntityQuery([Has(Game)]);
  const outpostEntities = useEntityQuery([Has(Defence)]);

  let content;

  if (gameEntities.length === 0) {
    content = (
      <button
        className="button-buy-revenant"
        onClick={() => create_game(account)}
      >
        create the game
      </button>
    );
  } 
  else if (outpostEntities.length === 0) {
    content = (
      <button
        className="button-buy-revenant"
        onClick={() => create_outpost(account, GAME_ID)}
      >
        buy revenant
      </button>
    );
  } 
  else {
    content = (
      <button
        className="button-buy-revenant"
        onClick={() => life_def_increment(account)}
      >
        increment
      </button>
    );
  }

  return <div>{content}</div>;
};
