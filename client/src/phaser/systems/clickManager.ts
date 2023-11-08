import { PhaserLayer } from "..";

import {
  EntityIndex,
  getComponentValueStrict,
  defineSystem,
  Has,
  getComponentEntities,
  getComponentValue,
  setComponent
} from "@latticexyz/recs";


import { setTooltipArray } from "./eventSystems/eventEmitter";
import { GAME_CONFIG, OUTPOST_HEIGHT, OUTPOST_WIDTH, SCALE } from "../constants";
import { setComponentQuick } from "../../dojo/testCalls";
import { decimalToHexadecimal } from "../../utils";
import { getEntityIdFromKeys } from "@dojoengine/utils";

export const clickManager = (layer: PhaserLayer) => {
  const {
    world,
    scenes: {
      Main: { camera, input, objectPool },
    },

    networkLayer: {
      network: { clientComponents },
      components: { Outpost, ClientClickPosition, ClientCameraPosition },
    },
  } = layer;

  input.pointerdown$.subscribe(({ pointer }) => {
    if (!pointer) {
      return;
    }


    let clickRelativeToMiddlePointX = pointer.x - camera.phaserCamera.width / 2;
    let clickRelativeToMiddlePointY = pointer.y - camera.phaserCamera.height / 2;


    setComponentQuick(
      {
      "xFromOrigin":pointer.x,
      "yFromOrigin":pointer.y,
      "xFromMiddle" :clickRelativeToMiddlePointX,
      "yFromMiddle":clickRelativeToMiddlePointY 
      },
       ["0x1"], "ClientClickPosition", clientComponents);

  });

  // Click checks for the ui tooltip
  defineSystem(world, [Has(ClientClickPosition)], ({ entity }) => {

    const positionClick = getComponentValueStrict(ClientClickPosition, entity);

    const outpostEntities = getComponentEntities(Outpost);
    const outpostArray = Array.from(outpostEntities);

    const positionCenterCam = getComponentValue(   // this errors out for some reason but doesnt break everything so this is low priority
      ClientCameraPosition,
      entity
    );

    let zoomVal:number = 0;

    // camera.zoom$.subscribe((zoom) => {zoomVal = zoom;});
    // console.log(zoomVal);
  
    if (positionCenterCam === undefined) { return; }


    //zoom is broken
    // let positionX = (positionClick.xFromMiddle/zoomVal) + positionCenterCam.x;
    // let positionY = (positionClick.yFromMiddle/zoomVal) + positionCenterCam.y;


    let positionX = (positionClick.xFromMiddle) + positionCenterCam.x;
    let positionY = (positionClick.yFromMiddle) + positionCenterCam.y;



    let foundEntity:   EntityIndex[] = []; // store the found entity

    const clientGameData = getComponentValue(clientComponents.ClientGameData, decimalToHexadecimal(GAME_CONFIG));

    for (const outpostEntityValue of outpostArray) {

      const clientOutpostData = getComponentValueStrict(clientComponents.ClientOutpostData, outpostEntityValue);

      const outpostData = getComponentValueStrict(Outpost, outpostEntityValue);

      // const playerObj = objectPool.get(getEntityIdFromKeys([BigInt(clientGameData.current_game_id ), BigInt(clientOutpostData.id)]), "Sprite");


      // this is broken
      // playerObj.setComponent({
      //   id: "position",
      //   once: (sprite) => {

      //     const minX = sprite.x;
      //     const minY = sprite.y;

      //     const maxX = minX + sprite.width * sprite.scale;
      //     const maxY = minY + sprite.height * sprite.scale;

      //     console.log(sprite.x)
      //     console.log("this is the min and max", minX, maxX, minY, maxY)
      //     console.log("this is the position", positionX, positionY)

      //     if (
      //       positionX >= minX &&
      //       positionX <= maxX &&
      //       positionY >= minY &&
      //       positionY <= maxY
      //     ) {
      //       console.log("pls get here")
      //       foundEntity.push(outpostEntityValue);
      //     }
      //   },
      // });




      //do this for now but need to find a solution

          const minX = outpostData.x - (OUTPOST_WIDTH / 2);
          const minY = outpostData.y - (OUTPOST_HEIGHT / 2);

          const maxX = minX + OUTPOST_WIDTH;
          const maxY = minY + OUTPOST_HEIGHT;

          console.log("this is the min and max", minX, maxX, minY, maxY)
          console.log("this is the position", positionX, positionY)

          if (
            positionX >= minX &&
            positionX <= maxX &&
            positionY >= minY &&
            positionY <= maxY
          ) {
            console.log("pls get here")
            foundEntity.push(outpostEntityValue);
          }
    }

    if (foundEntity.length > 0)
    {
      console.log("found entity", foundEntity)
      setTooltipArray.emit("setToolTipArray",foundEntity);
    }

  });

};
