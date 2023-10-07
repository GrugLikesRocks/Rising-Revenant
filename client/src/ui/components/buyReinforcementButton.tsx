import { useDojo } from "../../hooks/useDojo";

import { useState } from "react";

import "../../App.css";
import "../styles/ProfilePageStyle.css";
import { ClickWrapper } from "../clickWrapper";

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

            <button className="buy-reinforcement-button font-size-mid-titles" onClick={() => purchase_reinforcement(account, amount)}> Buy {amount} Reinforcement{amount > 1 ? 's' : ''} </button>

            <button className="buy-reinforcement-amount-button font-size-mid-titles" onClick={() => ChangeAmount(-1)}> - </button>
            <button className="buy-reinforcement-button-text font-size-mid-titles">1</button>
            <button className="buy-reinforcement-amount-button font-size-mid-titles" onClick={() => ChangeAmount(1)}> + </button>

        </ClickWrapper>
    );
};
