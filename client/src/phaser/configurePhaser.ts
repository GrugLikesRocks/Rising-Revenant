import {
  defineSceneConfig,
  AssetType,
  defineScaleConfig,
  defineCameraConfig
} from "@latticexyz/phaserx";

import { Sprites, Assets, Scenes } from "./constants";


export const phaserConfig = {
    sceneConfig: {
        [Scenes.Main]: defineSceneConfig({

            assets: {
                [Assets.CastleHealthySelfAsset]: {
                    type: AssetType.Image,
                    key: Assets.CastleHealthySelfAsset,
                    path: "src/assets/blue.png",
                },
                [Assets.CastleDamagedAsset]: {
                    type: AssetType.Image,
                    key: Assets.CastleDamagedAsset,
                    path: "src/assets/red.png",
                },
                [Assets.CastleHealthyEnemyAsset]: {
                    type: AssetType.Image,
                    key: Assets.CastleHealthyEnemyAsset,
                    path: "src/assets/purple.png",
                },
                [Assets.CastleDestroyedAsset]: {
                    type: AssetType.Image,
                    key: Assets.CastleDestroyedAsset,
                    path: "src/assets/grey.png",
                },
                [Assets.CaslteSelectedAsset]: {
                    type: AssetType.Image,
                    key: Assets.CaslteSelectedAsset,
                    path: "src/assets/white.png",
                },
                [Assets.MapPicture]: {
                    type: AssetType.Image,
                    key: Assets.MapPicture,
                    path: "src/assets/rev_map_big.png",
                }
            },
            maps: {
            },
            sprites: {
                [Sprites.Castle]: {
                    assetKey: Assets.CastleHealthySelfAsset,
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
    //     pinchSpeed: 0.01,
    //     wheelSpeed: 0.01,
    //     maxZoom: 2,
    //     minZoom: 0.4,
    // }),
    // ZOOMING IN AND OUT IS DISABLED FOR NOW 

    cullingChunkSize: 10000 * 5024,
};
