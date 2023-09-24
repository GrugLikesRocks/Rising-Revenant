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
}

export const MAP_WIDTH = 10240;
export const MAP_HEIGHT = 5164;


export const GAME_CONFIG = 999999999999999;
export const GAME_ID = 1;
export const GAME_DATA_ID = 9; 
export const CAMERA_ID = 19999999999; // the camera could prob share the same id as the game its no big deal
export const SCALE = 0.05;






/////////////////////////////////////////////////////////////
// below either make another singleton script or find another way to do this

export let userAccountAddress: string = "invalid";
export function setUserAccountAddress(address: string) {
    userAccountAddress = address;
}


export let currentGameId: EntityIndex = 0 as EntityIndex;
export function setCurrentGameId(gameId: number) {
    currentGameId = gameId as EntityIndex;
}

export let lastCheckedNumOfRevenants: number = 0;
export function setLastCheckedNumOfRevenants(num: number) {
    lastCheckedNumOfRevenants = num;
}
