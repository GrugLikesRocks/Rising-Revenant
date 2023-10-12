import { useEntityQuery } from "@latticexyz/react";
import {
  EntityIndex,
  Has,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { PhaserLayer } from "../../phaser";

import { useEffect, useState } from "react";

import "../styles/componentsStyle/EventFeedStyles.css";

import {
  GAME_CONFIG,
  PREPARATION_PHASE_BLOCK_COUNT,
} from "../../phaser/constants";
import { ClickWrapper } from "../clickWrapper";
import { getEntityIdFromKeys } from "../../dojo/createSystemCalls";

type Props = {
  layer: PhaserLayer;
  timerPassed: boolean;
};

export const EventFeed = ({ layer, timerPassed }: Props) => {

  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);
  const [eventEffectedOnlyOutposts, setEventEffectedOnlyOutposts] = useState<EntityIndex[]>([]);

  const {
    networkLayer: {
      components: { WorldEvent, ClientGameData, Game, Outpost, GameEntityCounter, ClientOutpostData },
    },
  } = layer;

  const outpostEntities = useEntityQuery([Has(Outpost)]);
  const worldEventEntities = useEntityQuery([Has(WorldEvent)]);

  useEffect(() => {

    // console.log("this is the select index thing")

    if (worldEventEntities.length === 0) { return; }

    if (selectedEventIndex >= worldEventEntities.length) {
      setSelectedEventIndex(worldEventEntities.length - 1);
      return;
    }
    else if (selectedEventIndex < 0) {
      setSelectedEventIndex(0);
      return;
    }

    let newIndex = selectedEventIndex + 1;

    let game_id = getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_id as EntityIndex;

    let worldEvent = getComponentValueStrict(WorldEvent, getEntityIdFromKeys([BigInt(game_id), BigInt(newIndex)]));


    // console.log(newIndex)
    // console.log(worldEvent);
    // console.log(worldEventEntities)

    setEventEffectedOnlyOutposts(outpostEntities.filter((entity) => {
      const outpost = getComponentValueStrict(Outpost, entity);
      return (Math.sqrt(Math.pow(outpost.x - worldEvent.x, 2) + Math.pow(outpost.y - worldEvent.y, 2)) <= worldEvent.radius);
    }));

  }, [selectedEventIndex, worldEventEntities]);


  // useEffect(() => { console.log("this is in the outpstt eneitty") }, [outpostEntities]);

  useEffect(() => { 

    if (worldEventEntities.length === 0) { return; }

    let game_id = getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_id as EntityIndex;

    let event_count = getComponentValueStrict(GameEntityCounter, game_id).event_count as EntityIndex;
  
    setSelectedEventIndex(event_count - 1);

  }, [worldEventEntities]);



  // console.log(selectedEventIndex);

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
        <div className="event-feed-event-data-text">Preparation Phase ends in {(PREPARATION_PHASE_BLOCK_COUNT + getComponentValueStrict(Game, getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_id as EntityIndex).start_block_number) - getComponentValueStrict(ClientGameData, GAME_CONFIG).current_block_number} block/s</div>
      </div>
    )
  }
  else if (gamePhase === 2) {

    if (worldEventEntities.length === 0) {
      eventDataContent = (
        <div className="event-feed-event-data-container">
          <div className="event-feed-event-data-text">No event history detected in this game</div>
        </div>
      )
    }
    else {

      let game_id = getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_id as EntityIndex;

      let event_count = getComponentValueStrict(GameEntityCounter, game_id).event_count as EntityIndex;

      let worldEvent = getComponentValueStrict(WorldEvent, getEntityIdFromKeys([BigInt(game_id), BigInt(selectedEventIndex + 1)]));

      eventDataContent = (
        <div className="event-feed-event-data-container">

          {event_count === selectedEventIndex + 1 ? (
            <div className="event-feed-event-data-text font-size-texts">Most recent event at position: {worldEvent.x}, {worldEvent.y} with radius {worldEvent.radius}</div>
          ) : (
            <div className="event-feed-event-data-text font-size-texts">Old event at position: {worldEvent.x}, {worldEvent.y} with radius {worldEvent.radius}</div>
          )}
          
          <div className="event-feed-event-data-button-container">
            {
              worldEventEntities.length > 1 && (
                <>
                  {selectedEventIndex - 1 >= 0 && (<div className="event-feed-event-data-button standard-orange-color-palette font-size-texts" onClick={() => { setSelectedEventIndex(selectedEventIndex - 1) }}>Previous event</div>)}
                  {selectedEventIndex + 1 < event_count && (<div className="event-feed-event-data-button standard-orange-color-palette font-size-texts" onClick={() => { setSelectedEventIndex(selectedEventIndex + 1) }}>Next event</div>)}
                </>
              )
            }
          </div>
        </div>
      )

      if (eventEffectedOnlyOutposts.length === 0) {

      }
      else {
        outpostDataContent = (
          <div className="event-feed-outpost-data-container">
            <div className="event-feed-outpost-data-title font-size-texts">All outposts affected by event</div>
            <div className="event-feed-outpost-data-list-container standard-orange-color-palette">
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
