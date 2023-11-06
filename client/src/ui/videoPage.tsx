import React, { useEffect, useState } from "react";
import { useDojo } from "../hooks/useDojo";
import { CreateGameProps, CreateRevenantProps } from "../dojo/types";
import { ClickWrapper } from "./clickWrapper";
import { getGameEntitiesSpecific, getOutpostEntitySpecific } from "../dojo/testCalls";

import { Component, Entity, Metadata, Schema, setComponent } from '@latticexyz/recs';


import { uuid } from "@latticexyz/utils";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { getGameTrackerEntity } from "../dojo/testQueries";
import { addPrefix0x } from "../utils";

export const VideoComponent = ({
  onLoadingComplete,
}: {
  onLoadingComplete: () => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [showVid, setShowVid] = useState(true);

  // const {
  //   account: { account },
  //   networkLayer: {
  //     systemCalls: { create_game, create_revenant },
  //     network : { graphSdk }
  //   }
  // } = useDojo();

  // const createGame = () => {
  //   const createGameProps: CreateGameProps =
  //   {
  //     account: account,
  //     preparation_phase_interval: 30,
  //     event_interval: 30,
  //     erc_addr: account.address
  //   }

  //   create_game(createGameProps);
  // };


  // const summonRev = () => {
  //   const createRevProps: CreateRevenantProps =
  //   {
  //     account: account,
  //     game_id: 1,
  //     name: "Revenant",
  //   }

  //   create_revenant(createRevProps);
  // };

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
              const func = async () => {  const num = await getGameTrackerEntity();
                console.log(num);
              }

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
      systemCalls : { create_game, create_revenant },
      components: { Game, GameEntityCounter, GameTracker },
      network: { graphSdk },
    },
  } = useDojo();


  const createGame = async () => {
    const createGameProps: CreateGameProps =
    {
      account: account,
      preparation_phase_interval: 30,
      event_interval: 30,
      erc_addr: account.address
    }

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

    const fetchTheCurrentGame = async () => {
      
      let gameCount: any = await getGameTrackerEntity();

      if (gameCount === 0 || gameCount === undefined) 
      {
          // this is where we would create the game
          console.log("creating game");
          await createGame();
          gameCount = 1;
      }
     
      const gameTrackerId = uuid()
          const gameTrackerKey = getEntityIdFromKeys([BigInt(1)])

          GameTracker.addOverride(gameTrackerId, {
            entity: gameTrackerKey,
            value: {
              count: gameCount,
            }
          })

      GameTracker.removeOverride(gameTrackerId);

      //////////////////////////////////////////////////////////////////////////////////////////////////

      const {allKeys: allKeysG, gameModels: gameModelsG, allKeysCounter: allKeysGEC, gameModelsCounter: gameModelsGEC} = await getGameEntitiesSpecific(graphSdk, addPrefix0x(gameCount));

      const gameId = uuid()
      const gameKey = getEntityIdFromKeys([BigInt(gameCount)])

      Game.addOverride(gameId, {
        entity: gameKey,
        value: {
          start_block_number: gameModelsG[0],
          prize: gameModelsG[1],
          preparation_phase_interval: gameModelsG[2],
          event_interval: gameModelsG[3],
          erc_addr: gameModelsG[4],
          status: gameModelsG[5],
        }
      })

      Game.removeOverride(gameId);

      //////////////////////////////////////////////////////////////////////////////////////////////////

      const gameEntityCounterId = uuid()
      const gameEntitycounterKey = getEntityIdFromKeys([BigInt(gameCount)])

      GameEntityCounter.addOverride(gameEntityCounterId, {
        entity: gameEntitycounterKey,
        value: {
          revenant_count: gameModelsGEC[0],
          outpost_count: gameModelsGEC[1],
          event_count: gameModelsGEC[2],
          outpost_exists_count: gameModelsGEC[3],
        }
      })

      GameEntityCounter.removeOverride(gameEntityCounterId);

      console.log("this is the loading data")
      console.log("the number of games on chain right now is: " + gameCount);
      console.log("this is the data for the game it self")
      console.log(gameModelsG);
      console.log("this is the data for the game entity counter")
      console.log(gameModelsGEC);

      return addPrefix0x(gameCount);
    };

    const fetchTheRevenant = async (game_id: string) => {

      const entity = await getOutpostEntitySpecific(graphSdk, game_id, "0x1");
      // console.log("\n\n\nThios is for the revenant");
      // console.log(entity);

      setLoading(false);
    };


    const orderOfOperations = async () => {
      await preloadImages();
      const game_id = await fetchTheCurrentGame();
      await fetchTheRevenant(game_id);
    }

    console.log("preloading images");
    orderOfOperations();

  }, []);


  return (
    <></>
  )
}

