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
    
    // const phaserScene = layer.scenes.Main.phaserScene;

    // const svg = phaserScene.load.svg(Assets.MapPicture, "assets/map.svg");
    // console.log(svg);
    // const phaserObj = phaserScene.add.image(10240, 5164, Assets.MapPicture);
    // phaserObj.depth = -1;

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

  defineSystem(world, [Has(Game)], ({ entity }) => {
    const gameComp = getComponentValueStrict(Game, entity);
    const clientGameData = getComponentValueStrict(ClientGameData, GAME_CONFIG);

    if (
      Number(gameComp.start_block_number) + PREPARATION_PHASE_BLOCK_COUNT >=
        clientGameData.current_block_number + 1 &&
      clientGameData.current_game_state === 1
    ) 
    {
      return;
    } 
    else 
    {
      if (clientGameData.current_game_state === 1) {
        setComponent(ClientGameData, GAME_CONFIG, {
          current_game_state: 2,
          user_account_address: clientGameData.user_account_address,
          current_game_id: clientGameData.current_game_id,
          current_block_number: clientGameData.current_block_number,
        });

        drawPhaserLayer.emit("toggleVisibility", true);
      } 
      else {
        return;
      }
    }
  });
};
