import React, { useEffect, useState, useRef } from "react";
import { PhaserLayer } from "../../phaser";

import { CAMERA_ID } from "../../phaser/constants";
import { EntityIndex, Has, getComponentValue, getComponentValueStrict} from "@latticexyz/recs";
import {useEntityQuery} from "@latticexyz/react";

import { circleEvents } from "../../phaser/systems/eventSystems/eventEmitter";

//MAJOR ISSUE HERE, THE CIRCLE FIRST SPAWNS IN THE WRONG PLACE BUT THEN AFTER RELOADING THE SCRIPT IT CORRECTS ITSELF

type Props = {
  layer: PhaserLayer;
};

export const EventCircle = ({ layer }: Props) => {
  const {
    scenes: {
      Main: { camera },
    }
    
  } = layer;


  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [radius, setRadius] = useState(0);

  const eventPos = useRef<any>({ x: 0, y: 0 });
  const eventRadius = useRef<any>(0);


  useEffect(() => {
    
    const spawnCircle = (x:number , y:number, radius:number) => {
 
      eventPos.current = { x: x, y: y };
      eventRadius.current = radius;
  
      setPosition({
        x: eventPos.current.x,
        y: eventPos.current.y,
      });
  
      setRadius(eventRadius.current * 2);
      setIsVisible(true);
    };

    const updateCirclePosition = (cameraPosX: number, cameraPosY: number) => {
        setPosition({x: eventPos.current.x - (cameraPosX - camera.phaserCamera.width/2) - radius/2, y: eventPos.current.y-(cameraPosY  -camera.phaserCamera.height/2) - radius/2})
    };

    circleEvents.on("spawnCircle", spawnCircle);
    circleEvents.on("updateCirclePos", updateCirclePosition);

    return () => {
      circleEvents.off("spawnCircle", spawnCircle);
      circleEvents.off("updateCirclePos", updateCirclePosition);
    };
  }, []);

  if (!isVisible) return null;

  const style: React.CSSProperties = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    position: "absolute",
    width: `${radius}px`,
    height: `${radius }px`,
    borderRadius: "50%",
    background: "transparent",
    border: "2px solid red",
    zIndex: "2",
  };
  return <div style={style}> </div>;
};
