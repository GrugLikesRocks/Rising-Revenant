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
  u128: { input: any; output: any };
  u64: { input: any; output: any };
};

export type ComponentUnion =  Position | Defence | Lifes | Name | Balance | Prosperity | WorldEvent | Game | Ownership;

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







export type Position = {
  __typename?: "Position";
  entity?: Maybe<Entity>;
  x?: Maybe<Scalars["u32"]["output"]>;
  y?: Maybe<Scalars["u32"]["output"]>;
};

export type PositionConnection = {
  __typename?: "PositionConnection";
  edges?: Maybe<Array<Maybe<PositionEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type PositionEdge = {
  __typename?: "PositionEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<Position>;
};






export type Defence = {
  __typename?: "Defence";
  entity?: Maybe<Entity>;
  plague?: Maybe<Scalars["u32"]["output"]>;
};

export type DefenceConnection = {
  __typename?: "DefenceConnection";
  edges?: Maybe<Array<Maybe<DefenceEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type DefenceEdge = {
  __typename?: "DefenceEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<Defence>;
};






export type Lifes = {
  __typename?: "Lifes";
  entity?: Maybe<Entity>;
  count?: Maybe<Scalars["u32"]["output"]>;
};

export type LifesConnection = {
  __typename?: "LifesConnection";
  edges?: Maybe<Array<Maybe<LifesEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type LifesEdge = {
  __typename?: "LifesEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<Lifes>;
};




export type Name = {
  __typename?: "Name";
  entity?: Maybe<Entity>;
  value?: Maybe<Scalars["felt252"]["output"]>;
};

export type NameConnection = {
  __typename?: "NameConnection";
  edges?: Maybe<Array<Maybe<NameEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type NameEdge = {
  __typename?: "NameEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<Name>;
};





export type Balance = {
  __typename?: "Balance";
  entity?: Maybe<Entity>;
  value?: Maybe<Scalars["felt252"]["output"]>;
};

export type BalanceConnection = {
  __typename?: "NameConnection";
  edges?: Maybe<Array<Maybe<BalanceEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type BalanceEdge = {
  __typename?: "BalanceEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<Balance>;
};







export type Prosperity = {
  __typename?: "Prosperity";
  entity?: Maybe<Entity>;
  value?: Maybe<Scalars["felt252"]["output"]>;
};

export type ProsperityConnection = {
  __typename?: "ProsperityConnection";
  edges?: Maybe<Array<Maybe<ProsperityEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type ProsperityEdge = {
  __typename?: "ProsperityEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<Prosperity>;
};







export type WorldEvent = {
  __typename?: "WorldEvent";
  entity?: Maybe<Entity>;
  radius?: Maybe<Scalars["u32"]["output"]>;
  event_type?: Maybe<Scalars["u32"]["output"]>;
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
  start_time?: Maybe<Scalars["u64"]["output"]>;
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






export type Ownership = {
  __typename?: "Ownership";
  entity?: Maybe<Entity>;
  address?: Maybe<Scalars["felt252"]["output"]>;
};

export type OwnershipConnection = {
  __typename?: "OwnershipConnection";
  edges?: Maybe<Array<Maybe<OwnershipEdge>>>;
  totalCount: Scalars["Int"]["output"];
};

export type OwnershipEdge = {
  __typename?: "OwnershipEdge";
  cursor: Scalars["Cursor"]["output"];
  node?: Maybe<Ownership>;
};







export type Query = {
  __typename?: "Query";
  entities?: Maybe<EntityConnection>;
  entity: Entity;
  event: Event;
  events?: Maybe<EventConnection>;

  lifesComponents?: Maybe<LifesConnection>;
  positionComponents?: Maybe<PositionConnection>;
  defenceComponents?: Maybe<DefenceConnection>;
  gamecomponents?: Maybe<GameConnection>; 
  nameComponents?: Maybe<NameConnection>;
  balanceComponents?: Maybe<BalanceConnection>;
  prosperityComponents?: Maybe<ProsperityConnection>;
  worldEventComponents?: Maybe<WorldEventConnection>;
  ownershipComponents?: Maybe<OwnershipConnection>;

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

export type QueryLifesComponentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryDefenceComponentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryPositionComponentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};


export type QueryNameComponentsArgs = {
  after?: InputMaybe<Scalars["Cursor"]["input"]>;
  before?: InputMaybe<Scalars["Cursor"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  last?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryBalanceComponentsArgs = {
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
          | { __typename: "Lifes"; count?: any | null }
          | { __typename: "Position"; x?: any | null; y?: any | null }
          | { __typename: "Defence"; plague?: any | null }
          | { __typename: "Name"; value?: any | null }
          | { __typename: "Balance"; value?: any | null }
          | { __typename: "Prosperity"; value?: any | null }
          | { __typename: "WorldEvent"; radius?: any | null; event_type?: any | null; block_number?: any | null }
          | { __typename: "Game"; start_time?: any | null; prize?: any | null; status?: any | null }
          | { __typename: "Ownership"; address?: any | null}
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
            ... on Lifes {
              count
            }
            ... on Position {
              x
              y
            }
            ... on Defence {
              plague
            }
            ... on Name {
              value
            }
            ... on Balance {
              value
            }
            ... on Prosperity {
              value
            }
            ... on WorldEvent {
              radius
              event_type
              block_number
            }
            ... on Game {
              start_time
              prize
              status
            }
            ... on Prosperity {
              address
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
