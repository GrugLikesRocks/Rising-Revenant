import { EntityIndex } from "@latticexyz/recs";

export enum Scenes {
    Main = "Main",
}

export enum Maps {
    Main = "Main",
}

export enum Sprites {
    Map,
    Castle
}

export enum Assets {
    MapPicture = "MapPicture",
    CastleHealthySelfAsset = "CastleHealthySelfAsset",
    CastleDamagedAsset = "CastleDamagedAsset",
    CastleHealthyEnemyAsset = "CastleHealthyEnemyAsset",
    CastleDestroyedAsset = "CastleDestroyedAsset",
}

export const MAP_WIDTH = 10240;
export const MAP_HEIGHT = 5164;

export const PREPARATION_PHASE_BLOCK_COUNT = 5;
export const EVENT_PHASE_BLOCK_COUNT = 10;

export const GAME_CONFIG : EntityIndex= 999999999999999 as EntityIndex;
export const CAMERA_ID = 19999999999 as EntityIndex; // the camera could prob share the same id as the game its no big deal
export const SCALE = 0.2;

