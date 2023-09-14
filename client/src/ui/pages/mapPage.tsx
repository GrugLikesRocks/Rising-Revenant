import React, { useEffect } from 'react';
import { useWASDKeys } from '../../phaser/systems/eventSystems/keyPressListener';
import "../styles/MapPageStyle.css";

import { PhaserLayer } from '../../phaser';
import { CAMERA_ID, MAP_HEIGHT, MAP_WIDTH } from '../../phaser/constants';
import { EntityIndex, getComponentValue } from '@latticexyz/recs';



export const MapReactComp: React.FC <{ layer: PhaserLayer }> = ({ layer })=> {
  const keysDown = useWASDKeys();
  const camEntity = CAMERA_ID as EntityIndex;
  const CAMERA_SPEED = 10;

  const {
    scenes: {
      Main: { camera },
    },
    networkLayer:
    {
      systemCalls:{set_camera_position_component},
      components: { ClientCameraPosition},
    }
  } = layer;

  useEffect(() => {
    let animationFrameId: number;

    let currentZoomValue = 0;

    // Subscribe to zoom$ observable
    const zoomSubscription = camera.zoom$.subscribe((currentZoom) => {
      currentZoomValue = currentZoom;  // Update the current zoom value
    });

    const update = () => {
      const current_pos = getComponentValue(ClientCameraPosition, camEntity) || { x: MAP_WIDTH/2, y: MAP_HEIGHT/2 };

      if (!current_pos)
      {
        console.log("failed")
        return;
      }

      let newX = current_pos.x;
      let newY = current_pos.y;
    
      if (keysDown.W) {
        newY = current_pos.y - CAMERA_SPEED;
      }
      if (keysDown.A) {
        newX =  current_pos.x - CAMERA_SPEED;
      }
      
      if (keysDown.S) {
        newY =  current_pos.y + CAMERA_SPEED;
      }
      if (keysDown.D) {
        newX =  current_pos.x + CAMERA_SPEED;
      }

      if (newX > MAP_WIDTH - (camera.phaserCamera.width / currentZoomValue)/2) {
        newX = MAP_WIDTH - (camera.phaserCamera.width / currentZoomValue)/2;
      }
      if (newX < (camera.phaserCamera.width / currentZoomValue) /2) {
        newX = (camera.phaserCamera.width / currentZoomValue)/2;
      }
      if (newY > MAP_HEIGHT - (camera.phaserCamera.height/ currentZoomValue)/2) {
        newY = MAP_HEIGHT - (camera.phaserCamera.height / currentZoomValue)/2;
      }
      if (newY < (camera.phaserCamera.height / currentZoomValue )/2) {
        newY = (camera.phaserCamera.height / currentZoomValue )/2;
      }
    
      set_camera_position_component(newX, newY);
      // console.log(newX, newY);
      // console.log(currentZoomValue);
      // console.log("this is divided ", 1/currentZoomValue)
    
      animationFrameId = requestAnimationFrame(update);
    };
    

    // Kick off the loop
    update();

    // Cancel the animation frame when the component is unmounted
    return () => {
      cancelAnimationFrame(animationFrameId);
      zoomSubscription.unsubscribe();
    };

  }, [keysDown]);

  return (
    <div>
      {/* Your component content here */}
    </div>
  );
};
