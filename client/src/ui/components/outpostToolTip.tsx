import { useEffect, useState, useRef } from "react";
import { tooltipEvent } from "../../phaser/systems/eventSystems/eventEmitter";
import "../styles/ToolTipDataStyles.css";
import { PhaserLayer } from "../../phaser";

import { EntityIndex, getComponentValue, getComponentValueStrict} from "@latticexyz/recs";
import { useDojo } from "../../hooks/useDojo";

import { ClickWrapper } from "../clickWrapper";
import { CAMERA_ID, currentGameId } from "../../phaser/constants";

import { bigIntToHexAndAscii, bigIntToHexWithPrefix, hexToAscii } from "../../utils";     // THIS IS THE HEX TO ASCII FUNCTION
import { getEntityIdFromKeys } from "../../dojo/createSystemCalls";

// NEED TO FIND A HEX TO ASCII FUNCTION

type Props = {
  layer: PhaserLayer;
};



export const ToolTipData = ({ layer }: Props) => {
  const {
    networkLayer: {
      components: {
        Outpost,
        ClientCameraPosition,
        GameEntityCounter,
        ClientOutpostData
      },
    },
  } = layer;

  const {
    account: { account },
    networkLayer: {
      systemCalls: { destroy_outpost, reinforce_outpost },
    },
  } = useDojo();


  const [isVisible, setIsVisible] = useState(false);  // visibility of the tooltip
  const [position, setPosition] = useState({ x: 0, y: 0 });  // initla screen position of the tooltip

  const [nameText, setNameText] = useState<any>(null);   // name of the outpost
  const [addressText, setAddressText] = useState<any>(null);  // address of the player who owns the outpost
  const [reinforceText, setReinforceText] = useState<any>(null); // current life of the outpost

  const [outpostEntityVal, setOutpostEntityVal] = useState<any>(null);  // specific entity id of the outpost
  const [isOwner, setIsOwner] = useState<boolean>(false); // bool to check if the owner is the user
  const [isEventEffected, setIsEventEffected] = useState<boolean>(false); // bool to check if the event has effected the outpost

  const tooltipContainerRef = useRef<HTMLDivElement>(null);
  const initialCameraCenterPos = useRef<any>(null);
  const currentTooltipPos = useRef<any>({ x: 0, y: 0 });

  let timer: NodeJS.Timeout | null = null;

  const closeTooltip = (shouldCheck: boolean, clickX?: number, clickY?: number) => {
    if (!shouldCheck) {
      setIsVisible(false);
      return;
    }
  
    const tooltipDiv = document.querySelector('.tooltip-container-in-game');
    if (!tooltipDiv) return;
  
    const rect = tooltipDiv.getBoundingClientRect();

    if (clickX !== undefined && clickY !== undefined) {
      if (
        clickX >= rect.left &&
        clickX <= rect.right &&
        clickY >= rect.top &&
        clickY <= rect.bottom
      ) {
        return;
      }
    }

    setIsVisible(false);
  };

  const spawnTooltip = (x: number, y: number, outpostNum: number) => {

    // get the component data
    const entityId = getEntityIdFromKeys([
      BigInt(currentGameId),
      BigInt(outpostNum),
    ]);

    const _outpostEntityData = getComponentValueStrict(Outpost, entityId);
    const _outpostOwnershipData = getComponentValueStrict(ClientOutpostData, entityId);

    // set the data 
    setNameText(bigIntToHexAndAscii( BigInt(_outpostEntityData.name) ));
    setAddressText(bigIntToHexWithPrefix( BigInt(_outpostEntityData.owner) ));
    setReinforceText(Number(_outpostEntityData.lifes));   // why does this need to be a number to work 

    setOutpostEntityVal(_outpostOwnershipData.id);
    setIsOwner(_outpostOwnershipData.owned);
    setIsEventEffected(_outpostOwnershipData.event_effected);


    // set the position data
    initialCameraCenterPos.current = getComponentValue(
      ClientCameraPosition,
      CAMERA_ID as EntityIndex
    );
    currentTooltipPos.current = { x, y };

    setPosition({ x, y });
    setIsVisible(true);

    // restart timer
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
        setIsVisible(false);
    }, 8000);
  };

  useEffect(() => {
    tooltipEvent.on("spawnTooltip", spawnTooltip);
    tooltipEvent.on("closeTooltip", closeTooltip);

    const updateTooltipPosition = () => {
      const newCameraCenterPos = getComponentValue(
        ClientCameraPosition,
        CAMERA_ID as EntityIndex
      );

      if (newCameraCenterPos && initialCameraCenterPos.current) {
        const dx = newCameraCenterPos.x - initialCameraCenterPos.current.x;
        const dy = newCameraCenterPos.y - initialCameraCenterPos.current.y;

        setPosition({
          x: currentTooltipPos.current.x - dx,
          y: currentTooltipPos.current.y - dy,
        });

        currentTooltipPos.current = {
          x: currentTooltipPos.current.x - dx,
          y: currentTooltipPos.current.y - dy,
        };

        initialCameraCenterPos.current = newCameraCenterPos;
      }
    };

    const intervalID = setInterval(updateTooltipPosition, 1000 / 60);

    return () => {
      tooltipEvent.off("spawnTooltip", spawnTooltip);
      tooltipEvent.off("closeTooltip", closeTooltip);
      clearInterval(intervalID);
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  if (!isVisible) return null;



  const style = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  return (
    
    <div
      ref={tooltipContainerRef} 
      className="tooltip-container-in-game"
      style={style}>

      <div className="tooltip-text-box-in-game">Name: {nameText} </div>   
      <div className="tooltip-text-box-in-game">Owner address: {addressText}</div>
      <div className="tooltip-text-box-in-game">Reinforcement: {reinforceText}</div>

      {isOwner && 
      (
      <ClickWrapper>

        
        <button
          className="tooltip-button-in-game"
          onClick={() => {
            destroy_outpost(account, currentGameId, getComponentValueStrict(GameEntityCounter,currentGameId).event_count, outpostEntityVal);
          }}>

          Confirm Event
        </button>
        <button
          className="tooltip-button-in-game"
          onClick={() => {
            reinforce_outpost(account, outpostEntityVal);
          }}>
          Reinforces
        </button>
      </ClickWrapper>
      )}
      
    </div>
  );
};
