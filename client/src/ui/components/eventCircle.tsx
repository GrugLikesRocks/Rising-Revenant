import React, { useEffect, useState, useRef } from "react";
import { PhaserLayer } from "../../phaser";

import { CAMERA_ID } from "../../phaser/constants";
import { EntityIndex, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";

import { getEntityIdFromKeys } from "../../dojo/createSystemCalls";

import { circleEvents } from "../../phaser/systems/eventSystems/eventEmitter";

type Props = {
  layer: PhaserLayer;
};

export const EventCircle = ({ layer }: Props) => {
  const {
    scenes: {
      Main: { camera },
    },
    networkLayer: {
      components: { ClientCameraPosition},
    },
  } = layer;

  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [radius, setRadius] = useState(0);

  const initialCameraCenterPos = useRef<any>(null);
  const eventPos = useRef<any>({ x: 0, y: 0 });
  const eventRadius = useRef<any>(0);

  const spawnCircle = (x:number,y:number, radius:number) => {
    initialCameraCenterPos.current = getComponentValue(
      ClientCameraPosition,
      CAMERA_ID as EntityIndex
    );

    eventPos.current = { x: x, y: y };
    eventRadius.current = radius;

    setPosition({
      x: eventPos.current.x,
      y: eventPos.current.y,
    });
    setRadius(eventRadius.current * 2);
    setIsVisible(true);
  };

  useEffect(() => {
    circleEvents.on("spawnCircle", spawnCircle);

    const updateTooltipPosition = () => {
      const newCameraCenterPos = getComponentValue(
        ClientCameraPosition,
        CAMERA_ID as EntityIndex
      );
      
      if (newCameraCenterPos ) {
        setPosition({x:  -(newCameraCenterPos.x - camera.phaserCamera.width/2) , y: -(newCameraCenterPos.y - camera.phaserCamera.height/2)})
      }
    };

    const intervalID = setInterval(updateTooltipPosition, 1000 / 60);

    return () => {
      circleEvents.off("spawnCircle", spawnCircle);
      clearInterval(intervalID);
      
    };
  }, []);

  if (!isVisible) return null;

  const style: React.CSSProperties = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    position: "absolute",
    width: `${radius}px`,
    height: `${radius}px`,
    borderRadius: "50%",
    background: "transparent",
    border: "2px solid red",
    zIndex: "-2",
  };

  return <div style={style}> </div>;
};
