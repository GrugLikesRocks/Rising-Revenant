import { useEntityQuery } from "@latticexyz/react";
import {
  Has,
  getComponentValue,
} from "@latticexyz/recs";
import { PhaserLayer } from "../../phaser";
import "../../App.css";
import { useDojo } from "../../hooks/useDojo";

type Props = {
  layer: PhaserLayer;
};

export const OutpostList = ({ layer }: Props) => {
  const {
    networkLayer: {
      components: { Defence },
    },
  } = layer;

  // const {
  //   account: { account },
  //   networkLayer: {
  //     systemCalls: { reinforce_outpost },
  //   },
  // } = useDojo();

  const entities = useEntityQuery([Has(Defence)]);

  if (entities.length === 0) {
    return (
      <div className="profile-datatable-container ">
      <span className="revenant-title">Your Revenants:</span>
      <div className="data-container">
        <div className="fields-container">
          <div className="fields-name">revenant id</div>
          <div className="fields-name">outpost id</div>
          <div className="fields-name">reinforcement</div>
        </div>
        <div className="elements-container">
          
            <div className="sub-element-container">
              <div className="element-data">
                No data available
              </div>
              <div className="center-element-data">
                No data available
              </div>
              <div className="element-data">
                No data available
              </div>
            </div>
        </div>
      </div>
    </div>
    )
  }

  return (
    <div className="profile-datatable-container ">
      <span className="revenant-title">Your Revenants</span>
      <div className="data-container">
        <div className="fields-container">
          <div className="fields-name">revenant id</div>
          <div className="fields-name">outpost id</div>
          <div className="fields-name">reinforcements</div>
        </div>
        <div className="elements-container">
          {entities.map((entity, index) => (
            <div className="sub-element-container" key={index}>
              <div className="element-data">{entity}</div>
              <div className="center-element-data"> null
               
              </div>
              <div className="element-data">
                {getComponentValue(Defence, entity)?.plague || 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
