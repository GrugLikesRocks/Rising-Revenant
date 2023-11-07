import { SetupNetworkResult } from "./setupNetwork";
import { ClientComponents } from "./createClientComponents";
import { getEntityIdFromKeys, hexToAscii , getEvents, setComponentsFromEvents} from "@dojoengine/utils";
import { uuid } from "@latticexyz/utils";
import { getComponentValue, getComponentValueStrict, Components, Schema,setComponent } from "@latticexyz/recs";



import { CreateGameProps, CreateRevenantProps, ConfirmEventOutpost, CreateEventProps, PurchaseReinforcementProps, ReinforceOutpostProps } from "./types/index"

import { toast } from 'react-toastify';

import manifest from "../../../contracts/target/dev/manifest.json";
import { MAP_HEIGHT, MAP_WIDTH } from "../phaser/constants";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
    { execute, contractComponents, clientComponents }: SetupNetworkResult,
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

    const create_game = async ({ account, preparation_phase_interval, event_interval, erc_addr }: CreateGameProps) => {

        try {
            const tx = await execute(account, "game_actions", "create", [preparation_phase_interval, event_interval, erc_addr]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            setComponentsFromEvents(contractComponents,
                getEvents(receipt)
            );
            console.log(receipt)

            notify('Game Created!')
        } catch (e) {
            console.log(e)
            notify(`Error creating game ${e}`)
        }
    };

    const create_revenant = async ({ account, game_id, name }: CreateRevenantProps) => {

        // const gameTracker = getComponentValueStrict(GameEntityCounter, game_id)

        const gameTracker = 1

        const revenantId = uuid()
        const revenantAndOutpostKey = getEntityIdFromKeys([BigInt(game_id), BigInt(gameTracker)])

        Revenant.addOverride(revenantId, {
            entity: revenantAndOutpostKey,
            value: {
                owner: account.address,
                name_revenant: name,
                outpost_count: 1,
                status: 1
            }
        })

        const outpostId = uuid()
        
        Outpost.addOverride(outpostId, {
            entity: revenantAndOutpostKey,
            value: {
                owner: account.address,
                name_outpost: name,
                x: MAP_WIDTH/2,
                y: MAP_HEIGHT/2,
                lifes: 1,
                status: 1,
                last_affect_event_id: 0,
            }
        })

        const clientOutpostId = uuid()
        
        ClientOutpostData.addOverride(clientOutpostId, {
            entity: revenantAndOutpostKey,
            value: {
                id: 1,
                owned: true,
                event_effected: false, 
                selected: false,
                visible: true,
            }
        })

        try {
            const tx = await execute(account, "revenant_actions", "create", [game_id, name]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )

            console.log(receipt)
            // setComponentsFromEvents(contractComponents,
            //     getEvents(receipt)
            // );

            notify('Revenant Created!');
        } catch (e) {
            console.log(e)
            Revenant.removeOverride(revenantId);
            Outpost.removeOverride(outpostId);
            ClientOutpostData.removeOverride(clientOutpostId);

            notify('Failed to create revenant');
        }
        finally
        {
            Revenant.removeOverride(revenantId);
            Outpost.removeOverride(outpostId);
            ClientOutpostData.removeOverride(clientOutpostId);
        }
    };

    const purchase_reinforcement = async ({ account, game_id, count }: PurchaseReinforcementProps) => {

        const reinforcementId = uuid();
        const balanceKey =  getEntityIdFromKeys([BigInt(game_id), BigInt(account.address)]);

        const reinforecementBalance = getComponentValue(Reinforcement, balanceKey)

        Reinforcement.addOverride(reinforcementId, {
            entity:  balanceKey,
            value: {
                balance: reinforecementBalance?.balance,
            }
        })

        try {
            const tx = await execute(account, "revenant_actions", "purchase_reinforcement", [game_id, count]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            // setComponentsFromEvents(contractComponents,
            //     getEvents(receipt)
            // );

            notify(`Purchased ${count} reinforcements`);
        } catch (e) {
            console.log(e)
            Reinforcement.removeOverride(reinforcementId);
        }
        finally
        {
            Reinforcement.removeOverride(reinforcementId);
        }
    };

    const reinforce_outpost = async ({ account, game_id, outpost_id }: ReinforceOutpostProps) => {
        
        const reinforcementId = uuid();
        const balanceKey =  getEntityIdFromKeys([BigInt(game_id), BigInt(account.address)]);

        const reinforecementBalance = getComponentValue(Reinforcement, balanceKey)

        Reinforcement.addOverride(reinforcementId, {
            entity:  balanceKey,
            value: {
                balance: reinforecementBalance?.balance - 1,
            }
        })

        const outpostKey = getEntityIdFromKeys([BigInt(game_id), BigInt(outpost_id)])
        const outpostData = getComponentValueStrict(Outpost, outpostKey)
        
        const outpostId = uuid()
        
        Outpost.addOverride(outpostId, {
            entity: outpostData,
            value: {
                lifes: outpostData.lifes + 1
            }
        })

        try {
            const tx = await execute(account, "revenant_actions", "reinforce_outpost", [game_id, outpost_id]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            // setComponentsFromEvents(contractComponents,
            //     getEvents(receipt)
            // );

            notify('Reinforced Outpost')
        } catch (e) {
            console.log(e)
            notify("Failed to reinforce outpost")

            Reinforcement.removeOverride(reinforcementId)
            Outpost.removeOverride(outpostId)
        }
        finally
        {
            Reinforcement.removeOverride(reinforcementId)
            Outpost.removeOverride(outpostId)
        }
    };

    const create_event = async ({ account, game_id }: CreateEventProps) => {
        
        const gameTracker = getComponentValueStrict(GameTracker, game_id)

        const worldEventKey = getEntityIdFromKeys([BigInt(game_id), BigInt(gameTracker.event_count)])
        const worldEventId = uuid()

        WorldEvent.addOverride(
            worldEventId,
            {
                entity: worldEventKey,
                value: {
                    x: MAP_WIDTH/2,
                    y: MAP_HEIGHT/2,
                    radius: 10,
                    destroy_count: 0,
                    block_number: 0,
                }
            }
        )

        const gameTrackerId = uuid();
        GameTracker.addOverride(
            gameTrackerId,
            {
                entity: getEntityIdFromKeys([BigInt(game_id)]),
                value: {
                    event_count: gameTracker.event_count + 1
                }
            }
        )

        try {
            const tx = await execute(account, "world_event_actions", "create", [game_id]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            // setComponentsFromEvents(contractComponents,
            //     getEvents(receipt)
            // );

            notify('World Event Created!');

        } catch (e) {
            console.log(e)
            WorldEvent.removeOverride(worldEventId);
            GameTracker.removeOverride(gameTrackerId);
        }
        finally
        {
            WorldEvent.removeOverride(worldEventId);
            GameTracker.removeOverride(gameTrackerId);
        }
    };

    const confirm_event_outpost = async ({ account, game_id, event_id, outpost_id }: ConfirmEventOutpost) => {

            const clientOutpostId = uuid();
            const outpostKey = getEntityIdFromKeys([BigInt(game_id),BigInt(outpost_id)]);

            ClientOutpostData.addOverride(
                clientOutpostId,
                {
                    entity: outpostKey,
                    value: {
                        event_effected: false, 
                    }
                }
            )
            
            const outpostData = getComponentValueStrict(Outpost, outpostKey)

            const outpostId = uuid()
            Outpost.addOverride(
                outpostId,
                {
                    entity: outpostKey,
                    value: {
                        last_affect_event_id: event_id,
                        lifes: outpostData.lifes - 1
                    }
                }
            )
            
        try {
            const tx = await execute(account, "world_event_actions", "create", [game_id, event_id, outpost_id]);
            const receipt = await account.waitForTransaction(
                tx.transaction_hash,
                { retryInterval: 100 }
            )
            // setComponentsFromEvents(contractComponents,
            //     getEvents(receipt)
            // );

            notify('Confirmed the event')
        } catch (e) {
            console.log(e)
            notify('Failed to confirm event')
            ClientOutpostData.removeOverride(clientOutpostId);
            Outpost.removeOverride(outpostData);
        }
        finally
        {
            ClientOutpostData.removeOverride(clientOutpostId);
            Outpost.removeOverride(outpostData);

        }
    };


    return {

        create_game,
        create_revenant,
        purchase_reinforcement,
        reinforce_outpost,
        create_event,
        confirm_event_outpost
    };
}
