import { SetupNetworkResult } from "./setupNetwork";
import { ClientComponents } from "./createClientComponents";
import { getEntityIdFromKeys, getEvents, setComponentsFromEvents } from "@dojoengine/utils";

import {CreateGameProps, CreateRevenantProps,ConfirmEventOutpost,CreateEventProps,CreateOutpostProps,PurchaseReinforcementProps,ReinforceOutpostProps} from "./types/index"

import { toast } from 'react-toastify';

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

    const notify = (message: string) => toast(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

    const create_game = async ({ account, preparation_phase_interval, event_interval, erc_addr}: CreateGameProps) => {

        try {             
            const tx = await execute(account, "game_actions", "create", [preparation_phase_interval, event_interval, erc_addr]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            setComponentsFromEvents(contractComponents,
                getEvents(receipt)
            );

            notify('Game Created!')
        } catch (e) {
            console.log(e)
            notify(`Error creating game ${e}`)
        }
    };

    const create_revenant = async ({ account, game_id, name}: CreateRevenantProps) => {

        try {  
            const tx = await execute(account, "revenant_actions", "create", [game_id,name]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            setComponentsFromEvents(contractComponents,
                getEvents(receipt)
            );

            notify('Game Created!');
        } catch (e) {
            console.log(e)
        }
    };

    const purchase_reinforcement = async ({ account, game_id, count}: PurchaseReinforcementProps) => {

        try {              
            const tx = await execute(account, "revenant_actions", "purchase_reinforcement", [game_id,count]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            setComponentsFromEvents(contractComponents,
                getEvents(receipt)
            );

            // notify('Game Created!', receipt)
        } catch (e) {
            console.log(e)
        }
    };

    const reinforce_outpost = async ({ account, game_id, outpost_id}: ReinforceOutpostProps) => {

        try {                
            const tx = await execute(account, "revenant_actions", "reinforce_outpost", [game_id,outpost_id]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            setComponentsFromEvents(contractComponents,
                getEvents(receipt)
            );

            // notify('Game Created!', receipt)
        } catch (e) {
            console.log(e)
        }
    };

    const create_outpost = async ({ account, game_id}: CreateOutpostProps) => {

        try {                
            const tx = await execute(account, "revenant_actions", "create_outpost", [game_id]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            setComponentsFromEvents(contractComponents,
                getEvents(receipt)
            );

            // notify('Game Created!', receipt)
        } catch (e) {
            console.log(e)
        }
    };



    const create_event = async ({ account, game_id}: CreateEventProps) => {

        try {               
            const tx = await execute(account, "world_event_actions", "create", [game_id]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            setComponentsFromEvents(contractComponents,
                getEvents(receipt)
            );

            // notify('Game Created!', receipt)
        } catch (e) {
            console.log(e)
        }
    };

    const confirm_event_outpost = async ({ account, game_id,event_id,outpost_id}: ConfirmEventOutpost) => {

        try {               
            const tx = await execute(account, "world_event_actions", "create", [game_id,event_id,outpost_id]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            setComponentsFromEvents(contractComponents,
                getEvents(receipt)
            );

            // notify('Game Created!', receipt)
        } catch (e) {
            console.log(e)
        }
    };


    return {

        create_game,
        create_revenant,
        purchase_reinforcement,
        reinforce_outpost,
        create_outpost,
        create_event,
        confirm_event_outpost
    };
}

