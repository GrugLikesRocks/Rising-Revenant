//libs
import React, { useState, useEffect } from 'react';

// styles
import "./PagesStyles/MainMenuContainerStyles.css"

//components
import { TopBarComponent } from '../Components/mainTopBar';
import { NavbarComponent } from '../Components/navbar';
import { JurnalEventComponent } from '../Components/jurnalEvent';
import { OutpostTooltipComponent } from '../Components/outpostTooltip';

import { ProfilePage } from './profilePage';
import { RulesPage } from './rulesPage';
import { SettingsPage } from './settingsPage';
import { TradesPage } from './tradesPage';
import { RevenantJurnalPage } from './revenantJurnalPage';
import { StatsPage } from './statsPage';
import { WinnerPage } from './winnerPage';
import { BuyReinforcementPage } from './buyReinforcementsPage';
import { PrepPhaseEndsPage } from './preparationPhaseEndsPage';
import { BuyRevenantPage } from "./summonRevenantPage";

import { DebugPage } from './debugPage';

export enum MenuState {
    NONE,
    PROFILE,
    STATS,
    SETTINGS,
    TRADES,
    RULES,
    REV_JURNAL,
    WINNER,
    BUY_REINF,
    PREP_PHASE_SCENE,
    BUY_REV,
    Debug
}

export const MainMenuContainer = () => {
    const [currentMenuState, setCurrentMenuState] = useState(MenuState.WINNER);
    const [gamePhase, setGamePhase] = useState(false);
    const [showTooltip, setShowTooltip] = useState(true);

    const handleIconClick = (newMenuState: MenuState) => {
        setCurrentMenuState(newMenuState);
    };

    // this only needs to be like this for the debug, once the game ships take out the dependency
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setCurrentMenuState(MenuState.NONE);
            }
    
            if (event.key === 'd') {
                if (currentMenuState === MenuState.Debug) {
                    setCurrentMenuState(MenuState.NONE);
                } else {
                    setCurrentMenuState(MenuState.Debug);
                }
            }
        };
    
        window.addEventListener('keydown', handleKeyPress);
    
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentMenuState]); 

    const handleTopBarClick = () => {
        setCurrentMenuState(MenuState.NONE);
    };

    return (
        <>
            <div className="main-page-container-layout">
                <div className='main-page-topbar' onClick={handleTopBarClick}>
                    <TopBarComponent />
                </div>
                <div className='main-page-content'>
                    {currentMenuState !== MenuState.NONE && (
                        <div className='page-container'>
                            {currentMenuState === MenuState.PROFILE && <ProfilePage setMenuState={setCurrentMenuState} />}
                            {currentMenuState === MenuState.RULES && <RulesPage setMenuState={setCurrentMenuState} />}
                            {currentMenuState === MenuState.SETTINGS && <SettingsPage setMenuState={setCurrentMenuState} />}
                            {currentMenuState === MenuState.TRADES && <TradesPage />}
                            {currentMenuState === MenuState.STATS && <StatsPage setMenuState={setCurrentMenuState} />}
                            {currentMenuState === MenuState.REV_JURNAL && <RevenantJurnalPage setMenuState={setCurrentMenuState} />}
                            {currentMenuState === MenuState.WINNER && <WinnerPage setMenuState={setCurrentMenuState} />}
                            {currentMenuState === MenuState.BUY_REINF && <BuyReinforcementPage setMenuState={setCurrentMenuState} />}
                            {currentMenuState === MenuState.PREP_PHASE_SCENE && <PrepPhaseEndsPage setMenuState={setCurrentMenuState} />}
                            {currentMenuState === MenuState.BUY_REV && <BuyRevenantPage setMenuState={setCurrentMenuState} />}
                            {currentMenuState === MenuState.Debug && <DebugPage setMenuState={setCurrentMenuState} />}

                        </div>
                    )}
                </div>

                {gamePhase === false && <div className='prep-phase-text'> <h2> Preparation phase ends in <br /> DD: 5 HH: 5 MM: 5 SS: 5</h2></div>};

            </div>

            <NavbarComponent menuState={currentMenuState} setMenuState={setCurrentMenuState} onIconClick={handleIconClick} />

            {currentMenuState === MenuState.NONE && <JurnalEventComponent setMenuState={setCurrentMenuState} />}
            {currentMenuState === MenuState.NONE  && <OutpostTooltipComponent />}
            
            <div className='image-test' />
        </>
    );
}
