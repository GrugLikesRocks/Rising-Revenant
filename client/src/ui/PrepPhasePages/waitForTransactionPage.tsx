// Import necessary dependencies from React
import React, { useState, useEffect } from "react";

// Import required components and utilities
import { getComponentValueStrict } from "@latticexyz/recs";
import { PrepPhaseStages } from "./prepPhaseManager";
import { ClickWrapper } from "../clickWrapper";
import { decimalToHexadecimal } from "../../utils";
import { GAME_CONFIG } from "../../phaser/constants";
import { useDojo } from "../../hooks/useDojo";
import { getEntityIdFromKeys } from "@dojoengine/utils";

// Define the WaitForTransactionPage component
interface WaitForTransactionPageProps {
    setMenuState: React.Dispatch<PrepPhaseStages>;
}

export const WaitForTransactionPage: React.FC<WaitForTransactionPageProps> = ({ setMenuState }) => {
    // State variables for managing the display of blocks and the countdown
    const [showBlocks, setShowBlocks] = useState(true);
    const [blocksLeft, setBlocksLeft] = useState(1234567);
    const [ellipsisCount, setEllipsisCount] = useState(0);

    const {
        networkLayer: {
            network: { contractComponents, clientComponents },
            systemCalls: { view_block_count }
        },
    } = useDojo();

    const toggleShowBlocks = () => {
        setShowBlocks((prevShowBlocks) => !prevShowBlocks);
    };

    const goNextPage = () => {
        setMenuState(PrepPhaseStages.BUY_REIN);
    };

    const updateEllipsis = () => {
        setEllipsisCount((prevCount) => (prevCount < 3 ? prevCount + 1 : 0));
    };

    useEffect(() => {
        const getBlocksLeft = async () => {
            const clientGame = getComponentValueStrict(clientComponents.ClientGameData, getEntityIdFromKeys([BigInt(GAME_CONFIG)]));
            const gameData = getComponentValueStrict(contractComponents.Game, getEntityIdFromKeys([BigInt(clientGame.current_game_id)]));

            const current_block = await view_block_count();
            const blocksLeft = gameData.start_block_number + gameData.preparation_phase_interval - current_block!;
            setBlocksLeft(blocksLeft);

        };

        const intervalId = setInterval(() => {
            getBlocksLeft();
        }, 5000);

        getBlocksLeft();
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            
            updateEllipsis();
        }, 500);

        
        updateEllipsis();
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            goNextPage();
        }, 10000);

        return () => clearTimeout(timeoutId);
    }, []);


    return (
        <ClickWrapper className="ppe-page-container">
            <h1>
                YOUR REVENANTS ARE BEING SUMMONED <br /> READY TO CREATE AN OUTPOST
                <span >
                    {Array.from({ length: ellipsisCount }, (_, index) => (
                        <span key={index}>.</span>
                    ))}
                </span>
            </h1>
        </ClickWrapper>
    );
};
