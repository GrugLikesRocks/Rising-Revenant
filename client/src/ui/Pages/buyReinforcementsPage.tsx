import React, {useState} from "react";

import "./PagesStyles/BuyingPageStyle.css"

import { MenuState } from "../Pages/mainMenuContainer";
import { ClickWrapper } from "../clickWrapper";




interface BRPageProps {
    setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

export const BuyReinforcementPage: React.FC<BRPageProps> = ({ setMenuState }) => 
{
    const [reinforcementNumber, setReinforcementNumber] = useState(50);

    const closePage = () => {
        setMenuState(MenuState.NONE);
    };
    
    return (
        <div className="br-page-container">
            <ClickWrapper className="main-content">
                <h2 className="main-content-header">REINFORCE YOUR OUTPOST</h2>
                <div className="amount-section">
                    <div className="button-style" style={{aspectRatio: "1/1", width: "8%", textAlign: "center"}}> - </div>
                    <h2>{reinforcementNumber}</h2>
                    <div  className="button-style" style={{aspectRatio: "1/1", width: "8%", textAlign: "center"}}> + </div>
                </div>
                <div className="button-style" onClick={closePage}>Reinforce (Tot: 250 $LORDS)</div>
            </ClickWrapper>

            <div className="footer-text">1 Reinforcement = 5 $LORDS</div>
        </div>
    )
}
