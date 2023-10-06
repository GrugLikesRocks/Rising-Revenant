import { useEffect, useState, useRef } from "react";
import { tooltipEvent } from "../../phaser/systems/eventSystems/eventEmitter";
import "../styles/ToolTipDataStyles.css";
import { PhaserLayer } from "../../phaser";

import {
  EntityIndex,
  getComponentValue,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { useDojo } from "../../hooks/useDojo";

import { ClickWrapper } from "../clickWrapper";
import { GAME_CONFIG } from "../../phaser/constants";

import { bigIntToHexAndAscii, bigIntToHexWithPrefix } from "../../utils";
import { getEntityIdFromKeys } from "../../dojo/createSystemCalls";

type Props = {
  layer: PhaserLayer;
  useDojoContents: ReturnType<typeof useDojo>;
};

export const ToolTipData = ({ layer, useDojoContents }: Props) => {
  const [isVisible, setIsVisible] = useState(false); // visibility of the tooltip
  const [position, setPosition] = useState({ x: 0, y: 0 }); // initial screen position of the tooltip

  const [nameText, setNameText] = useState<any>(null); // name of the outpost
  const [addressText, setAddressText] = useState<any>(null); // address of the player who owns the outpost
  const [reinforceText, setReinforceText] = useState<any>(null); // current life of the outpost

  const [outpostEntityVal, setOutpostEntityVal] = useState<any>(null); // specific entity id of the outpost
  const [isOwner, setIsOwner] = useState<boolean>(false); // bool to check if the owner is the user
  const [isEventEffected, setIsEventEffected] = useState<boolean>(false); // bool to check if the event has effected the outpost
  const [gameId, setGameId] = useState<any>(null); // game id of the current game

  const tooltipContainerRef = useRef<HTMLDivElement>(null);
  const initialCameraCenterPos = useRef<any>(null);
  const currentTooltipPos = useRef<any>({ x: 0, y: 0 });

  const {
    networkLayer: {
      components: {
        Outpost,
        ClientCameraPosition,
        GameEntityCounter,
        ClientOutpostData,
        ClientGameData,
      },
    },
  } = layer;

  const {
    account: { account },
    networkLayer: {
      systemCalls: { destroy_outpost, reinforce_outpost },
    },
  } = useDojoContents;

  let timer: NodeJS.Timeout | null = null;

  const closeTooltip = (
    shouldCheck: boolean,
    clickX?: number,
    clickY?: number
  ) => {
    if (!shouldCheck) {
      setIsVisible(false);
      return;
    }

    const tooltipDiv = document.querySelector(".tooltip-container-in-game");
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
    const currentGameId = getComponentValueStrict(
      ClientGameData,
      GAME_CONFIG
    ).current_game_id;

    setGameId(currentGameId);

    const entityId = getEntityIdFromKeys([
      BigInt(currentGameId),
      BigInt(outpostNum),
    ]);

    const _outpostEntityData = getComponentValueStrict(Outpost, entityId);
    const _outpostOwnershipData = getComponentValueStrict(
      ClientOutpostData,
      entityId
    );

    // set the data
    // setNameText(bigIntToHexAndAscii(BigInt(_outpostEntityData.name)));
    setNameText(_outpostEntityData.x + " " + _outpostEntityData.y)
    setAddressText(bigIntToHexWithPrefix(BigInt(_outpostEntityData.owner)));
    setReinforceText(Number(_outpostEntityData.lifes)); // why does this need to be a number to work

    setOutpostEntityVal(_outpostOwnershipData.id);
    setIsOwner(_outpostOwnershipData.owned);
    setIsEventEffected(_outpostOwnershipData.event_effected);
   

    // this should not be like this, will need to be changed
    if (_outpostEntityData.lifes <= 0) 
    {
      setIsOwner(false);
    }

    initialCameraCenterPos.current = getComponentValue(
      ClientCameraPosition,
      GAME_CONFIG as EntityIndex
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
        if (!isVisible)
        {return;}
          
        const newCameraCenterPos = getComponentValue(
          ClientCameraPosition,
          GAME_CONFIG as EntityIndex
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
  }, [isVisible]);

  if (!isVisible) return null;

  const style = {
    left: `${position.x}px`,
    top: `${position.y}px`,
  };

  return (
    <div
      ref={tooltipContainerRef}
      className="tooltip-container-in-game"
      style={style}
    >
      <div className="tooltip-text-box-in-game">Name: {nameText} </div>
      <div className="tooltip-text-box-in-game">
        Owner address: {addressText}
      </div>
      <div className="tooltip-text-box-in-game">
        Reinforcement: {reinforceText}
      </div>

      {isOwner && (
        <ClickWrapper>
          {isEventEffected && (
            <button
              className="tooltip-button-in-game"
              onClick={() => {
                destroy_outpost(
                  account,
                  getComponentValueStrict(GameEntityCounter, gameId).event_count,
                  outpostEntityVal
                );
              }}
            >
              Confirm Event
            </button>
          )}


  <button
              className="tooltip-button-in-game"
              onClick={() => {
                destroy_outpost(
                  account,
                  getComponentValueStrict(GameEntityCounter, gameId).event_count,
                  outpostEntityVal
                );
              }}
            >
              Confirm Event
            </button>

          <button
            className="tooltip-button-in-game"
            onClick={() => {
              reinforce_outpost(account, outpostEntityVal);
            }}
          >
            Reinforces
          </button>
        </ClickWrapper>
      )}
    </div>
  );
};
