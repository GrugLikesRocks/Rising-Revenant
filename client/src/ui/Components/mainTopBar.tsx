import React, { useEffect, useState } from "react";

import "./ComponentsStyles/TopBarStyles.css";

import {
    EntityIndex,
    Has,
    getComponentValue,
    getComponentValueStrict,
  } from "@latticexyz/recs";
  import { useEntityQuery } from "@latticexyz/react";
import { useDojo } from "../../hooks/useDojo";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { GAME_CONFIG } from "../../phaser/constants";


export const TopBarComponent = () => {
    const [isloggedIn, setIsLoggedIn] = useState(true);
    const [inGame, setInGame] = useState(1);

    const [numberOfRevenants, setNumberOfRevenants] = useState(0);
    const [Jackpot, setJackpot] = useState(2000);

    const [reinforcementNumber, setReinforcementNumber] = useState(0);


    const {
        networkLayer: {
          network: { contractComponents, clientComponents },
        },
      } = useDojo();
    

    const outpostArray = useEntityQuery([Has(contractComponents.Outpost)]);

    const gameClientData = getComponentValue(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG)]));
    const gameData = getComponentValue(contractComponents.Game, getEntityIdFromKeys([BigInt(gameClientData.current_game_id)]));
    

      useEffect(() => {

        if (gameData === undefined)
        {
            return;
        }
        setJackpot(gameData.prize);
        setInGame(gameData.game_state);

        setNumberOfRevenants(outpostArray.length);

        const balance = getComponentValue(contractComponents.Reinforcement, getEntityIdFromKeys([BigInt(gameClientData.current_game_id), BigInt(gameClientData.user_account_address)]));

        if (balance === undefined)
        {
            setReinforcementNumber(0);
        }
        else
        {
            setReinforcementNumber(balance.balance);
        }

      }, [outpostArray, gameData]);


    return (
        <div className="top-bar-container-layout">
            <div style={{  width: "100%", height: "30%" }}></div>
            <div className="top-bar-content-section">
                <div className="left-section">
                    <div className="left-section-image-div">
                       <div className="logo-img"></div>
                    </div>
                    <div className="text-section">
                        <h4>Jackpot: {Jackpot} $LORDS</h4>
                    </div>
                </div>
                <div className="name-section">
                    <div className="game-title">Rising Revenant</div>
                </div>
                <div className="right-section">
                    <div className="text-section">
                        
                        {inGame === 2? <h4>Outposts Alive: {numberOfRevenants}/2000</h4> : <h4>Outposts Summoned: {outpostArray.length || "####"}/2000</h4>}
                        <h4>Reinforcement: {reinforcementNumber}</h4>
                    </div>
                    
                    {isloggedIn ? <h3> <img src="LOGO_WHITE.png" className="chain-logo"></img>0x9485...213</h3> : <button>Log in now</button>}
                </div>
            </div>
        </div>
    );
};
