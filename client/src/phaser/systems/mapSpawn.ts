import {
  Has,
  defineEnterSystem,
  defineSystem,
  getComponentValueStrict,
  setComponent,
} from "@latticexyz/recs";
import { PhaserLayer } from "..";

import {
  Assets,
  GAME_CONFIG,
  PREPARATION_PHASE_BLOCK_COUNT as PREPARATION_PHASE_BLOCK_COUNT,
} from "../constants";
import { drawPhaserLayer } from "./eventSystems/eventEmitter";

export const mapSpawn = (layer: PhaserLayer) => {
  const {
    world,
    scenes: {
      Main: { objectPool, camera },
    },
    networkLayer: {
      components: { Game, ClientGameData },
    },
  } = layer;

  defineEnterSystem(world, [Has(Game)], ({ entity }) => {
    const mapObj = objectPool.get(entity, "Sprite");

    mapObj.setComponent({
      id: "animation",
      once: (sprite) => {
        sprite.setTexture(Assets.MapPicture);
        sprite.depth = -2;
        camera.phaserCamera.setBounds(0, 0, sprite.width, sprite.height);
        camera.centerOn(sprite.width / 2, sprite.height / 2);
      },
    });
  });

  defineSystem(world, [Has(ClientGameData)], ({ entity }) => {
    const clientGameData = getComponentValueStrict(ClientGameData, entity);

    // if (
    //   Number(gameComp.start_block_number) + PREPARATION_PHASE_BLOCK_COUNT >=
    //     clientGameData.current_block_number + 1 &&
    //   clientGameData.current_game_state === 1
    // ) {
    //   return;
    // } else {
    //   if (clientGameData.current_game_state === 1) {
    //     drawPhaserLayer.emit("toggleVisibility", true);
    //   } else {
    //     return;
    //   }
    // }

    if (clientGameData.current_game_state === 1)
    {
      drawPhaserLayer.emit("toggleVisibility", false);
    }
    else
    {
      drawPhaserLayer.emit("toggleVisibility", true);
    }
  });
};
