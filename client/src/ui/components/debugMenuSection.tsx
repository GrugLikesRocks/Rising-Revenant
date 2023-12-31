import { PhaserLayer } from "../../phaser";
import { useDojo } from "../../hooks/useDojo";

import "../../App.css";

import { ClickWrapper } from "../clickWrapper";
import { EntityIndex,getComponentValue,getComponentValueStrict, Has} from "@latticexyz/recs";
import { GAME_CONFIG } from "../../phaser/constants";

import {useEntityQuery} from "@latticexyz/react";

type ExampleComponentProps = {
  layer: PhaserLayer;
};

export const DebugMenuSection = ({ layer }: ExampleComponentProps) => {
  const {
    networkLayer: {
      components: {GameEntityCounter, GameTracker, ClientGameData},
    },
  } = layer;

  const {
    account: { account },
    networkLayer: {
      systemCalls: {
        create_game,
        set_world_event,
        create_revenant,

        fetch_event_data,
        fetch_game_data,
        fetch_game_entity_counter_data,
        fetch_game_tracker_data,
        fetch_outpost_data,
        fetch_revenant_data
      },
    },
  } = useDojo();

  const gameDataEntities = useEntityQuery([Has(GameEntityCounter)]); // to delete

  const clientGameDataEntity = getComponentValue(ClientGameData,GAME_CONFIG) // to delete


  const fetch_all_revenants = (revenant_count: number) => 
  {
    let game_id :EntityIndex = getComponentValueStrict(GameTracker,  GAME_CONFIG as EntityIndex).count as EntityIndex;

    console.log("fetching all outposts which are: ", revenant_count);
    for (let i = 0; i < revenant_count; i++) 
    { 
      console.log("fetching revenant: ", i +1, " in game: ", game_id);
      fetch_revenant_data(i + 1);
    }
  }

  const fetch_all_outposts = (revenant_count: number) => 
  {
    let game_id : EntityIndex = getComponentValueStrict(GameTracker,  GAME_CONFIG as EntityIndex).count as EntityIndex;

    console.log("fetching all outposts which are: ", revenant_count);
    for (let i = 0; i < revenant_count; i++) 
    { 
      console.log("fetching outpost: ", i + 1, " in game: ", game_id);
      fetch_outpost_data(i + 1);
    }
  }


  const fetch_last_event = (event_id: number) => 
  {
    fetch_event_data(event_id);
  }


  if (gameDataEntities.length === 0) 
  {
   return <ClickWrapper className="debug-menu">
    <div className="debug-title font-size-titles standard-orange-color-palette">Debug Menu</div>
    {/* this creates the game this shuold be done via a main address/ account */}
    <button className="debug-button font-size-texts standard-orange-color-palette"  onClick={() => create_game(account)} >Create Game</button>  

    {/* this should run at the start of the game and should fetch the latest game ID */}
    {/* <button className="debug-button font-size-texts standard-orange-color-palette"  onClick={() => fetch_game_tracker_data(account)} >fetch game tracker</button> */}

    {/* this fetches the actual game data */}
    {/* <button className="debug-button font-size-texts standard-orange-color-palette"  onClick={() => fetch_game_data(getComponentValueStrict(GameTracker, GAME_CONFIG as EntityIndex).count)} >join game</button> */}

    {/* this fetches the amount of entities data in the game id given*/}
    {/* <button className="debug-button font-size-texts standard-orange-color-palette"   onClick={() => fetch_game_entity_counter_data(getComponentValueStrict(GameTracker, GAME_CONFIG as EntityIndex).count)} >fetch entity counter</button> */}
  </ClickWrapper>
  }
  else
  {
   return <ClickWrapper className="debug-menu">
    <div className="debug-title font-size-titles standard-orange-color-palette">Debug Menu</div>

    <button className="debug-button font-size-texts standard-orange-color-palette"  onClick={() => fetch_game_entity_counter_data(getComponentValueStrict(GameTracker, GAME_CONFIG as EntityIndex).count)} >update counter</button>
 
    <button className="debug-button font-size-texts standard-orange-color-palette" onClick={() => fetch_all_revenants(getComponentValueStrict(GameEntityCounter,  clientGameDataEntity!.current_game_id as EntityIndex).revenant_count)} >fetch all revenants</button>
    <button className="debug-button font-size-texts standard-orange-color-palette" onClick={() => fetch_all_outposts(getComponentValueStrict(GameEntityCounter,  clientGameDataEntity!.current_game_id  as EntityIndex).outpost_count)} >fetch all outposts</button>
    <button className="debug-button font-size-texts standard-orange-color-palette" onClick={() => fetch_last_event(getComponentValueStrict(GameEntityCounter,  clientGameDataEntity!.current_game_id  as EntityIndex).event_count)} >fetch all events</button>

    <button className="debug-text font-size-texts standard-orange-color-palette">revenants in the game {getComponentValueStrict(GameEntityCounter,clientGameDataEntity!.current_game_id  as EntityIndex)?.revenant_count  || 0}</button>
    <button className="debug-text font-size-texts standard-orange-color-palette">outposts in the game {getComponentValueStrict(GameEntityCounter, clientGameDataEntity!.current_game_id  as EntityIndex)?.outpost_count  || 0}</button>
    <button className="debug-text font-size-texts standard-orange-color-palette">events in the game {getComponentValueStrict(GameEntityCounter, clientGameDataEntity!.current_game_id  as EntityIndex)?.event_count || 0}</button>
    <button className="debug-text font-size-texts standard-orange-color-palette">current block {getComponentValueStrict(ClientGameData, GAME_CONFIG)?.current_block_number || 0}</button>

    <button className="debug-button font-size-texts standard-orange-color-palette" onClick={() => set_world_event(account)} >Run Event</button>
    <button className="debug-button font-size-texts standard-orange-color-palette"  onClick={() => create_revenant(
              account,
              "name " + getComponentValueStrict(GameEntityCounter, getComponentValueStrict(ClientGameData,GAME_CONFIG).current_game_id as EntityIndex).revenant_count as string, 
            )}>Summon Revenant</button>
    
  </ClickWrapper>
  }
};
