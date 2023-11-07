import React, { useState } from "react";

import { useEntityQuery } from "@latticexyz/react";

import "./PagesStyles/DebugPageStyles.css";

import { MenuState } from "../Pages/mainMenuContainer";
import { ClickWrapper } from "../clickWrapper";

import { useDojo } from "../../hooks/useDojo";

import { CreateRevenantProps } from "../../dojo/types";

import {
  EntityIndex,
  Has,
  getComponentValue,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { createSystemCalls } from "../../dojo/createSystemCalls";
import { GAME_CONFIG } from "../../phaser/constants";
import { getGameTrackerEntity } from "../../dojo/testQueries";
import { getFullOutpostGameData, getGameEntitiesSpecific, getOutpostEntitySpecific } from "../../dojo/testCalls";
import { addPrefix0x } from "../../utils";
import { getEntityIdFromKeys } from "@dojoengine/utils";

interface DebugPageProps {
  setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

export const DebugPage: React.FC<DebugPageProps> = ({ setMenuState }) => {
  const {
    account: { account },
    networkLayer: {
      network: { contractComponents, clientComponents,graphSdk },
      systemCalls: { create_game, create_revenant },

    },
  } = useDojo();

  const summonRev = async () => {
    const gameTrackerComp = getComponentValueStrict(
      contractComponents.GameTracker,
      getEntityIdFromKeys([BigInt(GAME_CONFIG)])
    );
    const game_id: number = gameTrackerComp.count;

    const gameEntityCounter = getComponentValueStrict(
      contractComponents.GameEntityCounter,
      getEntityIdFromKeys([BigInt(game_id)])
    );
    const rev_counter: number = gameEntityCounter.outpost_count;

    const createRevProps: CreateRevenantProps = {
      account: account,
      game_id: game_id,
      name: "Revenant " + rev_counter,
    };

    await create_revenant(createRevProps);
  };

  const queryAllRevenantData = async () => {
    const gameTrackerComp = getComponentValueStrict(
      contractComponents.GameTracker,
      getEntityIdFromKeys([BigInt(GAME_CONFIG)])
    );

    const game_id: number = gameTrackerComp.count;

    await getFullOutpostGameData(graphSdk, addPrefix0x(gameTrackerComp.count));
    // console.log("entity", entity);



  }
      
  const closePage = () => {
    setMenuState(MenuState.NONE);
  };

  const outpostArray = useEntityQuery([Has(contractComponents.Outpost)]);
  const revenantArray = useEntityQuery([Has(contractComponents.Revenant)]);


  //#region  Game Data Debug
  const gameTrackerArray = useEntityQuery([Has(contractComponents.GameTracker)]);
  const gameArray = useEntityQuery([Has(contractComponents.GameEntityCounter)]);
  const gameEntityCounterArray = useEntityQuery([Has(contractComponents.Game)]);

  const printEntitiesofGamedata = () => {
    console.log(gameArray[0]);
    console.log(gameEntityCounterArray[0]);
    console.log(gameTrackerArray[0]);

    let comp = getComponentValueStrict(contractComponents.Game, gameArray[0]);
    console.log("game entity", comp);
    comp = getComponentValueStrict(contractComponents.GameEntityCounter, gameEntityCounterArray[0]);
    console.log("game entity counter", comp);
    comp = getComponentValueStrict(contractComponents.GameTracker, gameTrackerArray[0]);
    console.log("game tracker", comp);
  }

  const queryCheckGameData = async () => {
    const game_count:any = await getGameTrackerEntity();
    console.log("game count", game_count);

    const data = await getGameEntitiesSpecific(graphSdk, addPrefix0x(game_count));
    console.log("game entity data", data);
    
    console.log("\n\n");
    printEntitiesofGamedata();
    console.log("\n\n\n\n");
  }  

  //#endregion

  

  //#region  Client Data Debug
  const clientClickArray = useEntityQuery([Has(clientComponents.ClientClickPosition)]);
  const clientGameArray = useEntityQuery([Has(clientComponents.ClientGameData)]);
  const clientCameraArray = useEntityQuery([Has(clientComponents.ClientCameraPosition)]);
  const clientOutpostArray = useEntityQuery([Has(clientComponents.ClientOutpostData)]);

  const printEntitiesOfClientdata = () => {
    console.log(clientClickArray[0]);
    console.log(clientGameArray[0]);
    console.log(clientCameraArray[0]);

    let comp = getComponentValueStrict(clientComponents.ClientGameData, clientGameArray[0]);
    console.log("client game entity", comp);
    comp = getComponentValueStrict(clientComponents.ClientClickPosition, clientClickArray[0]);
    console.log("click entity counter", comp);
    comp = getComponentValueStrict(clientComponents.ClientCameraPosition, clientCameraArray[0]);
    console.log("camera tracker", comp);
    console.log("\n\nstart of array of client outpost Data")
    for (let index = 0; index < clientOutpostArray.length; index++) {
      const element = clientOutpostArray[index];
      getComponentValueStrict(clientComponents.ClientOutpostData, element);
      console.log("outpost client data", element);
    } 

    console.log("\nend of array of client outpost Data\n\n")
  }


  //#endregion 
  return (
    <ClickWrapper className="revenant-jurnal-page-container">
      <h1 style={{ color: "white" }}>Debug Menu</h1>
      <div className="buttons-holder">

        <div className="data-container">
          <div className="button-style-debug">This is a button</div>
          <div className="content-holder">
            <h3>The current address is {account.address}</h3>
          </div>
        </div>

        <div className="data-container">
          <div className="button-style-debug" onMouseDown={() => {summonRev()}}>Create a new revenant</div>
          <div className="content-holder">
            <h3>There are currently {outpostArray.length} outposts</h3>
            <button onMouseDown={() => {queryAllRevenantData()}}>Fetch all Data</button>
          </div>
        </div>

        <div className="data-container">
          <div className="button-style-debug" onMouseDown={() => {queryCheckGameData()}}>Query Check everthing</div>
          <div className="content-holder">
            <h3>There are currently {gameArray.length} games (1)</h3>
            <h3>There are currently {gameTrackerArray.length} game tracker (1)</h3>
            <h3>There are currently {gameEntityCounterArray.length} game entity counter (1)</h3>
            <h3>Current Game id is {getComponentValueStrict(clientComponents.ClientGameData, addPrefix0x(GAME_CONFIG)).current_game_id} and should be {getComponentValueStrict(contractComponents.GameTracker, addPrefix0x(GAME_CONFIG)).count}</h3>
          </div>
        </div>

        <div className="data-container">
          <div className="button-style-debug" onMouseDown={() => {printEntitiesOfClientdata()}}>Query Check everthing</div>
          <div className="content-holder">
            <h3>There are currently {clientCameraArray.length} camera entity (1) </h3>
            <h3>There are currently {clientClickArray.length} click entity (1) </h3>
            <h3>There are currently {clientGameArray.length} client game (1) </h3>
            <h3>There are currently {clientOutpostArray.length} client outpost data  (~{getComponentValueStrict(contractComponents.GameEntityCounter, addPrefix0x(getComponentValueStrict(clientComponents.ClientGameData,  addPrefix0x(GAME_CONFIG)).current_game_id)).outpost_count})</h3>
          </div>
        </div>

      </div>
    </ClickWrapper>
  );
};
