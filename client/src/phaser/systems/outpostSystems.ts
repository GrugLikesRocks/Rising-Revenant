import {
  Has,
  defineSystem,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { PhaserLayer } from "..";
import { Assets, SCALE, getEntityGroup } from "../constants";

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
      once: (sprite:any) => {
        sprite.setPosition(outpostDojoData.x - (sprite.width * SCALE) / 2, outpostDojoData.y - (sprite.height * SCALE) / 2);
      },
    });

    outpostObj.setComponent({
      id: "texture",
      once: (sprite:any) => {

        if (outpostClientData.selected) {
          sprite.setTexture(Assets.CaslteSelectedAsset);

          sprite.depth = 1;
        }
        else {

          if (outpostClientData.visible === false) 
          {
                sprite.setVisible(false);
          }
          else
          {
            sprite.depth = 0;
            sprite.setVisible(true);

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
        }

        sprite.scale = SCALE;

      },
    });

  });
};
