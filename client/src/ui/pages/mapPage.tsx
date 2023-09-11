import React, { useEffect } from 'react';
import { useWASDKeys } from '../../phaser/systems/keyPressListener';  // Replace with the actual path to your hook file
import "../styles/MapPageStyle.css";

import { PhaserLayer } from '../../phaser';
import { CAMERA_ID } from '../../phaser/constants';
import { EntityIndex, getComponentValue } from '@latticexyz/recs';

export const MapReactComp: React.FC <{ layer: PhaserLayer }> = ({ layer })=> {
  const keysDown = useWASDKeys();
  const camEntity = CAMERA_ID as EntityIndex;
  const CAMERA_SPEED = 10;

  const {
    networkLayer:
    {
      systemCalls:{set_camera_position_component},
      components: { ClientCameraPosition},
    }
  } = layer;

  useEffect(() => {
    let animationFrameId: number;

    const update = () => {
      if (keysDown.W) {
        
        const current_pos = getComponentValue(ClientCameraPosition, camEntity);

        set_camera_position_component(current_pos?.x || 0 , (current_pos?.y || 0)  - CAMERA_SPEED);
      }
      if (keysDown.A) {
        
        const current_pos = getComponentValue(ClientCameraPosition, camEntity);

        set_camera_position_component((current_pos?.x || 0 ) - CAMERA_SPEED, current_pos?.y || 0 );
      }
      if (keysDown.S) {
      
        const current_pos = getComponentValue(ClientCameraPosition, camEntity);

        set_camera_position_component(current_pos?.x || 0 , (current_pos?.y || 0 ) + CAMERA_SPEED);
      }
      if (keysDown.D) {
       
        const current_pos = getComponentValue(ClientCameraPosition, camEntity);

        set_camera_position_component((current_pos?.x || 0 ) + CAMERA_SPEED, current_pos?.y || 0 );
      }

      animationFrameId = requestAnimationFrame(update);
    };

    // Kick off the loop
    update();

    // Cancel the animation frame when the component is unmounted
    return () => {
      cancelAnimationFrame(animationFrameId);
    };

  }, [keysDown]);

  return (
    <div>
      {/* Your component content here */}
    </div>
  );
};
