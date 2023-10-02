import { PhaserLayer } from "..";

import {
  defineSystem,
  Has,
  getComponentValue,
} from "@latticexyz/recs";

export const cameraManager = (layer: PhaserLayer) => {
  const {
    world,
    scenes: {
      Main: { camera },
    },
    networkLayer: {
      components: { ClientCameraPosition },
    },
  } = layer;

  defineSystem(world, [Has(ClientCameraPosition)], ({ entity }) => {
    const newCamPos = getComponentValue(ClientCameraPosition, entity);

    if (newCamPos) {
      camera.centerOn(newCamPos.x, newCamPos.y);

      // this could be put on update of the component to save on resource instead of having react run it every frame
      // same thing for the event emitter

      //tooltipEvent.emit("updateTooltipPos", newCamPos.x, newCamPos.y);    
    }
  });
};
