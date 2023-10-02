import { useEntityQuery } from "@latticexyz/react";
import {
  EntityIndex,
  Has,
  getComponentValue,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { PhaserLayer } from "../../phaser";
import "../styles/MainPageStyle.css";
import {
  GAME_CONFIG,
  PREPARATION_PHASE_BLOCK_COUNT,
} from "../../phaser/constants";
import { ClickWrapper } from "../clickWrapper";
import { useEffect, useState } from "react";
import { getEntityIdFromKeys } from "../../dojo/createSystemCalls";

type Props = {
  layer: PhaserLayer;
  timerPassed: boolean;
};

export const EventList = ({ layer, timerPassed }: Props) => {
  const {
    networkLayer: {
      components: { WorldEvent, ClientGameData, Game, GameTracker, Revenant, Outpost, GameEntityCounter },
    },
  } = layer;

  const [gamePhaseValue, setGamePhaseValue] = useState(99);

  const [totalNumberOutposts, setTotalNumberOutposts] = useState(0);
  const [currentTotalNumberOfRevenants, setCurrentTotalNumberOfRevenants] = useState(0);

  const [blocksLeft, setBlocksLeft] = useState(0);

  const [newBlocksLeft, setNewBlocksLeft] = useState(0);
  const [newTotalNumberOfRevenants, setNewNumberOfRevenants] = useState(0);

  const revenantEntities = useEntityQuery([Has(Revenant)]);
  // const gameEntities = useEntityQuery([Has(ClientGameData)]);
  const entitiesQuery = useEntityQuery([Has(WorldEvent)]);



  useEffect(() => {

    let gameClientData = getComponentValue(ClientGameData, GAME_CONFIG);

    if (gameClientData === undefined) {
      return;
    }

    setGamePhaseValue(gameClientData.current_game_state);

    if (gamePhaseValue === 1) {
      setNewNumberOfRevenants(revenantEntities.length);
      setTotalNumberOutposts(40);

    }
    else if (gamePhaseValue === 2) {

      setTotalNumberOutposts(revenantEntities.length);
      const currentTotalNumberOfRevenants = revenantEntities.filter(item => getComponentValueStrict(Outpost, item).lifes >= 0).length;
      setNewNumberOfRevenants(currentTotalNumberOfRevenants);

    }


  }, [revenantEntities,timerPassed]);



  useEffect(() => {

    const performActionWithRetry = async () => {

      let actionSucceeded = false;  //set the action to false
      while (!actionSucceeded) {  // while the actiion is no completed

        let gameClientData = getComponentValue(ClientGameData, GAME_CONFIG);

        if (gameClientData === undefined) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          continue;
        }

        setGamePhaseValue(gameClientData.current_game_state);

        if (gamePhaseValue === 1) {
          setNewBlocksLeft(Math.abs(
            Number(gameClientData.current_block_number) -
            (Number(getComponentValue(Game, gameClientData.current_game_id as EntityIndex)?.start_block_number || 0) + PREPARATION_PHASE_BLOCK_COUNT)
          ));
        }
        else if (gamePhaseValue === 2) {

          const worldEventKey = getEntityIdFromKeys([BigInt(gameClientData.current_game_id),
          BigInt(getComponentValueStrict(GameEntityCounter, gameClientData.current_game_id as EntityIndex).event_count)]);

          setNewBlocksLeft(Math.abs(
            Number(gameClientData.current_block_number) -
            (Number(getComponentValueStrict(WorldEvent, worldEventKey).block_number + PREPARATION_PHASE_BLOCK_COUNT)
            )));
        }
        await new Promise((resolve) => setTimeout(resolve, 5000)); 

      }
    };

    performActionWithRetry();

  }, [timerPassed]);

  useEffect(() => {
    if (newBlocksLeft > blocksLeft) {

      document.querySelector(".main-menu-event-feed-live-data-elements.blocks-left")?.classList.add("flash-green");
      setTimeout(() => {
        document.querySelector(".main-menu-event-feed-live-data-elements.blocks-left")?.classList.remove("flash-green");
      }, 2000);

    } else if (newBlocksLeft < blocksLeft) {

      document.querySelector(".main-menu-event-feed-live-data-elements.blocks-left")?.classList.add("flash-red");
      setTimeout(() => {
        document.querySelector(".main-menu-event-feed-live-data-elements.blocks-left")?.classList.remove("flash-red");
      }, 2000);

    }

    if (newTotalNumberOfRevenants > currentTotalNumberOfRevenants) {
      document.querySelector(".main-menu-event-feed-live-data-elements.minted-revenants")?.classList.add("flash-green");
      setTimeout(() => {
        document.querySelector(".main-menu-event-feed-live-data-elements.minted-revenants")?.classList.remove("flash-green");
      }, 2000);

    } else if (newTotalNumberOfRevenants < currentTotalNumberOfRevenants) {
      document.querySelector(".main-menu-event-feed-live-data-elements.minted-revenants")?.classList.add("flash-red");
      setTimeout(() => {
        document.querySelector(".main-menu-event-feed-live-data-elements.minted-revenants")?.classList.remove("flash-red");
      }, 2000);

    }

    setCurrentTotalNumberOfRevenants(newTotalNumberOfRevenants);
    setBlocksLeft(newBlocksLeft);

  }, [newBlocksLeft, newTotalNumberOfRevenants]);



  //console.log("this si the rev entities length ", revenantEntities.length);

  // this needs the clickwrapper
  let listContent: JSX.Element = <div></div>;
  let liveDataContent: JSX.Element = <div></div>;

  if (gamePhaseValue === 1)   // preparation phase
  {

    listContent = (
      <ClickWrapper className="main-menu-event-feed-list">
        <div className="main-menu-event-feed-list-element">GAME WILL START IN {blocksLeft} BLOCKS</div>
      </ClickWrapper>
    )

    liveDataContent = (
      <div className="main-menu-event-feed-live-data-container">
        <div className="main-menu-event-feed-live-data-elements minted-revenants"> minted revenants {currentTotalNumberOfRevenants} out of {totalNumberOutposts}</div>
        <div className="main-menu-event-feed-live-data-elements blocks-left"> blocks left {blocksLeft} </div>
      </div>
    )

  }
  else if (gamePhaseValue === 2) {

    listContent = (
      <ClickWrapper className="main-menu-event-feed-list">

        {entitiesQuery.length === 0 && <div className="main-menu-event-feed-list-element">no events yet</div>}

        {entitiesQuery.map((item, index) => {
          const worldEvent = getComponentValueStrict(WorldEvent, item);
          return (
            <div className="main-menu-event-feed-list-element" key={index}>
              Event at x:{worldEvent.x} y:{worldEvent.y}, radius: {worldEvent.radius}
            </div>
          );
        })}
      </ClickWrapper>
    );

    liveDataContent = (
      <div className="main-menu-event-feed-live-data-container">
        <div className="main-menu-event-feed-live-data-elements minted-revenants"> {currentTotalNumberOfRevenants} out of {totalNumberOutposts} revenants left alive </div>
        <div className="main-menu-event-feed-live-data-elements blocks-left"> new event in {blocksLeft} blocks</div>
        <div className="main-menu-event-feed-live-data-elements"> lords bag: 99999</div>

      </div>
    )
  }
  else {
    return null;
  }



  return (
    <div
      className={`main-menu-list-container ${timerPassed ? "opaque-on" : "opaque-off"}`}
    >
      <div className="main-menu-event-list-title">event feed</div>
      {listContent}
      <div className="main-menu-event-feed-divider"></div>
      {liveDataContent}
    </div>
  );
};
