import { PhaserLayer } from "..";
import { controlCamera } from "./cameraMovement";
import { mapSpawn } from "./mapSpawn";
import { spawnOutposts } from "./outpostSystems";
import {testSystem} from "./testSystem";

export const registerSystems = (layer: PhaserLayer) => {
    controlCamera(layer);
    mapSpawn(layer);
    // testSystem(layer);
    spawnOutposts(layer);
};