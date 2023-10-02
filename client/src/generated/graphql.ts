import { GraphQLClient } from "graphql-request";
import { GraphQLClientRequestHeaders } from "graphql-request/build/cjs/types";
import { print } from "graphql";
import gql from "graphql-tag";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Cursor: { input: any; output: any };
  DateTime: { input: any; output: any };
  felt252: { input: any; output: any };
  u8: { input: any; output: any };
  u32: { input: any; output: any };
  u64: { input: any; output: any };
  u128: { input: any; output: any };
};

export type ComponentUnion = GameTracker| Outpost| Revenant | WorldEvent | Game  | GameEntityCounter;

export type Entity = {
  __typename?: "Entity";
  componentNames?: Maybe<Scalars["String"]["output"]>;
  components?: Maybe<Array<Maybe<ComponentUnion>>>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  keys?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["DateTime"]["output"]>;
};

export type EntityConnection = {
  __typename?: "EntityConnection";
  edges?: Maybe<Array<Maybe<EntityEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type EntityEdge = {
  __typename?: "EntityEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<Entity>;
};

export type Event = {
  __typename?: "Event";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  data?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  keys?: Maybe<Scalars["String"]["output"]>;
  systemCall: SystemCall;
  systemCallId?: Maybe<Scalars["Int"]["output"]>;
};

export type EventConnection = {
  __typename?: "EventConnection";
  edges?: Maybe<Array<Maybe<EventEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type EventEdge = {
  __typename?: "EventEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<Event>;
};









export type WorldEvent = {
  __typename?: "WorldEvent";
  entity?: Maybe<Entity>;
  x?: Maybe<Scalars["u32"]["output"]>;
  y?: Maybe<Scalars["u32"]["output"]>;
  radius?: Maybe<Scalars["u64"]["output"]>;
  destroy_count?: Maybe<Scalars["u32"]["output"]>;
  block_number?: Maybe<Scalars["u64"]["output"]>;
};

export type WorldEventConnection = {
  __typename?: "WorldEventConnection";
  edges?: Maybe<Array<Maybe<WorldEventEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type WorldEventEdge = {
  __typename?: "WorldEventEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<WorldEvent>;
};




export type Game = {
  __typename?: "Game";
  entity?: Maybe<Entity>;
  block_number?: Maybe<Scalars["u64"]["output"]>;
  prize?: Maybe<Scalars["u32"]["output"]>;
  status?: Maybe<Scalars["Boolean"]["output"]>;
};

export type GameConnection = {
  __typename?: "GameConnection";
  edges?: Maybe<Array<Maybe<GameEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type GameEdge = {
  __typename?: "GameEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<Game>;
};




export type GameTracker = {
  __typename?: "GameTracker";
  entity?: Maybe<Entity>;
  count?: Maybe<Scalars["u32"]["output"]>;
};

export type GameTrackerConnection = {
  __typename?: "GameTrackerConnection";
  edges?: Maybe<Array<Maybe<GameTrackerEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type GameTrackerEdge = {
  __typename?: "GameTrackerEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<GameTracker>;
};





export type GameEntityCounter = {
  __typename?: "GameEntityCounter";
  entity?: Maybe<Entity>;
  revenant_count?: Maybe<Scalars["u32"]["output"]>;
  outpost_count?: Maybe<Scalars["u32"]["output"]>;
  event_count?: Maybe<Scalars["u32"]["output"]>;
};

export type GameEntityCounterConnection = {
  __typename?: "GameEntityCounterConnection";
  edges?: Maybe<Array<Maybe<GameEntityCounterEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type GameEntityCounterEdge = {
  __typename?: "GameEntityCounterEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<GameEntityCounter>;
};




export type Outpost = {
  __typename?: "Outpost";
  entity?: Maybe<Entity>;
  entity_id?: Maybe<Scalars["u128"]["output"]>;
  owner? : Maybe<Scalars["felt252"]["output"]>;
  name?: Maybe<Scalars["felt252"]["output"]>;
  x?: Maybe<Scalars["u32"]["output"]>;
  y?: Maybe<Scalars["u32"]["output"]>;
  lifes?: Maybe<Scalars["u32"]["output"]>;
  status?: Maybe<Scalars["u32"]["output"]>;
  last_affect_event_id?: Maybe<Scalars["u128"]["output"]>;
}

export type OutpostConnection = {
  __typename?: "OutpostConnection";
  edges?: Maybe<Array<Maybe<OutpostEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type OutpostEdge = {
  __typename?: "OutpostEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<Outpost>;
};



export type Revenant = {
  __typename?: "Revenant";
  entity?: Maybe<Entity>;
  owner? : Maybe<Scalars["felt252"]["output"]>;
  name?: Maybe<Scalars["felt252"]["output"]>;
  outpost_count? : Maybe<Scalars["u32"]["output"]>;
  status?: Maybe<Scalars["u32"]["output"]>;
}

export type RevenantConnection = {
  __typename?: "RevenantConnection";
  edges?: Maybe<Array<Maybe<RevenantEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type RevenantEdge = {
  __typename?: "RevenantEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<Revenant>;
};



export type Reinforcement = {
  __typename?: "Reinforcement";
  entity?: Maybe<Entity>;
  balance?: Maybe<Scalars["u32"]["output"]>;
}

export type ReinforcementConnection = {
  __typename?: "ReinforcementConnection";
  edges?: Maybe<Array<Maybe<ReinforcementEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type ReinforcementEdge = {
  __typename?: "ReinforcementEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<Reinforcement>;
};



export type Query = {
  __typename?: "Query";
  entities?: Maybe<EntityConnection>;
  entity: Entity;
  event: Event;
  events?: Maybe<EventConnection>;
  gamecomponents?: Maybe<GameConnection>; 

  gameEntityCounterComponents?: Maybe<GameEntityCounterConnection>;
  gameTrackerComponents?: Maybe<GameTrackerConnection>;
  gameComponents?: Maybe<GameConnection>;

  outpostComponents?: Maybe<OutpostConnection>;
  revenantComponents?: Maybe<RevenantConnection>;
  reinforcementComponents?: Maybe<ReinforcementConnection>;

  worldEventComponents?: Maybe<WorldEventConnection>;

  system: System;
  systemCall: SystemCall;
  systemCalls?: Maybe<SystemCallConnection>;
  systems?: Maybe<SystemConnection>;
};



export type QueryEntitiesArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  keys: Array<Scalars["String"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryEntityArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryEventArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryReinforcementComponentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryGameComponentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryWorldEventComponentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryGameEntityCounterComponentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryGameTrackerComponentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryOutpostComponentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryRevenantComponentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};



export type QuerySystemArgs = {
  id: Scalars["ID"]["input"];
};

export type QuerySystemCallArgs = {
  id: Scalars["Int"]["input"];
};

export type System = {
  __typename?: "System";
  classHash?: Maybe<Scalars["felt252"]["output"]>;
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  systemCalls: Array<SystemCall>;
  transactionHash?: Maybe<Scalars["felt252"]["output"]>;
};

export type SystemCall = {
  __typename?: "SystemCall";
  createdAt?: Maybe<Scalars["DateTime"]["output"]>;
  data?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["ID"]["output"]>;
  system: System;
  systemId?: Maybe<Scalars["ID"]["output"]>;
  transactionHash?: Maybe<Scalars["String"]["output"]>;
};

export type SystemCallConnection = {
  __typename?: "SystemCallConnection";
  edges?: Maybe<Array<Maybe<SystemCallEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type SystemCallEdge = {
  __typename?: "SystemCallEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<SystemCall>;
};

export type SystemConnection = {
  __typename?: "SystemConnection";
  edges?: Maybe<Array<Maybe<SystemEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type SystemEdge = {
  __typename?: "SystemEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<System>;
};

export type GetEntitiesQueryVariables = Exact<{ [key: string]: never }>;

export type GetEntitiesQuery = {
  __typename?: "Query";
  entities?: {
    __typename?: "EntityConnection";
    edges?: Array<{
      __typename?: "EntityEdge";
      node?: {
        __typename?: "Entity";
        keys?: string | null;
        components?: Array<

          | { __typename: "Revenant"; owner?: any | null; name?: any | null; outpost_count?: any | null; status?: any | null }
          | { __typename: "Outpost"; owner?: any | null; name?: any | null; x?: any | null; y?: any | null; lifes?: any | null; status?: any | null; last_affect_event_id?: any | null}
          | { __typename: "Reinforcement"; balance?: any | null}

          | { __typename: "WorldEvent"; x?: any | null; y?: any | null; radius?: any | null; destroy_count?: any | null; block_number?: any | null }

          | { __typename: "GameTracker"; count?: any | null}
          | { __typename: "Game";  block_number?: any | null;   prize?: any | null; status?: any | null }
          | { __typename: "GameEntityCounter"; revenant_count?: any | null; outpost_count?: any | null; event_count?: any | null}

          | null
        > | null;
      } | null;
    } | null> | null;
  } | null;
};

export const GetEntitiesDocument = gql`
  query getEntities {
    entities(keys: ["%"]) {
      edges {
        node {
          keys
          components {
            __typename
            ... on Revenant {
              owner
              name
              outpost_count
              status
            }
            ... on Outpost {
              owner
              name
              x
              y
              lifes
              status
              last_affect_event_id
            }
            ... on WorldEvent {
              x
              y
              radius
              destroy_count
              block_number
            }
            ... on GameTracker {
              count
            }
            ... on Game {
              block_number
              prize
              status
            }
            ... on GameEntityCounter {
              revenant_count
              outpost_count
              event_count
            }
            ... on Reinforcement {
              balance
            }
          }
        }
      }
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType
) => action();
const GetEntitiesDocumentString = print(GetEntitiesDocument);
export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    getEntities(
      variables?: GetEntitiesQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<{
      data: GetEntitiesQuery;
      extensions?: any;
      headers: Dom.Headers;
      status: number;
    }> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.rawRequest<GetEntitiesQuery>(
            GetEntitiesDocumentString,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getEntities",
        "query"
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
