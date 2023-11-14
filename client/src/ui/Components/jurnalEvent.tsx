import React, { useEffect, useState } from "react";
import {
  EntityIndex,
  Has,
  
  getComponentValueStrict,
} from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";



import "./ComponentsStyles/JurnalEventStyles.css";

import { MenuState } from "../Pages/mainMenuContainer";

import { ClickWrapper } from "../clickWrapper";
import { useDojo } from "../../hooks/useDojo";
import { GAME_CONFIG } from "../../phaser/constants";
import { getEntityIdFromKeys } from "@dojoengine/utils";

interface JuornalEventProps {
  setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

export const JurnalEventComponent: React.FC<JuornalEventProps> = ({ setMenuState }) => {




  return (<></>)

  const [allOutpostEffected, setAllOutpostEffected] = useState<EntityIndex[]>([]);

  const {
    networkLayer: {
      network: { contractComponents, clientComponents },
    },
  } = useDojo();

  const openJurnal = () => {
    setMenuState(MenuState.REV_JURNAL);
  };

  const outpostsArray = useEntityQuery([Has(clientComponents.ClientOutpostData)]);
  const eventArray = useEntityQuery([Has(contractComponents.WorldEvent)]);

  const gameClientData = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG)]));
  const gameTrackerComp = getComponentValueStrict(contractComponents.GameEntityCounter, getEntityIdFromKeys([BigInt(gameClientData.current_game_id)]));


  useEffect(() => {


    if (eventArray.length === 0)
    {
      return;
    }
    setAllOutpostEffected([]);
    
   
    const eventData = getComponentValueStrict(contractComponents.WorldEvent, getEntityIdFromKeys([BigInt(gameTrackerComp.current_event), BigInt(gameClientData.current_game_id)]));

    for (let index = 0; index < outpostsArray.length; index++) {
      const element = outpostsArray[index];

      const outpostData = getComponentValueStrict(contractComponents.Outpost, element);

      if (outpostData.lifes > 0)
      {
        const distance = Math.sqrt(Math.pow(eventData.x - outpostData.x, 2) + Math.pow(eventData.y - outpostData.y, 2));
        if (distance < eventData.radius)
        {
          setAllOutpostEffected([...allOutpostEffected, element]);
        }
      }
    }

  }, [eventArray]);

  if (eventArray.length === 0) { return (<></>) }

  console.log(eventArray.length)
  const eventData = getComponentValueStrict(contractComponents.WorldEvent, getEntityIdFromKeys([BigInt(gameTrackerComp.current_event), BigInt(gameClientData.current_game_id)]));



  return (
    <div className="jurnal-event-container">
      <ClickWrapper className="title-div-container">
        <h2>
          REVENANT JOURNAL {" "}
          <img
            src="LOGO_WHITE.png"
            style={{ maxHeight: "1em", verticalAlign: "top", marginLeft: "auto" }}
            alt="Logo"
            onMouseDown={() => (openJurnal())}
          ></img>
        </h2>
      </ClickWrapper>

      <div className="current-data-container">
        <h3 className="sub-title">Current Event Data</h3>
        <h4>Radius: {eventData.radius}</h4>
        <h4>Type: Null</h4>
        <h4>Position: X:{eventData.x} Y:{eventData.y}</h4>
      </div>

      <div className="outpost-hit-data-container">
        <h3 className="sub-title">Outpost Status</h3>
        <ClickWrapper className="outpost-hit-list-container">
          {allOutpostEffected.map((entityIndex: EntityIndex) => (
            <h4>
              Outpost ID:{" "}
              {getComponentValueStrict(clientComponents.ClientOutpostData, entityIndex).id} || {" "}
              X: {getComponentValueStrict(contractComponents.Outpost, entityIndex).x}, Y:{" "}
              {getComponentValueStrict(contractComponents.Outpost, entityIndex).y}
            </h4>
          ))}
        </ClickWrapper>
      </div>
    </div>
  );
};
