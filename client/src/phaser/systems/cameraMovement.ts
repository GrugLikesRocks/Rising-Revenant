import { PhaserLayer } from "..";
import { Entity } from "../../generated/graphql";
import { GAME_ID } from "../constants";

import { EntityIndex, getComponentValueStrict, defineSystem, Has } from "@latticexyz/recs";

const CAMERA_SPEED = 20;
const MINIMUM_DISTANCE = 20;

export const controlCamera = (layer: PhaserLayer) => {
  let xPositionCamera = 0; // this isnt correct this should be a component in the client side only
  let yPositionCamera = 0;

  const {
    world,
    scenes: {
      Main: { camera, input, objectPool }
    },
    networkLayer: {
      systemCalls: { set_click_component },
      components: {  ClientClickPosition ,ClientCameraPosition},
      account,
    },
  } = layer;


  // // need a way to have this not on press but while down
  // input.onKeyPress(
  //   (keys) => keys.has("W"),
  //   () => {
  //     yPositionCamera -= CAMERA_SPEED;

  //     camera.centerOn(xPositionCamera, yPositionCamera);
  //   }
  // );

  // input.onKeyPress(
  //   (keys) => keys.has("A"),
  //   () => {
  //     xPositionCamera -= CAMERA_SPEED;

  //     camera.centerOn(xPositionCamera, yPositionCamera);
  //   }
  // );

  // input.onKeyPress(
  //   (keys) => keys.has("S"),
  //   () => {
  //     yPositionCamera += CAMERA_SPEED;

  //     camera.centerOn(xPositionCamera, yPositionCamera);
  //   }
  // );

  // input.onKeyPress(
  //   (keys) => keys.has("D"),
  //   () => {
  //     xPositionCamera += CAMERA_SPEED;

  //     camera.centerOn(xPositionCamera, yPositionCamera);
  //   }
  // );



  // this is to recheck and redo

  input.pointerdown$.subscribe(({ pointer, event }) => {

    // pointer is the coord of the cursor on the screen

    let clickRelativeToMiddlePointX = pointer.x - camera.phaserCamera.width/2;   // this si the click of the screen relative to the center of the camera
    let clickRelativeToMiddlePointY = pointer.y - camera.phaserCamera.height/2;  

    set_click_component(pointer.x, pointer.y, clickRelativeToMiddlePointX, clickRelativeToMiddlePointY);

  });



  defineSystem(world, [Has(ClientCameraPosition)], ({ entity }) => {
        
    const newCamPos = getComponentValueStrict(ClientCameraPosition, entity);

    //console.log("dwiojjiowdijowdijowd ",newCamPos);

    camera.centerOn(newCamPos.x, newCamPos.y);
    
    //   const positionCenterCam = getComponentValueStrict(ClientCameraComponent, entity);
    
    // const playerObj = objectPool.get(entity, "Sprite");

    // playerObj.setComponent({
    //     id: 'animation',
    //     once: (sprite) => {
    //         sprite.setTexture(Assets.MapPicture);
    //         sprite.setPosition(-sprite.width/2,-sprite.height/2);
    //     }
    // });

    // spawn the graphics here
});






};
