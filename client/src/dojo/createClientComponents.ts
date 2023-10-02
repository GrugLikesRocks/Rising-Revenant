import { overridableComponent } from "@latticexyz/recs";
import { SetupNetworkResult } from "./setupNetwork";


export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({ contractComponents }: SetupNetworkResult) {
    return {
        ...contractComponents,
        

        Outpost: overridableComponent(contractComponents.Outpost),
        Revenant: overridableComponent(contractComponents.Revenant),
        Game: overridableComponent(contractComponents.Game),
        WorldEvent: overridableComponent(contractComponents.WorldEvent),
        GameTracker: overridableComponent(contractComponents.GameTracker),
        GameEntityCounter : overridableComponent(contractComponents.GameEntityCounter),
        Reinforcement : overridableComponent(contractComponents.Reinforcement),

        //should not be here
        ClientClickPosition : overridableComponent(contractComponents.ClientClickPosition),
        ClientCameraPosition : overridableComponent(contractComponents.ClientCameraPosition),
        ClientOutpostData : overridableComponent(contractComponents.ClientOutpostData),
        ClientGameData : overridableComponent(contractComponents.ClientGameData),
    };
}