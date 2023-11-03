import React, {useState} from "react";
import { useDojo } from "../../hooks/useDojo";
import { CreateGameProps } from "../../dojo/types";

import "./PagesStyles/BuyingPageStyle.css"

import { MenuState } from "../Pages/mainMenuContainer";
import { ClickWrapper } from "../clickWrapper";


interface BuyRevPageProps {
    setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

export const BuyRevenantPage: React.FC<BuyRevPageProps> = ({ setMenuState }) => 
{
    const [revenantNumber, setRevenantNumber] = useState(5);

    const {
        account: { account },
        networkLayer: {
          systemCalls: { create_game},
        },
      } = useDojo();

    const closePage = () => {
        setMenuState(MenuState.NONE);
    };

    const createGame = () => {
        
        const createGameProps: CreateGameProps = 
        {
            account: account,
            preparation_phase_interval: 4,
            event_interval: 4,
            erc_addr: account.address
        }

        create_game(createGameProps);
    };
    
    return (
        <div className="summon-revenant-page-container">
            <ClickWrapper className="main-content">
                <h2 className="main-content-header">SUMMON A REVENANT</h2>
                <div className="amount-section">
                    <div className="button-style" style={{aspectRatio: "1/1", width: "8%", textAlign: "center"}}> - </div>
                    <h2>{revenantNumber}</h2>
                    <div  className="button-style" style={{aspectRatio: "1/1", width: "8%", textAlign: "center"}}> + </div>
                </div>
                <div className="button-style" onClick={createGame}>Summon (Tot: 50 $LORDS)</div>
            </ClickWrapper>
            <div className="footer-text">1 Revenant = 10 $LORDS</div>
        </div>
    )
}