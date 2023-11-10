import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import { print } from 'graphql'
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ContractAddress: { input: any; output: any; }
  Cursor: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  felt252: { input: any; output: any; }
  u32: { input: any; output: any; }
  u64: { input: any; output: any; }
  u128: { input: any; output: any; }
};

export type Entity = {
  __typename?: 'Entity';
  created_at?: Maybe<Scalars['DateTime']['output']>;
  event_id?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  model_names?: Maybe<Scalars['String']['output']>;
  models?: Maybe<Array<Maybe<ModelUnion>>>;
  updated_at?: Maybe<Scalars['DateTime']['output']>;
};

export type EntityConnection = {
  __typename?: 'EntityConnection';
  edges?: Maybe<Array<Maybe<EntityEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type EntityEdge = {
  __typename?: 'EntityEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Entity>;
};

export type Event = {
  __typename?: 'Event';
  created_at?: Maybe<Scalars['DateTime']['output']>;
  data?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  transaction_hash?: Maybe<Scalars['String']['output']>;
};

export type EventConnection = {
  __typename?: 'EventConnection';
  edges?: Maybe<Array<Maybe<EventEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type EventEdge = {
  __typename?: 'EventEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Event>;
};

export type Game = {
  __typename?: 'Game';
  entity?: Maybe<Entity>;
  erc_addr?: Maybe<Scalars['ContractAddress']['output']>;
  event_interval?: Maybe<Scalars['u64']['output']>;
  game_id?: Maybe<Scalars['u32']['output']>;
  preparation_phase_interval?: Maybe<Scalars['u64']['output']>;
  prize?: Maybe<Scalars['u32']['output']>;
  start_block_number?: Maybe<Scalars['u64']['output']>;
  status?: Maybe<Scalars['u32']['output']>;
};

export type GameConnection = {
  __typename?: 'GameConnection';
  edges?: Maybe<Array<Maybe<GameEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type GameEdge = {
  __typename?: 'GameEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Game>;
};

export type GameEntityCounter = {
  __typename?: 'GameEntityCounter';
  entity?: Maybe<Entity>;
  event_count?: Maybe<Scalars['u32']['output']>;
  game_id?: Maybe<Scalars['u32']['output']>;
  outpost_count?: Maybe<Scalars['u32']['output']>;
  outpost_exists_count?: Maybe<Scalars['u32']['output']>;
  revenant_count?: Maybe<Scalars['u32']['output']>;
};

export type GameEntityCounterConnection = {
  __typename?: 'GameEntityCounterConnection';
  edges?: Maybe<Array<Maybe<GameEntityCounterEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type GameEntityCounterEdge = {
  __typename?: 'GameEntityCounterEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<GameEntityCounter>;
};

export type GameEntityCounterOrder = {
  direction: OrderDirection;
  field: GameEntityCounterOrderField;
};

export enum GameEntityCounterOrderField {
  EventCount = 'EVENT_COUNT',
  GameId = 'GAME_ID',
  OutpostCount = 'OUTPOST_COUNT',
  OutpostExistsCount = 'OUTPOST_EXISTS_COUNT',
  RevenantCount = 'REVENANT_COUNT'
}

export type GameEntityCounterWhereInput = {
  event_count?: InputMaybe<Scalars['u32']['input']>;
  event_countEQ?: InputMaybe<Scalars['u32']['input']>;
  event_countGT?: InputMaybe<Scalars['u32']['input']>;
  event_countGTE?: InputMaybe<Scalars['u32']['input']>;
  event_countLT?: InputMaybe<Scalars['u32']['input']>;
  event_countLTE?: InputMaybe<Scalars['u32']['input']>;
  event_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  outpost_count?: InputMaybe<Scalars['u32']['input']>;
  outpost_countEQ?: InputMaybe<Scalars['u32']['input']>;
  outpost_countGT?: InputMaybe<Scalars['u32']['input']>;
  outpost_countGTE?: InputMaybe<Scalars['u32']['input']>;
  outpost_countLT?: InputMaybe<Scalars['u32']['input']>;
  outpost_countLTE?: InputMaybe<Scalars['u32']['input']>;
  outpost_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  outpost_exists_count?: InputMaybe<Scalars['u32']['input']>;
  outpost_exists_countEQ?: InputMaybe<Scalars['u32']['input']>;
  outpost_exists_countGT?: InputMaybe<Scalars['u32']['input']>;
  outpost_exists_countGTE?: InputMaybe<Scalars['u32']['input']>;
  outpost_exists_countLT?: InputMaybe<Scalars['u32']['input']>;
  outpost_exists_countLTE?: InputMaybe<Scalars['u32']['input']>;
  outpost_exists_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  revenant_count?: InputMaybe<Scalars['u32']['input']>;
  revenant_countEQ?: InputMaybe<Scalars['u32']['input']>;
  revenant_countGT?: InputMaybe<Scalars['u32']['input']>;
  revenant_countGTE?: InputMaybe<Scalars['u32']['input']>;
  revenant_countLT?: InputMaybe<Scalars['u32']['input']>;
  revenant_countLTE?: InputMaybe<Scalars['u32']['input']>;
  revenant_countNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export type GameOrder = {
  direction: OrderDirection;
  field: GameOrderField;
};

export enum GameOrderField {
  ErcAddr = 'ERC_ADDR',
  EventInterval = 'EVENT_INTERVAL',
  GameId = 'GAME_ID',
  PreparationPhaseInterval = 'PREPARATION_PHASE_INTERVAL',
  Prize = 'PRIZE',
  StartBlockNumber = 'START_BLOCK_NUMBER',
  Status = 'STATUS'
}

export type GameTracker = {
  __typename?: 'GameTracker';
  count?: Maybe<Scalars['u32']['output']>;
  entity?: Maybe<Entity>;
  entity_id?: Maybe<Scalars['u128']['output']>;
};

export type GameTrackerConnection = {
  __typename?: 'GameTrackerConnection';
  edges?: Maybe<Array<Maybe<GameTrackerEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type GameTrackerEdge = {
  __typename?: 'GameTrackerEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<GameTracker>;
};

export type GameTrackerOrder = {
  direction: OrderDirection;
  field: GameTrackerOrderField;
};

export enum GameTrackerOrderField {
  Count = 'COUNT',
  EntityId = 'ENTITY_ID'
}

export type GameTrackerWhereInput = {
  count?: InputMaybe<Scalars['u32']['input']>;
  countEQ?: InputMaybe<Scalars['u32']['input']>;
  countGT?: InputMaybe<Scalars['u32']['input']>;
  countGTE?: InputMaybe<Scalars['u32']['input']>;
  countLT?: InputMaybe<Scalars['u32']['input']>;
  countLTE?: InputMaybe<Scalars['u32']['input']>;
  countNEQ?: InputMaybe<Scalars['u32']['input']>;
  entity_id?: InputMaybe<Scalars['u128']['input']>;
  entity_idEQ?: InputMaybe<Scalars['u128']['input']>;
  entity_idGT?: InputMaybe<Scalars['u128']['input']>;
  entity_idGTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idLT?: InputMaybe<Scalars['u128']['input']>;
  entity_idLTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['u128']['input']>;
};

export type GameWhereInput = {
  erc_addr?: InputMaybe<Scalars['ContractAddress']['input']>;
  erc_addrEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  erc_addrGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  erc_addrGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  erc_addrLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  erc_addrLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  erc_addrNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  event_interval?: InputMaybe<Scalars['u64']['input']>;
  event_intervalEQ?: InputMaybe<Scalars['u64']['input']>;
  event_intervalGT?: InputMaybe<Scalars['u64']['input']>;
  event_intervalGTE?: InputMaybe<Scalars['u64']['input']>;
  event_intervalLT?: InputMaybe<Scalars['u64']['input']>;
  event_intervalLTE?: InputMaybe<Scalars['u64']['input']>;
  event_intervalNEQ?: InputMaybe<Scalars['u64']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  preparation_phase_interval?: InputMaybe<Scalars['u64']['input']>;
  preparation_phase_intervalEQ?: InputMaybe<Scalars['u64']['input']>;
  preparation_phase_intervalGT?: InputMaybe<Scalars['u64']['input']>;
  preparation_phase_intervalGTE?: InputMaybe<Scalars['u64']['input']>;
  preparation_phase_intervalLT?: InputMaybe<Scalars['u64']['input']>;
  preparation_phase_intervalLTE?: InputMaybe<Scalars['u64']['input']>;
  preparation_phase_intervalNEQ?: InputMaybe<Scalars['u64']['input']>;
  prize?: InputMaybe<Scalars['u32']['input']>;
  prizeEQ?: InputMaybe<Scalars['u32']['input']>;
  prizeGT?: InputMaybe<Scalars['u32']['input']>;
  prizeGTE?: InputMaybe<Scalars['u32']['input']>;
  prizeLT?: InputMaybe<Scalars['u32']['input']>;
  prizeLTE?: InputMaybe<Scalars['u32']['input']>;
  prizeNEQ?: InputMaybe<Scalars['u32']['input']>;
  start_block_number?: InputMaybe<Scalars['u64']['input']>;
  start_block_numberEQ?: InputMaybe<Scalars['u64']['input']>;
  start_block_numberGT?: InputMaybe<Scalars['u64']['input']>;
  start_block_numberGTE?: InputMaybe<Scalars['u64']['input']>;
  start_block_numberLT?: InputMaybe<Scalars['u64']['input']>;
  start_block_numberLTE?: InputMaybe<Scalars['u64']['input']>;
  start_block_numberNEQ?: InputMaybe<Scalars['u64']['input']>;
  status?: InputMaybe<Scalars['u32']['input']>;
  statusEQ?: InputMaybe<Scalars['u32']['input']>;
  statusGT?: InputMaybe<Scalars['u32']['input']>;
  statusGTE?: InputMaybe<Scalars['u32']['input']>;
  statusLT?: InputMaybe<Scalars['u32']['input']>;
  statusLTE?: InputMaybe<Scalars['u32']['input']>;
  statusNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export type Metadata = {
  __typename?: 'Metadata';
  id?: Maybe<Scalars['ID']['output']>;
  uri?: Maybe<Scalars['String']['output']>;
};

export type MetadataConnection = {
  __typename?: 'MetadataConnection';
  edges?: Maybe<Array<Maybe<MetadataEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type MetadataEdge = {
  __typename?: 'MetadataEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Metadata>;
};

export type Model = {
  __typename?: 'Model';
  class_hash?: Maybe<Scalars['felt252']['output']>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  transaction_hash?: Maybe<Scalars['felt252']['output']>;
};

export type ModelConnection = {
  __typename?: 'ModelConnection';
  edges?: Maybe<Array<Maybe<ModelEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type ModelEdge = {
  __typename?: 'ModelEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Model>;
};

export type ModelUnion = Game | GameEntityCounter | GameTracker | Outpost | OutpostPosition | Reinforcement | Revenant | WorldEvent | WorldEventTracker;

export enum OrderDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Outpost = {
  __typename?: 'Outpost';
  entity?: Maybe<Entity>;
  entity_id?: Maybe<Scalars['u128']['output']>;
  game_id?: Maybe<Scalars['u32']['output']>;
  last_affect_event_id?: Maybe<Scalars['u128']['output']>;
  lifes?: Maybe<Scalars['u32']['output']>;
  name_outpost?: Maybe<Scalars['felt252']['output']>;
  owner?: Maybe<Scalars['ContractAddress']['output']>;
  status?: Maybe<Scalars['u32']['output']>;
  x?: Maybe<Scalars['u32']['output']>;
  y?: Maybe<Scalars['u32']['output']>;
};

export type OutpostConnection = {
  __typename?: 'OutpostConnection';
  edges?: Maybe<Array<Maybe<OutpostEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type OutpostEdge = {
  __typename?: 'OutpostEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Outpost>;
};

export type OutpostOrder = {
  direction: OrderDirection;
  field: OutpostOrderField;
};

export enum OutpostOrderField {
  EntityId = 'ENTITY_ID',
  GameId = 'GAME_ID',
  LastAffectEventId = 'LAST_AFFECT_EVENT_ID',
  Lifes = 'LIFES',
  NameOutpost = 'NAME_OUTPOST',
  Owner = 'OWNER',
  Status = 'STATUS',
  X = 'X',
  Y = 'Y'
}

export type OutpostPosition = {
  __typename?: 'OutpostPosition';
  entity?: Maybe<Entity>;
  entity_id?: Maybe<Scalars['u128']['output']>;
  game_id?: Maybe<Scalars['u32']['output']>;
  x?: Maybe<Scalars['u32']['output']>;
  y?: Maybe<Scalars['u32']['output']>;
};

export type OutpostPositionConnection = {
  __typename?: 'OutpostPositionConnection';
  edges?: Maybe<Array<Maybe<OutpostPositionEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type OutpostPositionEdge = {
  __typename?: 'OutpostPositionEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<OutpostPosition>;
};

export type OutpostPositionOrder = {
  direction: OrderDirection;
  field: OutpostPositionOrderField;
};

export enum OutpostPositionOrderField {
  EntityId = 'ENTITY_ID',
  GameId = 'GAME_ID',
  X = 'X',
  Y = 'Y'
}

export type OutpostPositionWhereInput = {
  entity_id?: InputMaybe<Scalars['u128']['input']>;
  entity_idEQ?: InputMaybe<Scalars['u128']['input']>;
  entity_idGT?: InputMaybe<Scalars['u128']['input']>;
  entity_idGTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idLT?: InputMaybe<Scalars['u128']['input']>;
  entity_idLTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['u128']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  x?: InputMaybe<Scalars['u32']['input']>;
  xEQ?: InputMaybe<Scalars['u32']['input']>;
  xGT?: InputMaybe<Scalars['u32']['input']>;
  xGTE?: InputMaybe<Scalars['u32']['input']>;
  xLT?: InputMaybe<Scalars['u32']['input']>;
  xLTE?: InputMaybe<Scalars['u32']['input']>;
  xNEQ?: InputMaybe<Scalars['u32']['input']>;
  y?: InputMaybe<Scalars['u32']['input']>;
  yEQ?: InputMaybe<Scalars['u32']['input']>;
  yGT?: InputMaybe<Scalars['u32']['input']>;
  yGTE?: InputMaybe<Scalars['u32']['input']>;
  yLT?: InputMaybe<Scalars['u32']['input']>;
  yLTE?: InputMaybe<Scalars['u32']['input']>;
  yNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export type OutpostWhereInput = {
  entity_id?: InputMaybe<Scalars['u128']['input']>;
  entity_idEQ?: InputMaybe<Scalars['u128']['input']>;
  entity_idGT?: InputMaybe<Scalars['u128']['input']>;
  entity_idGTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idLT?: InputMaybe<Scalars['u128']['input']>;
  entity_idLTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['u128']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  last_affect_event_id?: InputMaybe<Scalars['u128']['input']>;
  last_affect_event_idEQ?: InputMaybe<Scalars['u128']['input']>;
  last_affect_event_idGT?: InputMaybe<Scalars['u128']['input']>;
  last_affect_event_idGTE?: InputMaybe<Scalars['u128']['input']>;
  last_affect_event_idLT?: InputMaybe<Scalars['u128']['input']>;
  last_affect_event_idLTE?: InputMaybe<Scalars['u128']['input']>;
  last_affect_event_idNEQ?: InputMaybe<Scalars['u128']['input']>;
  lifes?: InputMaybe<Scalars['u32']['input']>;
  lifesEQ?: InputMaybe<Scalars['u32']['input']>;
  lifesGT?: InputMaybe<Scalars['u32']['input']>;
  lifesGTE?: InputMaybe<Scalars['u32']['input']>;
  lifesLT?: InputMaybe<Scalars['u32']['input']>;
  lifesLTE?: InputMaybe<Scalars['u32']['input']>;
  lifesNEQ?: InputMaybe<Scalars['u32']['input']>;
  name_outpost?: InputMaybe<Scalars['felt252']['input']>;
  name_outpostEQ?: InputMaybe<Scalars['felt252']['input']>;
  name_outpostGT?: InputMaybe<Scalars['felt252']['input']>;
  name_outpostGTE?: InputMaybe<Scalars['felt252']['input']>;
  name_outpostLT?: InputMaybe<Scalars['felt252']['input']>;
  name_outpostLTE?: InputMaybe<Scalars['felt252']['input']>;
  name_outpostNEQ?: InputMaybe<Scalars['felt252']['input']>;
  owner?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  status?: InputMaybe<Scalars['u32']['input']>;
  statusEQ?: InputMaybe<Scalars['u32']['input']>;
  statusGT?: InputMaybe<Scalars['u32']['input']>;
  statusGTE?: InputMaybe<Scalars['u32']['input']>;
  statusLT?: InputMaybe<Scalars['u32']['input']>;
  statusLTE?: InputMaybe<Scalars['u32']['input']>;
  statusNEQ?: InputMaybe<Scalars['u32']['input']>;
  x?: InputMaybe<Scalars['u32']['input']>;
  xEQ?: InputMaybe<Scalars['u32']['input']>;
  xGT?: InputMaybe<Scalars['u32']['input']>;
  xGTE?: InputMaybe<Scalars['u32']['input']>;
  xLT?: InputMaybe<Scalars['u32']['input']>;
  xLTE?: InputMaybe<Scalars['u32']['input']>;
  xNEQ?: InputMaybe<Scalars['u32']['input']>;
  y?: InputMaybe<Scalars['u32']['input']>;
  yEQ?: InputMaybe<Scalars['u32']['input']>;
  yGT?: InputMaybe<Scalars['u32']['input']>;
  yGTE?: InputMaybe<Scalars['u32']['input']>;
  yLT?: InputMaybe<Scalars['u32']['input']>;
  yLTE?: InputMaybe<Scalars['u32']['input']>;
  yNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export type Query = {
  __typename?: 'Query';
  entities?: Maybe<EntityConnection>;
  entity: Entity;
  events?: Maybe<EventConnection>;
  gameModels?: Maybe<GameConnection>;
  gameentitycounterModels?: Maybe<GameEntityCounterConnection>;
  gametrackerModels?: Maybe<GameTrackerConnection>;
  metadata: Metadata;
  metadatas?: Maybe<MetadataConnection>;
  model: Model;
  models?: Maybe<ModelConnection>;
  outpostModels?: Maybe<OutpostConnection>;
  outpostpositionModels?: Maybe<OutpostPositionConnection>;
  reinforcementModels?: Maybe<ReinforcementConnection>;
  revenantModels?: Maybe<RevenantConnection>;
  transaction: Transaction;
  transactions?: Maybe<TransactionConnection>;
  worldeventModels?: Maybe<WorldEventConnection>;
  worldeventtrackerModels?: Maybe<WorldEventTrackerConnection>;
};


export type QueryEntitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryEntityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEventsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGameModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<GameOrder>;
  where?: InputMaybe<GameWhereInput>;
};


export type QueryGameentitycounterModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<GameEntityCounterOrder>;
  where?: InputMaybe<GameEntityCounterWhereInput>;
};


export type QueryGametrackerModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<GameTrackerOrder>;
  where?: InputMaybe<GameTrackerWhereInput>;
};


export type QueryMetadataArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMetadatasArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryModelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryOutpostModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OutpostOrder>;
  where?: InputMaybe<OutpostWhereInput>;
};


export type QueryOutpostpositionModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<OutpostPositionOrder>;
  where?: InputMaybe<OutpostPositionWhereInput>;
};


export type QueryReinforcementModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<ReinforcementOrder>;
  where?: InputMaybe<ReinforcementWhereInput>;
};


export type QueryRevenantModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<RevenantOrder>;
  where?: InputMaybe<RevenantWhereInput>;
};


export type QueryTransactionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTransactionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryWorldeventModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<WorldEventOrder>;
  where?: InputMaybe<WorldEventWhereInput>;
};


export type QueryWorldeventtrackerModelsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<WorldEventTrackerOrder>;
  where?: InputMaybe<WorldEventTrackerWhereInput>;
};

export type Reinforcement = {
  __typename?: 'Reinforcement';
  balance?: Maybe<Scalars['u32']['output']>;
  entity?: Maybe<Entity>;
  game_id?: Maybe<Scalars['u32']['output']>;
  owner?: Maybe<Scalars['ContractAddress']['output']>;
};

export type ReinforcementConnection = {
  __typename?: 'ReinforcementConnection';
  edges?: Maybe<Array<Maybe<ReinforcementEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type ReinforcementEdge = {
  __typename?: 'ReinforcementEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Reinforcement>;
};

export type ReinforcementOrder = {
  direction: OrderDirection;
  field: ReinforcementOrderField;
};

export enum ReinforcementOrderField {
  Balance = 'BALANCE',
  GameId = 'GAME_ID',
  Owner = 'OWNER'
}

export type ReinforcementWhereInput = {
  balance?: InputMaybe<Scalars['u32']['input']>;
  balanceEQ?: InputMaybe<Scalars['u32']['input']>;
  balanceGT?: InputMaybe<Scalars['u32']['input']>;
  balanceGTE?: InputMaybe<Scalars['u32']['input']>;
  balanceLT?: InputMaybe<Scalars['u32']['input']>;
  balanceLTE?: InputMaybe<Scalars['u32']['input']>;
  balanceNEQ?: InputMaybe<Scalars['u32']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  owner?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
};

export type Revenant = {
  __typename?: 'Revenant';
  entity?: Maybe<Entity>;
  entity_id?: Maybe<Scalars['u128']['output']>;
  game_id?: Maybe<Scalars['u32']['output']>;
  name_revenant?: Maybe<Scalars['felt252']['output']>;
  outpost_count?: Maybe<Scalars['u32']['output']>;
  owner?: Maybe<Scalars['ContractAddress']['output']>;
  status?: Maybe<Scalars['u32']['output']>;
};

export type RevenantConnection = {
  __typename?: 'RevenantConnection';
  edges?: Maybe<Array<Maybe<RevenantEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type RevenantEdge = {
  __typename?: 'RevenantEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Revenant>;
};

export type RevenantOrder = {
  direction: OrderDirection;
  field: RevenantOrderField;
};

export enum RevenantOrderField {
  EntityId = 'ENTITY_ID',
  GameId = 'GAME_ID',
  NameRevenant = 'NAME_REVENANT',
  OutpostCount = 'OUTPOST_COUNT',
  Owner = 'OWNER',
  Status = 'STATUS'
}

export type RevenantWhereInput = {
  entity_id?: InputMaybe<Scalars['u128']['input']>;
  entity_idEQ?: InputMaybe<Scalars['u128']['input']>;
  entity_idGT?: InputMaybe<Scalars['u128']['input']>;
  entity_idGTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idLT?: InputMaybe<Scalars['u128']['input']>;
  entity_idLTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['u128']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  name_revenant?: InputMaybe<Scalars['felt252']['input']>;
  name_revenantEQ?: InputMaybe<Scalars['felt252']['input']>;
  name_revenantGT?: InputMaybe<Scalars['felt252']['input']>;
  name_revenantGTE?: InputMaybe<Scalars['felt252']['input']>;
  name_revenantLT?: InputMaybe<Scalars['felt252']['input']>;
  name_revenantLTE?: InputMaybe<Scalars['felt252']['input']>;
  name_revenantNEQ?: InputMaybe<Scalars['felt252']['input']>;
  outpost_count?: InputMaybe<Scalars['u32']['input']>;
  outpost_countEQ?: InputMaybe<Scalars['u32']['input']>;
  outpost_countGT?: InputMaybe<Scalars['u32']['input']>;
  outpost_countGTE?: InputMaybe<Scalars['u32']['input']>;
  outpost_countLT?: InputMaybe<Scalars['u32']['input']>;
  outpost_countLTE?: InputMaybe<Scalars['u32']['input']>;
  outpost_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  owner?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerGT?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerGTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerLT?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerLTE?: InputMaybe<Scalars['ContractAddress']['input']>;
  ownerNEQ?: InputMaybe<Scalars['ContractAddress']['input']>;
  status?: InputMaybe<Scalars['u32']['input']>;
  statusEQ?: InputMaybe<Scalars['u32']['input']>;
  statusGT?: InputMaybe<Scalars['u32']['input']>;
  statusGTE?: InputMaybe<Scalars['u32']['input']>;
  statusLT?: InputMaybe<Scalars['u32']['input']>;
  statusLTE?: InputMaybe<Scalars['u32']['input']>;
  statusNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  entityUpdated: Entity;
  modelRegistered: Model;
};


export type SubscriptionEntityUpdatedArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};


export type SubscriptionModelRegisteredArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type Transaction = {
  __typename?: 'Transaction';
  calldata?: Maybe<Array<Maybe<Scalars['felt252']['output']>>>;
  created_at?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  max_fee?: Maybe<Scalars['felt252']['output']>;
  nonce?: Maybe<Scalars['felt252']['output']>;
  sender_address?: Maybe<Scalars['felt252']['output']>;
  signature?: Maybe<Array<Maybe<Scalars['felt252']['output']>>>;
  transaction_hash?: Maybe<Scalars['felt252']['output']>;
};

export type TransactionConnection = {
  __typename?: 'TransactionConnection';
  edges?: Maybe<Array<Maybe<TransactionEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type TransactionEdge = {
  __typename?: 'TransactionEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<Transaction>;
};

export type WorldEvent = {
  __typename?: 'WorldEvent';
  block_number?: Maybe<Scalars['u64']['output']>;
  destroy_count?: Maybe<Scalars['u32']['output']>;
  entity?: Maybe<Entity>;
  entity_id?: Maybe<Scalars['u128']['output']>;
  game_id?: Maybe<Scalars['u32']['output']>;
  radius?: Maybe<Scalars['u32']['output']>;
  x?: Maybe<Scalars['u32']['output']>;
  y?: Maybe<Scalars['u32']['output']>;
};

export type WorldEventConnection = {
  __typename?: 'WorldEventConnection';
  edges?: Maybe<Array<Maybe<WorldEventEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type WorldEventEdge = {
  __typename?: 'WorldEventEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<WorldEvent>;
};

export type WorldEventOrder = {
  direction: OrderDirection;
  field: WorldEventOrderField;
};

export enum WorldEventOrderField {
  BlockNumber = 'BLOCK_NUMBER',
  DestroyCount = 'DESTROY_COUNT',
  EntityId = 'ENTITY_ID',
  GameId = 'GAME_ID',
  Radius = 'RADIUS',
  X = 'X',
  Y = 'Y'
}

export type WorldEventTracker = {
  __typename?: 'WorldEventTracker';
  entity?: Maybe<Entity>;
  event_id?: Maybe<Scalars['u128']['output']>;
  game_id?: Maybe<Scalars['u32']['output']>;
  outpost_id?: Maybe<Scalars['u128']['output']>;
};

export type WorldEventTrackerConnection = {
  __typename?: 'WorldEventTrackerConnection';
  edges?: Maybe<Array<Maybe<WorldEventTrackerEdge>>>;
  total_count: Scalars['Int']['output'];
};

export type WorldEventTrackerEdge = {
  __typename?: 'WorldEventTrackerEdge';
  cursor?: Maybe<Scalars['Cursor']['output']>;
  node?: Maybe<WorldEventTracker>;
};

export type WorldEventTrackerOrder = {
  direction: OrderDirection;
  field: WorldEventTrackerOrderField;
};

export enum WorldEventTrackerOrderField {
  EventId = 'EVENT_ID',
  GameId = 'GAME_ID',
  OutpostId = 'OUTPOST_ID'
}

export type WorldEventTrackerWhereInput = {
  event_id?: InputMaybe<Scalars['u128']['input']>;
  event_idEQ?: InputMaybe<Scalars['u128']['input']>;
  event_idGT?: InputMaybe<Scalars['u128']['input']>;
  event_idGTE?: InputMaybe<Scalars['u128']['input']>;
  event_idLT?: InputMaybe<Scalars['u128']['input']>;
  event_idLTE?: InputMaybe<Scalars['u128']['input']>;
  event_idNEQ?: InputMaybe<Scalars['u128']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  outpost_id?: InputMaybe<Scalars['u128']['input']>;
  outpost_idEQ?: InputMaybe<Scalars['u128']['input']>;
  outpost_idGT?: InputMaybe<Scalars['u128']['input']>;
  outpost_idGTE?: InputMaybe<Scalars['u128']['input']>;
  outpost_idLT?: InputMaybe<Scalars['u128']['input']>;
  outpost_idLTE?: InputMaybe<Scalars['u128']['input']>;
  outpost_idNEQ?: InputMaybe<Scalars['u128']['input']>;
};

export type WorldEventWhereInput = {
  block_number?: InputMaybe<Scalars['u64']['input']>;
  block_numberEQ?: InputMaybe<Scalars['u64']['input']>;
  block_numberGT?: InputMaybe<Scalars['u64']['input']>;
  block_numberGTE?: InputMaybe<Scalars['u64']['input']>;
  block_numberLT?: InputMaybe<Scalars['u64']['input']>;
  block_numberLTE?: InputMaybe<Scalars['u64']['input']>;
  block_numberNEQ?: InputMaybe<Scalars['u64']['input']>;
  destroy_count?: InputMaybe<Scalars['u32']['input']>;
  destroy_countEQ?: InputMaybe<Scalars['u32']['input']>;
  destroy_countGT?: InputMaybe<Scalars['u32']['input']>;
  destroy_countGTE?: InputMaybe<Scalars['u32']['input']>;
  destroy_countLT?: InputMaybe<Scalars['u32']['input']>;
  destroy_countLTE?: InputMaybe<Scalars['u32']['input']>;
  destroy_countNEQ?: InputMaybe<Scalars['u32']['input']>;
  entity_id?: InputMaybe<Scalars['u128']['input']>;
  entity_idEQ?: InputMaybe<Scalars['u128']['input']>;
  entity_idGT?: InputMaybe<Scalars['u128']['input']>;
  entity_idGTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idLT?: InputMaybe<Scalars['u128']['input']>;
  entity_idLTE?: InputMaybe<Scalars['u128']['input']>;
  entity_idNEQ?: InputMaybe<Scalars['u128']['input']>;
  game_id?: InputMaybe<Scalars['u32']['input']>;
  game_idEQ?: InputMaybe<Scalars['u32']['input']>;
  game_idGT?: InputMaybe<Scalars['u32']['input']>;
  game_idGTE?: InputMaybe<Scalars['u32']['input']>;
  game_idLT?: InputMaybe<Scalars['u32']['input']>;
  game_idLTE?: InputMaybe<Scalars['u32']['input']>;
  game_idNEQ?: InputMaybe<Scalars['u32']['input']>;
  radius?: InputMaybe<Scalars['u32']['input']>;
  radiusEQ?: InputMaybe<Scalars['u32']['input']>;
  radiusGT?: InputMaybe<Scalars['u32']['input']>;
  radiusGTE?: InputMaybe<Scalars['u32']['input']>;
  radiusLT?: InputMaybe<Scalars['u32']['input']>;
  radiusLTE?: InputMaybe<Scalars['u32']['input']>;
  radiusNEQ?: InputMaybe<Scalars['u32']['input']>;
  x?: InputMaybe<Scalars['u32']['input']>;
  xEQ?: InputMaybe<Scalars['u32']['input']>;
  xGT?: InputMaybe<Scalars['u32']['input']>;
  xGTE?: InputMaybe<Scalars['u32']['input']>;
  xLT?: InputMaybe<Scalars['u32']['input']>;
  xLTE?: InputMaybe<Scalars['u32']['input']>;
  xNEQ?: InputMaybe<Scalars['u32']['input']>;
  y?: InputMaybe<Scalars['u32']['input']>;
  yEQ?: InputMaybe<Scalars['u32']['input']>;
  yGT?: InputMaybe<Scalars['u32']['input']>;
  yGTE?: InputMaybe<Scalars['u32']['input']>;
  yLT?: InputMaybe<Scalars['u32']['input']>;
  yLTE?: InputMaybe<Scalars['u32']['input']>;
  yNEQ?: InputMaybe<Scalars['u32']['input']>;
};

export type GetEntitiesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEntitiesQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Game', start_block_number?: any | null, prize?: any | null, preparation_phase_interval?: any | null, event_interval?: any | null, erc_addr?: any | null, status?: any | null } | { __typename: 'GameEntityCounter', revenant_count?: any | null, outpost_count?: any | null, event_count?: any | null, outpost_exists_count?: any | null } | { __typename: 'GameTracker', count?: any | null } | { __typename: 'Outpost', owner?: any | null, name_outpost?: any | null, x?: any | null, y?: any | null, lifes?: any | null, status?: any | null, last_affect_event_id?: any | null } | { __typename: 'OutpostPosition', entity_id?: any | null } | { __typename: 'Reinforcement', balance?: any | null } | { __typename: 'Revenant', owner?: any | null, name_revenant?: any | null, outpost_count?: any | null, status?: any | null } | { __typename: 'WorldEvent', x?: any | null, y?: any | null, radius?: any | null, destroy_count?: any | null, block_number?: any | null } | { __typename: 'WorldEventTracker' } | null> | null } | null } | null> | null } | null };

export type GetGameEntityQueryVariables = Exact<{
  key: Scalars['String']['input'];
}>;


export type GetGameEntityQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Game', game_id?: any | null, start_block_number?: any | null, prize?: any | null, preparation_phase_interval?: any | null, event_interval?: any | null, erc_addr?: any | null, status?: any | null } | { __typename: 'GameEntityCounter', game_id?: any | null, revenant_count?: any | null, outpost_count?: any | null, event_count?: any | null, outpost_exists_count?: any | null } | { __typename: 'GameTracker' } | { __typename: 'Outpost' } | { __typename: 'OutpostPosition' } | { __typename: 'Reinforcement' } | { __typename: 'Revenant' } | { __typename: 'WorldEvent' } | { __typename: 'WorldEventTracker' } | null> | null } | null } | null> | null } | null };

export type GetOutpostEntityQueryVariables = Exact<{
  game_id: Scalars['String']['input'];
  entity_id: Scalars['String']['input'];
}>;


export type GetOutpostEntityQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Game' } | { __typename: 'GameEntityCounter' } | { __typename: 'GameTracker' } | { __typename: 'Outpost', game_id?: any | null, entity_id?: any | null, owner?: any | null, name_outpost?: any | null, x?: any | null, y?: any | null, lifes?: any | null, status?: any | null, last_affect_event_id?: any | null } | { __typename: 'OutpostPosition' } | { __typename: 'Reinforcement' } | { __typename: 'Revenant', game_id?: any | null, entity_id?: any | null, owner?: any | null, name_revenant?: any | null, outpost_count?: any | null, status?: any | null } | { __typename: 'WorldEvent' } | { __typename: 'WorldEventTracker' } | null> | null } | null } | null> | null } | null };

export type GetOutpostEntityAllQueryVariables = Exact<{
  game_id: Scalars['String']['input'];
}>;


export type GetOutpostEntityAllQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Game' } | { __typename: 'GameEntityCounter' } | { __typename: 'GameTracker' } | { __typename: 'Outpost', owner?: any | null, name_outpost?: any | null, x?: any | null, y?: any | null, lifes?: any | null, status?: any | null, last_affect_event_id?: any | null } | { __typename: 'OutpostPosition' } | { __typename: 'Reinforcement' } | { __typename: 'Revenant', owner?: any | null, name_revenant?: any | null, outpost_count?: any | null, status?: any | null } | { __typename: 'WorldEvent' } | { __typename: 'WorldEventTracker' } | null> | null } | null } | null> | null } | null };

export type GetGameTrackerQueryVariables = Exact<{
  config_id: Scalars['String']['input'];
}>;


export type GetGameTrackerQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: Array<string | null> | null, models?: Array<{ __typename?: 'Game' } | { __typename?: 'GameEntityCounter' } | { __typename?: 'GameTracker', entity_id?: any | null, count?: any | null } | { __typename?: 'Outpost' } | { __typename?: 'OutpostPosition' } | { __typename?: 'Reinforcement' } | { __typename?: 'Revenant' } | { __typename?: 'WorldEvent' } | { __typename?: 'WorldEventTracker' } | null> | null } | null } | null> | null } | null };

export type GetReinforcementQueryVariables = Exact<{
  game_id: Scalars['String']['input'];
  owner: Scalars['String']['input'];
}>;


export type GetReinforcementQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Game' } | { __typename: 'GameEntityCounter' } | { __typename: 'GameTracker' } | { __typename: 'Outpost' } | { __typename: 'OutpostPosition' } | { __typename: 'Reinforcement', game_id?: any | null, owner?: any | null, balance?: any | null } | { __typename: 'Revenant' } | { __typename: 'WorldEvent' } | { __typename: 'WorldEventTracker' } | null> | null } | null } | null> | null } | null };

export type GetWorldEventEntityQueryVariables = Exact<{
  game_id: Scalars['String']['input'];
  entity_id: Scalars['String']['input'];
}>;


export type GetWorldEventEntityQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: Array<string | null> | null, models?: Array<{ __typename: 'Game' } | { __typename: 'GameEntityCounter' } | { __typename: 'GameTracker' } | { __typename: 'Outpost' } | { __typename: 'OutpostPosition' } | { __typename: 'Reinforcement' } | { __typename: 'Revenant' } | { __typename: 'WorldEvent', game_id?: any | null, entity_id?: any | null, x?: any | null, y?: any | null, radius?: any | null, destroy_count?: any | null, block_number?: any | null } | { __typename: 'WorldEventTracker' } | null> | null } | null } | null> | null } | null };


export const GetEntitiesDocument = gql`
    query getEntities {
  entities(keys: ["%"]) {
    edges {
      node {
        keys
        models {
          __typename
          ... on GameTracker {
            count
          }
          ... on GameEntityCounter {
            revenant_count
            outpost_count
            event_count
            outpost_exists_count
          }
          ... on Game {
            start_block_number
            prize
            preparation_phase_interval
            event_interval
            erc_addr
            status
          }
          ... on Outpost {
            owner
            name_outpost
            x
            y
            lifes
            status
            last_affect_event_id
          }
          ... on OutpostPosition {
            entity_id
          }
          ... on Reinforcement {
            balance
          }
          ... on Revenant {
            owner
            name_revenant
            outpost_count
            status
          }
          ... on WorldEvent {
            x
            y
            radius
            destroy_count
            block_number
          }
        }
      }
    }
  }
}
    `;
export const GetGameEntityDocument = gql`
    query getGameEntity($key: String!) {
  entities(keys: [$key]) {
    edges {
      node {
        keys
        models {
          __typename
          ... on Game {
            game_id
            start_block_number
            prize
            preparation_phase_interval
            event_interval
            erc_addr
            status
          }
          ... on GameEntityCounter {
            game_id
            revenant_count
            outpost_count
            event_count
            outpost_exists_count
          }
        }
      }
    }
  }
}
    `;
export const GetOutpostEntityDocument = gql`
    query getOutpostEntity($game_id: String!, $entity_id: String!) {
  entities(keys: [$game_id, $entity_id]) {
    edges {
      node {
        keys
        models {
          __typename
          ... on Revenant {
            game_id
            entity_id
            owner
            name_revenant
            outpost_count
            status
          }
          ... on Outpost {
            game_id
            entity_id
            owner
            name_outpost
            x
            y
            lifes
            status
            last_affect_event_id
          }
        }
      }
    }
  }
}
    `;
export const GetOutpostEntityAllDocument = gql`
    query getOutpostEntityAll($game_id: String!) {
  entities(keys: [$game_id]) {
    edges {
      node {
        keys
        models {
          __typename
          ... on Revenant {
            owner
            name_revenant
            outpost_count
            status
          }
          ... on Outpost {
            owner
            name_outpost
            x
            y
            lifes
            status
            last_affect_event_id
          }
        }
      }
    }
  }
}
    `;
export const GetGameTrackerDocument = gql`
    query getGameTracker($config_id: String!) {
  entities(keys: [$config_id]) {
    edges {
      node {
        keys
        models {
          ... on GameTracker {
            entity_id
            count
          }
        }
      }
    }
  }
}
    `;
export const GetReinforcementDocument = gql`
    query getReinforcement($game_id: String!, $owner: String!) {
  entities(keys: [$game_id, $owner]) {
    edges {
      node {
        keys
        models {
          __typename
          ... on Reinforcement {
            game_id
            owner
            balance
          }
        }
      }
    }
  }
}
    `;
export const GetWorldEventEntityDocument = gql`
    query getWorldEventEntity($game_id: String!, $entity_id: String!) {
  entities(keys: [$game_id, $entity_id]) {
    edges {
      node {
        keys
        models {
          __typename
          ... on WorldEvent {
            game_id
            entity_id
            x
            y
            radius
            destroy_count
            block_number
          }
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();
const GetEntitiesDocumentString = print(GetEntitiesDocument);
const GetGameEntityDocumentString = print(GetGameEntityDocument);
const GetOutpostEntityDocumentString = print(GetOutpostEntityDocument);
const GetOutpostEntityAllDocumentString = print(GetOutpostEntityAllDocument);
const GetGameTrackerDocumentString = print(GetGameTrackerDocument);
const GetReinforcementDocumentString = print(GetReinforcementDocument);
const GetWorldEventEntityDocumentString = print(GetWorldEventEntityDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getEntities(variables?: GetEntitiesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetEntitiesQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetEntitiesQuery>(GetEntitiesDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getEntities', 'query');
    },
    getGameEntity(variables: GetGameEntityQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetGameEntityQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetGameEntityQuery>(GetGameEntityDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getGameEntity', 'query');
    },
    getOutpostEntity(variables: GetOutpostEntityQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetOutpostEntityQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetOutpostEntityQuery>(GetOutpostEntityDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getOutpostEntity', 'query');
    },
    getOutpostEntityAll(variables: GetOutpostEntityAllQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetOutpostEntityAllQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetOutpostEntityAllQuery>(GetOutpostEntityAllDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getOutpostEntityAll', 'query');
    },
    getGameTracker(variables: GetGameTrackerQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetGameTrackerQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetGameTrackerQuery>(GetGameTrackerDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getGameTracker', 'query');
    },
    getReinforcement(variables: GetReinforcementQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetReinforcementQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetReinforcementQuery>(GetReinforcementDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getReinforcement', 'query');
    },
    getWorldEventEntity(variables: GetWorldEventEntityQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetWorldEventEntityQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetWorldEventEntityQuery>(GetWorldEventEntityDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getWorldEventEntity', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;