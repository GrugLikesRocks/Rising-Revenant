import { useEntityQuery } from "@latticexyz/react";
import {
  EntityID,
  EntityIndex,
  Has,
  getComponentValue,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { PhaserLayer } from "../../phaser";
import "../../App.css";
import { GAME_ID } from "../../phaser/constants";
import { useDojo } from "../../hooks/useDojo";
import { ClickWrapper } from "../clickWrapper";

type Props = {
  layer: PhaserLayer;
};

export const OutpostList = ({ layer }: Props) => {
  const {
    networkLayer: {
      components: { Defence, OutpostEntity },
    },
  } = layer;

  const {
    account: { account },
    networkLayer: {
      systemCalls: { reinforce_outpost },
    },
  } = useDojo();

  const entities = useEntityQuery([Has(Defence)]);

  if (entities.length === 0) {
    return <div>No entities found.</div>;
  }

  return (
    <div className="profile-datatable-container ">
      <span className="revenant-title">Your Revenants:</span>
      <div className="data-container">
        <div className="fields-container">
          <div className="fields-name">Revenant_ID</div>
          <div className="fields-name">OUTPOST_ID</div>
          <div className="fields-name">Reinforcements</div>
        </div>
        <div className="elements-container">
          {entities.map((entity, index) => (
            <div className="sub-element-container" key={index}>
              <div className="element-data">{entity}</div>
              <div className="element-data">
                {getComponentValue(OutpostEntity, entity)?.entity_id || 0}
              </div>
              <div className="element-data">
                {getComponentValue(Defence, entity)?.plague || 0}
              </div>
              <ClickWrapper>
              <button
                onClick={() =>
                  reinforce_outpost(
                    account,
                    getComponentValue(OutpostEntity, entity)!.entity_id,
                  )
                }
              >
                reinforce
              </button>
                </ClickWrapper>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
