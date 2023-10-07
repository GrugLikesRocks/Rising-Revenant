import { useEntityQuery } from "@latticexyz/react";
import {
  EntityIndex,
  Has,
  getComponentValue,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { PhaserLayer } from "../../phaser";
// import "../styles/MainPageStyle.css";

import { useEffect, useState } from "react";

import "../styles/EventFeedStyles.css"

import {
  EVENT_PHASE_BLOCK_COUNT,
  GAME_CONFIG,
  PREPARATION_PHASE_BLOCK_COUNT,
} from "../../phaser/constants";
import { ClickWrapper } from "../clickWrapper";
import { getEntityIdFromKeys } from "../../dojo/createSystemCalls";
import { set } from "mobx";
import { bigIntToHexAndAscii } from "../../utils";

type Props = {
  layer: PhaserLayer;
  timerPassed: boolean;
};

export const EventFeed = ({ layer, timerPassed }: Props) => {
  
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(1);
  const [eventEffectedOnlyOutposts, setEventEffectedOnlyOutposts] = useState<EntityIndex[]>([]);
  
  const {
    networkLayer: {
      components: { WorldEvent, ClientGameData, Game, Outpost, GameEntityCounter, ClientOutpostData },
    },
  } = layer;

  const outpostEntities = useEntityQuery([Has(Outpost)]);
  const worldEventEntities = useEntityQuery([Has(WorldEvent)]);

  useEffect (() => {
    
    if (worldEventEntities.length === 0){ return;}

    if (selectedEventIndex >= worldEventEntities.length)
    {
      setSelectedEventIndex(worldEventEntities.length - 1);
      return;
    }
    else if (selectedEventIndex < 0)
    {
      setSelectedEventIndex(0);
      return;
    }

    let newIndex = selectedEventIndex + 1;

    console.log("this is event index: " + newIndex + " and this is the length: " + worldEventEntities.length + " and this is the array: " + worldEventEntities);

    let game_id = getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_id as EntityIndex;

    let worldEvent = getComponentValueStrict(WorldEvent, getEntityIdFromKeys([BigInt(game_id), BigInt(newIndex)]));

    setEventEffectedOnlyOutposts(outpostEntities.filter((entity) => {
      const outpost = getComponentValueStrict(Outpost, entity);
      return (Math.sqrt(Math.pow(outpost.x - worldEvent.x, 2) + Math.pow(outpost.y - worldEvent.y, 2)) <= worldEvent.radius);
    }));

  }, [selectedEventIndex]);



  // useEffect (() => {
    
  //   setSelectedEventIndex(worldEventEntities.length - 1);

  // }, [worldEventEntities]);


  let eventDataContent = <div></div>;
  let outpostDataContent = <div></div>;

  if (!timerPassed) {
    return null;
  }

  let gamePhase = getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_state;

  if (gamePhase === 1)   // preparation phase
  {
    eventDataContent = (
      <div className="event-feed-event-data-container">
        <div className="event-feed-event-data-text">  Preparation Phase ends in {(PREPARATION_PHASE_BLOCK_COUNT + getComponentValueStrict(Game, getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_id as EntityIndex).start_block_number) - getComponentValueStrict(ClientGameData, GAME_CONFIG).current_block_number} block/s</div>
      </div>
    )
  }
  else if (gamePhase === 2) {

    if (worldEventEntities.length === 0)
    {
      eventDataContent = (
        <div className="event-feed-event-data-container">
          <div className="event-feed-event-data-text">no event detected in this game</div>
        </div>
      )
    }
    else
    {

      let game_id = getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_id as EntityIndex;

      let event_id = getComponentValueStrict(GameEntityCounter, game_id).event_count as EntityIndex;

      let worldEvent = getComponentValueStrict(WorldEvent, getEntityIdFromKeys([BigInt(game_id), BigInt(event_id)]));

      eventDataContent = (
        <div className="event-feed-event-data-container">
          <div className="event-feed-event-data-text font-size-texts">  Current event at position: {worldEvent.x}, {worldEvent.y} with radius {worldEvent.radius}</div>
          <div className="event-feed-event-data-button-container">
            <div className="event-feed-event-data-button font-size-texts" onClick={() => {setSelectedEventIndex(selectedEventIndex - 1)}}>prev event</div>
            <div className="event-feed-event-data-button font-size-texts" onClick={() => {setSelectedEventIndex(selectedEventIndex + 1)}}>next event</div>
          </div>
        </div>
      )

      if (eventEffectedOnlyOutposts.length === 0 )
      {

      }
      else
      {
        outpostDataContent = (
          <div className="event-feed-outpost-data-container">
            <div className="event-feed-outpost-data-title font-size-texts">Outposts affected by event</div>
            <div className="event-feed-outpost-data-list-container">
              {eventEffectedOnlyOutposts.map((outpost, index) => (
                <div key={index} className="event-feed-outpost-data-list-element font-size-texts">
                  Outpost Id: {getComponentValueStrict(ClientOutpostData, outpost).id}, 
                  x: {getComponentValueStrict(Outpost, outpost).x} y: {getComponentValueStrict(Outpost, outpost).y}</div>
              ))}
            </div>
          </div>
        )
      }
    }

  }
  else {
    return null;
  }


  return (
   
    <ClickWrapper className="event-feed-main-container">
      <div className="event-feed-title font-size-titles">Event Feed</div>

      {eventDataContent}

      <div className="event-feed-divider"></div>

      {outpostDataContent}
    </ClickWrapper>
  );
};
