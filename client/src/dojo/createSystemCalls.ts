import { SetupNetworkResult } from "./setupNetwork";
import { ClientComponents } from "./createClientComponents";

import manifest from "../../../contracts/target/dev/manifest.json";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { execute, contractComponents,clientComponents }: SetupNetworkResult,
    { 
        Game,
        GameEntityCounter,
        GameTracker,
        Outpost,
        OutpostPosition,
        Revenant,
        Reinforcement,
        WorldEvent,
        WorldEventTracker,

        ClientCameraPosition,
        ClientClickPosition,
        ClientOutpostData,
        ClientGameData,
    }: ClientComponents
) {

    //noti setup  here


    // const create_game = async ({ account, max_players, game_length, password, entry_fee }: CreateGameProps) => {
   
    // };
   

    return {
       
    };
}

export enum Direction {
    Left = 1,
    Right = 2,
    Up = 3,
    Down = 4,
}
