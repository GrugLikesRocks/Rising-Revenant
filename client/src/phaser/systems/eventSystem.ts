import { Has, defineEnterSystem} from "@latticexyz/recs";
import { PhaserLayer } from "..";

export const mapSpawn = (layer: PhaserLayer) => {

    const {
        world,
        scenes: {
            Main: { objectPool},
        },
        networkLayer: {
            components: { WorldEvent }
        },
    } = layer;

    defineEnterSystem(world, [Has(WorldEvent)], ({ entity }) => {
        
        // const playerObj = objectPool.get(entity, "Sprite");

        // playerObj.setComponent({
        //     id: 'animation',
        //     once: (sprite) => {
        //         sprite.setTexture(Assets.MapPicture);
        //         sprite.setPosition(-sprite.width/2,-sprite.height/2);
        //     }
        // });

        // spawn the graphics here
    });
};