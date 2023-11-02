import React, { useState } from "react";

import "./ComponentsStyles/TopBarStyles.css";

export const TopBarComponent = () => {
    const [isloggedIn, setIsLoggedIn] = useState(true);
    const [inGame, setInGame] = useState(true);

    return (
        <div className="top-bar-container-layout">
            <div style={{  width: "100%", height: "30%" }}></div>
            <div className="top-bar-content-section">
                <div className="left-section">
                    <div className="left-section-image-div">
                       <div className="logo-img"></div>
                    </div>
                    <div className="text-section">
                        <h4>Jackpot: 12.567 $LORDS</h4>
                    </div>
                </div>
                <div className="name-section">
                    <div className="game-title">Rising Revenant</div>
                </div>
                <div className="right-section">
                    <div className="text-section">
                        
                        {inGame ? <h4>Outposts Alive: 450/2000</h4> : <h4>Outposts Available: 450/2000</h4>}
                        <h4>Reinforcement: 12.432</h4>
                    </div>
                    
                    {isloggedIn ? <h3> <img src="LOGO_WHITE.png" className="chain-logo"></img>0x9485...213</h3> : <button>Log in now</button>}
                </div>
            </div>
        </div>
    );
};
