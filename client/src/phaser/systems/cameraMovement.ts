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


import { circleEvents } from "./eventSystems/eventEmitter";

export const controlCamera = (layer: PhaserLayer) => {
  const {
    world,
    scenes: {
      Main: { camera, input },
    },
    networkLayer: {
      systemCalls: { set_click_component },
      components: { ClientCameraPosition },
    },
  } = layer;

  // this is to recheck and redo

  input.pointerdown$.subscribe(({ pointer, event }) => {
    // pointer is the coord of the cursor on the screen

    let clickRelativeToMiddlePointX = pointer.x - camera.phaserCamera.width / 2; // this is the click of the screen relative to the center of the camera
    let clickRelativeToMiddlePointY =
      pointer.y - camera.phaserCamera.height / 2;

    set_click_component(
      pointer.x,
      pointer.y,
      clickRelativeToMiddlePointX,
      clickRelativeToMiddlePointY
    );
  });

  defineSystem(world, [Has(ClientCameraPosition)], ({ entity }) => {
    const newCamPos = getComponentValue(ClientCameraPosition, entity);

    if (newCamPos) {
      camera.centerOn(newCamPos.x, newCamPos.y);

      // console.log("calling updating circle", newCamPos.x, newCamPos.y)
      
      circleEvents.emit("updateCirclePos", newCamPos.x, newCamPos.y);
    }
  });
};
