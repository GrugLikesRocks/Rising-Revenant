import {
  Has,
  defineEnterSystem,
  defineSystem,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { PhaserLayer } from "..";
import { tileCoordToPixelCoord } from "@latticexyz/phaserx";

import { useEntityQuery } from "@latticexyz/react";

import { useDojo } from "../../hooks/useDojo";

const CAMERA_SPEED = 20;
const MINIMUM_DISTANCE = 20;

export const controlCamera = (layer: PhaserLayer) => {
  let xPositionCamera = 0; // this isnt correct this should be a component in the client side only
  let yPositionCamera = 0;

  const {
    scenes: {
      Main: { camera, input, objectPool },
    },
    networkLayer: {
      systemCalls: { click_component_call,camera_component_call },
      account,
    },
  } = layer;



  // need a way to have this not on press but while down
  input.onKeyPress(
    (keys) => keys.has("W"),
    () => {
      yPositionCamera -= CAMERA_SPEED;

      camera.centerOn(xPositionCamera, yPositionCamera);
    }
  );

  input.onKeyPress(
    (keys) => keys.has("A"),
    () => {
      xPositionCamera -= CAMERA_SPEED;

      camera.centerOn(xPositionCamera, yPositionCamera);
    }
  );

  input.onKeyPress(
    (keys) => keys.has("S"),
    () => {
      yPositionCamera += CAMERA_SPEED;

      camera.centerOn(xPositionCamera, yPositionCamera);
    }
  );

  input.onKeyPress(
    (keys) => keys.has("D"),
    () => {
      xPositionCamera += CAMERA_SPEED;

      camera.centerOn(xPositionCamera, yPositionCamera);
    }
  );

  input.pointerdown$.subscribe(({ pointer, event }) => {

    let screenClickCoordX = pointer.x - camera.phaserCamera.width/2;
    let screenClickCoordY = pointer.y - camera.phaserCamera.height/2;

    let adjustedX = screenClickCoordX - xPositionCamera;    // this is the world position of the click
    let adjustedY = screenClickCoordY - yPositionCamera;

    click_component_call(pointer.x , pointer.y);
    camera_component_call(adjustedX, adjustedY)
  });
};
