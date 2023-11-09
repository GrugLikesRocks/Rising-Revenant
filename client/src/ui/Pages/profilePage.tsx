import React, { useState } from "react";

import "./PagesStyles/ProfilePageStyles.css";

import { MenuState } from "../Pages/mainMenuContainer";

import { HasValue, Has, getComponentValueStrict } from "@latticexyz/recs";

import { useEntityQuery } from "@latticexyz/react";

import { useDojo } from "../../hooks/useDojo";

import { ReinforceOutpostProps } from "../../dojo/types";
import { setComponentQuick } from "../../dojo/testCalls";
import { decimalToHexadecimal } from "../../utils";
import { GAME_CONFIG } from "../../phaser/constants";
import { ClickWrapper } from "../clickWrapper";
import { getEntityIdFromKeys } from "@dojoengine/utils";
interface ProfilePageProps {
  setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ setMenuState }) => {
  const closePage = () => {
    setMenuState(MenuState.NONE);
  };

  const {
    account: { account },
    networkLayer: {
      systemCalls: { reinforce_outpost, confirm_event_outpost },
      network: { clientComponents, contractComponents },
    },
  } = useDojo();

  const selectedOutposts = useEntityQuery([Has(clientComponents.ClientOutpostData, { owner: account.address })]);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const moveCameraHere = (x: number, y: number) => {

    const clientCameraComp = getComponentValueStrict(clientComponents.ClientCameraPosition, getEntityIdFromKeys([BigInt(GAME_CONFIG)]));
    
    setComponentQuick({"x": x, "y": y, "tile_index": clientCameraComp.tile_index},[getEntityIdFromKeys([BigInt(GAME_CONFIG)])], "ClientCameraPosition", clientComponents);
            
  }

  const reinforceOutpost = (outpost_id: any) => {
    const reinforceOutpostProps: ReinforceOutpostProps = {
      account: account,
      game_id: 0,
      outpost_id: outpost_id,
    };

    reinforce_outpost(reinforceOutpostProps);
  }


  return (
    <div className="profile-page-container">
      <div className="title-section">
        <h2>PROFILE</h2>
        <div className="title-cart-section">
          <h1>
            {" "}
            <img src="LOGO_WHITE.png" className="test-embed" alt=""></img> 5
          </h1>
          <h3>Reinforcement available</h3>
        </div>
      </div>
      <div className="info-section">
        <div className="table-section">
          <div className="table-container">
            <div className="table-title-container">
              <h2>Outpost ID</h2>
              <h2>Position</h2>
              <h2>Reinforcements</h2>
              <div style={{ backgroundColor: "black", flex: "1.5" }}></div>
            </div>
            <ClickWrapper className="table-items-container">
              {selectedOutposts.map((outpost: any, index: number) => (
                <div
                  key={index}
                  className="item-container-profile"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <h2>{getComponentValueStrict(clientComponents.ClientOutpostData, outpost).id}</h2>
                  <h2
                    onMouseDown={() => {
                      moveCameraHere(getComponentValueStrict(contractComponents.Outpost, outpost).x, getComponentValueStrict(contractComponents.Outpost, outpost).y);
                      setHoveredIndex(null);
                    }}
                  >
                    X: {getComponentValueStrict(contractComponents.Outpost, outpost).x}, Y:{" "}
                    {getComponentValueStrict(contractComponents.Outpost, outpost).y}
                  </h2>
                  <h2
                    onMouseDown={() => {
                      reinforceOutpost(getComponentValueStrict(clientComponents.ClientOutpostData, outpost).id);
                      setHoveredIndex(null);
                    }}
                  >
                    {getComponentValueStrict(contractComponents.Outpost, outpost).lifes}
                  </h2>
                  <div className="item-button" style={{ opacity: hoveredIndex === index ? 1 : 0 }}>
                    {hoveredIndex === index ? "Click To Move Here" : "Reinforce"}
                  </div>
                </div>
              ))}
            </ClickWrapper>
          </div>
        </div>
        <div className="buy-section">
          <div className="button-style-profile">Buy Reinforcements</div>
        </div>
      </div>
    </div>
  );
};
