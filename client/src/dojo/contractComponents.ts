/* Autogenerated file. Do not edit manually. */
// could this be the issue?

import { defineComponent, Type as RecsType, World } from "@latticexyz/recs";

export function defineContractComponents(world: World) {
  return {
    Outpost: (() => {
      const name = "Outpost";
      return defineComponent(
        world,
        {
          owner: RecsType.String, // not too sure about this
          name: RecsType.Number,
          x: RecsType.Number,
          y: RecsType.Number,
          lifes: RecsType.Number,
          status: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),

    Revenant: (() => {
      const name = "Revenant";
      return defineComponent(
        world,
        {
          owner: RecsType.Number,
          name: RecsType.Number,
          outpost_count: RecsType.Number,
          status: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),

    WorldEvent: (() => {
      const name = "WorldEvent";
      return defineComponent(
        world,
        {
          x: RecsType.Number,
          y: RecsType.Number,
          radius: RecsType.Number,
          destroy_count: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),

    Game: (() => {
      const name = "Game";
      return defineComponent(
        world,
        {
          start_time: RecsType.Number,
          prize: RecsType.Number,
          status: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),

    GameTracker: (() => {
      const name = "GameTracker";
      return defineComponent(
        world,
        {
          count: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),

    GameEntityCounter: (() => {
      const name = "GameEntityCounter";
      return defineComponent(
        world,
        {
          revenant_count: RecsType.Number,
          outpost_count: RecsType.Number,
          event_count: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),

    // this is to change
    ClientCameraPosition: (() => {
      const name = "ClientCameraPosition";
      return defineComponent(
        world,
        {
          x: RecsType.Number,
          y: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),

    ClientClickPosition: (() => {
      const name = "ClientClickPosition";
      return defineComponent(
        world,
        {
          xFromOrigin: RecsType.Number,
          yFromOrigin: RecsType.Number,

          xFromMiddle: RecsType.Number,
          yFromMiddle: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),

    ClientOutpostData: (() => {
      const name = "ClientOutpostData";
      return defineComponent(
        world,
        {
          id : RecsType.Number,
          owned: RecsType.Boolean,
          event_effected: RecsType.Boolean,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),

    AuthStatus: (() => {
      const name = "AuthStatus";
      return defineComponent(
        world,
        {
          is_authorized: RecsType.Boolean,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),

    AuthRole: (() => {
      const name = "AuthRole";
      return defineComponent(
        world,
        {
          id: RecsType.Number,
        },
        {
          metadata: {
            name: name,
          },
        }
      );
    })(),
  };
}
