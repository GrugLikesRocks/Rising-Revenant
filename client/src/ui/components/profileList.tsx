import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValueStrict } from "@latticexyz/recs";
import { PhaserLayer } from "../../phaser";
import "../../App.css";

import { useDojo } from "../../hooks/useDojo";
import { ClickWrapper } from "../clickWrapper";
import { bigIntToHexWithPrefix } from "../../utils";

type Props = {
  layer: PhaserLayer;
};

export const OutpostList = ({ layer }: Props) => {

  const {
    networkLayer: {
      components: { Outpost, ClientOutpostData },
    },
  } = layer;

  const {
    account: { account },
    networkLayer: {
      systemCalls: { reinforce_outpost },
    },
  } = useDojo();

  const entities = useEntityQuery([Has(Outpost)]);

  const playerOutpostsOnly = entities.filter((entity) => {
    const ownerAddressOfOutpost = getComponentValueStrict(
      Outpost,
      entity
    )?.owner;

    return account.address === bigIntToHexWithPrefix(BigInt(ownerAddressOfOutpost));
  });

  const setCameraToCoordinate = (x: number, y: number) => {
    console.log("setting camera to: ", x, y);   // this might be an issue becuase the effect needs to be updated too
  };

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
              <div className="element-data">No data available</div>
              <div className="center-element-data">No data available</div>
              <div className="element-data">No data available</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-datatable-container ">
      <span className="revenant-title">Your Revenants</span>
      <div className="data-container">
        <div className="fields-container">
          <div className="fields-name">revenant id</div>
          <div className="fields-name">position</div>
          <div className="fields-name">reinforcements</div>
        </div>
        <div className="elements-container">
          {playerOutpostsOnly.map((entity, index) => (
            <div className="sub-element-container" key={index}>
              <div className="element-data">
                {String(getComponentValueStrict(ClientOutpostData, entity).id)}
              </div>

              <ClickWrapper
                className="center-element-data"
                onMouseDown={() =>
                  setCameraToCoordinate(
                    getComponentValueStrict(Outpost, entity).x,
                    getComponentValueStrict(Outpost, entity).y
                  )}
              >
                x: {getComponentValueStrict(Outpost, entity).x} y:
                {getComponentValueStrict(Outpost, entity)?.y}
              </ClickWrapper>

              <ClickWrapper
                className="element-data"
                // onMouseEnter={() => setShowTooltip(true)}
                // onMouseLeave={() => setShowTooltip(false)}
                onMouseDown={() =>

                  reinforce_outpost(account,getComponentValueStrict(ClientOutpostData, entity).id )
                  
                  }
              >
                {String(getComponentValueStrict(Outpost, entity).lifes)}
              </ClickWrapper>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
