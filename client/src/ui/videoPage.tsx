import React, { useEffect, useState } from "react";
import { useDojo } from "../hooks/useDojo";
import { CreateGameProps, CreateRevenantProps } from "../dojo/types";
import { ClickWrapper } from "./clickWrapper";
import { getGameEntitySpecific, getOutpostEntitySpecific } from "../dojo/testCalls";

export const VideoComponent = ({
  onLoadingComplete,
}: {
  onLoadingComplete: () => void;
}) => {
  const [loading, setLoading] = useState(true);
  const [showVid, setShowVid] = useState(true);

  const {
    account: { account },
    networkLayer: {
      systemCalls: { create_game, create_revenant },
    }
  } = useDojo();

  const createGame = () => {
    const createGameProps: CreateGameProps = 
    {
        account: account,
        preparation_phase_interval: 30,
        event_interval: 30,
        erc_addr: account.address
    }

    create_game(createGameProps);
  };


  const summonRev = () => {
    const createRevProps: CreateRevenantProps = 
    {
        account: account,
        game_id: 1,
        name: "Revenant",
    }

    create_revenant(createRevProps);
  };

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
              createGame();
            }}
          >
            Create game
          </button>
          <button
            
            onMouseDown={() => {
              setShowVid(false);
            }}
          >
            skip video 
          </button>
          <button
            
            onMouseDown={() => {
              summonRev();
            }}
          >
            summon Rev
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
    networkLayer: {
      network: { graphSdk},
    },
  } = useDojo();

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

      await new Promise((resolve) => setTimeout(resolve, 10000)); 

    };

    const fetchTheCurrentGame = async () => {

      // const {
      //   data: { entities },
      // } = await graphSdk().getEntities();

      // console.log(entities);
    
      
      const entities= await getGameEntitySpecific(graphSdk, "0x1");

      console.log(entities);
    };

    const fetchTheRevenant = async () => {

      const entity = await getOutpostEntitySpecific(graphSdk, "0x1", "0x1");
      console.log("revenant");
      console.log(entity);
      
      setLoading(false);
    };

  
    const orderOfOperations = async () => {
      await preloadImages();
      await fetchTheCurrentGame();
      await fetchTheRevenant();
    }

    console.log("preloading images");
    orderOfOperations();

  }, []);


  return (
    <></>
  )
}

