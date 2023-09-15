import { useEffect, useState, useRef } from "react";
import { tooltipEvent } from "../../phaser/systems/eventSystems/eventEmitter";
import "../styles/ToolTipDataStyles.css";
import { PhaserLayer } from "../../phaser";

import { EntityIndex, getComponentValue} from "@latticexyz/recs";
import { useDojo } from "../../hooks/useDojo";

import { ClickWrapper } from "../clickWrapper";
import { CAMERA_ID } from "../../phaser/constants";

// NEED TO FIND A HEX TO ASCII FUNCTION

type Props = {
  layer: PhaserLayer;
};

export const ToolTipData = ({ layer }: Props) => {
  const {
    networkLayer: {
      components: {
        Name,
        Defence,
        Ownership,
        ClientCameraPosition,
      },
    },
  } = layer;

  const {
    account: { account },
    networkLayer: {
      systemCalls: { destroy_outpost, reinforce_outpost },
    },
  } = useDojo();


  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [nameText, setNameText] = useState<any>(null);
  const [addressText, setAddressText] = useState<any>(null);
  const [reinforceText, setReinforceText] = useState<any>(null);
  const [outpostEntityVal, setOutpostEntityVal] = useState<any>(null);
  const [currentEntity, setCurrentEntity] = useState<EntityIndex | null>(null);

  const tooltipContainerRef = useRef<HTMLDivElement>(null);
  const initialCameraCenterPos = useRef<any>(null);
  const currentTooltipPos = useRef<any>({ x: 0, y: 0 });

  let timer: NodeJS.Timeout | null = null;

  const closeTooltip = (shouldCheck: boolean, clickX?: number, clickY?: number) => {
    if (!shouldCheck) {
      setIsVisible(false);
      return;
    }
  
    const tooltipDiv = document.querySelector('.tooltip-container');
    if (!tooltipDiv) return;
  
    const rect = tooltipDiv.getBoundingClientRect();

    console.log(rect);
    console.log(clickX, clickY);    
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

  const spawnTooltip = (x: number, y: number, entity: EntityIndex) => {
    setCurrentEntity(entity);

    const _nameText = getComponentValue(Name, entity)?.value;
    const _addressText = getComponentValue(Ownership, entity)?.address;
    const _reinforceText = getComponentValue(Defence, entity)?.plague;
    const _outpostEntityVal = "null"

    setNameText(_nameText);
    setAddressText(_addressText);
    setReinforceText(_reinforceText);
    setOutpostEntityVal(_outpostEntityVal);

    initialCameraCenterPos.current = getComponentValue(
      ClientCameraPosition,
      CAMERA_ID as EntityIndex
    );
    currentTooltipPos.current = { x, y };

    setPosition({ x, y });
    setIsVisible(true);

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
      className="tooltip-container"
      style={style}
    >
      <div className="text-box">Name: {nameText} </div>   
      <div className="text-box">Owner address: {addressText}</div>
      <div className="text-box">Reinforcement: {reinforceText}</div>
      <ClickWrapper>
        <button
          className="optional-button"
          onClick={() => {
            destroy_outpost(account, outpostEntityVal);

            if (currentEntity !== null) {
              setReinforceText(
                getComponentValue(Defence, currentEntity)?.plague || 0
              );
            }
          }}
        >
          Confirm Event
        </button>
        <button
          className="optional-button"
          onClick={() => {
            reinforce_outpost(account, outpostEntityVal);
            if (currentEntity !== null) {
              setReinforceText(
                getComponentValue(Defence, currentEntity)?.plague || 0
              );
            }
          }}
        >
          Reinforces
        </button>
      </ClickWrapper>
    </div>
  );
};
