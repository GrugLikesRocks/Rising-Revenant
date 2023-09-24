import { SetupNetworkResult } from "./setupNetwork";
import {
  Account,
  InvokeTransactionReceiptResponse,
  shortString,
  Event,
} from "starknet";
import {
  EntityIndex,
  getComponentValue,
  setComponent,
  Components,
  Schema,
} from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import {
  CAMERA_ID,
  GAME_CONFIG,
  MAP_HEIGHT,
  MAP_WIDTH,
  currentGameId,
  setCurrentGameId,
  setUserAccountAddress,
  userAccountAddress,
} from "../phaser/constants";
import { poseidonHashMany } from "micro-starknet";
import {
  fromFixed,
  toFixed,
  hexToAscii,
  toFelt,
  bigIntToHexWithPrefix,
  bigIntToHexAndAscii,
} from "../utils";

// altough this new method is much cleaner, need to try the old one back to see if the number and bigint issue gets fixed

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

    ClientCameraPosition,
    ClientClickPosition,
    ClientOutpostData
  }: ClientComponents
) {
  const reinforce_outpost = async (signer: Account, revenant_id: number) => {
    try {
      const tx = await execute(signer, "reinforce_outpost", [
        revenant_id,
        currentGameId,
      ]);

      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      console.log("reinforce_outpost", receipt);

      setComponentsFromEvents(contractComponents, getEvents(receipt));
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
    game_id: number,
    event_id: number,
    outpost_id: number
  ) => {
    try {
      const tx = await execute(signer, "destroy_outpost", [
        game_id,
        event_id,
        outpost_id,
      ]);

      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      console.log("destroy outpost", receipt);

      setComponentsFromEvents(contractComponents, getEvents(receipt));
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const create_outpost = async (
    signer: Account,
    game_id: number,
    revenant_id: number
  ) => {
    try {
      const tx: any = await execute(signer, "create_outpost", [
        game_id,
        revenant_id,
      ]);

      console.log("this is the revenant id given ", revenant_id);

      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      console.log("create outpost", receipt);

      setComponentsFromEvents(contractComponents, getEvents(receipt));
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const set_world_event = async (signer: Account) => {
    try {
      const tx = await execute(signer, "set_world_event", [currentGameId]);

      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      console.log("world event tx", receipt);

      setComponentsFromEvents(contractComponents, getEvents(receipt));
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const create_revenant = async (
    signer: Account,
    game_id: number,
    name: string
  ) => {
    try {
      const tx: any = await execute(signer, "create_revenant", [game_id, name]);

      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      console.log("create revenant", receipt);

      setComponentsFromEvents(contractComponents, getEvents(receipt));
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  //////////////////////////////////////////////////
  //////////////////////////////////////////////////
  //////////////////////////////////////////////////

  // need to add the overrideRemove thing to each of this

  const fetch_full_game_data = async (signer: Account) => {
    try {
      const txGameTracker: any = await call("fetch_game_tracker_data", []);
      console.log("tx from the game tracker ", txGameTracker);

      let keys_amount = 1;

      const gameTrackerUUID = uuid();
      setCurrentGameId(Number(txGameTracker[0 + keys_amount]));

      GameTracker.addOverride(gameTrackerUUID, {
        entity: GAME_CONFIG as EntityIndex,
        value: {
          count: Number(txGameTracker[0 + keys_amount]),
        },
      });

      setUserAccountAddress(signer.address.toString());

      ///////////////////////////////////////////////////////////////////////////////////

      const txGameEntityCounter: any = await call(
        "fetch_game_entity_counter_data",
        [currentGameId]
      );
      console.log(txGameEntityCounter);

      const gameEntityCounterId = getEntityIdFromKeys([BigInt(currentGameId)]);

      keys_amount = 1;

      const gameEntityCounterUUID = uuid();
      GameEntityCounter.addOverride(gameEntityCounterUUID, {
        entity: gameEntityCounterId,
        value: {
          revenant_count: Number(txGameEntityCounter[0 + keys_amount]),
          outpost_count: Number(txGameEntityCounter[1 + keys_amount]),
          event_count: Number(txGameEntityCounter[2 + keys_amount]),
        },
      });

      ///////////////////////////////////////////////////////////////////////////////////

      const txGameData: any = await call("fetch_game_data", [currentGameId]);
      console.log(txGameData);

      const gameDataEntityId = getEntityIdFromKeys([BigInt(currentGameId)]);

      keys_amount = 1;

      const gameUUID = uuid();
      Game.addOverride(gameUUID, {
        entity: gameDataEntityId,
        value: {
          start_time: fromFixed(txGameData[0 + keys_amount]),
          prize: fromFixed(txGameData[1 + keys_amount]),
          status: fromFixed(txGameData[2 + keys_amount]),
        },
      });

      const clientCamCompUUID = uuid();
      ClientCameraPosition.addOverride(clientCamCompUUID, {
        entity: gameDataEntityId,
        value: { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 },
      });

      const clickCompUUID = uuid();
      ClientClickPosition.addOverride(clickCompUUID, {
        entity: gameDataEntityId,
        value: {
          xFromMiddle: 0,
          yFromMiddle: 0,

          yFromOrigin: 0,
          xFromOrigin: 0,
        },
      });
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  //delete the 3 below if not needed
  const fetch_game_data = async (game_id: number) => {
    try {
      const tx: any = await call("fetch_game_data", [game_id]);
      console.log(tx);

      const gameDataEntityId = getEntityIdFromKeys([BigInt(game_id)]);

      const keys_amount = 1;

      const gameUUID = uuid();
      Game.addOverride(gameUUID, {
        entity: gameDataEntityId,
        value: {
          start_time: fromFixed(tx[0 + keys_amount]),
          prize: fromFixed(tx[1 + keys_amount]),
          status: fromFixed(tx[2 + keys_amount]),
        },
      });

      const clientCamCompUUID = uuid();
      ClientCameraPosition.addOverride(clientCamCompUUID, {
        entity: gameDataEntityId,
        value: { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 },
      });

      const clickCompUUID = uuid();
      ClientClickPosition.addOverride(clickCompUUID, {
        entity: gameDataEntityId,
        value: {
          xFromMiddle: 0,
          yFromMiddle: 0,

          yFromOrigin: 0,
          xFromOrigin: 0,
        },
      });
    } catch (e) {
      console.log(e);

      return false;
    } finally {
      return true;
    }
  };

  const fetch_game_entity_counter_data = async (game_id: number) => {
    try {
      const tx: any = await call("fetch_game_entity_counter_data", [game_id]);
      console.log(tx);

      const gameEntityCounterId = getEntityIdFromKeys([BigInt(game_id)]);

      const keys_amount = 1;

      console.log("this si the entity id for the game entity counter", gameEntityCounterId);

      const gameEntityCounterUUID = uuid();
      GameEntityCounter.addOverride(gameEntityCounterUUID, {
        entity: gameEntityCounterId,
        value: {
          revenant_count: Number(tx[0 + keys_amount]),
          outpost_count: Number(tx[1 + keys_amount]),
          event_count: Number(tx[2 + keys_amount]),
        },
      });

      return true;
    } catch (e) {
      console.log(e);

      return false;
    }
  };

  const fetch_game_tracker_data = async (signer: Account) => {
    try {
      const tx: any = await call("fetch_game_tracker_data", []);
      console.log(tx);

      let keys_amount = 1;

      console.log(
        "the saved data is ",
        tx[0 + keys_amount],
        " and this is the output ",
        tx[0 + keys_amount]
      );

      const gameTrackerUUID = uuid();
      setCurrentGameId(Number(tx[0 + keys_amount]));

      GameTracker.addOverride(gameTrackerUUID, {
        entity: GAME_CONFIG as EntityIndex,
        value: {
          count: Number(tx[0 + keys_amount]),
        },
      });

      setUserAccountAddress(signer.address.toString());

      return true;
    } catch (e) {
      console.log(e);

      return false;
    } finally {
    }
  };

  ////////////////////////////////////////////////////////////////////////////////

  const fetch_outpost_data = async (game_id: number, entity_id: number) => {
    try {
      const tx: any = await call("fetch_outpost_data", [game_id, entity_id]);
      
      const outpostId = getEntityIdFromKeys([
        BigInt(game_id),
        BigInt(entity_id),
      ]);

      let keys_amount = 2;

      const outpostUUID = uuid();
      Outpost.addOverride(outpostUUID, {
        entity: outpostId,
        value: {
          owner: tx[0 + keys_amount],
          name: tx[1 + keys_amount],
          x: Number(tx[2 + keys_amount]),
          y: Number(tx[3 + keys_amount]),
          lifes: tx[4 + keys_amount],
          status: tx[5 + keys_amount],
        },
      });

      let owned = false;

      if (bigIntToHexWithPrefix(tx[0 + keys_amount]) === userAccountAddress)
      {
        owned = true;
      }

      console.log(owned, " this is the owned value")

      const outpostDataUUID = uuid();
      ClientOutpostData.addOverride(outpostDataUUID, {
        entity: outpostId,
        value: {
          id: tx[0 + keys_amount -1],
          owned: owned,
          event_effected: false
        },
      });

      
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const fetch_revenant_data = async (game_id: number, entity_id: number) => {
    try {
      const tx: any = await call("fetch_revenant_data", [game_id, entity_id]);

      const revenantId = getEntityIdFromKeys([
        BigInt(game_id),
        BigInt(entity_id),
      ]);

      const revenantUUID = uuid();

      let keys_amount = 2;

      Revenant.addOverride(revenantUUID, {
        entity: revenantId,
        value: {
          owner: tx[0 + keys_amount],
          name: tx[1 + keys_amount],
          outpost_count: tx[2 + keys_amount],
          status: tx[3 + keys_amount],
        },
      });
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const fetch_event_data = async (game_id: number, entity_id: number) => {
    try {
      const tx: any = await call("fetch_event_data", [game_id, entity_id]);
      console.log(tx);

      const eventId = getEntityIdFromKeys([BigInt(game_id), BigInt(entity_id)]);

      const eventUUID = uuid();

      let keys_amount = 1;

      WorldEvent.addOverride(eventUUID, {
        entity: eventId,
        value: {
          x: tx[0 + keys_amount],
          y: tx[1 + keys_amount],
          radius: tx[2 + keys_amount],
        },
      });
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  //////////////////////////////////////////////////
  //////////////////////////////////////////////////
  //////////////////////////////////////////////////

  const set_click_component = async (
    xOrigin: number,
    yOrigin: number,
    xMiddle: number,
    yMiddle: number
  ) => {
    const entityId = CAMERA_ID as EntityIndex;

    const defenceId = uuid();
    ClientClickPosition.addOverride(defenceId, {
      entity: entityId,
      value: {
        xFromMiddle: xMiddle,
        yFromMiddle: yMiddle,

        yFromOrigin: yOrigin,
        xFromOrigin: xOrigin,
      },
    });
  };

  const set_camera_position_component = async (x: number, y: number) => {
    const entityId = CAMERA_ID as EntityIndex;

    const defenceId = uuid();
    ClientCameraPosition.addOverride(defenceId, {
      entity: entityId,
      value: {
        x: x,
        y: y,
      },
    });
  };

  return {
    reinforce_outpost,
    create_game,
    create_outpost,
    destroy_outpost,
    set_world_event,
    create_revenant,

    //////////////////////////////////////////////////
    fetch_event_data,
    fetch_game_entity_counter_data,
    fetch_game_data,
    fetch_game_tracker_data,
    fetch_outpost_data,
    fetch_revenant_data,

    fetch_full_game_data,

    ///////////////////////////////////////////////////
    set_camera_position_component,
    set_click_component,
  };
}

export function getEvents(receipt: any): any[] {
  return receipt.events.filter((event: any) => {
    return (
      event.keys.length === 1 &&
      event.keys[0] === import.meta.env.VITE_EVENT_KEY
    );
  });
}

export function setComponentsFromEvents(
  components: Components,
  events: Event[]
) {
  events.forEach((event) => setComponentFromEvent(components, event.data));
}

export function setComponentFromEvent(
  components: Components,
  eventData: string[]
) {
  // retrieve the component name
  const componentName = hexToAscii(eventData[0]);

  const component = components[componentName];

  const keysNumber = parseInt(eventData[1]); //number of keys

  let index = 2 + keysNumber + 1; // this is the index to get the number of vars

  const keys = eventData.slice(2, 2 + keysNumber).map((key) => BigInt(key));

  const entityIndex = getEntityIdFromKeys(keys);

  let numberOfValues = parseInt(eventData[index++]);

  const values = eventData.slice(index, index + numberOfValues);

  const componentValues = Object.keys(component.schema).reduce(
    (acc: Schema, key, index) => {
      const value = values[index];
      acc[key] = Number(value);
      return acc;
    },
    {}
  );

  console.log("this si the main thing we care about form the settign component, this si the key: ",entityIndex, " and this is the component: ", component, " and these are the keys: ", keys);
  console.log("setting component", component, entityIndex, componentValues);

  setComponent(component, entityIndex, componentValues);
}

export function getEntityIdFromKeys(keys: bigint[]): EntityIndex {
  if (keys.length === 1) {
    return parseInt(keys[0].toString()) as EntityIndex;
  }
  // calculate the poseidon hash of the keys
  let poseidon = poseidonHashMany([BigInt(keys.length), ...keys]);
  return parseInt(poseidon.toString()) as EntityIndex;
}
