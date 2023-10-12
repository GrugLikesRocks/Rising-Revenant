import React, { useEffect } from "react";
import { useWASDKeys } from "../../phaser/systems/eventSystems/keyPressListener";
import "../styles/MapPageStyle.css";

import { ClickWrapper } from "../clickWrapper";

import { PhaserLayer } from "../../phaser";
import { GAME_CONFIG, MAP_HEIGHT, MAP_WIDTH } from "../../phaser/constants";
import { getComponentValue, setComponent } from "@latticexyz/recs";

import { EventFeed } from "../components/eventFeedComponent";

import {GameToolTipList} from "../components/gameTooltip";
import { Game } from "phaser";

export const MapReactComp: React.FC<{ layer: PhaserLayer }> = ({ layer }) => {
  const keysDown = useWASDKeys();
  const CAMERA_SPEED = 10;

  const {
    scenes: {
      Main: { camera },
    },
    networkLayer: {
      components: { ClientCameraPosition },
    },
  } = layer;

  let prevX: number = 0;
  let prevY: number = 0;

  useEffect(() => {
    let animationFrameId: number;

    let currentZoomValue = 0;

    // Subscribe to zoom$ observable
    const zoomSubscription = camera.zoom$.subscribe((currentZoom) => {
      currentZoomValue = currentZoom; // Update the current zoom value
    });

    const update = () => {
      const current_pos = getComponentValue(
        ClientCameraPosition,
        GAME_CONFIG
      ) || { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 };

      if (!current_pos) {
        console.log("failed");
        return;
      }

      let newX = current_pos.x;
      let newY = current_pos.y;

      if (keysDown.W) {
        newY = current_pos.y - CAMERA_SPEED;
      }
      if (keysDown.A) {
        newX = current_pos.x - CAMERA_SPEED;
      }

      if (keysDown.S) {
        newY = current_pos.y + CAMERA_SPEED;
      }
      if (keysDown.D) {
        newX = current_pos.x + CAMERA_SPEED;
      }

      if (newX > MAP_WIDTH - camera.phaserCamera.width / currentZoomValue / 2) {
        newX = MAP_WIDTH - camera.phaserCamera.width / currentZoomValue / 2;
      }
      if (newX < camera.phaserCamera.width / currentZoomValue / 2) {
        newX = camera.phaserCamera.width / currentZoomValue / 2;
      }
      if (
        newY >
        MAP_HEIGHT - camera.phaserCamera.height / currentZoomValue / 2
      ) {
        newY = MAP_HEIGHT - camera.phaserCamera.height / currentZoomValue / 2;
      }
      if (newY < camera.phaserCamera.height / currentZoomValue / 2) {
        newY = camera.phaserCamera.height / currentZoomValue / 2;
      }

      if (newX !== prevX || newY !== prevY) {

        setComponent(ClientCameraPosition, GAME_CONFIG, {
          x: newX,
          y: newY,
        });

        prevX = newX;
        prevY = newY;
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      zoomSubscription.unsubscribe();
    };
  }, [keysDown]);

  return (
    <div>
      <ClickWrapper className="instruction-for-map-container">
        <div className="instruction-for-map-title-element font-size-mid-titles">instructions</div>
        <div className="instruction-for-map-text-element font-size-texts">Ctrl + scrool wheel to zoom (disabled)</div>
        <div className="instruction-for-map-text-element font-size-texts">Shift to toggle NavBar</div>
      </ClickWrapper>
      <EventFeed layer={layer} timerPassed={true} />
      <GameToolTipList layer={layer} />
    </div>
  );
};
