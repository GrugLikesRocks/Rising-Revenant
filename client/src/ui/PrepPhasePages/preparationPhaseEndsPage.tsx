import React, { useEffect, useState } from "react";
import { PrepPhaseStages } from "./prepPhaseManager";
import { getComponentValueStrict } from "@latticexyz/recs";

import "./PagesStyles/PrepPhaseEndsPageStyles.css";
import "./PagesStyles/BuyingPageStyle.css";

import { ClickWrapper } from "../clickWrapper";
import { useDojo } from "../../hooks/useDojo";
import { GAME_CONFIG } from "../../phaser/constants";
import { getEntityIdFromKeys } from "@dojoengine/utils";

interface PrepPhaseEndsPageProps {
    setMenuState: React.Dispatch<PrepPhaseStages>;
}

export const PrepPhaseEndsPage: React.FC<PrepPhaseEndsPageProps> = ({ setMenuState }) => {
    const [showBlocks, setShowBlocks] = useState(false);
    const [blocksLeft, setBlocksLeft] = useState(0);

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

    return (
        <ClickWrapper className="ppe-page-container">
            <h1>
                PREPARATION PHASE ENDS IN<br />
                <span onClick={toggleShowBlocks} className="hover-effect" >
                    {showBlocks ? `BLOCKS LEFT: ${blocksLeft}` : "DD: 5 HH: 5 MM: 5 SS: 5"}
                </span>
            </h1>

            <div className="button-container">
                <button className="button-style-prep-phase" style={{height: "fit-content", backgroundColor: "#77777757"}} onMouseDown={() => { setMenuState(PrepPhaseStages.BUY_REVS) }}>Summon More Revenants</button>
                <button className="button-style-prep-phase" style={{height: "fit-content" ,backgroundColor: "#77777757"}} onMouseDown={() => { setMenuState(PrepPhaseStages.BUY_REIN) }}>Buy more Reinforcements</button>
            </div>
        </ClickWrapper>
    );
};
