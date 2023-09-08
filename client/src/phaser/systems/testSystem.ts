import {
  EntityIndex,
  Has,
  defineEnterSystem,
  defineSystem,
  defineUpdateQuery,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { PhaserLayer } from "..";
import { gameEvents } from "./eventEmitter"; // Update with your actual file path

export const testSystem = (layer: PhaserLayer) => {
  let entities: EntityIndex[] = [];

  const {
    world,
    scenes: {
      Main: { objectPool },
    },
    networkLayer: {
      components: { ClickComponent, ClientCameraComponent, Position },
    },
  } = layer;

  defineEnterSystem(world, [Has(Position)], ({ entity }) => {
    entities.push(entity);
  });

  defineSystem(
    world,
    [Has(ClickComponent), Has(ClientCameraComponent)],
    ({ entity }) => {
      if (entities.length === 0) {
        return;
      }
      console.log("call");
      const position = getComponentValueStrict(ClickComponent, entity);
      let positionX = position.x;
      let positionY = position.y;

      console.log(
        "this si the position fo the mouse click",
        positionX,
        positionY
      );

      let foundEntity: EntityIndex | null = null; // To store the found entity

      for (let index = 0; index < entities.length; index++) {
        const element = entities[index];
        const playerObj = objectPool.get(element, "Sprite");

        playerObj.setComponent({
          id: "texture",
          once: (sprite) => {
            const minX = sprite.x;
            const minY = sprite.y;
            console.log(minX, minY);

            const maxX = minX + sprite.width * sprite.scale;
            const maxY = minY + sprite.height * sprite.scale;
            console.log(maxX, maxY);
            console.log(positionX, positionY);
            if (
              positionX >= minX &&
              positionX <= maxX &&
              positionY >= minY &&
              positionY <= maxY
            ) {
              foundEntity = element;
              console.log("found");
            }
          },
        });

        if (foundEntity) {
          break;
        }
      }

      if (foundEntity) {
        gameEvents.emit("spawnTooltip", position.x, position.y, foundEntity);
      }
    }
  );
};
