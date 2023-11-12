// import React, { useEffect, useState } from "react";
// import { useDojo } from "../../DojoContext";
// import { CreateGameProps, CreateRevenantProps } from "../../dojo/types";
// import { PrepPhaseStages } from "./prepPhaseManager";

// import { HasValue, EntityIndex, getComponentValueStrict, setComponent } from "@latticexyz/recs";
// import { useEntityQuery } from "@latticexyz/react";

// import "./PagesStyles/BuyingPageStyle.css"

// import { ClickWrapper } from "../clickWrapper";
// import { getEntityIdFromKeys } from "@dojoengine/utils";
// import { GAME_CONFIG } from "../../phaser/constants";


// interface BuyRevenantPageProps {
//     setMenuState: React.Dispatch<PrepPhaseStages>;
// }


// const IMAGES = ["./revenants/1.png", "./revenants/2.png", "./revenants/3.png", "./revenants/4.png", "./revenants/5.png"]

// export const BuyRevenantPage: React.FC<BuyRevenantPageProps> = ({ setMenuState }) => {
//     const [revenantNumber, setRevenantNumber] = useState(5);
//     const [revenantCost, setRevenantCost] = useState(10);

//     const [backgroundImage, setBackgroundImage] = useState("");

//     const {
//         account: { account },
//         networkLayer: {
//             network: { contractComponents, clientComponents },
//             systemCalls: { create_revenant },
//         },
//     } = useDojo();


//     useEffect(() => {
//         // Set a random background image when the component is loaded
//         const randomImage = IMAGES[Math.floor(Math.random() * IMAGES.length)];
//         setBackgroundImage(`url(${randomImage})`);
//       }, []);

//     const summonRev = async (num : number) => {
//         const gameTrackerComp = getComponentValueStrict(
//           contractComponents.GameTracker,
//           getEntityIdFromKeys([BigInt(GAME_CONFIG)])
//         );
//         const game_id: number = gameTrackerComp.count;
    
//         const gameEntityCounter = getComponentValueStrict(
//           contractComponents.GameEntityCounter,
//           getEntityIdFromKeys([BigInt(game_id)])
//         );
//         const rev_counter: number = gameEntityCounter.outpost_count;
            
//         for (let index = 0; index < num; index++) {
//             const createRevProps: CreateRevenantProps = {
//                 account: account,
//                 game_id: game_id,
//                 name: "Revenant " + rev_counter,
//               };  
      
//               await create_revenant(createRevProps);
//         }

//         setMenuState(PrepPhaseStages.WAIT_TRANSACTION);
//       };

//     const ownReveants = useEntityQuery([HasValue(contractComponents.Outpost, { owner: account.address })]);

//     return (
//         <div className="summon-revenant-page-container" style={{backgroundImage: backgroundImage}}>
//             <ClickWrapper className="main-content">
//                 <h2 className="main-content-header">SUMMON A REVENANT</h2>
//                 <div className="amount-section">
//                     <div className="button-style-prep-phase" onMouseDown={() => { setRevenantNumber(revenantNumber - 1)}} style={{ aspectRatio: "1/1", width: "8%", textAlign: "center" }}> - </div>
//                     <h2>{revenantNumber}</h2>
//                     <div className="button-style-prep-phase" onMouseDown={() => { setRevenantNumber(revenantNumber + 1)}} style={{ aspectRatio: "1/1", width: "8%", textAlign: "center" }}> + </div>
//                 </div>
//                 {/* <div className="button-style-prep-phase" onMouseDown={() => {summonRev(revenantNumber)}}>Summon (Tot: {revenantCost * revenantNumber} $LORDS)</div> */}
//                 {ownReveants.length > 0 && <div className="button-style-prep-phase" onMouseDown={() => {setMenuState(PrepPhaseStages.WAIT_TRANSACTION)}}>Move To Next Screen</div>}
//             </ClickWrapper>
//             <div className="footer-text" >1 Revenant = {revenantCost} $LORDS</div>
//         </div>
//     )
// }





import React, { useEffect, useState } from "react";
import { useDojo } from "../../hooks/useDojo";
import { CreateRevenantProps } from "../../dojo/types";
import { PrepPhaseStages } from "./prepPhaseManager";

import { HasValue,  getComponentValueStrict } from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";

import "./PagesStyles/BuyingPageStyle.css"

import { ClickWrapper } from "../clickWrapper";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { GAME_CONFIG } from "../../phaser/constants";


interface BuyRevenantPageProps {
    setMenuState: React.Dispatch<PrepPhaseStages>;
}

const IMAGES = ["./revenants/1.png", "./revenants/2.png", "./revenants/3.png", "./revenants/4.png", "./revenants/5.png"]


const max = 2;

export const BuyRevenantPage: React.FC<BuyRevenantPageProps> = ({ setMenuState }) => {
    const [revenantNumber, setRevenantNumber] = useState(2);
    const [revenantCost, setRevenantCost] = useState(10);

    const [backgroundImage, setBackgroundImage] = useState("");

    const {
        account: { account },
        networkLayer: {
            network: { contractComponents },
            systemCalls: { create_revenant },
        },
    } = useDojo();


    useEffect(() => {
        // Set a random background image when the component is loaded
        const randomImage = IMAGES[Math.floor(Math.random() * IMAGES.length)];
        setBackgroundImage(`url(${randomImage})`);
      }, []);

    const summonRev = async (num : number) => {
        const gameTrackerComp = getComponentValueStrict(
          contractComponents.GameTracker,
          getEntityIdFromKeys([BigInt(GAME_CONFIG)])
        );
        const game_id: number = gameTrackerComp.count;
    
        const gameEntityCounter = getComponentValueStrict(
          contractComponents.GameEntityCounter,
          getEntityIdFromKeys([BigInt(game_id)])
        );

        const rev_counter: number = gameEntityCounter.outpost_count;
            
        for (let index = 0; index < num; index++) {
            const createRevProps: CreateRevenantProps = {
                account: account,
                game_id: game_id,
                name: "Revenant " + rev_counter,
              };  
      
              await create_revenant(createRevProps);
        }

        setMenuState(PrepPhaseStages.WAIT_TRANSACTION);
      };

    const ownReveants = useEntityQuery([HasValue(contractComponents.Outpost, { owner: account.address })]);

    useEffect(() => {

        if (ownReveants.length === max)
        {
            return;
        }

        if (revenantNumber > max - ownReveants.length)
        {
            setRevenantNumber(max - ownReveants.length);
        }

        if (revenantNumber < 1)
        {
            setRevenantNumber(1);
        }

    }, [revenantNumber, ownReveants]);


    return (
        <div className="summon-revenant-page-container" style={{backgroundImage: backgroundImage}}>
            <ClickWrapper className="main-content">
                <h2 className="main-content-header">SUMMON A REVENANT</h2>
                <div className="amount-section">
                    <div className="button-style-prep-phase" onMouseDown={() => {setRevenantNumber(revenantNumber - 1)}} style={{ aspectRatio: "1/1", width: "8%", textAlign: "center" }}> - </div>
                    <h2>{revenantNumber}</h2>
                    <div className="button-style-prep-phase" onMouseDown={() => {setRevenantNumber(revenantNumber +2)}} style={{ aspectRatio: "1/1", width: "8%", textAlign: "center" }}> + </div>
                </div>

                {ownReveants.length <= max && ownReveants.length !== max  &&<div className="button-style-prep-phase" onMouseDown={() => {summonRev(revenantNumber)}}>Summon {revenantNumber} Revenants (Free $LORDS)</div>}
                {ownReveants.length > 0 && ownReveants.length !== max && <div className="button-style-prep-phase" onMouseDown={() => {setMenuState(PrepPhaseStages.WAIT_TRANSACTION)}}>Click to continue <br />(Can Still summon {max-ownReveants.length})</div>}
                {ownReveants.length === max && <div className="button-style-prep-phase" onMouseDown={() => {setMenuState(PrepPhaseStages.WAIT_TRANSACTION)}}>Maximum number of revenants have<br />been summoned for this demo <br/>Click to continue</div>}
            
            </ClickWrapper>
            <div className="footer-text" >1 Revenant = {revenantCost} $LORDS</div>
        </div>
    )
}