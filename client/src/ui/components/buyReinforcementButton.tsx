import { useEntityQuery } from "@latticexyz/react";
import { EntityIndex, Has, getComponentValueStrict } from "@latticexyz/recs";
import { PhaserLayer } from "../../phaser";
import { useDojo } from "../../hooks/useDojo";

import { useState } from "react";

import "../../App.css";
import "../styles/ProfilePageStyle.css";
import { GAME_CONFIG } from "../../phaser/constants";
import { ClickWrapper } from "../clickWrapper";

// ALL DEBUG TO DELETE ONCE DONE

// type ExampleComponentProps = {
//   layer: PhaserLayer;
//   timerPassed: boolean;
// };

// export const BuyRevenantButton = ({ layer,timerPassed }: ExampleComponentProps) => {
//   const {
//     networkLayer: {
//       components: {GameEntityCounter,ClientGameData },
//     },
//   } = layer;


export const BuyReinforcementComponent = () => {
    const {
        account: { account },
        networkLayer: {
            systemCalls: {
                purchase_reinforcement,
            },
        },
    } = useDojo();

    const [amount, setAmount] = useState(1);

    const ChangeAmount = (number: number) => {
        let newAmount = amount + number;

        if (newAmount < 1) {
            newAmount = 1;
        }

        setAmount(newAmount);
    }

    return (
            <ClickWrapper className="buy-reinforces-container">
                <button className="buy-reinforcement-amount-button" onClick={() => ChangeAmount(-1)}> -1 </button>
                <button className="buy-reinforcement-button" onClick={() => purchase_reinforcement(account, amount)}>Buy {amount} Reinforces</button>
                <button className="buy-reinforcement-amount-button" onClick={() => ChangeAmount(1)}> +1 </button>
            </ClickWrapper>
    );
};
