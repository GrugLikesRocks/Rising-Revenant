import React, { useEffect, useState } from "react";
import { useDojo } from "../hooks/useDojo";
import { CreateGameProps, CreateRevenantProps } from "../dojo/types";
import { ClickWrapper } from "./clickWrapper";
import {
  createComponentStructure,
  getFullOutpostGameData,
  getGameEntitiesSpecific,
  getOutpostEntitySpecific,
} from "../dojo/testCalls";

import {
  EntityIndex,
  Component,
  Entity,
  Metadata,
  Schema,
  setComponent,
} from "@latticexyz/recs";

import { uuid } from "@latticexyz/utils";
import { ComponentValue } from "@latticexyz/recs/lib/types";
import { getEntityIdFromKeys, setComponentFromGraphQLEntity } from "@dojoengine/utils";
import { getGameTrackerEntity } from "../dojo/testQueries";
import {  decimalToHexadecimal } from "../utils";


import { GameEntityCounter } from "../generated/graphql";
import { MAP_HEIGHT, MAP_WIDTH } from "../phaser/constants";

export const VideoComponent = ({
  onLoadingComplete,
}: {
  onLoadingComplete: () => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [showVid, setShowVid] = useState(true);

  useEffect(() => {
    if (loading === false && showVid === false) {
      onLoadingComplete();
    }
  }, [showVid, loading]);

  return (
    <ClickWrapper>
      <LoadingComponent setLoading={setLoading} />
      {showVid ? (
        <div
          style={{
            backgroundColor: "red",
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        >
          <button
            onMouseDown={() => {
              setShowVid(false);
            }}
          >
            skip video
          </button>

          <button
            onMouseDown={() => {
              const func = async () => {
                const num = await getGameTrackerEntity();
                console.log(num);
              };

              func();
            }}
          >
            get game Tracker
          </button>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "blue",
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        >
          <h1 style={{ position: "absolute", top: "50%", left: "50%" }}>
            Loading
          </h1>
        </div>
      )}
    </ClickWrapper>
  );
};

const LoadingComponent = ({
  setLoading,
}: {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    account: { account },
    networkLayer: {
      systemCalls: { create_game, create_revenant },
      network: { graphSdk, contractComponents, clientComponents },
    },
  } = useDojo();

  const createGame = async () => {
    const createGameProps: CreateGameProps = {
      account: account,
      preparation_phase_interval: 30,
      event_interval: 30,
      erc_addr: account.address,
    };

    await create_game(createGameProps);
  };

  useEffect(() => {
    setLoading(true);

    const preloadImages = async () => {
      const imageUrls = [
        "Page_Bg/SETTINGS_PAGE_BG.png",
        "Page_Bg/STATS_PAGE_BG.png",
        "Page_Bg/PROFILE_PAGE_BG.png",
        "map_Island.png",
      ];

      const imagePromises = imageUrls.map((url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });
      });

      await Promise.all(imagePromises);

      await new Promise((resolve) => setTimeout(resolve, 5000));
    };


    const createClientComponent = async (game_id: number) => {

      const componentSchemaClientCamera = {
        "x": MAP_WIDTH / 2,
        "y": MAP_HEIGHT / 2,
      };

      let keys = ["0x1"];
      let componentName = "ClientCameraPosition";

      let craftedEdgeGT = createComponentStructure(componentSchemaClientCamera, keys, componentName);

      console.log(craftedEdgeGT)
      setComponentFromGraphQLEntity(clientComponents, craftedEdgeGT)

      const componentSchemaClientClick = {
        "xFromOrigin": 0,
        "yFromOrigin": 0,

        "xFromMiddle": 0,
        "yFromMiddle": 0,
      };

      keys = ["0x1"];
      componentName = "ClientClickPosition";

      craftedEdgeGT = createComponentStructure(componentSchemaClientClick, keys, componentName);
      setComponentFromGraphQLEntity(clientComponents, craftedEdgeGT)


      //should pro be an enum but 1 is perp and 2 is game
      const componentSchemaClientGameData = {
        "current_game_state": 1,
        "user_account_address": account.address,
        "current_game_id": game_id,
        "current_block_number": 50,
      };

      keys = ["0x1"];
      componentName = "ClientGameData";

      craftedEdgeGT = createComponentStructure(componentSchemaClientGameData, keys, componentName);
      setComponentFromGraphQLEntity(clientComponents, craftedEdgeGT);
    }


    const fetchTheCurrentGame = async () => {
      let last_game_id: any = await getGameTrackerEntity();

      if (last_game_id === 0 || last_game_id === undefined) {
        console.log("creating game");
        await createGame();

        
        await new Promise((resolve) => setTimeout(resolve, 5000));
        last_game_id = 1;
      }

      const componentSchema = {
        "entity_id": 1,
        "count": last_game_id,
      };

      const keys = ["0x1"];
      const componentName = "GameTracker";

      const craftedEdgeGT = createComponentStructure(componentSchema, keys, componentName);
      setComponentFromGraphQLEntity(contractComponents, craftedEdgeGT);

      const entityEdge: any = await getGameEntitiesSpecific(graphSdk, decimalToHexadecimal(last_game_id));

      setComponentFromGraphQLEntity(contractComponents, entityEdge);

      await createClientComponent(last_game_id);

      return {
        hexLastGameId: decimalToHexadecimal(last_game_id),
        revenantCount: entityEdge.node.models[1].revenant_count
      };
      
    };

    const fetchTheRevenant = async (game_id: string, rev_amount: number) => {
      // const entity = await getOutpostEntitySpecific(graphSdk, game_id, "0x1");
      const data = await getFullOutpostGameData(graphSdk, game_id, rev_amount);
      
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        setComponentFromGraphQLEntity(contractComponents, element);

        const owner = element.node.models[1].owner;
        let owned = false;
        
        if (owner === account.address) { owned = true;}
        
        const componentSchemaClientOutpostData = {
          "id": 1,
          "owned": owned,
          "event_effected": false,
          "selected": false,
          "visible": false
        };
  
        const keys = ["0x1", decimalToHexadecimal(index + 1)];
        const componentName = "ClientOutpostData";
  
        const craftedEdgeCOD = createComponentStructure(componentSchemaClientOutpostData, keys, componentName);
        setComponentFromGraphQLEntity(clientComponents, craftedEdgeCOD);
      }
  

      setLoading(false);
    };

    const orderOfOperations = async () => {
      await preloadImages();
      const entity_data = await fetchTheCurrentGame();
      await fetchTheRevenant(entity_data.hexLastGameId, entity_data.revenantCount);
    };

    console.log("Loading data...");
    orderOfOperations();
  }, []);

  return <></>;
};
