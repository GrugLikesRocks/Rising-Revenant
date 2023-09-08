import { Has, defineEnterSystem, defineSystem,  getComponentValueStrict } from "@latticexyz/recs";
import { PhaserLayer } from "..";
import {  Assets } from "../constants";

export const spawnOutposts = (layer: PhaserLayer) => {

    const {
        world,
        scenes: {
            Main: { objectPool },
        },
        networkLayer: {
            components: { Position }
        },
    } = layer;

    defineEnterSystem(world, [Has(Position)], ({ entity }) => {
        const outpostObj = objectPool.get(entity, "Sprite");

        const position = getComponentValueStrict(Position, entity);

        outpostObj.setComponent({
            id: 'texture',
            once: (sprite) => {
                sprite.setTexture(Assets.CastleHealthyAsset);  // Assuming "outpost" is the key for the outpost texture.
                sprite.setPosition(position?.x, position?.y);
                sprite.scale = 0.25;
            },
        });
    });

    //comp for the center of the camera could be user here for effects
    defineSystem(world, [Has(Position)], ({ entity }) => {

    });
};