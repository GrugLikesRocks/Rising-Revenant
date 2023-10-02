import { PhaserLayer } from "..";

import {
  EntityIndex,
  getComponentValueStrict,
  defineSystem,
  Has,
  getComponentEntities,
  getComponentValue
} from "@latticexyz/recs";


import { tooltipEvent } from "./eventSystems/eventEmitter";

export const clickManager = (layer: PhaserLayer) => {
  const {
    world,
    scenes: {
      Main: { camera, input, objectPool },
    },

    networkLayer: {
      components: { Outpost, ClientClickPosition, ClientCameraPosition, ClientOutpostData },
      systemCalls: { set_click_component },
    },
  } = layer;

  input.pointerdown$.subscribe(({ pointer, event }) => {
    if (!pointer) {

      return;
    }

    let clickRelativeToMiddlePointX = pointer.x - camera.phaserCamera.width / 2;
    let clickRelativeToMiddlePointY = pointer.y - camera.phaserCamera.height / 2;

    set_click_component(
      pointer.x,
      pointer.y,
      clickRelativeToMiddlePointX,
      clickRelativeToMiddlePointY
    );
  });

  // Click checks for the ui tooltip
  defineSystem(world, [Has(ClientClickPosition)], ({ entity }) => {

    const positionClick = getComponentValueStrict(ClientClickPosition, entity);

    const outpostEntities = getComponentEntities(Outpost);
    const outpostArray = Array.from(outpostEntities);

    const positionCenterCam = getComponentValue(   // this errors out for some reason but doesnt break everything so this is low priority
      ClientCameraPosition,
      entity
    );

    if (positionCenterCam === undefined) { return; }

    let positionX = positionClick.xFromMiddle + positionCenterCam.x;
    let positionY = positionClick.yFromMiddle + positionCenterCam.y;

    let foundEntity: EntityIndex | null = null; // store the found entity

    for (const outpostEntityValue of outpostArray) {
      const playerObj = objectPool.get(outpostEntityValue, "Sprite");

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
            foundEntity = outpostEntityValue;
          }
        },
      });

      if (foundEntity) {
        foundEntity = getComponentValueStrict(ClientOutpostData, outpostEntityValue).id as EntityIndex;
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
