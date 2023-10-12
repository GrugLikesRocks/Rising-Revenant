import {
  Has,
  defineSystem,
  getComponentValueStrict,
  } from "@latticexyz/recs";
import { PhaserLayer } from "..";
import { Assets } from "../constants";
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

  defineSystem(world, [Has(Outpost), Has(ClientOutpostData)], ({ entity }) => {
    const outpostDojoData = getComponentValueStrict(Outpost, entity);
    const outpostClientData = getComponentValueStrict(ClientOutpostData, entity);

    const outpostObj = objectPool.get(entity, "Sprite");

    //can this be merged?

    outpostObj.setComponent({
      id: "position",
      once: (sprite) => {
        sprite.setPosition(outpostDojoData.x - (sprite.width * SCALE) / 2, outpostDojoData.y - (sprite.height * SCALE) / 2);
      },
    });

    outpostObj.setComponent({
      id: "texture",
      once: (sprite) => {

        sprite.depth = 0;

        if (outpostClientData.selected)
        {
          sprite.setTexture(Assets.CaslteSelectedAsset);
        }
        else
        {
          if (outpostDojoData.lifes <= 0) {
            sprite.setTexture(Assets.CastleDestroyedAsset);
          }
          else {
            if (!outpostClientData.event_effected) {
              if (outpostClientData.owned) {
                sprite.setTexture(Assets.CastleHealthySelfAsset);
              } else {
                sprite.setTexture(Assets.CastleHealthyEnemyAsset);
              }
            }
            else {
              sprite.setTexture(Assets.CastleDamagedAsset);
            }
          }
        }

        // sprite.setBlendMode(Phaser.BlendModes.MULTIPLY);
        sprite.scale = SCALE;
      },
    });
  });
};
