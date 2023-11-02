import React from "react";

import "./PagesStyles/WinnerPageStyles.css";

import { MenuState } from "../Pages/mainMenuContainer";
import { ClickWrapper } from "../clickWrapper";


interface WinnerPageProps {
    setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

export const WinnerPage: React.FC<WinnerPageProps> = ({ setMenuState }) => 
{

    const closePage = () => {
        setMenuState(MenuState.NONE);
    };

    return (
        <div className="winner-page-container">
                <div className="content-container">
                    <h3>Address: 0x37842783423746237462347671478186478</h3>
                    <h1>YOU ARE THE RISING REVENANT</h1>
                    <ClickWrapper className="button-style">Claim your jackpot</ClickWrapper>
                </div>
                {/* i really dont like this*/}
                <div className="share-text">
                    <h2>Share on</h2>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg"></img>
                </div>
        </div>
    )
}
