import {
  defineSceneConfig,
  AssetType,
  defineScaleConfig,
  defineMapConfig,
  defineCameraConfig,
} from "@latticexyz/phaserx";
import { TileAnimations, Tileset } from "../artTypes/world";
import { Sprites, Assets, Maps, Scenes } from "./constants";


export const phaserConfig = {
    sceneConfig: {
        [Scenes.Main]: defineSceneConfig({

            assets: {
                [Assets.CastleHealthyAsset]: {
                    type: AssetType.Image,
                    key: Assets.CastleHealthyAsset,
                    path: "src/assets/castleHealthy.png",
                },
                [Assets.CastleDamagedAsset]: {
                    type: AssetType.Image,
                    key: Assets.CastleDamagedAsset,
                    path: "src/assets/castleDamaged.png",
                },
                [Assets.MapPicture]: {
                    type: AssetType.Image,
                    key: Assets.MapPicture,
                    path: "src/assets/mapReve.png",
                }
            },
            maps: {
            },
            sprites: {
                [Sprites.Castle]: {
                    assetKey: Assets.CastleHealthyAsset,
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

    cullingChunkSize: 10000 * 10000,
};
