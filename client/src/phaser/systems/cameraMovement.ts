
import { COLOUMNS_NUMBER, SCALE, compareAdjacentIndexes, getAdjacentIndexes, getAdjacentIndexesAllDirections, getEntityArrayAtIndex, getMoveDirection, getTileIndex } from "../constants";

import { PhaserLayer } from "..";


import {
  defineSystem,
  Has,
  getComponentValue,
  getComponentEntities,
  getComponentValueStrict,
  setComponent,
  EntityIndex,
  HasValue,
  getEntitiesWithValue,
} from "@latticexyz/recs";

export const cameraManager = (layer: PhaserLayer) => {
  const {
    world,
    scenes: {
      Main: { camera, objectPool },
    },
    networkLayer: {
      components: { ClientCameraPosition, Outpost, ClientOutpostData },
    },
  } = layer;

  defineSystem(world, [Has(ClientCameraPosition)], ({ entity }) => {
    const newCamPos = getComponentValue(ClientCameraPosition, entity);    //get the cam entity

    if (!newCamPos) {   //check if its true
      return;
    }

    if (newCamPos) {
      camera.centerOn(newCamPos.x, newCamPos.y);   //set the position of the camera
    }

    const index = getTileIndex(newCamPos.x, newCamPos.y);  //get the index of the tile where the cam is 

    //therefore new index
    if (newCamPos.tile_index !== index) {    //if a new index then set the new outpost

      setComponent(ClientCameraPosition, entity, {   //set the new index
        x: newCamPos.x,
        y: newCamPos.y,
        tile_index: index,
      });

      const direction = getMoveDirection(newCamPos.tile_index, index);  //get the direction it went

      if (direction !== null) {  // if the change was by one then normal way   //this is to change to a better way

        const oldAdjacent = getAdjacentIndexesAllDirections(newCamPos.tile_index, 1);
        const newAdjacent = getAdjacentIndexesAllDirections(index, 1);

        const data = compareAdjacentIndexes(oldAdjacent, newAdjacent);

        console.log("old adjacent")
        console.log(oldAdjacent)
        console.log("new adjacent")
        console.log(newAdjacent)
        console.log("data")
        console.log(data)

        for (const index of data.newAdjacent) {
          const entityArray = getEntityArrayAtIndex(index);
          for (const entity of entityArray) {
            const clientData = getComponentValueStrict(ClientOutpostData, entity);
            if (!clientData.selected) {
              clientData.visible = true;
              setComponent(ClientOutpostData, entity, clientData);
            }
          }
        }

        for (const index of data.removedAdjacent) {
          const entityArray = getEntityArrayAtIndex(index);
          for (const entity of entityArray) {
            const clientData = getComponentValueStrict(ClientOutpostData, entity);
            if (!clientData.selected) {
              clientData.visible = false;
              setComponent(ClientOutpostData, entity, clientData);
            }
          }
        }
      } 
      else {
        console.log("nuke option")   //else nuke it and start the array again, slower
        nukeOption(newCamPos.tile_index, index);
      }
    }


    const outpostEntities = getEntitiesWithValue(ClientOutpostData, { visible: true});
    const outpostArray = Array.from(outpostEntities);

    // console.log("outpost array")
    // console.log(outpostArray.length)

    for (const entity of outpostArray) {
      spriteTransform(entity, newCamPos);
    }
  });



  function nukeOption(originalIndex: number, newIndex: number) {
    const originalIndexAdjacentIndexes = getAdjacentIndexesAllDirections(originalIndex, COLOUMNS_NUMBER);

    // loop through all the adjacent indexes
    for (const index of originalIndexAdjacentIndexes) {
      const entityArray = getEntityArrayAtIndex(index);
      for (const entity of entityArray) {
        const clientData = getComponentValueStrict(ClientOutpostData, entity);
        clientData.visible = false;
        setComponent(ClientOutpostData, entity, clientData);
      }
    }

    const newIndexAdjacentIndexes = getAdjacentIndexesAllDirections(newIndex, COLOUMNS_NUMBER);

    // loop through all the adjacent indexes
    for (const index of newIndexAdjacentIndexes) {
      const entityArray = getEntityArrayAtIndex(index);
      for (const entity of entityArray) {
        const clientData = getComponentValueStrict(ClientOutpostData, entity);
        clientData.visible = true;
        setComponent(ClientOutpostData, entity, clientData);
      }
    }
  }

  function spriteTransform(outpostEntityValue: EntityIndex, newCamPos: any) {


      const playerObj = objectPool.get(outpostEntityValue, "Sprite");

      playerObj.setComponent({
        id: "texture",
        once: (sprite:any) => {

          //get the disatnce from the center cam to the sprite
          let distanceX = Math.abs(sprite.x - newCamPos.x);  //wtf is this
          let distanceY = Math.abs(sprite.y - newCamPos.y);

          //get the hypothenuse
          let totDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY); 

          // console.log(totDistance)
          const clientData = getComponentValueStrict(ClientOutpostData, outpostEntityValue);

          if (totDistance < 40 || clientData.selected) {
            sprite.alpha = 1;
            sprite.setScale(SCALE);
          } else if (totDistance > 40 && totDistance < 250) {
            sprite.alpha = 1 - ((totDistance - 40) / (250 - 40));
            sprite.setScale(SCALE * (1 - ((totDistance - 40) / (250 - 40))));
          } else {
            sprite.alpha = 0;
            sprite.setScale(0);
          }
      }});
  }
}

