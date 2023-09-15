import { overridableComponent } from "@latticexyz/recs";
import { SetupNetworkResult } from "./setupNetwork";


export type ClientComponents = ReturnType<typeof createClientComponents>;

export function createClientComponents({ contractComponents }: SetupNetworkResult) {
    return {
        ...contractComponents,
        Position: overridableComponent(contractComponents.Position),
        Defence: overridableComponent(contractComponents.Defence),
        Lifes: overridableComponent(contractComponents.Lifes),
        Prosperity : overridableComponent(contractComponents.Prosperity),
        Name: overridableComponent(contractComponents.Name),
        Balance: overridableComponent(contractComponents.Balance),
        Game: overridableComponent(contractComponents.Game),
        WorldEvent: overridableComponent(contractComponents.WorldEvent),
        Ownership: overridableComponent(contractComponents.Ownership),
        GameTracker: overridableComponent(contractComponents.GameTracker),
        GameEntityCounter : overridableComponent(contractComponents.GameEntityCounter),

        //should not be here
        ClientClickPosition : overridableComponent(contractComponents.ClientClickPosition),
        ClientCameraPosition : overridableComponent(contractComponents.ClientCameraPosition),
        
    };
}