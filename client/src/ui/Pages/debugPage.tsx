import React from "react";

import { useEntityQuery } from "@latticexyz/react";

import "./PagesStyles/DebugPageStyles.css";

import { MenuState } from "../Pages/mainMenuContainer";
import { ClickWrapper } from "../clickWrapper";

import { useDojo } from "../../hooks/useDojo";

import {
    EntityIndex,
    Has,
    getComponentValue,
    getComponentValueStrict,
} from "@latticexyz/recs";
import { createSystemCalls } from "../../dojo/createSystemCalls";



interface DebugPageProps {
    setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

export const DebugPage: React.FC<DebugPageProps> = ({ setMenuState }) => {
    
    const {
        account: { account },
        networkLayer: {
          network: {contractComponents}
          
        },
        
      } = useDojo();


    const closePage = () => {
        setMenuState(MenuState.NONE);
    };

    const outpostArray = useEntityQuery([Has(contractComponents.Outpost)])
   
    return (
        <ClickWrapper className="revenant-jurnal-page-container">
            <h1 style={{ color: "white" }}>Debug Menu</h1>
            <div className="buttons-holder">

            <div className="data-container">
                    <div className="button-style-debug">This is a button</div>
                    <div className="content-holder">
                        <h3>The current address is {account.address}</h3>
                    </div>
                </div>

                <div className="data-container">
                    <div className="button-style-debug">This is a button</div>
                    <div className="content-holder">
                        <h3>There are currently {outpostArray.length} outposts</h3>
                    </div>
                </div>

            </div>

        </ClickWrapper>
    );
};
