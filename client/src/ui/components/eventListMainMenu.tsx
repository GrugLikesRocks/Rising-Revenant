import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValue } from "@latticexyz/recs";
import { PhaserLayer } from "../../phaser";
import "../styles/MainPageStyle.css";

type Props = {
  layer: PhaserLayer;
};

export const EventList = ({ layer }: Props) => {
  const {
    networkLayer: {
      components: { WorldEvent },
    },
  } = layer;

  const entities = useEntityQuery([Has(WorldEvent)]);

  //get the current state of the game and deal with that

  if (entities.length === 0) {
    return (
      <div>
        <ul className="main-menu-event-feed-list-element">
          <li>NO EVENTS YET</li>
        </ul>
      </div>
    );
  }

  return (
    <div>
      <ul className="main-menu-event-feed-list-element">
        {entities.map((item, index) => (
          <li key={index}>Event at x:{getComponentValue(WorldEvent, item)?.x || "null"} y:{getComponentValue(WorldEvent, item)?.y || "null"}, radius: {getComponentValue(WorldEvent, item)?.radius || "null"}</li>
        ))}
      </ul>
    </div>
  );
};
