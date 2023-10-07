import { SetupNetworkResult } from "./setupNetwork";
import {
  Account,
} from "starknet";
import {
  EntityIndex,
  setComponent,
  getComponentValueStrict,
  getComponentValue,
} from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import {
  GAME_CONFIG,
  MAP_HEIGHT,
  MAP_WIDTH,
  PREPARATION_PHASE_BLOCK_COUNT,
} from "../phaser/constants";
import { poseidonHashMany } from "micro-starknet";
import { bigIntToHexWithPrefix } from "../utils";

import { toast } from 'react-toastify';

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { execute, contractComponents, call }: SetupNetworkResult,
  {
    Outpost,
    Revenant,
    Game,
    WorldEvent,
    GameTracker,
    GameEntityCounter,
    Reinforcement,

    ClientCameraPosition,
    ClientClickPosition,
    ClientOutpostData,
    ClientGameData
  }: ClientComponents
) {

  const notify = (message: string) => toast(message, {
    position: "top-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "dark",
  });


  const reinforce_outpost = async (signer: Account, outpost_id: number) => {

    const game_id = getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_id;

    try {

      const tx = await execute(signer, "reinforce_outpost", [
        game_id,
        outpost_id
      ]);

      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      notify("Reinforcing outpost " + outpost_id + "\nTransaction hash: " + receipt.transaction_hash)

      //setComponentsFromEvents(contractComponents, getEvents(receipt));
    } catch (e) {
      console.log(e);
      notify("this is an error with the sys calss  also this is te game Id " + game_id + " and this is the outpost id " + outpost_id + "\n\n\n")
      // notify("Reinforcement failed")
    } finally {
    }
  };


  const purchase_reinforcement = async (signer: Account, amount: number) => {
    try {
      const game_id = getComponentValueStrict(ClientGameData, GAME_CONFIG as EntityIndex).current_game_id;

      // console.log("this is what was sent to the reinforce function ", amount, " btw this si the game id ", game_id,"\n\n\n")

      const tx = await execute(signer, "purchase_reinforcement", [
        game_id,
        amount,
      ]);

      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      console.log("reinforce_outpost", receipt);

      notify("Buying " + amount + " reinforcements\n" + "Transaction hash: " + receipt.transaction_hash)

      //setComponentsFromEvents(contractComponents, getEvents(receipt));
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const create_game = async (signer: Account) => {
    try {
      const tx = await execute(signer, "create_game", []);

      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      console.log("create game", receipt);
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const destroy_outpost = async (
    signer: Account,
    event_id: number,
    outpost_id: number
  ) => {
    try {

      const game_id = getComponentValueStrict(ClientGameData, GAME_CONFIG as EntityIndex).current_game_id;

      console.log("this is what was sent to the destroy function", signer, " ", event_id, " ", outpost_id, "  ", game_id, "\n\n\n")

      const tx = await execute(signer, "destroy_outpost", [
        game_id,
        event_id,
        outpost_id,
      ]);

      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      console.log("destroy outpost", receipt);
      notify("Destroying outpost " + outpost_id + "\nTransaction hash: " + receipt.transaction_hash)

      //setComponentsFromEvents(contractComponents, getEvents(receipt));
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const set_world_event = async (signer: Account) => {
    try {

      const game_id = getComponentValueStrict(ClientGameData, GAME_CONFIG as EntityIndex).current_game_id;

      const tx = await execute(signer, "set_world_event", [game_id]);

      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      console.log("world event tx", receipt);

      //setComponentsFromEvents(contractComponents, getEvents(receipt));
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const create_revenant = async (
    signer: Account,
    name: string
  ) => {
    try {

      const game_id = getComponentValueStrict(ClientGameData, GAME_CONFIG as EntityIndex).current_game_id;

      const tx: any = await execute(signer, "create_revenant", [game_id, name]);

      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      console.log("create revenant", receipt);

      notify("Summoning revenant " + name + "\nTransaction hash: " + receipt.transaction_hash)

      //setComponentsFromEvents(contractComponents, getEvents(receipt));
    } catch (e) {
      console.log(e);
      notify("adding rev ")
    } finally {
    }
  };

  //////////////////////////////////////////////////
  //////////////////////////////////////////////////
  //////////////////////////////////////////////////

  const fetch_game_data = async (game_id: number) => {

    if (game_id === 0) {
      return;
    }

    const gameDataEntityId = getEntityIdFromKeys([BigInt(game_id)]);

    const gameUUID = uuid();
    const clientCamCompUUID = uuid();
    const clickCompUUID = uuid();

    const gameComp = getComponentValue(Game, gameDataEntityId);

    if (gameComp === undefined) {

      Game.addOverride(gameUUID, {
        entity: gameDataEntityId,
        value: {
          start_block_number: 0,
          prize: 0,
          status: 0,
        },
      });

      ClientCameraPosition.addOverride(clientCamCompUUID, {
        entity: GAME_CONFIG,
        value: { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 },
      });

      ClientClickPosition.addOverride(clickCompUUID, {
        entity: GAME_CONFIG,
        value: {
          xFromMiddle: 0,
          yFromMiddle: 0,

          yFromOrigin: 0,
          xFromOrigin: 0,
        },
      });
    }

    try {
      const tx: any = await call("fetch_game_data", [game_id]);

      const gameDataEntityId = getEntityIdFromKeys([BigInt(game_id)]);

      const keys_amount = 1;

      setComponent(Game, gameDataEntityId, {
        start_block_number: Number(tx[0 + keys_amount]),
        prize: Number(tx[1 + keys_amount]),
        status: Number(tx[2 + keys_amount]),
      });

      setComponent(ClientCameraPosition, GAME_CONFIG, {
        x: MAP_WIDTH / 2,
        y: MAP_HEIGHT / 2,
      });

      setComponent(ClientClickPosition, GAME_CONFIG, {
        xFromMiddle: 0,
        yFromMiddle: 0,

        yFromOrigin: 0,
        xFromOrigin: 0,
      });

    } catch (e) {
      console.log(e);
      ClientCameraPosition.removeOverride(clientCamCompUUID);
      ClientClickPosition.removeOverride(clickCompUUID);
      Game.removeOverride(gameUUID);
    } finally {

      ClientCameraPosition.removeOverride(clientCamCompUUID);
      ClientClickPosition.removeOverride(clickCompUUID);
      Game.removeOverride(gameUUID);
    }
  };

  const fetch_game_entity_counter_data = async (game_id: number) => {

    if (game_id === 0) {
      return;
    }


    const gameEntityCounterId = getEntityIdFromKeys([BigInt(game_id)]);

    const gameEntityCounterComp = getComponentValue(GameEntityCounter, gameEntityCounterId);

    const gameEntityCounterUUID = uuid();

    if (gameEntityCounterComp === undefined) {

      GameEntityCounter.addOverride(gameEntityCounterUUID, {
        entity: gameEntityCounterId,
        value: {
          revenant_count: 0,
          outpost_count: 0,
          event_count: 0,
        },
      });
    }

    try {

      const tx: any = await call("fetch_game_entity_counter_data", [game_id]);

      const gameEntityCounterId = getEntityIdFromKeys([BigInt(game_id)]);

      const keys_amount = 1;

      setComponent(GameEntityCounter, gameEntityCounterId, {
        revenant_count: Number(tx[0 + keys_amount]),
        outpost_count: Number(tx[1 + keys_amount]),
        event_count: Number(tx[2 + keys_amount]),
      });

    } catch (e) {
      console.log(e);
      GameEntityCounter.removeOverride(gameEntityCounterUUID);
    }
    finally {
      GameEntityCounter.removeOverride(gameEntityCounterUUID);
    }
  };

  const fetch_game_tracker_data = async (signer: Account) => {

    const gameTrackerUUID = uuid();
    const clientGameDataUUID = uuid();

    let outpostData = getComponentValue(GameTracker, GAME_CONFIG);

    if (outpostData === undefined) {
      GameTracker.addOverride(gameTrackerUUID, {
        entity: GAME_CONFIG,
        value: {
          count: 0,
        },
      });

      ClientGameData.addOverride(clientGameDataUUID, {
        entity: GAME_CONFIG,
        value: {
          current_game_state: 1,
          user_account_address: "",
          current_game_id: 0,
          current_block_number: 0,
        },
      });
    }


    try {
      const txGameTracker: any = await call("fetch_game_tracker_data", []);

      let keys_amount = 1;

      setComponent(GameTracker, GAME_CONFIG as EntityIndex, {
        count: Number(txGameTracker[0 + keys_amount]),
      });

      setComponent(ClientGameData, GAME_CONFIG as EntityIndex, {
        current_game_state: 1,
        user_account_address: signer.address.toString(),
        current_game_id: Number(txGameTracker[0 + keys_amount]),
        current_block_number: 0,
      });

    } catch (e) {
      console.log(e);
      GameTracker.removeOverride(gameTrackerUUID);
      ClientGameData.removeOverride(clientGameDataUUID);
    } finally {
      GameTracker.removeOverride(gameTrackerUUID);
      ClientGameData.removeOverride(clientGameDataUUID);
    }
  };

  ////////////////////////////////////////////////////////////////////////////////

  const fetch_outpost_data = async (entity_id: number) => {

    const game_id = getComponentValueStrict(ClientGameData, GAME_CONFIG as EntityIndex).current_game_id;

    const outpostId = getEntityIdFromKeys([
      BigInt(game_id),
      BigInt(entity_id),
    ]);

    const outpostData = getComponentValue(Outpost, outpostId);

    const outpostUUID = uuid();
    const outpostDataUUID = uuid();

    if (outpostData === undefined) {

      Outpost.addOverride(outpostUUID, {
        entity: outpostId,
        value: {
          owner:0 ,
          name: 0,
          x: 0,
          y: 0,
          lifes: 0,
          status: 0,
          last_affect_event_id: 0,
        },
      });

      ClientOutpostData.addOverride(outpostDataUUID, {
        entity: outpostId,
        value: {
          id: 0,
          owned: false,
          event_effected: false
        },
      });
    }


    try {

      const tx: any = await call("fetch_outpost_data", [game_id, entity_id]);

      let keys_amount = 2;

      if (outpostData?.status === Number(tx[5 + keys_amount]) &&
        outpostData?.lifes === Number(tx[4 + keys_amount]) &&
        outpostData?.y === Number(tx[3 + keys_amount]) &&
        outpostData?.x === Number(tx[2 + keys_amount]) &&
        outpostData?.name === Number(tx[1 + keys_amount]) &&
        outpostData?.owner === (tx[0 + keys_amount]) &&
        outpostData?.last_affect_event_id === Number(tx[6 + keys_amount])) 
      {
        return;
      }

      setComponent(Outpost, outpostId, {
        owner: tx[0 + keys_amount],
        name: tx[1 + keys_amount],
        x: Number(tx[2 + keys_amount]),
        y: Number(tx[3 + keys_amount]),
        lifes: Number(tx[4 + keys_amount]),
        status: tx[5 + keys_amount],
        last_affect_event_id: Number(tx[6 + keys_amount]),
      });

      let owned = false;

      if (bigIntToHexWithPrefix(tx[0 + keys_amount]) === getComponentValueStrict(ClientGameData, GAME_CONFIG as EntityIndex).user_account_address) {
        owned = true;
      }

      const outpostClientData = getComponentValue(ClientOutpostData, outpostId);

      setComponent(ClientOutpostData, outpostId, {
        id: entity_id,
        owned: owned,
        event_effected: outpostClientData?.event_effected || false
      });

    } catch (e) {
      console.log(e);
      Outpost.removeOverride(outpostUUID);
      ClientOutpostData.removeOverride(outpostDataUUID);
    } finally {
      Outpost.removeOverride(outpostUUID);
      ClientOutpostData.removeOverride(outpostDataUUID);
    }
  };

  const fetch_revenant_data = async (entity_id: number) => {

    const game_id = getComponentValueStrict(ClientGameData, GAME_CONFIG as EntityIndex).current_game_id;

    const revenantId = getEntityIdFromKeys([
      BigInt(game_id),
      BigInt(entity_id),
    ]);

    const revenantComp = getComponentValue(Revenant, revenantId);

    const revenantUUID = uuid();

    if (revenantComp === undefined) {

      Revenant.addOverride(revenantUUID, {
        entity: revenantId,
        value: {
          owner: 0,
          name: 0,
          outpost_count: 0,
          status: 0,
        },
      });
    }

    try {

      const tx: any = await call("fetch_revenant_data", [game_id, entity_id]);

      let keys_amount = 2;

      if (revenantComp?.status === Number(tx[3 + keys_amount]) && 
      revenantComp?.outpost_count === Number(tx[2 + keys_amount]) && 
      revenantComp?.name === Number(tx[1 + keys_amount]) && 
      revenantComp?.owner === (tx[0 + keys_amount])) 
      {
        return;
      }

      setComponent(Revenant, revenantId, {
        owner: tx[0 + keys_amount],
        name: tx[1 + keys_amount],
        outpost_count: tx[2 + keys_amount],
        status: tx[3 + keys_amount],
      });

    } catch (e) {
      console.log(e);
      Revenant.removeOverride(revenantUUID);
    } finally {
      Revenant.removeOverride(revenantUUID);
    }
  };

  const fetch_event_data = async (entity_id: number) => {

    const game_id = getComponentValueStrict(ClientGameData, GAME_CONFIG as EntityIndex).current_game_id;

    const eventId = getEntityIdFromKeys([BigInt(game_id), BigInt(entity_id)]);

    const eventUUID = uuid();

    const WorldEventComp = getComponentValue(WorldEvent, eventId);

    if (WorldEventComp === undefined) {

      WorldEvent.addOverride(eventUUID, {
        entity: eventId,
        value: {
          x: 0,
          y: 0,
          radius: 0,
          destroy_count: 0,
          block_number: 0,
        },
      });
    }

    try {

      const tx: any = await call("fetch_event_data", [game_id, entity_id]);

      let keys_amount = 2;

      // this is to change
      if (WorldEventComp?.block_number === Number(tx[4 + keys_amount])) {
        return;
      }


      setComponent(WorldEvent, eventId, {
        x: Number(tx[0 + keys_amount]),
        y: Number(tx[1 + keys_amount]),
        radius: Number(tx[2 + keys_amount]),
        destroy_count: Number(tx[3 + keys_amount]),
        block_number: Number(tx[4 + keys_amount]),
      });

    } catch (e) {
      console.log(e);
      WorldEvent.removeOverride(eventUUID);
    } finally {
      WorldEvent.removeOverride(eventUUID);
    }
  };

  const fetch_current_block_count = async () => {
    try {

      const txBlockTracker: any = await call("fetch_current_block_count", []);

      const clientGameData = getComponentValueStrict(ClientGameData, GAME_CONFIG as EntityIndex);
      const gameData = getComponentValueStrict(Game, clientGameData.current_game_id as EntityIndex);

      let phase = clientGameData.current_game_state;

      if (clientGameData.current_game_state === 1) {
        //prep phase
        if (Number(txBlockTracker[0]) > gameData.start_block_number + PREPARATION_PHASE_BLOCK_COUNT) {
          phase = 2;
        }
      }

      // we dont want to set the component again if its the same value

      if (clientGameData.current_block_number === Number(txBlockTracker[0])) {
        return;
      }

      setComponent(ClientGameData, GAME_CONFIG as EntityIndex, {
        current_game_state: phase,
        user_account_address: clientGameData.user_account_address,
        current_game_id: clientGameData.current_game_id,
        current_block_number: Number(txBlockTracker[0])
      });

    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const fetch_user_reinforcement_balance = async (signer: Account) => {

    const game_id = getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_id;

    const entityIndex = getEntityIdFromKeys([BigInt(game_id), BigInt(signer.address)]);

    const reinforcementComp = getComponentValue(Reinforcement, entityIndex);

    const ReinforcementUUID = uuid();

    if (reinforcementComp === undefined) {

      Reinforcement.addOverride(ReinforcementUUID, {
        entity: entityIndex,
        value: {
          balance: 0,
        },
      });
    }

    try {

      const txBalanceTracker: any = await call("fetch_reinforcement_balance", [game_id, signer.address]);

      let keys_amount = 2;

      setComponent(Reinforcement, entityIndex, {
        balance: Number(txBalanceTracker[0 + keys_amount])
      });

      notify("fetching reinforcement balance for " + signer.address + " with game id: " + game_id)

    } catch (e) {
      console.log(e);
      Reinforcement.removeOverride(ReinforcementUUID);
    }
    finally {
      Reinforcement.removeOverride(ReinforcementUUID);
    }
  };

  //////////////////////////////////////////////////
  //////////////////////////////////////////////////
  //////////////////////////////////////////////////

  return {
    reinforce_outpost,
    create_game,   //debug
    destroy_outpost,
    set_world_event,   //debug
    create_revenant,
    purchase_reinforcement,

    //////////////////////////////////////////////////
    fetch_event_data,
    fetch_game_entity_counter_data,
    fetch_game_data,
    fetch_game_tracker_data,
    fetch_outpost_data,
    fetch_revenant_data,
    fetch_current_block_count,
    fetch_user_reinforcement_balance,

  };
}

export function getEntityIdFromKeys(keys: bigint[]): EntityIndex {
  if (keys.length === 1) {
    return parseInt(keys[0].toString()) as EntityIndex;
  }

  let poseidon = poseidonHashMany([BigInt(keys.length), ...keys]);
  return parseInt(poseidon.toString()) as EntityIndex;
}
