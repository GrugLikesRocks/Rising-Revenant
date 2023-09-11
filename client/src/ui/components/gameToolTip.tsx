import React, { useEffect, useState, useRef } from "react";
import { gameEvents } from "../../phaser/systems/eventEmitter";
import "../styles/ToolTipDataStyles.css";
import { PhaserLayer } from "../../phaser";

import { EntityIndex, getComponentValue } from "@latticexyz/recs";
import { useDojo } from "../../hooks/useDojo";

import { ClickWrapper } from "../clickWrapper";
import { CAMERA_ID } from "../../phaser/constants";

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
        OutpostEntity,
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

  const initialCameraCenterPos = useRef<any>(null);
  const currentTooltipPos = useRef<any>({ x: 0, y: 0 });

  let timer: NodeJS.Timeout | null = null;

  const spawnTooltip = (x: number, y: number, entity: EntityIndex) => {
    setCurrentEntity(entity);
    const _nameText = getComponentValue(Name, entity)?.value;
    const _addressText = getComponentValue(Ownership, entity)?.address;
    const _reinforceText = getComponentValue(Defence, entity)?.plague;
    const _outpostEntityVal = getComponentValue(
      OutpostEntity,
      entity
    )?.entity_id;

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
    gameEvents.on("spawnTooltip", spawnTooltip);

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
      gameEvents.off("spawnTooltip", spawnTooltip);
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
    <div className="tooltip-container" style={style}>
      <div className="text-box">name: {nameText}</div>
      <div className="text-box">owner add: {addressText}</div>
      <div className="text-box">reinfoements: {reinforceText}</div>
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
          destroy WIP
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
          reinforcemnt
        </button>
      </ClickWrapper>
    </div>
  );
};
