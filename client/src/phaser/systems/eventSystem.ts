import {
    Has,
    defineSystem,
    getComponentValueStrict, getComponentValue,
    getComponentEntities,
    setComponent,
    EntityIndex,
  } from "@latticexyz/recs";
  import { PhaserLayer } from "..";
  import { GAME_CONFIG } from "../constants";
import { setComponentQuick } from "../../dojo/testCalls";
import { decimalToHexadecimal } from "../../utils";
import { getEntityIdFromKeys } from "@dojoengine/utils";

  export const eventManager = (layer: PhaserLayer) => {
    const {
      world,
      scenes: {
        Main: { objectPool },
      },
      networkLayer: {
        network: { clientComponents },
        components: { Outpost, WorldEvent, ClientOutpostData , GameEntityCounter, ClientGameData},
      },
    } = layer;
  
    defineSystem(world, [Has(WorldEvent)], ({ entity }) => {

      const dataEvent = getComponentValue(WorldEvent, entity);
      const clientGameData = getComponentValue(ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG)]));

      if (!dataEvent || !clientGameData) {  // this doesnt make sense
        return;
      }

      console.log(dataEvent)
      console.log("\n\n\n\n\n\n")

      const phaserScene = layer.scenes.Main.phaserScene;

      // Destroy all graphics objects in the scene
      phaserScene.sys.displayList.each((child) => {
        if (child instanceof Phaser.GameObjects.Graphics) {
            child.destroy();
        }
      });

      const graphics = phaserScene.add.graphics();

      graphics.lineStyle(3, 0xff0000); // Set line style for the outline
      graphics.strokeCircle(dataEvent.x, dataEvent.y, dataEvent.radius); // Draw the outline of a circle with a radius of 50

      let radius = dataEvent.radius;
  
      if (radius === 0) {  // this also makes no sense
        return;
      }
  
      let positionX = dataEvent.x;
      let positionY = dataEvent.y;
  
      const outpostEntities = getComponentEntities(Outpost);
      const outpostArray = Array.from(outpostEntities);

      const gameEntityCounter = getComponentValueStrict(GameEntityCounter, getEntityIdFromKeys([BigInt(clientGameData.current_game_id)]));
  
      for (const outpostEntityValue of outpostArray) {
        console.log(outpostEntityValue)
        // const outpostClientData = getComponentValueStrict(ClientOutpostData, outpostEntityValue);
        // const outpostEntityData = getComponentValueStrict(Outpost, outpostEntityValue);
  
        // const playerObj = objectPool.get(outpostEntityValue, "Sprite");
        
        // if (outpostEntityData.last_affect_event_id === gameEntityCounter.event_count)
        // {
          
        //   setComponentQuick(
        //     {
        //       "id": outpostClientData.id,
        //       "owned": outpostClientData.owned,
        //       "event_effected": false,
        //       "selected": outpostClientData.selected,
        //     },[decimalToHexadecimal(clientGameData.current_game_id), decimalToHexadecimal(outpostClientData.id)],"ClientOutpostData",clientComponents);
        
        //   continue;
        // }

        // playerObj.setComponent({
        //   id: "texture",
        //   once: (sprite: any) => {

        //     const distance = Math.sqrt(
        //       (Number(getComponentValueStrict(Outpost, outpostEntityValue).x) - positionX) ** 2 + (Number(getComponentValueStrict(Outpost, outpostEntityValue).y)- positionY) ** 2
        //     );
  
        //     if (distance <= radius) {

        //       setComponentQuick(
        //         {
        //           "id": outpostClientData.id,
        //           "owned": outpostClientData.owned,
        //           "event_effected": true,
        //           "selected": outpostClientData.selected,
        //         },[decimalToHexadecimal(clientGameData.current_game_id), decimalToHexadecimal(outpostClientData.id)],"ClientOutpostData",clientComponents);
            
        //     } 
        //     else 
        //     {

        //       setComponentQuick(
        //         {
        //           "id": outpostClientData.id,
        //           "owned": outpostClientData.owned,
        //           "event_effected": false,
        //           "selected": outpostClientData.selected,
        //         },[decimalToHexadecimal(clientGameData.current_game_id), decimalToHexadecimal(outpostClientData.id)],"ClientOutpostData",clientComponents);

        //     }
        //   },
        // });


      }
    });
  };
  