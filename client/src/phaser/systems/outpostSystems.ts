import {
  Has,
  defineEnterSystem,
  defineSystem,
  getComponentValueStrict,
  getComponentValue,
  EntityIndex,
  setComponent,
} from "@latticexyz/recs";
import { PhaserLayer } from "..";
import { Assets } from "../constants";
import { tooltipEvent, circleEvents } from "./eventSystems/eventEmitter";
import { useDojo } from "../../hooks/useDojo";
import { userAccountAddress, SCALE } from "../constants";
import { bigIntToHexWithPrefix, floatToHex, fromFixed, toFixed } from "../../utils/index";

//scale should be a const

export const spawnOutposts = (layer: PhaserLayer) => {
  let entities: EntityIndex[] = []; // this will need to be changed

  const {
    world,
    scenes: {
      Main: { objectPool },
    },
    networkLayer: {
      components: { Outpost, ClientClickPosition, ClientCameraPosition, WorldEvent, ClientOutpostData },
    },
  } = layer;
;

  // this is called on the instantiation of the outpost, here is where we set the texture
  defineEnterSystem(world, [Has(Outpost), Has(ClientOutpostData)], ({ entity }) => {
    const outpostObj = objectPool.get(entity, "Sprite");

    const outpostData = getComponentValueStrict(ClientOutpostData, entity);

    if (!entities.includes(entity)) {  // need to find a way to either do a multi query similar to bevy function in rust or do a query for the outpost component
      entities.push(entity);
    }

    outpostObj.setComponent({
      id: "texture",
      once: (sprite) => {
        if (outpostData.owned) {
          sprite.setTexture(Assets.CastleHealthySelfAsset);
        } else {
          sprite.setTexture(Assets.CastleHealthyEnemyAsset);
        }

        sprite.scale = SCALE;
      },
    });
  });

  // here is where we set the position of the outpost
  defineSystem(world, [Has(Outpost), Has(ClientOutpostData)], ({ entity }) => {
    const position = getComponentValueStrict(Outpost, entity);

    console.log("this is the position for the castle ", position.x, "  ", position.y);

    const player = objectPool.get(entity, "Sprite");

    player.setComponent({
      id: "position",
      once: (sprite) => {
        sprite.setPosition(position.x - (sprite.width * SCALE)/2, position.y - (sprite.height * SCALE)/2);
      },
    });
  });

  // the issue with checking for the interescetion of the circle is that we might be doing aabb but we just need the center of the sprite

  // //  comp for the center of the camera could be user here for effects, this is optional fully but is wrong anyway
  // //   defineSystem(world, [Has(Position), Has(Defence)], ({ entity }) => {});

  defineSystem(world, [Has(WorldEvent)], ({ entity }) => {
    const dataEvent = getComponentValueStrict(WorldEvent, entity);


    if (!dataEvent) {
      return;
    }

    let radius = dataEvent.radius;

    if (radius === 0) {
      return;
    }

    let positionX = dataEvent.x;
    let positionY = dataEvent.y;

    console.log("should spawn circle with this data", dataEvent);

    circleEvents.emit("spawnCircle",dataEvent.x, dataEvent.y, dataEvent.radius);
    circleEvents.emit("setCircleState", true);

    for (let index = 0; index < entities.length; index++) {
      const entityId = entities[index];

      console.log("these are all the entities id ", entityId);

      const outpostData = getComponentValueStrict(ClientOutpostData, entity);

      const playerObj = objectPool.get(entityId, "Sprite");

      playerObj.setComponent({
        id: "texture",
        once: (sprite) => {

          const distance = Math.sqrt(
            (sprite.x - positionX) ** 2 + (sprite.y - positionY) ** 2
          );

          console.log("these are the coordinates for the castle ", sprite.x, "  ", sprite.y);

          if (distance <= radius) {
            sprite.setTexture(Assets.CastleDamagedAsset);

            setComponent(ClientOutpostData, entity, {id: outpostData.id, owned: outpostData.owned, event_effected: true})
          } 
          else 
          {
            if (outpostData.owned) {
              sprite.setTexture(Assets.CastleHealthySelfAsset);
            }
            else {
              sprite.setTexture(Assets.CastleHealthyEnemyAsset);
            }
          }
        },
      });
    }
  });


  // Click checks for the ui tooltip
  defineSystem(world, [Has(ClientClickPosition)], ({ entity }) => {
    if (entities.length === 0) {
      return;
    }

    const positionClick = getComponentValueStrict(ClientClickPosition, entity);

    const positionCenterCam = getComponentValueStrict(   // this errors out for some reason but doesnt break everything so this is low priority
      ClientCameraPosition,
      entity
    );

    let positionX = positionClick.xFromMiddle + positionCenterCam.x;
    let positionY = positionClick.yFromMiddle + positionCenterCam.y;

    let foundEntity: EntityIndex | null = null; // To store the found entity

    for (let index = 0; index < entities.length; index++) {
      const element = entities[index];
      const playerObj = objectPool.get(element, "Sprite");

      playerObj.setComponent({
        id: "texture",
        once: (sprite) => {
          const minX = sprite.x;
          const minY = sprite.y;

          const maxX = minX + sprite.width * sprite.scale;
          const maxY = minY + sprite.height * sprite.scale;
          if (
            positionX >= minX &&
            positionX <= maxX &&
            positionY >= minY &&
            positionY <= maxY
          ) {
            foundEntity = element;
          }
        },
      });

      if (foundEntity) {
        foundEntity = getComponentValueStrict(ClientOutpostData, element).id as EntityIndex;
        break;
      }
    }

    if (foundEntity) {

      tooltipEvent.emit(
        "spawnTooltip",
        positionClick.xFromOrigin,
        positionClick.yFromOrigin,
        foundEntity
      );
    } else {

      tooltipEvent.emit(
        "closeTooltip",
        true,
        positionClick.xFromOrigin,
        positionClick.yFromOrigin
      );
    }
  });
};
