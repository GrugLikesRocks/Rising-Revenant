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
        GameData : overridableComponent(contractComponents.GameData),
        OutpostEntity : overridableComponent(contractComponents.OutpostEntity),

        //should not be here
        ClientCameraComponent : overridableComponent(contractComponents.ClientCameraComponent),
        ClickComponent : overridableComponent(contractComponents.ClickComponent),
        OutpostState: overridableComponent(contractComponents.OutpostState),
    };
}