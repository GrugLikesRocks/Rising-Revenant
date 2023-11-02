import React from "react";

import "./PagesStyles/ProfilePageStyles.css";

import { MenuState } from "../Pages/mainMenuContainer";

interface ProfilePageProps {
    setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ setMenuState }) => {
    const closePage = () => {
        setMenuState(MenuState.NONE);
    };

    return (
        <div className="profile-page-container">
            <div className="title-section">
                <h2>PROFILE</h2>
                <div className="title-cart-section">
                    <h1> <img src="LOGO_WHITE.png" className="test-embed"></img>  5</h1>
                    <h3>Reinforment available</h3>
                </div>
            </div>
            <div className="info-section">
                <div className="table-section">
                    <div className="table-container">
                        <div className="table-title-container">
                            <h2>Outpost ID</h2>
                            <h2>Position</h2>
                            <h2>Reinforcements</h2>    
                            <div style={{backgroundColor: "black", flex: "1.5"}}></div>
                        </div>
                        <div className="table-items-container">
                            <div className="item-container-profile">
                                <h2>1</h2>
                                <h2>X: 2314, Y:5123</h2>
                                <h2>2</h2>
                                <div className="item-button"></div>
                            </div>
                            <div className="item-container-profile">
                                <h2>1</h2>
                                <h2>X: 2314, Y:5123</h2>
                                <h2>2</h2>
                                <div className="item-button"></div>
                            </div>
                            <div className="item-container-profile">
                                <h2>1</h2>
                                <h2>X: 2314, Y:5123</h2>
                                <h2>2</h2>
                                <div className="item-button"></div>
                            </div>
                            <div className="item-container-profile">
                                <h2>1</h2>
                                <h2>X: 2314, Y:5123</h2>
                                <h2>2</h2>
                                <div className="item-button"></div>
                            </div><div className="item-container-profile">
                                <h2>1</h2>
                                <h2>X: 2314, Y:5123</h2>
                                <h2>2</h2>
                                <div className="item-button"></div>
                            </div><div className="item-container-profile">
                                <h2>1</h2>
                                <h2>X: 2314, Y:5123</h2>
                                <h2>2</h2>
                                <div className="item-button"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="buy-section">
                    <div className="button-style-profile">Buy Reinforcements</div>
                </div>
            </div>
        </div>
    )
}
