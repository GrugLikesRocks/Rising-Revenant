import {
  Has,
  defineEnterSystem,
  defineSystem,
  getComponentValueStrict,
  getComponentValue,
  EntityIndex,
  setComponent
} from "@latticexyz/recs";
import { PhaserLayer } from "..";
import { Assets } from "../constants";
import { gameEvents } from "./eventEmitter";

import { StateOutpost } from "../constants";

export const spawnOutposts = (layer: PhaserLayer) => {
  let entities: EntityIndex[] = []; // this will need to be changed

  const {
    world,
    scenes: {
      Main: { objectPool,camera },
    },
    networkLayer: {
      components: {
        Position,
        Defence,
        WorldEvent,
        ClickComponent,
        ClientCameraComponent,
        OutpostState
      },
    },
  } = layer;

  // start system called on the instantiation of an outpost
  defineEnterSystem(world, [Has(Position), Has(Defence)], ({ entity }) => {
    const outpostObj = objectPool.get(entity, "Sprite");

    if (!entities.includes(entity)) {
      entities.push(entity);
    }

    outpostObj.setComponent({
      id: "texture",
      once: (sprite) => {
        sprite.setTexture(Assets.CastleHealthyAsset); // Assuming "outpost" is the key for the outpost texture.
        sprite.scale = 0.25;
      },
    });
  });



  defineSystem(world, [Has(Position), Has(Defence)], ({ entity }) => {
        const position = getComponentValueStrict(Position, entity);

        const player = objectPool.get(entity, "Sprite")

        player.setComponent({
            id: 'position',
            once: (sprite) => {
                sprite.setPosition(position?.x, position?.y);
            }
        })

    });





  //comp for the center of the camera could be user here for effects, this is optional fully but is wrong anyway
  //   defineSystem(world, [Has(Position), Has(Defence)], ({ entity }) => {});

  defineSystem(world, [Has(WorldEvent), Has(Position)], ({ entity }) => {
    // const playerObj = objectPool.get(entity, "Sprite");
    // Your existing setup
    const dataEvent = getComponentValue(WorldEvent, entity);
    let radius = dataEvent?.radius  || 0 ;

    if (radius === 0) {return;}

    const dataEventPosition = getComponentValue(Position, entity);
    let positionX = dataEventPosition?.x  || 0;
    let positionY = dataEventPosition?.y  || 0;
    
    for (let index = 0; index < entities.length; index++) {
      const entityId = entities[index];
      const playerObj = objectPool.get(entityId, "Sprite");

      let change : boolean = false;

      playerObj.setComponent({
        id: "texture",
        once: (sprite) => {
            
          const spriteCenterX = sprite.x + (sprite.width * sprite.scale) / 2;
          const spriteCenterY = sprite.y + (sprite.height * sprite.scale) / 2;
          
          const distance = Math.sqrt(
            (spriteCenterX - positionX) ** 2 + (spriteCenterY - positionY) ** 2
          );

          let change : boolean = false;

          if (distance <= radius) {
            sprite.setTexture(Assets.CastleDamagedAsset); 
            change = true;

          } else {
            sprite.setTexture(Assets.CastleHealthyAsset); 
            
            change = false;
          }
        },
      });

      if (change)
      {
        setComponent(OutpostState, entityId, {
            state: StateOutpost.Damaged as number,
          });
      }
      else
      {
        setComponent(OutpostState, entityId, {
            state: StateOutpost.Healthy as number,
          });
      }
    }
  });


  // click checks for the ui tooltip
  defineSystem(
    world,
    [Has(ClickComponent), Has(ClientCameraComponent)],
    ({ entity }) => {

      if (entities.length === 0) {
        return;
      }

      const positionClick = getComponentValueStrict(ClickComponent, entity);
    //   const positionCenterCam = getComponentValueStrict(ClientCameraComponent, entity);
      let positionX = positionClick.x - camera.phaserCamera.width / 2 ;   //shoudlnt be calculated here
      let positionY = positionClick.y - camera.phaserCamera.height / 2 ;

      let foundEntity: EntityIndex | null = null; // To store the found entity

      for (let index = 0; index < entities.length; index++) {
        const element = entities[index];
        const playerObj = objectPool.get(element, "Sprite");

        playerObj.setComponent({
          id: "texture",
          once: (sprite) => {
            const minX = sprite.x;
            const minY = sprite.y;

            const maxX = minX + sprite.width * sprite.scale;
            const maxY = minY + sprite.height * sprite.scale;
            if (
              positionX >= minX &&
              positionX <= maxX &&
              positionY >= minY &&
              positionY <= maxY
            ) {
              foundEntity = element;
            }
          },
        });

        if (foundEntity) {
          break;
        }
      }

      if (foundEntity) {
        gameEvents.emit("spawnTooltip", positionClick.x, positionClick.y, foundEntity);
      }
    }
  );
};
