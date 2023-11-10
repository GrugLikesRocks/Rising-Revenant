import React, { useState } from "react";
import { PrepPhaseStages } from "./prepPhaseManager";

import "./PagesStyles/BuyingPageStyle.css"

import { PurchaseReinforcementProps } from "../../dojo/types";
import { ClickWrapper } from "../clickWrapper";
import { useDojo } from "../../hooks/useDojo";


import { toast } from 'react-toastify';
interface BuyReinforcementsPageProps {
    setMenuState: React.Dispatch<PrepPhaseStages>;
}

const notify = (message: string) => toast(message, {
    position: "top-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
});

export const BuyReinforcementPage: React.FC<BuyReinforcementsPageProps> = ({ setMenuState }) => {
    const [reinforcementNumber, setReinforcementNumber] = useState(2);
    const [priceOfReinforcements, setPriceOfReinforcements] = useState(5);



    const {
        account: { account },
        networkLayer: {
            systemCalls: { purchase_reinforcement },
        },
    } = useDojo()


    const buyReinforcements = async (num: number) => {

        const purchaseReinforcementProps: PurchaseReinforcementProps = {
            account: account,
            game_id: 1,
            count: num,
        }

        await purchase_reinforcement(purchaseReinforcementProps);
    }

    return (
        <div className="br-page-container">
            <ClickWrapper className="main-content">
                <h2 className="main-content-header">REINFORCE YOUR OUTPOST</h2>
                <div className="amount-section">
                    <div className="button-style" onMouseDown={() => { setReinforcementNumber(reinforcementNumber) }} style={{ aspectRatio: "1/1", width: "8%", textAlign: "center" }}> - </div>
                    <h2>{reinforcementNumber}</h2>
                    <div className="button-style" onMouseDown={() => { notify("") }} style={{ aspectRatio: "1/1", width: "8%", textAlign: "center" }}> + </div>
                </div>
                {/* <div className="button-style" onMouseDown={() => { buyReinforcements(reinforcementNumber) }}> Reinforce (Tot: {priceOfReinforcements * reinforcementNumber} $LORDS)</div> */}
                <div className="button-style" onMouseDown={() => { notify("Purchasing 2 free reinforces"); setMenuState(PrepPhaseStages.WAIT_PHASE_OVER); }}> Reinforce (2 Free Reinforces)</div>

                <div className="button-style" onMouseDown={() => { setMenuState(PrepPhaseStages.WAIT_PHASE_OVER) }}> Go Forward</div>
            </ClickWrapper>

            <div className="footer-text">1 Reinforcement = {priceOfReinforcements} $LORDS</div>
        </div>
    )
}
