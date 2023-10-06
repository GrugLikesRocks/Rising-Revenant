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
  EVENT_PHASE_BLOCK_COUNT,
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
      components: { WorldEvent, ClientGameData, Game, Revenant, Outpost, GameEntityCounter, ClientOutpostData },
    },
  } = layer;

  const outpostEntities = useEntityQuery([Has(Outpost)]);
  const worldEventEntities = useEntityQuery([Has(WorldEvent)]);


  const eventEffectedOnlyOutposts = outpostEntities.filter((entity) => {
    return getComponentValueStrict(
      ClientOutpostData,
      entity
    ).event_effected;
  });



  // this needs the clickwrapper
  let eventContent: JSX.Element = <div></div>;
  let liveDataContent: any = <div></div>;

  if (!timerPassed) {
    return null;
  }


  if (getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_state === 1)   // preparation phase
  {

    eventContent = (
      <div className="event-feed-worldevent-data-text">
        Preparation Phase ends in {(PREPARATION_PHASE_BLOCK_COUNT + getComponentValueStrict(Game, getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_id as EntityIndex).start_block_number) - getComponentValueStrict(ClientGameData, GAME_CONFIG).current_block_number} block/s
      </div>
    );
  }
  else if (getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_state === 2) {
    if (worldEventEntities.length === 0) {
      liveDataContent = <div></div>;
    }
    else {
      if (outpostEntities.length === 0) {
        liveDataContent = <div></div>;
      } else {
        liveDataContent = (

          <ClickWrapper className="event-feed-outpost-data-container">
            {eventEffectedOnlyOutposts.map((outpost, index) => (
              <div key={index} className="event-feed-outpost-data-element">{outpost}</div>
            ))}
          </ClickWrapper>
        );
      }

      let game_id = getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_id as EntityIndex;

      let event_id = getComponentValueStrict(GameEntityCounter, game_id).event_count as EntityIndex;

      let worldEvent = getComponentValueStrict(WorldEvent, getEntityIdFromKeys([BigInt(game_id), BigInt(event_id)]));

      eventContent = (
        <div className="event-feed-worldevent-data-text">
          Current event at position: {worldEvent.x}, {worldEvent.y} with radius {worldEvent.radius}
        </div>
      );
    }
  }
  else {
    return null;
  }


  return (
    <div className={`event-feed-main-container ${timerPassed ? "opaque-on" : "opaque-off"}`}>
      <div className="event-feed-title">event feed</div>
      {eventContent}
      <div className="event-feed-divider"></div>
      {liveDataContent}
    </div>
  );
};
