import {
    Has,
    defineSystem,
    getComponentValueStrict,
    getComponentEntities,
    setComponent,
    EntityIndex,
  } from "@latticexyz/recs";
  import { PhaserLayer } from "..";
  import { GAME_CONFIG } from "../constants";

  export const eventManager = (layer: PhaserLayer) => {
    const {
      world,
      scenes: {
        Main: { objectPool },
      },
      networkLayer: {
        components: { Outpost, WorldEvent, ClientOutpostData , GameEntityCounter, ClientGameData},
      },
    } = layer;
  
    defineSystem(world, [Has(WorldEvent)], ({ entity }) => {

    
      const dataEvent = getComponentValueStrict(WorldEvent, entity);
  
      if (!dataEvent) {  // this doesnt make sense
        return;
      }

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

      const gameEntityCounter = getComponentValueStrict(GameEntityCounter, getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_id as EntityIndex);
  
      for (const outpostEntityValue of outpostArray) {
  
        const outpostClientData = getComponentValueStrict(ClientOutpostData, outpostEntityValue);
        const outpostEntityData = getComponentValueStrict(Outpost, outpostEntityValue);
  
        const playerObj = objectPool.get(outpostEntityValue, "Sprite");
        
        if (outpostEntityData.last_affect_event_id === gameEntityCounter.event_count)
        {
          // console.log("\n\nis this even hitting")
          // console.log("if this is then this si the last effect ", outpostEntityData.last_affect_event_id)
          // console.log("and this si the current last event ", gameEntityCounter.event_count)

          setComponent(ClientOutpostData, outpostEntityValue, {
            id: outpostClientData.id,
            owned: outpostClientData.owned,
            event_effected: false,
            selected: outpostClientData.selected,
          });
        
          continue;
        }

        playerObj.setComponent({
          id: "texture",
          once: (sprite) => {

            const distance = Math.sqrt(
              (Number(getComponentValueStrict(Outpost, outpostEntityValue).x) - positionX) ** 2 + (Number(getComponentValueStrict(Outpost, outpostEntityValue).y)- positionY) ** 2
            );
  
            if (distance <= radius) {

              setComponent(ClientOutpostData, outpostEntityValue, {
                id: outpostClientData.id,
                owned: outpostClientData.owned,
                event_effected: true,
                selected: outpostClientData.selected,
              });

            } 
            else 
            {
              setComponent(ClientOutpostData, outpostEntityValue, {
                id: outpostClientData.id,
                owned: outpostClientData.owned,
                event_effected: false,
                selected: outpostClientData.selected,
              });

            }
          },
        });
      }
    });
  };
  