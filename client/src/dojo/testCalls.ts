import { request, gql } from 'graphql-request';










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

  return {allKeys, gameModels};
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


  const adjustedStartPoint =  entities.edges[0];
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

  console.log("\n\n\n\n")
  console.log(entities)
  console.log("\n\n\n\n")

  const {allKeys: allKeysOutpost, gameModels: gameModelsOutpost} = getDataFormatted(entities, "Outpost")
  const {allKeys: allKeysRev, gameModels: gameModelsRev} = getDataFormatted(entities, "Revenant")

  return [{allKeys:allKeysOutpost,gameModels: gameModelsOutpost},{allKeys: allKeysRev, gameModels: gameModelsRev}]
}

export const getFullOutpostGameData = async (graphSDK_: any, game_id: string) => {
  const {
    data: { entities },
  } = await graphSDK_().getOutpostEntityAll({ game_id: game_id })

  console.log(entities)

}


export const getReinforcementSpecific = async (graphSDK_: any, game_id: string, owner: string): Promise<DataFormatted> => {
  const {
    data: { entities },
  } = await graphSDK_().getReinforcement({ game_id: game_id, owner: owner })

  const {allKeys, gameModels} = getDataFormatted(entities, "Reinforcement")

  return {allKeys, gameModels};
}


//#endregion


//#region WORLDEVENT RELATED DATABASE CALLS

export const getWorldEventEntitySpecific = async (graphSDK_: any, game_id: string, entity_id: string): Promise<DataFormatted> => {
  const {
    data: { entities },
  } = await graphSDK_().getWorldEventEntity({ game_id: game_id, entity_id: entity_id })

  const {allKeys, gameModels} = getDataFormatted(entities, "WorldEvent")

  return {allKeys, gameModels};
}

//#endregion