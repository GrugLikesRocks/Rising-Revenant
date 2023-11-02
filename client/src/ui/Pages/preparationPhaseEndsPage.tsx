import React, { useState } from "react";

import "./PagesStyles/PrepPhaseEndsPageStyles.css";

import { MenuState } from "../Pages/mainMenuContainer";
import { ClickWrapper } from "../clickWrapper";

interface PrepPhaseEndsPageProps {
    setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

export const PrepPhaseEndsPage: React.FC<PrepPhaseEndsPageProps> = ({ setMenuState }) => {
    const [showBlocks, setShowBlocks] = useState(true);

    const closePage = () => {
        setMenuState(MenuState.NONE);
    };

    const toggleShowBlocks = () => {
        setShowBlocks((prevShowBlocks) => !prevShowBlocks);
    };

    return (
        <ClickWrapper className="ppe-page-container">
            <h1>
                PREPARATION PHASE ENDS IN<br />
                <span onClick={toggleShowBlocks} className="hover-effect" >
                    {showBlocks ? "BLOCKS LEFT: 484" : "DD: 5 HH: 5 MM: 5 SS: 5"}
                </span>
            </h1>
        </ClickWrapper>
    );
};
