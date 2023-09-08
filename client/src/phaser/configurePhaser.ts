import {
  defineSceneConfig,
  AssetType,
  defineScaleConfig,
  defineMapConfig,
  defineCameraConfig,
} from "@latticexyz/phaserx";
import worldTileset from "../assets/tilesets/world.png";
import { TileAnimations, Tileset } from "../artTypes/world";
import { Sprites, Assets, Maps, Scenes } from "./constants";

const ANIMATION_INTERVAL = 200;

export const phaserConfig = {
    sceneConfig: {
        [Scenes.Main]: defineSceneConfig({

            assets: {
                [Assets.CastleAsset]: {
                    type: AssetType.Image,
                    key: Assets.CastleAsset,
                    path: "src/assets/castle.png",
                },
                [Assets.MapPicture]: {
                    type: AssetType.Image,
                    key: Assets.MapPicture,
                    path: "src/assets/mapReve.png",
                }
            },
            maps: {
                //[Maps.Main]: mainMap,
            },
            sprites: {
                [Sprites.Castle]: {
                    assetKey: Assets.CastleAsset,
                },
                [Sprites.Map]: {
                    assetKey: Assets.MapPicture,
                },
            },
            animations: [
                
            ],
            tilesets: {
                
            },
        }),
    },
    scale: defineScaleConfig({
        parent: "phaser-game",
        zoom: 1,
        mode: Phaser.Scale.NONE,
    }),
    // cameraConfig: defineCameraConfig({
    //     pinchSpeed: 1,
    //     wheelSpeed: 1,
    //     maxZoom: 3,
    //     minZoom: 1,
    // }),

    cullingChunkSize: 16 * 16,
};
