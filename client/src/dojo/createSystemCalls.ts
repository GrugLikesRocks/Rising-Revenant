import { SetupNetworkResult } from "./setupNetwork";
import {
  Account,
  InvokeTransactionReceiptResponse,
  shortString,
} from "starknet";
import {
  EntityIndex,
  getComponentValue,
  setComponent, Components, Schema
} from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { ClientComponents } from "./createClientComponents";
import { CAMERA_ID, GAME_ID, MAP_HEIGHT, MAP_WIDTH} from "../phaser/constants";
import { poseidonHashMany } from "micro-starknet";


// IMPLEMENT THE BEER BARRON FUNCTION

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  { execute, contractComponents }: SetupNetworkResult,
  {
    Position,
    Defence,
    Lifes,
    Prosperity,
    Name,
    Game,
    WorldEvent,
    Balance,
    Ownership,
    GameTracker,
    GameEntityCounter,

    ClientCameraPosition,
    ClientClickPosition
  }: ClientComponents
) {


  const reinforce_outpost = async (signer: Account, entity_id: number) => {

    const entityId = getEntityIdFromKeys([BigInt(entity_id), BigInt(signer.address),BigInt(GAME_ID)]);

    const defenceId = uuid();
    Defence.addOverride(defenceId, {
      entity: entityId,
      value: {
        plague: (getComponentValue(Defence, entityId)?.plague || 0) + 1,
      },
    });

    const lifeId = uuid();
    Lifes.addOverride(lifeId, {
      entity: entityId,
      value: {
        count: (getComponentValue(Lifes, entityId)?.count || 0) + 1,
      },
    });

    try {
      const tx = await execute(signer, "reinforce_outpost", [
        entity_id,
        GAME_ID,
      ]);

      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      const events = parseEvent(receipt);

      const defenceEvent = events[1] as Defence;
      setComponent(contractComponents.Defence, entityId, {
        plague: defenceEvent.plague,
      });

      console.log("this is the defence event", defenceEvent.plague);

      const lifeEvent = events[0] as Lifes;
      setComponent(contractComponents.Lifes, entityId, {
        count: lifeEvent.count,
      });

    } catch (e) {
      console.log(e);
      Defence.removeOverride(defenceId);
      Lifes.removeOverride(lifeId);
    } finally {
      Defence.removeOverride(defenceId);
      Lifes.removeOverride(lifeId);
    }
  };

  // THIS IS TO REDO
  const destroy_outpost = async (signer: Account, entity_id: number) => {

    const entityId = getEntityIdFromKeys([BigInt(entity_id), BigInt(signer.address),BigInt(GAME_ID)]);

    // console.log("this is the entity id for the life increment", entityId);

    const defenceId = uuid();
    Defence.addOverride(defenceId, {
      entity: entityId,
      value: {
        plague: (getComponentValue(Defence, entityId)?.plague || 0) - 1,
      },
    });

    const lifeId = uuid();
    Lifes.addOverride(lifeId, {
      entity: entityId,
      value: {
        count: (getComponentValue(Lifes, entityId)?.count || 0) - 1,
      },
    });

    try {
      const tx = await execute(signer, "reinforce_outpost", [
        entity_id,
        GAME_ID,
      ]);

      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      // setComponentsFromEvents(contractComponents, getEvents(receipt));

      const events = parseEvent(receipt);
      // const entity = parseInt(events[0].entity.toString()) as EntityIndex;
      console.log("this si the entity", entityId);
      console.log("events for the reinforcing of an outpost" , events);
      console.log(receipt);
      console.log("\n\n\n");

      const defenceEvent = events[1] as Defence;
      setComponent(contractComponents.Defence, entityId, {
        plague: defenceEvent.plague,
      });

      console.log("this is the defence event", defenceEvent.plague);

      const lifeEvent = events[0] as Lifes;
      setComponent(contractComponents.Lifes, entityId, {
        count: lifeEvent.count,
      });

    } catch (e) {
      console.log(e);
      Defence.removeOverride(defenceId);
      Lifes.removeOverride(lifeId);
    } finally {
      Defence.removeOverride(defenceId);
      Lifes.removeOverride(lifeId);
    }
  };

  const create_outpost = async (
    signer: Account,
    game_id: number,
    outpost_num: number
  ) => {
    
    const entityId = getEntityIdFromKeys([BigInt(outpost_num), BigInt(signer.address),BigInt(GAME_ID)])
  
    console.log("this is the entity id for the create outpost", entityId);

    const lifesId = uuid();
    Lifes.addOverride(lifesId, {
      entity: entityId,
      value: { count: 1 },
    });

    const defenceId = uuid();
    Defence.addOverride(defenceId, {
      entity: entityId,
      value: { plague: 5 },
    });

    const nameId = uuid();
    Name.addOverride(nameId, {
      entity: entityId,
      value: {},
    });

    const prosperityId = uuid();
    Prosperity.addOverride(prosperityId, {
      entity: entityId,
      value: { value: 1 },
    });

    const positionId = uuid();
    Position.addOverride(positionId, {
      entity: entityId,
      value: { x: 1, y: 1 },
    });

    const ownershipId = uuid();
    Ownership.addOverride(ownershipId, {
      entity: entityId,
      value: {},
    });

    try {

      const tx: any = await execute(signer, "create_outpost", [game_id]);

      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      console.log(receipt);
      const events = parseEvent(receipt);
 
      const lifesEvent = events[0] as Lifes;
      setComponent(contractComponents.Lifes, entityId as EntityIndex, {
        count: lifesEvent.count,
      });

      const defenceEvent = events[1] as Defence;
      setComponent(contractComponents.Defence, entityId as EntityIndex, {
        plague: defenceEvent.plague,
      });

      const nameEvent = events[2] as Name;
      setComponent(contractComponents.Name, entityId as EntityIndex, {
        value: nameEvent.value,
      });

      const prosperityEvent = events[3] as Prosperity;
      setComponent(contractComponents.Prosperity, entityId as EntityIndex, {
        value: prosperityEvent.value,
      });

      const positionEvent = events[4] as Position;
      setComponent(contractComponents.Position, entityId as EntityIndex, {
        x: positionEvent.x,
        y: positionEvent.y,
      });

      const ownershipEvent = events[5] as Ownership;
      setComponent(contractComponents.Ownership, entityId as EntityIndex, {
        address: ownershipEvent.address,
      });

      const gameDataEvent = events[6] as GameEntityCounter;
      setComponent(contractComponents.GameEntityCounter, GAME_ID as EntityIndex, {
        outpost_count: gameDataEvent.outpost_count,
        event_count: gameDataEvent.event_count,
      });


      // check for the entity id here



    } catch (e) {
      console.log(e);
      Lifes.removeOverride(lifesId);
      Defence.removeOverride(defenceId);
      Name.removeOverride(nameId);
      Prosperity.removeOverride(prosperityId);
      Position.removeOverride(positionId);
      Ownership.removeOverride(ownershipId);
    } finally {
      Lifes.removeOverride(lifesId);
      Defence.removeOverride(defenceId);
      Name.removeOverride(nameId);
      Prosperity.removeOverride(prosperityId);
      Position.removeOverride(positionId);
      Ownership.removeOverride(ownershipId);
    }
  };

  // add the counter obj
  const create_game = async (signer: Account) => {


    const cameraId = CAMERA_ID as EntityIndex;

    const clientCamCompId = uuid();
    ClientCameraPosition.addOverride(clientCamCompId, {
      entity: cameraId,
      value: { x:MAP_WIDTH/2,y:MAP_HEIGHT/2 },
    });

    const clickCompId = uuid();
    ClientClickPosition.addOverride(clickCompId, {
      entity: cameraId,
      value: { 
        xFromMiddle: 0, 
        yFromMiddle: 0,
        
        yFromOrigin: 0, 
        xFromOrigin: 0 
      },
    });




    const gameId = GAME_ID as EntityIndex;

    const gameCompId = uuid();
    Game.addOverride(gameCompId, {
      entity: gameId,
      value: { start_time: 999, prize: 100, status: true },
    });

    const gameEntityDataId = uuid();
    GameEntityCounter.addOverride(gameEntityDataId, {
      entity: gameId,
      value: { outpost_count: 0, event_count: 0 },
    });


    const entityId = 999999999999999 as EntityIndex;

    const gameTrackerId = uuid();
    GameTracker.addOverride(gameTrackerId, {
      entity: entityId,
      value: {},
    });

    try {
      const tx = await execute(signer, "create_game", []);

      console.log(tx);
      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      console.log("this is for the game", receipt);

      const events = parseEvent(receipt);
      // const entity = parseInt(events[0].entity.toString()) as EntityIndex;


      const gameEvent = events[0] as Game;
      setComponent(contractComponents.Game, gameId, {
        start_time: gameEvent.start_time,
        prize: gameEvent.prize,
        status: gameEvent.status,
      });

      const gameDataEvent = events[1] as GameEntityCounter;
      setComponent(contractComponents.GameEntityCounter, gameId, {
        outpost_count: gameDataEvent.outpost_count,
        event_count: gameDataEvent.event_count,
      });

      const gameTrackerEvent = events[2] as GameTracker;
      setComponent(contractComponents.GameTracker, entityId, {
        count: gameTrackerEvent.count,
      });

    } catch (e) {
      console.log(e);
      Game.removeOverride(gameCompId);
      GameTracker.removeOverride(gameTrackerId);
      ClientClickPosition.removeOverride(clickCompId);
      ClientCameraPosition.removeOverride(clientCamCompId);
      GameEntityCounter.removeOverride(gameEntityDataId);
    } finally {
      Game.removeOverride(gameCompId);
      ClientClickPosition.removeOverride(clickCompId);
      ClientCameraPosition.removeOverride(clientCamCompId);
      GameTracker.removeOverride(gameTrackerId);
      GameEntityCounter.removeOverride(gameEntityDataId);
    }
  };

  // the world event should also have an id
  const set_world_event = async (signer: Account) => {
    
    const entityId = getEntityIdFromKeys([BigInt(GAME_ID), BigInt(signer.address), BigInt(50)])
    
    const worldEventId = uuid(); 
    WorldEvent.addOverride(worldEventId, {
      entity: entityId,
      value: {},
    });

    const positionId = uuid();
    Position.addOverride(positionId, {
      entity: entityId,
      value: {},
    });

    try {
      const tx = await execute(signer, "set_world_event", [GAME_ID]);

      console.log(tx);
      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      console.log(receipt);
      const events = parseEvent(receipt);

      const gameEvent = events[0] as WorldEvent;
      setComponent(contractComponents.WorldEvent, entityId, {
        radius: gameEvent.radius,
        event_type: gameEvent.event_type,
        block_number: gameEvent.block_number,
      });

      const positionEvent = events[1] as Position;
      setComponent(contractComponents.Position, entityId, {
        x: positionEvent.x,
        y: positionEvent.y,
      });

    } catch (e) {
      console.log(e);
      WorldEvent.removeOverride(worldEventId);
      Position.removeOverride(positionId);
    } finally {
      WorldEvent.removeOverride(worldEventId);
      Position.removeOverride(positionId);
    }
  };















  const set_click_component = async (xOrigin: number, yOrigin: number, xMiddle: number, yMiddle:number) => 
  {
    const entityId = CAMERA_ID as EntityIndex;

    const defenceId = uuid();
    ClientClickPosition.addOverride(defenceId, {
      entity: entityId,
      value: {
        xFromMiddle: xMiddle, 
        yFromMiddle: yMiddle,
        
        yFromOrigin: yOrigin, 
        xFromOrigin: xOrigin 
      },
    });
  }


  const set_camera_position_component = async (x: number, y: number) => 
  {
    const entityId = CAMERA_ID as EntityIndex;

    const defenceId = uuid();
    ClientCameraPosition.addOverride(defenceId, {
      entity: entityId,
      value: {
        x: x, y: y, 
      },
    });
  }

  return {
    reinforce_outpost,
    create_game,
    create_outpost,
    destroy_outpost,
    set_world_event,

    set_camera_position_component,
    set_click_component
  };
}

export enum ComponentEvents {
  Position = "Position",
  Defence = "Defence",
  Lifes = "Lifes",
  Name = "Name",
  Balance = "Balance",
  Prosperity = "Prosperity",
  WorldEvent = "WorldEvent",
  Game = "Game",
  Ownership = "Ownership",
  GameTracker = "GameTracker",
  GameEntityCounter = "GameEntityCounter",
}

export interface BaseEvent {
  type: ComponentEvents;
  entity: string;
}

export interface Position extends BaseEvent {
  x: number;
  y: number;
}

export interface Defence extends BaseEvent {
  plague: number;
}

export interface Lifes extends BaseEvent {
  count: number;
}

export interface Name extends BaseEvent {
  value: string;
}

export interface Balance extends BaseEvent {
  value: number;
}

export interface Prosperity extends BaseEvent {
  value: number;
}

export interface WorldEvent extends BaseEvent {
  radius: number;
  event_type: number;
  block_number: number;
}

export interface Game extends BaseEvent {
  start_time: number;
  prize: number;
  status: boolean;
}

export interface Ownership extends BaseEvent {
  address: string;
}

export interface GameTracker extends BaseEvent {
  count: number;
}

export interface GameEntityCounter extends BaseEvent {
  outpost_count: number;
  event_count: number;
}


export const parseEvent = (
  receipt: InvokeTransactionReceiptResponse
): Array<
  | Position
  | Defence
  | Lifes
  | Name
  | Balance
  | Prosperity
  | WorldEvent
  | Game
  | Ownership
  | GameTracker
  | GameEntityCounter
> => {
  if (!receipt.events) {
    throw new Error(`No events found`);
  }

  let events: Array<
    | Position
    | Defence
    | Lifes
    | Name
    | Balance
    | Prosperity
    | WorldEvent
    | Game
    | Ownership
    | GameTracker
    | GameEntityCounter
    
  > = [];

  for (let raw of receipt.events) {
    const decodedEventType = shortString.decodeShortString(raw.data[0]);

    switch (decodedEventType) {
      case ComponentEvents.Position:
        if (raw.data.length < 7) {
          throw new Error("Insufficient data for Position event.");
        }

        const positionData: Position = {
          type: ComponentEvents.Position,
          entity: raw.data[2],
          x: Number(raw.data[6]),
          y: Number(raw.data[7]),
        };

        events.push(positionData);
        break;

      case ComponentEvents.Defence:
        if (raw.data.length < 6) {
          throw new Error("Insufficient data for Defence event.");
        }

        const defenceData: Defence = {
          type: ComponentEvents.Defence,
          entity: raw.data[2],
          plague: Number(raw.data[6]),
        };

        events.push(defenceData);
        break;

      case ComponentEvents.Lifes:
        if (raw.data.length < 6) {
          throw new Error("Insufficient data for Defence event.");
        }

        const lifeData: Lifes = {
          type: ComponentEvents.Lifes,
          entity: raw.data[2],
          count: Number(raw.data[6]),
        };

        events.push(lifeData);
        break;

      case ComponentEvents.Name:
        if (raw.data.length < 6) {
          throw new Error("Insufficient data for Defence event.");
        }

        const nameData: Name = {
          type: ComponentEvents.Name,
          entity: raw.data[2],
          value: String(raw.data[6]),
        };

        events.push(nameData);
        break;

      case ComponentEvents.Prosperity:
        if (raw.data.length < 6) {
          throw new Error("Insufficient data for Defence event.");
        }

        const prosperityData: Prosperity = {
          type: ComponentEvents.Prosperity,
          entity: raw.data[2],
          value: Number(raw.data[6]),
        };

        events.push(prosperityData);
        break;

      case ComponentEvents.Balance:
        if (raw.data.length < 6) {
          throw new Error("Insufficient data for Defence event.");
        }

        const balanceData: Balance = {
          type: ComponentEvents.Balance,
          entity: raw.data[2],
          value: Number(raw.data[6]),
        };

        events.push(balanceData);
        break;

      case ComponentEvents.WorldEvent:
        if (raw.data.length < 6) {
          throw new Error("Insufficient data for Defence event.");
        }

        const worldEventData: WorldEvent = {
          type: ComponentEvents.WorldEvent,
          entity: raw.data[2],
          radius: Number(raw.data[6]),
          event_type: Number(raw.data[7]),
          block_number: Number(raw.data[8]),
        };

        events.push(worldEventData);
        break;

      case ComponentEvents.Game:
        if (raw.data.length < 6) {
          throw new Error("Insufficient data for Defence event.");
        }

        const gameData: Game = {
          type: ComponentEvents.Game,
          entity: raw.data[2],
          start_time: Number(raw.data[6]),
          prize: Number(raw.data[7]),
          status: Boolean(raw.data[8]),
        };

        events.push(gameData);
        break;

      case ComponentEvents.Ownership:
        if (raw.data.length < 6) {
          throw new Error("Insufficient data for Defence event.");
        }

        const ownershipData: Ownership = {
          type: ComponentEvents.Ownership,
          entity: raw.data[2],
          address: String(raw.data[6]),
        };

        events.push(ownershipData);
        break;

      case ComponentEvents.GameTracker:
        if (raw.data.length < 6) {
          throw new Error("Insufficient data for Defence event.");
        }
        const gameTrackerData: GameTracker = {
          type: ComponentEvents.GameTracker,
          entity: raw.data[2],
          count: Number(raw.data[6]),
        };

        events.push(gameTrackerData);
        break;

      case ComponentEvents.GameEntityCounter:
        if (raw.data.length < 7) {
          throw new Error("Insufficient data for GameEntityCounter event.");
        }
        const gameDataData: GameEntityCounter = {
          type: ComponentEvents.GameEntityCounter,
          entity: raw.data[2],
          outpost_count: Number(raw.data[5]),
          event_count: Number(raw.data[6]),
        };

        events.push(gameDataData);
        break;


      default:
        throw new Error("Unsupported event type.");
    }
  }

  return events;
};



export function getEntityIdFromKeys(keys: bigint[]): EntityIndex {
  if (keys.length === 1) {
    return parseInt(keys[0].toString()) as EntityIndex;
  }
  // calculate the poseidon hash of the keys
  let poseidon = poseidonHashMany([BigInt(keys.length), ...keys]);
  return parseInt(poseidon.toString()) as EntityIndex;
}
