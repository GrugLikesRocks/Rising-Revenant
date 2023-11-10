import React, { useState } from "react";
import { PrepPhaseStages } from "./prepPhaseManager";

import "./PagesStyles/BuyingPageStyle.css"

import { PurchaseReinforcementProps } from "../../dojo/types";
import { ClickWrapper } from "../clickWrapper";
import { useDojo } from "../../hooks/useDojo";


interface BuyReinforcementsPageProps {
    setMenuState: React.Dispatch<PrepPhaseStages>;
}

export const BuyReinforcementPage: React.FC<BuyReinforcementsPageProps> = ({ setMenuState }) => {
    const [reinforcementNumber, setReinforcementNumber] = useState(20);
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
                    <div className="button-style" onMouseDown={() => { setReinforcementNumber(reinforcementNumber - 1) }} style={{ aspectRatio: "1/1", width: "8%", textAlign: "center" }}> - </div>
                    <h2>{reinforcementNumber}</h2>
                    <div className="button-style" onMouseDown={() => { setReinforcementNumber(reinforcementNumber + 1) }} style={{ aspectRatio: "1/1", width: "8%", textAlign: "center" }}> + </div>
                </div>
                <div className="button-style" onMouseDown={() => { buyReinforcements(reinforcementNumber) }}> Reinforce (Tot: {priceOfReinforcements * reinforcementNumber} $LORDS)</div>
                <div className="button-style" onMouseDown={() => { setMenuState(PrepPhaseStages.WAIT_PHASE_OVER) }}> Go Forward</div>
            </ClickWrapper>

            <div className="footer-text">1 Reinforcement = {priceOfReinforcements} $LORDS</div>
        </div>
    )
}
