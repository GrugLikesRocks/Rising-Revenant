import { PhaserLayer } from "..";

import {
  EntityIndex,
  getComponentValueStrict,
  defineSystem,
  Has,
  getComponentEntities,
  getComponentValue,
  setComponent
} from "@latticexyz/recs";


import { setTooltipArray } from "./eventSystems/eventEmitter";
import { GAME_CONFIG } from "../constants";

export const clickManager = (layer: PhaserLayer) => {
  const {
    world,
    scenes: {
      Main: { camera, input, objectPool },
    },

    networkLayer: {
      components: { Outpost, ClientClickPosition, ClientCameraPosition },
    },
  } = layer;

  input.pointerdown$.subscribe(({ pointer, event }) => {
    if (!pointer) {

      return;
    }

    let clickRelativeToMiddlePointX = pointer.x - camera.phaserCamera.width / 2;
    let clickRelativeToMiddlePointY = pointer.y - camera.phaserCamera.height / 2;

    setComponent(ClientClickPosition, GAME_CONFIG, {
      xFromMiddle: clickRelativeToMiddlePointX,
      yFromMiddle: clickRelativeToMiddlePointY,
      xFromOrigin: pointer.x,
      yFromOrigin: pointer.y,
    });

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

    let zoomVal:number = 0;

    camera.zoom$.subscribe((zoom) => {zoomVal = zoom;});
  

    if (positionCenterCam === undefined) { return; }

    let positionX = (positionClick.xFromMiddle/zoomVal) + positionCenterCam.x;
    let positionY = (positionClick.yFromMiddle/zoomVal) + positionCenterCam.y;

    let foundEntity: EntityIndex[] = []; // store the found entity

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
            foundEntity.push(outpostEntityValue);
          }
        },
      });

    }

    if (foundEntity.length > 0)
    {
      setTooltipArray.emit("setToolTipArray",foundEntity);
    }

  });

};
