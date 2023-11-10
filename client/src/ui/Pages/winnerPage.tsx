import React, { useEffect } from "react";

import "./PagesStyles/WinnerPageStyles.css";

import { MenuState } from "../Pages/mainMenuContainer";
import { ClickWrapper } from "../clickWrapper";
import { useDojo } from "../../hooks/useDojo";


import { HasValue, EntityIndex, getComponentValueStrict, setComponent,Has } from "@latticexyz/recs";
import { useEntityQuery } from "@latticexyz/react";


interface WinnerPageProps {
    setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

export const WinnerPage: React.FC<WinnerPageProps> = ({ setMenuState }) => 
{
    const [winningAddress, setWinningAddress] = React.useState<string>("");

    const closePage = () => {
        setMenuState(MenuState.NONE);
    };

    const {
        account : { account },
        networkLayer: {
            network: { contractComponents, clientComponents },
        },
    } = useDojo();


  const outpostDeadQuery = useEntityQuery([HasValue(contractComponents.Outpost, { lifes: 0 })]);
  const totalOutposts = useEntityQuery([Has(contractComponents.Outpost)]);

  useEffect(() => {

    const difference: string[] = totalOutposts.filter(item => !outpostDeadQuery.includes(item));

    const outpostComp = getComponentValueStrict(contractComponents.Outpost, difference[0]);

    setWinningAddress(outpostComp.owner);

  }, []);

    return (
        <div className="winner-page-container">
                <div className="content-container">
                    <h3>Address: {winningAddress}</h3>
                    {winningAddress === account.address ?   <h1>YOU ARE THE RISING REVENANT</h1> : <h1>IS THE RISING REVENANT</h1>}
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
