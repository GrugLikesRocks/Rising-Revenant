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

export const getGameEntitiesSpecific = async (graphSDK_: any, key_: string) => {
  const {
    data: { entities },
  } = await graphSDK_().getGameEntity({ key: key_ })


  const {allKeys, gameModels} = getDataFormatted(entities, "Game")
  const {allKeys: allKeysCounter, gameModels: gameModelsCounter} = getDataFormatted(entities, "GameEntityCounter")

  console.log(allKeys)
  console.log(gameModels)

  console.log(allKeysCounter)
  console.log(gameModelsCounter)

  return {allKeys, gameModels, allKeysCounter, gameModelsCounter};
}



// export const getGameTrackerSpecific = async (graphSDK_: any, config_id_: string) => {
//   const {
//     data: { entities },
//   } = await graphSDK_().getGameTracker({ config_id: config_id_ })
  
//   console.log("\n\n\n entity counter")
//   console.log(entities)

//   const {allKeys, gameModels} = getDataFormatted(entities, "GameTracker")

//   console.log(allKeys)
//   console.log(gameModels)
//   console.log("\n\n\n")

//   return {allKeys, gameModels};
// }


//#endregion

//#region OUTPOST DATABASE RELATED CALLS

export const getOutpostEntitySpecific = async (graphSDK_: any, game_id: string, entity_id: string): Promise<DataFormatted[]> => {
  const {
    data: { entities },
  } = await graphSDK_().getOutpostEntity({ game_id: game_id, entity_id: entity_id })

  const {allKeys: allKeysOutpost, gameModels: gameModelsOutpost} = getDataFormatted(entities, "Outpost")
  const {allKeys: allKeysRev, gameModels: gameModelsRev} = getDataFormatted(entities, "Revenant")

  return [{allKeys:allKeysOutpost,gameModels: gameModelsOutpost},{allKeys: allKeysRev, gameModels: gameModelsRev}]
}

export const getFullOutpostGameData = async (graphSDK_: any, game_id: string) => {
   
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