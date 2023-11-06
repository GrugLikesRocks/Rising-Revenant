



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



//#region GAME RELATED DATABASE CALLS

export const getGameEntitySpecific = async (graphSDK_: any, key_: string) => {
  const {
    data: { entities },
  } = await graphSDK_().getGameEntity({ key: key_ })

  const {allKeys, gameModels} = getDataFormatted(entities, "Game")

  console.log(allKeys)
  console.log(gameModels)

  return entities
}


export const getGameEntityCounterSpecific = async (graphSDK_: any, game_id: string) => {
  const {
    data: { entities },
  } = await graphSDK_().getGameEntity({ key: game_id })

  const {allKeys, gameModels} = getDataFormatted(entities, "GameEntityCounter")

  console.log(allKeys)
  console.log(gameModels)

  return entities
}

export const getGameTrackerSpecific = async (graphSDK_: any, config_id: string) => {
  const {
    data: { entities },
  } = await graphSDK_().getGameEntity({ key: config_id })

  const {allKeys, gameModels} = getDataFormatted(entities, "GameTracker")

  console.log(allKeys)
  console.log(gameModels)

  return entities
}


//#endregion

//#region OUTPOST DATABASE RELATED CALLS

export const getOutpostEntitySpecific = async (graphSDK_: any, game_id: string, entity_id: string) => {
  const {
    data: { entities },
  } = await graphSDK_().getOutpostEntity({ game_id: game_id, entity_id: entity_id })



  return entities
}

export const getFullOutpostGameData = async (graphSDK_: any, game_id: string) => {
   
}


export const getReinforcementSpecific = async (graphSDK_: any, game_id: string, owner: string) => {
  const {
    data: { entities },
  } = await graphSDK_().getReinforcement({ game_id: game_id, owner: owner })

  console.log(entities)

  return entities

}


//#endregion


//#region WORLDEVENT RELATED DATABASE CALLS

export const getWorldEventEntitySpecific = async (graphSDK_: any, game_id: string, entity_id: string) => {
  const {
    data: { entities },
  } = await graphSDK_().getWorldEventEntity({ game_id: game_id, entity_id: entity_id })

  console.log(entities)
  
  return entities
}

//#endregion