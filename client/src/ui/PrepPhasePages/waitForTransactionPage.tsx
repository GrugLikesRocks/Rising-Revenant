import React, { useState, useEffect } from "react";

import {getComponentValueStrict} from "@latticexyz/recs";

import "./PagesStyles/WaitForTransactionPageStyle.css";

import { PrepPhaseStages } from "./prepPhaseManager";
import { ClickWrapper } from "../clickWrapper";
import { decimalToHexadecimal } from "../../utils";
import { GAME_CONFIG } from "../../phaser/constants";
import { useDojo } from "../../hooks/useDojo";
import { getEntityIdFromKeys } from "@dojoengine/utils";

interface WaitForTransactionPageProps {
    setMenuState: React.Dispatch<PrepPhaseStages>;
}

export const WaitForTransactionPage: React.FC<WaitForTransactionPageProps> = ({ setMenuState }) => {
    const [showBlocks, setShowBlocks] = useState(true);
    const [blocksLeft, setBlocksLeft] = useState(1234567);

    const {
        networkLayer: {
          network: { contractComponents, clientComponents },
          systemCalls: { view_block_count}
        },
      } = useDojo();

    const toggleShowBlocks = () => {
        setShowBlocks((prevShowBlocks) => !prevShowBlocks);
    };

    useEffect(() => {

        const getBlocksLeft = async () => {

            const clientGame = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG)]));
            const gameData = getComponentValueStrict(contractComponents.Game, getEntityIdFromKeys([BigInt(clientGame.current_game_id)]));

            const current_block = await view_block_count();
            const blocksLeft = gameData.start_block_number + gameData.preparation_phase_interval - current_block!;
            setBlocksLeft(blocksLeft);
        }

        const intervalId = setInterval(() => { 
            getBlocksLeft();
        }, 5000);

        getBlocksLeft();

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            goNextPage();
        }, 20000);

        return () => clearTimeout(timeoutId);
    }, []);

    const goNextPage = () => {
        setMenuState(PrepPhaseStages.BUY_REIN);
    };

    return (
        <ClickWrapper className="ppe-page-container">
            <h1>
                PREPARATION PHASE ENDS IN<br />
                <span onClick={toggleShowBlocks} className="hover-effect">
                    {showBlocks ? `BLOCKS LEFT: ${blocksLeft}` : "DD: 5 HH: 5 MM: 5 SS: 5"}
                </span>
            </h1>
        </ClickWrapper>
    );
};
