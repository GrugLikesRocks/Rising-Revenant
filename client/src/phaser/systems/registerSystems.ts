import { PhaserLayer } from "..";

import { eventSystem } from "./eventSystem";
import { controlCamera } from "./cameraMovement";
import { mapSpawn } from "./mapSpawn";
import { spawnOutposts } from "./outpostSystems";

export const registerSystems = (layer: PhaserLayer) => {
    controlCamera(layer);
    mapSpawn(layer);
    eventSystem(layer);
    spawnOutposts(layer);
};