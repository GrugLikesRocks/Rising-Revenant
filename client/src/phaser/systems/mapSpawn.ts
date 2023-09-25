import { Has, defineEnterSystem,defineSystem, getComponentValueStrict} from "@latticexyz/recs";
import { PhaserLayer } from "..";

import { Assets } from "../constants";

export const mapSpawn = (layer: PhaserLayer) => {

    const {
        world,
        scenes: {
            Main: { objectPool, camera},
        },
        networkLayer: {
            components: { Game, GameEntityCounter }
        },
    } = layer;


    defineEnterSystem(world, [Has(Game)], ({ entity }) => {
        
        const playerObj = objectPool.get(entity, "Sprite");

        playerObj.setComponent({
            id: 'animation',
            once: (sprite) => {
                sprite.setTexture(Assets.MapPicture);
                // sprite.setPosition(-sprite.width/2,-sprite.height/2);
                camera.phaserCamera.setBounds(0, 0, sprite.width, sprite.height);
                camera.centerOn(sprite.width/2, sprite.height/2);
            }
        });
    });


    defineSystem(world, [Has(GameEntityCounter)], ({ entity }) => {
        
        const playerObj = getComponentValueStrict(GameEntityCounter,entity)

        console.log("this is the define system", playerObj);

    });
};