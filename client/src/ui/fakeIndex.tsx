import { Wrapper } from "./wrapper";
import React, { useEffect, useState } from "react";

import { getComponentValueStrict } from "@latticexyz/recs";

import { MainMenuContainer } from "./Pages/mainMenuContainer";
import { PrepPhaseManager } from "./PrepPhasePages/prepPhaseManager";

import { decimalToHexadecimal } from "../utils";
import { GAME_CONFIG } from "../phaser/constants";
import { getEntityIdFromKeys, setComponentFromGraphQLEntity } from "@dojoengine/utils";
import { createComponentStructure, getUpdatedGameData, setComponentQuick } from "../dojo/testCalls";
import { useDojo } from "../hooks/useDojo";

export const MainStateManager = () => {

    const [gamePhase, setGamePhase] = useState(1);

    const {
        account: { account },
        networkLayer: {
            network: { graphSdk,contractComponents, clientComponents },
            systemCalls: { view_block_count }
        },
    } = useDojo();

    useEffect(() => {
        const clientGameData = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG)]));
        setGamePhase(clientGameData.current_game_state);
    }, []);


    useEffect(() => {

        const checkGamePhase = async () => {
            
           await getUpdatedGameData(view_block_count, clientComponents,contractComponents,account.address,graphSdk);

            const clientGameData = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG)]));
            setGamePhase(clientGameData.current_game_state);
        }

        const intervalId = setInterval(() => { 

            checkGamePhase();

        }, 10000);

        return () => clearInterval(intervalId);
    }, [gamePhase]);



    return (
        <Wrapper>
            {gamePhase === 1 && <PrepPhaseManager />}

            {gamePhase === 2 && <MainMenuContainer />}
        </Wrapper>
    );
};
