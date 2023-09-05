import { SetupNetworkResult } from "./setupNetwork";
import {
  Account,
  InvokeTransactionReceiptResponse,
  shortString,
} from "starknet";
import { EntityIndex, getComponentValue, setComponent } from "@latticexyz/recs";
import { uuid } from "@latticexyz/utils";
import { fromFixed } from "../utils";
import { ClientComponents } from "./createClientComponents";
import { updatePositionWithDirection } from "../utils";
import { GAME_ID, OUTPOST_ID, POSITION_OFFSET } from "../phaser/constants";
import { DefenceEdge } from "../generated/graphql";
import { poseidonHashMany } from "micro-starknet";

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
  }: ClientComponents
) {

  const defence_spawn = async (signer: Account) => {
    const entityId = OUTPOST_ID as EntityIndex;

    const defenceId = uuid();
    Defence.addOverride(defenceId, {
      entity: entityId,
      value: { plague: 100 },
    });

    try {
      const tx = await execute(signer, "defence_spawn", [OUTPOST_ID, GAME_ID]);

      console.log(tx);
      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      console.log("this is for the def", receipt);

      const events = parseEvent(receipt);
      const entity = parseInt(events[0].entity.toString()) as EntityIndex;

      const defenceEvent = events[0] as Defence;
      setComponent(contractComponents.Defence, entity, {
        plague: defenceEvent.plague,
      });
    } catch (e) {
      console.log(e);
      Defence.removeOverride(defenceId);
    } finally {
      Defence.removeOverride(defenceId);
    }
  };

  //   const position_spawn = async (signer: Account) => {
  //     const entityId = OUTPOST_ID as EntityIndex;

  //     const positionId = uuid();
  //     Position.addOverride(positionId, {
  //       entity: entityId,
  //       value: { x: 10, y: 10 },

  //     });

  //     try {
  //       const tx = await execute(signer, "position_spawn", [OUTPOST_ID, GAME_ID]);

  //       console.log(tx);
  //       const receipt = await signer.waitForTransaction(tx.transaction_hash, {
  //         retryInterval: 100,
  //       });

  //       const events = parseEvent(receipt);
  //       const entity = parseInt(events[0].entity.toString()) as EntityIndex;

  //       const positionEvent = events[0] as Position;
  //       setComponent(contractComponents.Position, entity, {
  //         x: positionEvent.x, y : positionEvent.y
  //       });
  //     } catch (e) {
  //       console.log(e);
  //       Position.removeOverride(positionId);
  //     } finally {
  //         Position.removeOverride(positionId);
  //     }
  //   };

  //   const name_spawn = async (signer: Account) => {
  //     const entityId = OUTPOST_ID as EntityIndex;

  //     const nameId = uuid();
  //     Name.addOverride(nameId, {
  //       entity: entityId,
  //       value: { value: "dd" },
  //     });

  //     try {
  //       const tx = await execute(signer, "name_spawn", [OUTPOST_ID, GAME_ID]);

  //       console.log(tx);
  //       const receipt = await signer.waitForTransaction(tx.transaction_hash, {
  //         retryInterval: 100,
  //       });

  //       const events = parseEvent(receipt);
  //       const entity = parseInt(events[0].entity.toString()) as EntityIndex;

  //       const nameEvent = events[0] as Name;
  //       setComponent(contractComponents.Name, entity, {
  //         value: nameEvent.value,
  //       });
  //     } catch (e) {
  //       console.log(e);
  //       Name.removeOverride(nameId);
  //     } finally {
  //       Name.removeOverride(nameId);
  //     }
  //   };

  const lifes_spawn = async (signer: Account) => {
    const entityId = OUTPOST_ID as EntityIndex;

    const lifesId = uuid();
    Lifes.addOverride(lifesId, {
      entity: entityId,
      value: { count: 1 },
    });

    try {
      const tx = await execute(signer, "lifes_spawn", [OUTPOST_ID, GAME_ID]);

      console.log(tx);
      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      console.log("this is for the life", receipt);

      const events = parseEvent(receipt);
      const entity = parseInt(events[0].entity.toString()) as EntityIndex;

      const lifesEvent = events[0] as Lifes;
      setComponent(contractComponents.Lifes, entity, {
        count: lifesEvent.count,
      });
    } catch (e) {
      console.log(e);
      Lifes.removeOverride(lifesId);
    } finally {
      Lifes.removeOverride(lifesId);
    }
  };

  const prosperity_spawn = async (signer: Account) => {
    const entityId = OUTPOST_ID as EntityIndex;

    const prosperityId = uuid();
    Prosperity.addOverride(prosperityId, {
      entity: entityId,
      value: { value: 4 },
    });

    try {
      const tx = await execute(signer, "prosperity_spawn", [
        OUTPOST_ID,
        GAME_ID,
      ]);

      console.log(tx);
      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      const events = parseEvent(receipt);
      const entity = parseInt(events[0].entity.toString()) as EntityIndex;

      const prosperityEvent = events[0] as Prosperity;
      setComponent(contractComponents.Prosperity, entity, {
        value: prosperityEvent.value,
      });
    } catch (e) {
      console.log(e);
      Prosperity.removeOverride(prosperityId);
    } finally {
      Prosperity.removeOverride(prosperityId);
    }
  };

  const life_def_increment = async (signer: Account) => {
    const entityId = OUTPOST_ID as EntityIndex;

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
      const tx = await execute(signer, "life_def_increment", [
        OUTPOST_ID,
        GAME_ID,
      ]);

      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      const events = parseEvent(receipt);
      const entity = parseInt(events[0].entity.toString()) as EntityIndex;

      console.log(events);

      const defenceEvent = events[0] as Defence;
      setComponent(contractComponents.Defence, entity, {
        plague: defenceEvent.plague,
      });

      const lifeEvent = events[1] as Lifes;
      setComponent(contractComponents.Lifes, entity, {
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

  const create_outpost = async (signer: Account, game_id: number) => {
    const entityId = OUTPOST_ID as EntityIndex;

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

      console.log(tx);
      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      // console.log(fromFixed(tx[0]))
      console.log(tx[0])

      console.log("this is for the outpost", receipt);

      const events = parseEvent(receipt);
      const entity = parseInt(events[0].entity.toString()) as EntityIndex;

      const lifesEvent = events[0] as Lifes;
      setComponent(contractComponents.Lifes, entity, {
        count: lifesEvent.count,
      });

      const defenceEvent = events[1] as Defence;
      setComponent(contractComponents.Defence, entity, {
        plague: defenceEvent.plague,
      });

      const nameEvent = events[2] as Name;
      setComponent(contractComponents.Name, entity, {
        value: nameEvent.value,
      });

      const prosperityEvent = events[3] as Prosperity;
      setComponent(contractComponents.Prosperity, entity, {
        value: prosperityEvent.value,
      });

      const positionEvent = events[4] as Position;
      setComponent(contractComponents.Position, entity, {
        x: positionEvent.x,
        y: positionEvent.y,
      });

      const ownershipEvent = events[5] as Ownership;
      setComponent(contractComponents.Ownership, entity, {
        address: ownershipEvent.address,
      });
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

  const create_game = async (signer: Account) => {
    const GameId = GAME_ID as EntityIndex;

    const gameId = uuid();
    Game.addOverride(gameId, {
      entity: GameId,
      value: { start_time: 999, prize: 100, status: true },
    });

    const entityId = 999999999999999 as EntityIndex;

    const gameTrackerId = uuid();
    GameTracker.addOverride(gameTrackerId, {
      entity: entityId,
      value: { },
    });

    try {
      const tx = await execute(signer, "create_game", []);

      console.log(tx);
      const receipt = await signer.waitForTransaction(tx.transaction_hash, {
        retryInterval: 100,
      });

      console.log("this is for the game", receipt);

      const events = parseEvent(receipt);
      const entity = parseInt(events[0].entity.toString()) as EntityIndex;

        const gameEvent = events[0] as Game;
        setComponent(contractComponents.Game, entity, {
            start_time: gameEvent.start_time,
            prize: gameEvent.prize,
            status: gameEvent.status,
        });

        const gameTrackerEvent = events[1] as GameTracker;
        setComponent(contractComponents.GameTracker, entity, {
            count: gameTrackerEvent.count,
        });

    } catch (e) {
      console.log(e);
      Game.removeOverride(gameId);
      GameTracker.removeOverride(gameTrackerId);
    } finally {
      Game.removeOverride(gameId);
      GameTracker.removeOverride(gameTrackerId);
    }
  };

  return {
    defence_spawn,
    life_def_increment,
    lifes_spawn,
    create_game,
    // prosperity_spawn,
    // name_spawn,
    // position_spawn,

    create_outpost,
  };
}

// TODO: Move types and generalise this

export enum Direction {
  Left = 0,
  Right = 1,
  Up = 2,
  Down = 3,
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
          x: Number(raw.data[5]) - POSITION_OFFSET,
          y: Number(raw.data[6]) - POSITION_OFFSET,
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
