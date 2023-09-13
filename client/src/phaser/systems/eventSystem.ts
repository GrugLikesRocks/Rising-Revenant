import { Has, getComponentValueStrict,defineSystem} from "@latticexyz/recs";
import { PhaserLayer } from "..";

import { circleEvents } from "./eventSystems/eventEmitter";

export const mapSpawn = (layer: PhaserLayer) => {

    const {
        world,
        
        networkLayer: {
            components: { WorldEvent, Position }
        },
    } = layer;

    // this should be on update
    defineSystem(world, [Has(WorldEvent), Has(Position)], ({ entity }) => {

        console.log("should spawn circle");

        const worldEvent = getComponentValueStrict(WorldEvent, entity);
        const positionEvent = getComponentValueStrict(Position, entity);

        // emits the event to the be received
        circleEvents.emit("spawnCircle",positionEvent.x,positionEvent.y,worldEvent.radius,worldEvent.radius);
    });
};