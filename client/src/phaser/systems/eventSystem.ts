import {
  Has,
  getComponentValueStrict,
  getComponentValue,
  defineSystem,
} from "@latticexyz/recs";
import { PhaserLayer } from "..";

import { circleEvents } from "./eventSystems/eventEmitter";

export const eventSystem = (layer: PhaserLayer) => {
  const {
    world,

    networkLayer: {
      components: { WorldEvent, Position },
    },
  } = layer;

  defineSystem(world, [Has(WorldEvent), Has(Position)], ({ entity }) => {
    const worldEvent = getComponentValue(WorldEvent, entity);
    const positionEvent = getComponentValue(Position, entity);

    if (worldEvent && positionEvent) {
      circleEvents.emit("spawnCircle",positionEvent.x,positionEvent.y,worldEvent.radius);

    }
  });
};
