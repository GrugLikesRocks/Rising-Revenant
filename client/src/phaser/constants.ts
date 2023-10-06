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

export const PREPARATION_PHASE_BLOCK_COUNT = 10;
export const EVENT_PHASE_BLOCK_COUNT =3;

export const GAME_CONFIG : EntityIndex = 999999999999999 as EntityIndex;
export const SCALE = 0.15;

