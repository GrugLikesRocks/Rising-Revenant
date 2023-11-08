import { request, gql } from 'graphql-request';
import { decimalToHexadecimal } from '../utils';
import { setComponentFromGraphQLEntity } from '@dojoengine/utils';




interface DataFormatted {
  allKeys: string[];
  gameModels: any[];
}

const getDataFormatted = (entities: any, typename: string): DataFormatted => {
  let allKeys: string[] = [];
  let gameModels: any[] = [];

  for (const edge of entities.edges) {
    const node = edge.node;

    if (node.models) {
      const gameModel = node.models.find((model: any) => model.__typename === typename);

      if (gameModel) {
        allKeys = allKeys.concat(node.keys);
        gameModels.push(gameModel);
      }
    }
  }

  return { allKeys, gameModels };
}




interface Model {
  __typename: string;
}

interface Node {
  keys: string[];
  models: Model[];
}

interface Data {
  node: Node;
}

function removeModelsByTypename(data: Data, typenamesToRemove: string[]): Data {
  const updatedData: Data = { ...data };

  if (updatedData.node && updatedData.node.models) {
    updatedData.node.models = updatedData.node.models.filter(
      (model) => !typenamesToRemove.includes(model.__typename)
    );
  }

  return updatedData;
}



interface Model {
  __typename: string;
}

interface Node {
  keys: string[];
  models: Model[];
}

interface Edge {
  node: Node;
}

interface Data {
  edges: Edge[];
}

function extractSpecificNode(data: Data, key: string): Edge | null {
  for (const edge of data.edges) {
    if (
      edge.node &&
      edge.node.keys &&
      edge.node.keys.length === 1 && // Ensure only one key is present
      edge.node.keys[0] === key &&
      edge.node.models
    ) {
      return edge;
    }
  }
  return null;
}



interface ComponentSchema {
  [key: string]: any;
}

export function createComponentStructure(componentSchema: ComponentSchema, keys: string[], componentName: string): any {
  return {
    "node": {
      "keys": keys,
      "models": [
        {
          "__typename": componentName,
          ...componentSchema
        }
      ]
    }
  };
}


//#region GAME RELATED DATABASE CALLS

export const getGameEntitiesSpecific = async (graphSDK_: any, key_: string) => {
  let {
    data: { entities },
  } = await graphSDK_().getGameEntity({ key: key_ })

  const adjustedStartPoint: any = extractSpecificNode(entities, key_);
  const newData = removeModelsByTypename(adjustedStartPoint, ["GameTracker"])

  return newData;
}

export async function getGameTrackerEntity() {
  const query = gql`
    query getEntities {
      entities(keys: ["0x1"]) {
        edges {
          node {
            keys
            models {
              __typename
              ... on GameTracker {
                count
              }
            }
          }
        }
      }
    }
  `;

  const endpoint = 'http://127.0.0.1:8080/graphql';

  try {
    const data: any = await request(endpoint, query);

    const gameTrackerCount: number | undefined = data!.entities.edges
      .find(edge => edge.node.models.some((model: any) => model.__typename === "GameTracker"))
      ?.node.models.find((model: any) => model.__typename === "GameTracker")?.count;

    return gameTrackerCount;

  } catch (error) {
    console.error('Error executing GraphQL query:', error);
    throw error;
  }
}



//#endregion

//#region OUTPOST DATABASE RELATED CALLS

export const getOutpostEntitySpecific = async (graphSDK_: any, game_id: string, entity_id: string): Promise<DataFormatted[]> => {
  const {
    data: { entities },
  } = await graphSDK_().getOutpostEntity({ game_id: game_id, entity_id: entity_id })

  return entities
}

export const getFullOutpostGameData = async (graphSDK_: any, game_id: string, end_index: number, start_index: number = 1) => {

  try {
    let arrOfEntities: any[] = [];

    for (let index = start_index; index < end_index + 1; index++) {
      const {
        data: { entities },
      } = await graphSDK_().getOutpostEntity({ game_id: game_id, entity_id: decimalToHexadecimal(index) });

      arrOfEntities.push(entities.edges[0]);
    }

    return arrOfEntities;
  } catch (error) {
    console.error('Error fetching outpost game data:', error);
    throw error;
  }
};


export const getReinforcementSpecific = async (graphSDK_: any, game_id: string, owner: string): Promise<DataFormatted> => {
  const {
    data: { entities },
  } = await graphSDK_().getReinforcement({ game_id: game_id, owner: owner })


  console.log("this is the entities in the reinforcmetn call", entities)
  // const { allKeys, gameModels } = getDataFormatted(entities, "Reinforcement")

  return entities;
}


//#endregion


//#region WORLDEVENT RELATED DATABASE CALLS

export const getWorldEventEntitySpecific = async (graphSDK_: any, game_id: string, entity_id: string): Promise<DataFormatted> => {
  const {
    data: { entities },
  } = await graphSDK_().getWorldEventEntity({ game_id: game_id, entity_id: entity_id })

  const { allKeys, gameModels } = getDataFormatted(entities, "WorldEvent")

  return { allKeys, gameModels };
}

export const getFullEventGameData = async (graphSDK_: any, game_id: string, end_index: number, start_index: number = 1) => {

  try {
    let arrOfEntities: any[] = [];

    for (let index = start_index; index < end_index + 1; index++) {
      // const {
      //   data: { entities },
      // } = await graphSDK_().getWorldEventEntity({ game_id: game_id, entity_id: decimalToHexadecimal(index) });

      const entities: any = await getEventEntity(game_id, decimalToHexadecimal(index));

      console.log("this is the entities in the event call", entities)

      const stuff = createComponentStructure({
        "block_number": entities[0].node.models[2].block_number,
        "destroy_count": entities[0].node.models[2].destroy_count,
        "entity_id": entities[0].node.models[2].entity_id,
        "game_id": entities[0].node.models[2].game_id,
        "radius": entities[0].node.models[2].radius,
        "x": entities[0].node.models[2].x,
        "y":entities[0].node.models[2].y,

      }, [entities[0].node.keys[0],entities[0].node.keys[1]], "WorldEvent")

      console.log(stuff)

      arrOfEntities.push(stuff);
    }

    return arrOfEntities;
  } catch (error) {
    console.error('Error fetching outpost game data:', error);
    throw error;
  }
};

// function removeModels(inputObject: any): any {
//   if (inputObject && inputObject.node && inputObject.node.models) {
//       inputObject.node.models = inputObject.node.models.filter(model => !model.__typename);
//   }
//   return inputObject;
// }




export async function getEventEntity(game_id: string, entity_id: string) {
  const query = gql`
  query getEntities {
    entities(keys: ["${game_id}", "${entity_id}"]) {
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
  }`;

  const endpoint = 'http://127.0.0.1:8080/graphql';

  try {
    const data: any = await request(endpoint, query);

    console.log("this is the data for the event", data);

    const gameTrackerCount = data.entities.edges;
    console.log("this is the game tracker count", gameTrackerCount);

    return gameTrackerCount;

  } catch (error) {
    console.error('Error executing GraphQL query:', error);
    throw error;
  }
}


//#endregion



export function setComponentQuick(schema: any, keys: string[], componentName: string, components: any) {
  const component = createComponentStructure(schema, keys, componentName);
  setComponentFromGraphQLEntity(components, component);
}