import React from "react";

import "./PagesStyles/RulesPageStyles.css"

import { MenuState } from "../Pages/mainMenuContainer";

interface RulesPageProps {
    setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

export const RulesPage: React.FC<RulesPageProps> = ({ setMenuState }) => 
{
    const closePage = () => {
        setMenuState(MenuState.NONE);
    };

    return (
        <div className="rules-page-container">
        </div>
    )
}
