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
      components: { WorldEvent, Position },
    },
  } = layer;

  const entities = useEntityQuery([Has(WorldEvent), Has(Position)]);

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
          <li key={index}>Event at x:{getComponentValue(Position, item)?.x || "null"} y:{getComponentValue(Position, item)?.y || "null"}, radius: {getComponentValue(WorldEvent, item)?.radius || "null"}</li>
        ))}
      </ul>
    </div>
  );
};
