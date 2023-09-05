import { PhaserLayer } from "..";
import { spawn } from "./spawn";
import { mapSystem } from "./mapSystem";

export const registerSystems = (layer: PhaserLayer) => {
    spawn(layer);
    mapSystem(layer);
};