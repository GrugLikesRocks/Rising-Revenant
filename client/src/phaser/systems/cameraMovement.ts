import { PhaserLayer } from "..";

import {
  EntityIndex,
  getComponentValueStrict,
  defineSystem,
  Has,
  defineEnterSystem,
  setComponent
} from "@latticexyz/recs";


export const controlCamera = (layer: PhaserLayer) => {

  const {
    world,
    scenes: {
      Main: { camera, input },
    },
    networkLayer: {
      systemCalls: { set_click_component, set_camera_position_component },
      components: {  ClientCameraPosition }
    },
  } = layer;

  // this is to recheck and redo

  input.pointerdown$.subscribe(({ pointer, event }) => {
    // pointer is the coord of the cursor on the screen

    let clickRelativeToMiddlePointX = pointer.x - camera.phaserCamera.width / 2; // this si the click of the screen relative to the center of the camera
    let clickRelativeToMiddlePointY =
      pointer.y - camera.phaserCamera.height / 2;

    set_click_component(
      pointer.x,
      pointer.y,
      clickRelativeToMiddlePointX,
      clickRelativeToMiddlePointY
    );
  });


  // defineEnterSystem(world, [Has(ClientCameraPosition)], ({ entity }) => {
  //   set_camera_position_component(camera.phaserCamera.x/2, camera.phaserCamera.y/2);
  // });

  defineSystem(world, [Has(ClientCameraPosition)], ({ entity }) => {
    const newCamPos = getComponentValueStrict(ClientCameraPosition, entity);
    console.log(newCamPos)
    camera.centerOn(newCamPos.x, newCamPos.y);
  });
};
