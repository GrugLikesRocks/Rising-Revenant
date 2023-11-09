import React, { useEffect, useState } from "react";
import { getComponentValueStrict } from "@latticexyz/recs";

import { ClickWrapper } from "../clickWrapper";

import { VideoComponent } from "./videoPage";
import { TopBarComponent } from "../Components/mainTopBar";
import { BuyRevenantPage } from "./summonRevenantPage";
import { BuyReinforcementPage } from "./buyReinforcementsPage";
import { PrepPhaseEndsPage } from "./preparationPhaseEndsPage";
import { WaitForTransactionPage } from "./waitForTransactionPage";
import { DebugPage } from "../Pages/debugPage";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { GAME_CONFIG } from "../../phaser/constants";
import { useDojo } from "../../hooks/useDojo";

export enum PrepPhaseStages {
    VID,
    BUY_REVS,
    WAIT_TRANSACTION,
    BUY_REIN,
    WAIT_PHASE_OVER,
    DEBUG
}

export const PrepPhaseManager = () => {

    const [prepPhaseStage, setPrepPhaseStage] = useState<PrepPhaseStages>(PrepPhaseStages.VID);

    const [showBlocks, setShowBlocks] = useState(true);
    const [blocksLeft, setBlocksLeft] = useState(0);

    const {
        networkLayer: {
          network: { contractComponents, clientComponents },
          systemCalls: { view_block_count}
        },
      } = useDojo();



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
        const handleKeyPress = (event: KeyboardEvent) => {
        
          if (event.key === 'j') {
            if (prepPhaseStage === PrepPhaseStages.DEBUG) {
                setPrepPhaseStage(PrepPhaseStages.BUY_REVS);
            } else {
                setPrepPhaseStage(PrepPhaseStages.DEBUG);
            }
            console.log("called debu")
          }
        };
    
        window.addEventListener('keydown', handleKeyPress);
    
        return () => {
          window.removeEventListener('keydown', handleKeyPress);
        };
      }, [prepPhaseStage]);


    const onVideoDone = () => {
        setPrepPhaseStage(PrepPhaseStages.BUY_REVS);
    }

    if (prepPhaseStage === PrepPhaseStages.VID) {
        return (<VideoComponent onVideoDone={onVideoDone} />)    // this is missin the video done
    }


 

    const setMenuState = (state: PrepPhaseStages) => {
        setPrepPhaseStage(state);
    }

    
    return (<div className="main-page-container-layout">
        <div className='main-page-topbar'>
            <TopBarComponent />
        </div>

        <div className='main-page-content'>
            <div className='page-container' style={{backgroundColor: "white"}}>
                {prepPhaseStage === PrepPhaseStages.BUY_REVS && <BuyRevenantPage setMenuState={setMenuState}/>}
                {prepPhaseStage === PrepPhaseStages.WAIT_TRANSACTION && <WaitForTransactionPage setMenuState={setMenuState} />}
                {prepPhaseStage === PrepPhaseStages.BUY_REIN && <BuyReinforcementPage setMenuState={setMenuState}/>}
                {prepPhaseStage === PrepPhaseStages.WAIT_PHASE_OVER && <PrepPhaseEndsPage setMenuState={setMenuState}/>}
                {prepPhaseStage === PrepPhaseStages.DEBUG && <DebugPage/>}
            </div>

        </div>

        <ClickWrapper className='prep-phase-text' onMouseDown={() => {setShowBlocks(!showBlocks)}}> <h2> Preparation phase ends in <br /> {showBlocks ? "DD: 5 HH: 5 MM: 5 SS: 5": `${blocksLeft} Blocks`}</h2></ClickWrapper>

    </div>);

};
