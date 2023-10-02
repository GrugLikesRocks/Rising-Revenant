import {
  Has,
  defineEnterSystem,
  defineSystem,
  getComponentValueStrict,
  setComponent
} from "@latticexyz/recs";
import { PhaserLayer } from "..";
import { Assets, GAME_CONFIG } from "../constants";
import { SCALE } from "../constants";

export const spawnOutposts = (layer: PhaserLayer) => {

  const {
    world,
    scenes: {
      Main: { objectPool },
    },
    networkLayer: {
      components: { Outpost, ClientOutpostData },
    },
  } = layer;

  // here is where we set the position of the outpost
  defineSystem(world, [Has(Outpost), Has(ClientOutpostData)], ({ entity }) => {
    const position = getComponentValueStrict(Outpost, entity);
    const outpostData = getComponentValueStrict(ClientOutpostData, entity);

    const outpostObj = objectPool.get(entity, "Sprite");

    outpostObj.setComponent({
      id: "position",
      once: (sprite) => {
        sprite.setPosition(position.x - (sprite.width * SCALE) / 2, position.y - (sprite.height * SCALE) / 2);
      },
    });

    outpostObj.setComponent({
      id: "texture",
      once: (sprite) => {

        sprite.depth = 0;

        if (position.lifes < 0) {
          sprite.setTexture(Assets.CastleDestroyedAsset);
        }
        else {
          if (!outpostData.event_effected) {
            if (outpostData.owned) {
              sprite.setTexture(Assets.CastleHealthySelfAsset);
            } else {
              sprite.setTexture(Assets.CastleHealthyEnemyAsset);
            }
          }
          else {
            sprite.setTexture(Assets.CastleDamagedAsset);
          }
        }

        sprite.scale = SCALE;
      },
    });
  });
};
