import React, { useEffect, useState } from "react";
import { gameEvents } from "../../phaser/systems/eventEmitter";
import "../styles/ToolTipDataStyles.css";
import { PhaserLayer } from "../../phaser";

import { EntityIndex, getComponentValue } from "@latticexyz/recs";
import { useDojo } from "../../hooks/useDojo";
import { StateOutpost } from "../../phaser/constants";

type Props = {
  layer: PhaserLayer;
};

export const ToolTipData = ({ layer }: Props) => {
  const {
    networkLayer: {
      components: { Name, Defence, Ownership, OutpostState, OutpostEntity },
    },
  } = layer;

  // const {
  //   account: { account },
  //   networkLayer: {
  //     systemCalls: {  destroy_outpost },
  //   },
  // } = useDojo();

  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const [nameText, setNameText] = useState<any>(null);
  const [addressText, setAddressText] = useState<any>(null);
  const [reinforceText, setReinforceText] = useState<any>(null);
  const [stateOutpost, setState] = useState<StateOutpost>();
  const [outpostEntityVal, setOutpostEntityVal] = useState<any>(null);

  let timer: NodeJS.Timeout | null = null;

  useEffect(() => {
    const spawnTooltip = (x: number, y: number, entity: EntityIndex) => {
      // Use received entity to get component values
      const _nameText = getComponentValue(Name, entity)?.value;
      const _addressText = getComponentValue(Ownership, entity)?.address;
      const _reinforceText = getComponentValue(Defence, entity)?.plague;
      const _state = getComponentValue(OutpostState, entity)?.state as StateOutpost;
      const _outpostEntityVal = getComponentValue(
        OutpostEntity,
        entity
      )?.entity_id;

      if (_nameText || _addressText || _reinforceText) {
        setNameText(_nameText!);
        setAddressText(_addressText!);
        setState(_state!);
        setReinforceText(_reinforceText!);
        setOutpostEntityVal(_outpostEntityVal!);
      } else {
        return null;
      }

      setPosition({ x, y });
      setIsVisible(true);

      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(() => {
        setIsVisible(false);
      }, 8000);
    };

    gameEvents.on("spawnTooltip", spawnTooltip);

    return () => {
      gameEvents.off("spawnTooltip", spawnTooltip);
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

  // const {
  //   account: { account },
  //   networkLayer: {
  //     systemCalls: {  destroy_outpost },
  //   },
  // } = useDojo();

  if (stateOutpost === StateOutpost.Healthy) {
    return (
      <div className="tooltip-container" style={style}>
        <div className="text-box">name: {stateOutpost}</div>
        <div className="text-box">owner add: {addressText}</div>
        <div className="text-box">reinforcements: {reinforceText}</div>
      </div>
    );
  } 
  else {
    return (
      <div className="tooltip-container" style={style}>
        <div className="text-box">name: {stateOutpost}</div>
        <div className="text-box">owner add: {addressText}</div>
        <div className="text-box">reinfoements: {reinforceText}</div>
        <button className="optional-button">Destroy</button>

        <button
          className="optional-button"
          onClick={() => {
            //destroy_outpost(account, outpostEntityVal);
          }}
        >
          increment
        </button>
      </div>
    );
  }
};
