import { PhaserLayer } from "../../phaser";
import { useDojo } from "../../hooks/useDojo";

import "../../App.css";

import { ClickWrapper } from "../clickWrapper";
import {
  EntityIndex,
  getComponentValue,
  getComponentValueStrict,
  Has,
} from "@latticexyz/recs";

import { useEntityQuery } from "@latticexyz/react";

import { Navbar, MenuState } from "./navbar";

import { MainReactComp } from "../pages/mainPage";
import { RulesReactComp } from "../pages/rulesPage";
import { StatsReactComp } from "../pages/statsPage";
import { TradesReactComp } from "../pages/tradesPage";
import { ProfilePage } from "../pages/profilePage";
import { MapReactComp } from "../pages/mapPage";

import { ToolTipData } from "./outpostToolTip";
import { CircleEvent } from "./eventCircle";

import React, { useState, useEffect, useRef } from "react";
import { currentGameId, GAME_CONFIG, userAccountAddress } from "../../phaser/constants";


type ExampleComponentProps = {
  layer: PhaserLayer;
  menuState?: MenuState;
  setMenuState?: React.Dispatch<React.SetStateAction<MenuState>>;
};

export const MainMenuComponent = ({
  layer,
  menuState: externalMenuState,
  setMenuState: externalSetMenuState,
}: ExampleComponentProps) => {
  const [internalMenuState, internalSetMenuState] = useState<MenuState>(MenuState.MAIN);

  const [showErrorMessage, setShowErrorMessage] = useState(true); // New state to control error message display
  const [dots, setDots] = useState(1); // Number of dots to display

  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // New state to control success message display
  const [timerPassed, setTimerPassed] = useState(false); // New state to control success message display

  const [showTooltip, setShowTooltip] = useState(false);


  // #region something about the menu prob not needed

  const actualSetMenuState = externalSetMenuState || internalSetMenuState;
  const actualMenuState =
    externalMenuState !== undefined ? externalMenuState : internalMenuState;

  // this is to check i have no clue what this does
  useEffect(() => {
    if (externalMenuState !== undefined) {
      internalSetMenuState(externalMenuState);
    }
  }, [externalMenuState]);

  // #endregion



  // #region logging in into the game logic

  // components stuff and dojo hook
  const {
    networkLayer: {
      components: { Game, GameEntityCounter,GameTracker },
    },
  } = layer;
  
  const {
    account: { account },
    networkLayer: {
      systemCalls: { fetch_full_game_data },
    },
  } = useDojo();
  
  
  // this is necessary to check if any new entities have been created and we save them as a ref to we can reference it in the use effect below
  const gameDataEntitiesRef = useRef<EntityIndex[]>([]);
  gameDataEntitiesRef.current = useEntityQuery([Has(Game)]);

  // this useEffect is only called once and the loop inside does its thing
  useEffect(() => {
    // function
    const performActionWithRetry = async () => {
        
      let actionSucceeded = false;  //set the action to false
      while (!actionSucceeded) {  // while the actiion is no completed

        await fetch_full_game_data(account); //call the join function that should fetch all the components

        if (gameDataEntitiesRef.current.length >= 1) {   // check if the component exixts in the client with the ref from above
          console.log("Game Entity found and game joined: ", currentGameId);
          actionSucceeded = true;   // true to break out of loop
          setShowErrorMessage(false); // set the error message to false
          setShowSuccessMessage(true); // set the success message to true
        } 
        else {
          console.log("Coulnd't find an entity therefore retrying");
          await new Promise((resolve) => setTimeout(resolve, 5000)); // didnt find the game will retry in 1 second
        }
      }
    };

    //call the function to start the loop
    performActionWithRetry();
  }, []);


  // this effect only runs when the showSuccessMessage variable changes
  useEffect(() => {

    if (showSuccessMessage)
    {   // runs a timer to show stuff
        const timer = setTimeout(() => {
            // once done showing the message we set it to false
            setShowSuccessMessage(false);
            setTimerPassed(true);
              
           }, 15000); // 15 seconds

    return () => clearTimeout(timer);
    }

  }, [showSuccessMessage]);




  const handleDocumentClick = () => {
    if (showSuccessMessage) {
      setShowSuccessMessage(false);
      setTimerPassed(true);

    console.log("Document clicked");
    }
  };

  useEffect(() => {
    // Add click event listener to the document
    document.addEventListener("click", handleDocumentClick);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [showSuccessMessage]);


  // #endregion



  useEffect(() => {
    if (showErrorMessage) {
      const timer = setInterval(() => {
        // Add a dot until you have 3 dots, then reset to 1
        setDots((prevDots) => (prevDots < 3 ? prevDots + 1 : 1));
      }, 1000); // Add a dot every second

      return () => {
        clearInterval(timer); // Clear the interval when component unmounts
      };
    }
  }, [showErrorMessage]);


  return (
      <div className={`main-page-container ${timerPassed ? "grey-scale-off" : "grey-scale-on"}`}>
       {showErrorMessage && ( 
       <div className="loading-screen-message-container">
        <div className="loading-screen-title-text">searching for a game{Array(dots).fill(".").join("")}</div>
        <div className="loading-screen-divider"></div>
       </div> )}   

       {showSuccessMessage && ( 
       <div className="loading-screen-message-container">
        <div className="loading-screen-title-text">joined game -- {getComponentValueStrict(GameTracker, GAME_CONFIG as EntityIndex).count}</div>
        <div className="loading-screen-message">starting phase ends</div>
        <div className="loading-screen-divider"></div>
        <div className="loading-screen-message">minted revenants so far -- {getComponentValueStrict(GameEntityCounter, currentGameId as EntityIndex).revenant_count}</div>
       </div> )}   

        <div className="top-menu-container">
          <div className="game-initials-menu">
            <div className="game-initials-menu-image-background">
              <div className="game-initials-menu-image"></div>
            </div>
          </div>
          <div className="game-title-menu">
            <div className="game-title-menu-text"></div>
          </div>

          <ClickWrapper className="connect-button-menu" 
             onMouseEnter={() => setShowTooltip(true)}
             onMouseLeave={() => setShowTooltip(false)}
             onClick={() => setShowTooltip(false)}
          >  

          {userAccountAddress === "invalid" ? "Connect" : userAccountAddress.substring(0, 8)}   
          {showTooltip && (
          <div className="tooltip-container-connect-button">

            <div className="tooltip-element-container-connect-button">
              <div className="tooltip-element-picture-connect-button">

              </div>
              <div className="tooltip-element-text-connect-button">
                Outposts
              </div>
            </div>

            <div className="tooltip-element-container-connect-button">
              <div className="tooltip-element-picture-connect-button">

              </div>
              <div className="tooltip-element-text-connect-button">
                Lords
              </div>
            </div>

          </div>
          )}
          </ClickWrapper>
        </div>
        
        <div className="navbar-container">
          <Navbar
            menuState={actualMenuState}
            setMenuState={actualSetMenuState}
            layer={layer}
            passedTimer={timerPassed}
          />
        </div>

        <div className="page-container">
          {actualMenuState === MenuState.MAIN && (
            <MainReactComp layer={layer} timerPassed={timerPassed} />
          )}
          {actualMenuState === MenuState.MAP && <MapReactComp layer={layer} />}
          {actualMenuState === MenuState.TRADES && <TradesReactComp />}
          {actualMenuState === MenuState.PROFILE && (
            <ProfilePage layer={layer} />
          )}
          {actualMenuState === MenuState.STATS && <StatsReactComp />}
          {actualMenuState === MenuState.RULES && <RulesReactComp />}
        </div>

        <ToolTipData layer={layer} />
        <CircleEvent layer={layer} />
      </div>
  );
};
