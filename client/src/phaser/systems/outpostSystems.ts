import {
  Has,
  defineEnterSystem,
  defineSystem,
  getComponentValueStrict,
  getComponentValue,
  EntityIndex,
} from "@latticexyz/recs";
import { PhaserLayer } from "..";
import { Assets } from "../constants";
import { tooltipEvent, circleEvents } from "./eventSystems/eventEmitter";

const SCALE = 0.05;
//scale should be a const

export const spawnOutposts = (layer: PhaserLayer) => {
  let entities: EntityIndex[] = []; // this will need to be changed

  const {
    world,
    scenes: {
      Main: { objectPool },
    },
    networkLayer: {
      components: {
        Position,
        Defence,
        WorldEvent,
        ClientClickPosition,
        ClientCameraPosition,
      },
    },
  } = layer;

  // start system called on the instantiation of an outpost
  defineEnterSystem(world, [Has(Position), Has(Defence)], ({ entity }) => {
    const outpostObj = objectPool.get(entity, "Sprite");

    if (!entities.includes(entity)) {
      entities.push(entity);
    }

    outpostObj.setComponent({
      id: "texture",
      once: (sprite) => {
        sprite.setTexture(Assets.CastleHealthySelfAsset);
        sprite.scale = SCALE;
      },
    });
  });

  defineSystem(world, [Has(Position), Has(Defence)], ({ entity }) => {
    const position = getComponentValueStrict(Position, entity);

    const player = objectPool.get(entity, "Sprite");

    console.log("position for the castle", position);

    player.setComponent({
      id: "position",
      once: (sprite) => {
        sprite.setPosition(position?.x, position?.y);
      },
    });
  });

  //  comp for the center of the camera could be user here for effects, this is optional fully but is wrong anyway
  //   defineSystem(world, [Has(Position), Has(Defence)], ({ entity }) => {});

  defineSystem(world, [Has(WorldEvent), Has(Position)], ({ entity }) => {
    const dataEvent = getComponentValueStrict(WorldEvent, entity);
    const dataEventPosition = getComponentValueStrict(Position, entity);

    if (!dataEvent || !dataEventPosition) {
      return;
    }

    let radius = dataEvent.radius;

    if (radius === 0) {
      return;
    }

    let positionX = dataEventPosition.x;
    let positionY = dataEventPosition.y;

    console.log("should spawn circle with this data", dataEvent, dataEventPosition);

    circleEvents.emit("spawnCircle",dataEventPosition.x,dataEventPosition.y, dataEvent.radius);
    circleEvents.emit("setCircleState", true);

    for (let index = 0; index < entities.length; index++) {
      const entityId = entities[index];
      const playerObj = objectPool.get(entityId, "Sprite");

      playerObj.setComponent({
        id: "texture",
        once: (sprite) => {
          const spriteCenterX = sprite.x + (sprite.width * sprite.scale) / 2;
          const spriteCenterY = sprite.y + (sprite.height * sprite.scale) / 2;

          const distance = Math.sqrt(
            (spriteCenterX - positionX) ** 2 + (spriteCenterY - positionY) ** 2
          );

          if (distance <= radius) {
            sprite.setTexture(Assets.CastleDamagedAsset);
          } else {
            sprite.setTexture(Assets.CastleHealthySelfAsset);
          }
        },
      });
    }
  });

  // click checks for the ui tooltip
  defineSystem(world, [Has(ClientClickPosition)], ({ entity }) => {
    if (entities.length === 0) {
      return;
    }

    const positionClick = getComponentValueStrict(ClientClickPosition, entity);
    const positionCenterCam = getComponentValueStrict(
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
