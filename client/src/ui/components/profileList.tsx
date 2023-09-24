import { useEntityQuery } from "@latticexyz/react";
import {
  Has,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { PhaserLayer } from "../../phaser";
import "../../App.css";
import { userAccountAddress } from "../../phaser/constants";
import { bigIntToHexWithPrefix } from "../../utils";

type Props = {
  layer: PhaserLayer;
};

export const OutpostList = ({ layer }: Props) => {
  const {
    networkLayer: {
      components: { Outpost },
    },
  } = layer;

  const entities = useEntityQuery([Has(Outpost)]);



  const playerOutpostsOnly = entities.filter((entity) => {
    const ownerAddressOfOutpost = getComponentValueStrict(Outpost, entity)?.owner;
    console.log(ownerAddressOfOutpost)
    return bigIntToHexWithPrefix(ownerAddressOfOutpost) === userAccountAddress;
  });

  if (playerOutpostsOnly.length === 0) {
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
          {playerOutpostsOnly.map((entity, index) => (
            <div className="sub-element-container" key={index}>
              <div className="element-data">{entity}</div>
              <div className="center-element-data"> null
               
              </div>
              <div className="element-data">
                {getComponentValueStrict(Outpost, entity)?.lifes}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
