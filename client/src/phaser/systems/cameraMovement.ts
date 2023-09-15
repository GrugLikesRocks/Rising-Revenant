import { PhaserLayer } from "..";

import {
  EntityIndex,
  getComponentValueStrict,
  defineSystem,
  Has,
  defineEnterSystem,
  setComponent,
  getComponentValue,
} from "@latticexyz/recs";


import { circleEvents, tooltipEvent } from "./eventSystems/eventEmitter";

export const controlCamera = (layer: PhaserLayer) => {
  const {
    world,
    scenes: {
      Main: { camera, input },
    },
    networkLayer: {
      systemCalls: { set_click_component },
      components: { ClientCameraPosition,ClientClickPosition },
    },
  } = layer;

  // this is to recheck and redo

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

  defineSystem(world, [Has(ClientCameraPosition)], ({ entity }) => {
    const newCamPos = getComponentValue(ClientCameraPosition, entity);
    const position = getComponentValueStrict(ClientClickPosition, entity);

    if (newCamPos) {
      camera.centerOn(newCamPos.x, newCamPos.y);

      // console.log("calling updating circle", newCamPos.x, newCamPos.y)
      
      circleEvents.emit("updateCirclePos", newCamPos.x, newCamPos.y);
      tooltipEvent.emit("updateTooltipPos", newCamPos.x, newCamPos.y);
    }
  });
};
