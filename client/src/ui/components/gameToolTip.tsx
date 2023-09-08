import React, { useEffect, useState } from "react";
import { gameEvents } from "../../phaser/systems/eventEmitter";
import "../styles/ToolTipDataStyles.css";
import { PhaserLayer } from "../../phaser";

import { EntityIndex, getComponentValue } from "@latticexyz/recs";

type Props = {
  layer: PhaserLayer;
};

export const ToolTipData = ({ layer }: Props) => {

  const {
    networkLayer: {
      components: { Name, Defence, Ownership },
    },
  } = layer;

  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [nameText, setNameText] = useState<any>(null);
  const [addressText, setAddressText] = useState<any>(null);
  const [reinforceText, setReinforceText] = useState<any>(null);

  let timer: NodeJS.Timeout | null = null;

  useEffect(() => {
    const spawnTooltip = (x: number, y: number, entity: EntityIndex) => {
      // Use received entity to get component values
      const _nameText = getComponentValue(Name, entity)?.value;
      const _addressText = getComponentValue(Ownership, entity)?.address ;
      const _reinforceText =   getComponentValue(Defence, entity)?.plague;

      if (_nameText || _addressText || _reinforceText) {
        setNameText(_nameText!);
        setAddressText(_addressText!);
        setReinforceText(_reinforceText!);
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

  return (
    <div className="tooltip-container" style={style}>
      <div className="text-box">name: {nameText}</div>
      <div className="text-box">owner add: {addressText}</div>
      <div className="text-box">reinforcements: {reinforceText}</div>
      <button className="optional-button">Click Me</button>
    </div>
  );
};
