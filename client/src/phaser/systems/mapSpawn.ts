import {
  Has,
  defineEnterSystem,
  defineSystem,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { PhaserLayer } from "..";

import {setEntityGroup, Assets, GAME_CONFIG} from "../constants";

import { drawPhaserLayer } from "./eventSystems/eventEmitter";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { decimalToHexadecimal } from "../../utils";

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

    const phaserScene = layer.scenes.Main.phaserScene;

    const mapGroup = phaserScene.add.group();
    const _entityGroup = phaserScene.add.group();

    setEntityGroup(_entityGroup);

    mapObj.setComponent({
      id: "animation",
      once: (sprite:any) => {
        sprite.setTexture(Assets.MapPicture);
        sprite.depth = -2;
        camera.phaserCamera.setBounds(0, 0, sprite.width, sprite.height);
        camera.centerOn(sprite.width / 2, sprite.height / 2);


        mapGroup.add(sprite);
      },
    });


    //console.log("THIS IS HOW MANY IN THE MAP GROUP", mapGroup.getLength());
    //console.log("THIS IS HOW MANY IN THE ENTITY GROUP", _entityGroup.getLength());

  });

  defineSystem(world, [Has(ClientGameData)], ({ entity }) => {

    const clientGameData = getComponentValueStrict(ClientGameData, decimalToHexadecimal(GAME_CONFIG));

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
