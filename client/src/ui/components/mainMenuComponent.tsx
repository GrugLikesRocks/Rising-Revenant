import { PhaserLayer } from "../../phaser";
import { useDojo } from "../../hooks/useDojo";

import "../../App.css";

import { ClickWrapper } from "../clickWrapper";
import {
  EntityIndex,
  getComponentValueStrict,
  getComponentValue,
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

import React, { useState, useEffect, useRef } from "react";
import { GAME_CONFIG, PREPARATION_PHASE_BLOCK_COUNT } from "../../phaser/constants";
import { getEntityIdFromKeys } from "../../dojo/createSystemCalls";

type ExampleComponentProps = {
  layer: PhaserLayer;
  menuState?: MenuState;
  setMenuState?: React.Dispatch<React.SetStateAction<MenuState>>;
};



// THIS SCRIPT IS TO COMPLETLY CLEAR OUT AND REDO



export const MainMenuComponent = ({
  layer,
  menuState: externalMenuState,
  setMenuState: externalSetMenuState,
}: ExampleComponentProps) => {
  const [internalMenuState, internalSetMenuState] = useState<MenuState>(MenuState.MAIN);
  const useDojoContents = useDojo();

  const [showErrorMessage, setShowErrorMessage] = useState(true); // New state to control error message display
  const [dots, setDots] = useState(1); // Number of dots to display

  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // New state to control success message display
  const [timerPassed, setTimerPassed] = useState(false); // New state to control success message display

  const [showTooltip, setShowTooltip] = useState(false);

  const [lordsAmount, setLordsAmount] = useState(0);
  const [outpostsAmount, setOutpostsAmount] = useState(0);
  const [reinforcementsAmount, setReinforcementsAmount] = useState(0);

  const [navbarOpacity, setNavbarOpacity] = useState(1);

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
      components: { Game, GameEntityCounter, GameTracker, ClientGameData, Outpost, ClientOutpostData, Reinforcement },
    },
  } = layer;

  const {
    account: { account },
    networkLayer: {
      systemCalls: {
        fetch_game_tracker_data,
        fetch_game_entity_counter_data,
        fetch_game_data,
        fetch_revenant_data,
        fetch_outpost_data,
        fetch_event_data,
        fetch_current_block_count,
        fetch_user_reinforcement_balance
      },
    },
  } = useDojo();

  const allOutpostsEntities = useEntityQuery([Has(Outpost)]);


  // this is necessary to check if any new entities have been created and we save them as a ref to we can reference it in the use effect below
  const gameDataEntitiesRef = useRef<EntityIndex[]>([]);
  gameDataEntitiesRef.current = useEntityQuery([Has(Game)]);
  // might move this into another effect so not to do this thing above

  // this useEffect is only called once and the loop inside does its thing
  useEffect(() => {
    // function
    const performActionWithRetry = async () => {

      let actionSucceeded = false;  //set the action to false
      while (!actionSucceeded) {  // while the action is no completed

        await fetch_game_tracker_data(account); //call the join function that should fetch all the components

        const game_id = getComponentValue(GameTracker, GAME_CONFIG as EntityIndex)?.count as EntityIndex;

        if (game_id === undefined || game_id === 0) {
          await new Promise((resolve) => setTimeout(resolve, 5000));
          continue;
        }

        await fetch_game_entity_counter_data(game_id);
        await fetch_game_data(game_id);
        await fetch_current_block_count()

        if (gameDataEntitiesRef.current.length >= 1) {   // check if the component exixts in the client with the ref from above
          actionSucceeded = true;   // true to break out of loop
          console.log(getComponentValueStrict(ClientGameData, GAME_CONFIG).current_block_number)
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
  // and its a 15 seconds timer to show the success message then it deletes it
  useEffect(() => {

    if (showSuccessMessage) {   // runs a timer to show stuff
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
    }
  };

  // this is to close the search message when it finds a game
  useEffect(() => {
    // Add click event listener to the document
    document.addEventListener("click", handleDocumentClick);

    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [showSuccessMessage]);


  // #endregion


  // this is to add the dot in the search text
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



  useEffect(() => {

    const fetch_all_game_entities = (revenant_count: number) => {

      for (let i = 0; i < revenant_count; i++) {
        fetch_revenant_data(i + 1);
        fetch_outpost_data(i + 1);
      }
    }

    const fetch_all_event_entities = (event_count: number) => {
        
        for (let i = 0; i < event_count; i++) {
          fetch_event_data(i + 1);
        }
      }

    const performActionWithRetry = async () => {

      let actionSucceeded = false;
      while (!actionSucceeded && timerPassed) {

        //await fetch_full_game_data(account); 
        console.log("should be called every 10 seconds")

        const game_id = getComponentValueStrict(GameTracker, GAME_CONFIG as EntityIndex)?.count as EntityIndex;

        await fetch_game_entity_counter_data(game_id);

        const clientGameData = getComponentValue(ClientGameData, GAME_CONFIG as EntityIndex);

        if (clientGameData === undefined) {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          continue;
        }

        if (clientGameData.current_game_state === 1) {
          fetch_game_data(clientGameData.current_game_id);
        }

        fetch_current_block_count();

        const entityCounter = getComponentValueStrict(GameEntityCounter, clientGameData.current_game_id as EntityIndex);

        if (entityCounter.revenant_count != 0 && entityCounter.outpost_count != 0) {
          fetch_all_game_entities(getComponentValueStrict(GameEntityCounter, clientGameData.current_game_id as EntityIndex).revenant_count);
        }

        if (entityCounter.event_count != 0) {
          fetch_all_event_entities(getComponentValueStrict(GameEntityCounter, clientGameData.current_game_id as EntityIndex).event_count)
        }

        await new Promise((resolve) => setTimeout(resolve, 10000));
      }
    };

    //call the function to start the loop
    performActionWithRetry();
  }, [timerPassed]);




  useEffect(() => {

    const FetchBalance = async () => {

      await fetch_user_reinforcement_balance(account);

      const entityIndex = getEntityIdFromKeys([BigInt(getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_id), BigInt(account.address)]);
      setReinforcementsAmount(getComponentValueStrict(Reinforcement, entityIndex).balance);
    };

    if (showTooltip) {
      let num = 0;

      const game_state = getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_state;

      allOutpostsEntities.forEach(element => {
        const entityData = getComponentValueStrict(Outpost, element);
        const entityClientData = getComponentValueStrict(ClientOutpostData, element);

        if (game_state === 1) {
          if (entityClientData.owned) {
            num++;
          }
        }
        else {
          if (entityClientData && entityData.lifes > 0) {
            num++;
          }
        }
      });

      setOutpostsAmount(num);

      FetchBalance();
    }
  }, [showTooltip]);

  const toggleOpacity = () => {

    if (actualMenuState != MenuState.MAP) {
      setNavbarOpacity(1);
      return;
    }
    if (navbarOpacity === 1) {
      setNavbarOpacity(0);
    }
    else {
      setNavbarOpacity(1);
    }

    console.log(navbarOpacity, actualMenuState)
  }


  useEffect(() => {

    const handleShift = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        toggleOpacity();
      }
    };


    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'escape') {
        setNavbarOpacity(1);
      }
    };

    window.addEventListener('keydown', handleShift);
    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('keydown', handleShift);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [navbarOpacity, actualMenuState]);







  return (
    <div className={`main-page-container ${timerPassed ? "grey-scale-off" : "grey-scale-on"} ${navbarOpacity === 0 && actualMenuState === MenuState.MAP ? "opacity-scale-off" : "opacity-scale-on"} `}>
      {showErrorMessage && (
        <div className="loading-screen-message-container">
          <div className="loading-screen-title-text font-size-titles">Searching for a game{Array(dots).fill(".").join("")}</div>
          <div className="loading-screen-divider"></div>
        </div>)}

      {showSuccessMessage && (
        <div className="loading-screen-message-container">
          <div className="loading-screen-title-text  font-size-mid-titles">JOINED GAME -- {getComponentValueStrict(GameTracker, GAME_CONFIG as EntityIndex).count}</div>

          {getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_state === 1 ? (
            <div className="loading-screen-message  font-size-mid-titles">
              STARTING PHASE ENDS IN {Math.abs(
                Number(getComponentValueStrict(ClientGameData, GAME_CONFIG).current_block_number) -
                (Number(getComponentValueStrict(Game, getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_id as EntityIndex).start_block_number) + PREPARATION_PHASE_BLOCK_COUNT)
              )} BLOCKS
            </div>
          ) : (

            <div className="loading-screen-message font-size-mid-titles">
              PLAY PHASE STARTED {Number(getComponentValueStrict(ClientGameData, GAME_CONFIG).current_block_number) -
                (Number(getComponentValueStrict(Game, getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_id as EntityIndex).start_block_number) + PREPARATION_PHASE_BLOCK_COUNT)} BLOCKS AGO
            </div>
          )}

          <div className="loading-screen-divider"></div>
          <div className="loading-screen-message font-size-mid-titles">Number of Revenants summoned so far -- {getComponentValueStrict(GameEntityCounter,
            getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_id as EntityIndex).revenant_count}</div>
        </div>)}

      <div className="top-menu-container">
        <div className="game-initials-menu">
          <div className="game-initials-menu-image-background">
            <div className="game-initials-menu-image"></div>
          </div>
        </div>
        <div className="game-title-menu">
          <div className="game-title-menu-text"></div>
        </div>

        <ClickWrapper className="connect-button-menu font-size-mid-titles"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {getComponentValue(ClientGameData, GAME_CONFIG)?.user_account_address?.substring(0, 8) + "..." || "Connect"}

          {showTooltip && navbarOpacity === 1 && (
            <div className="tooltip-container-connect-button font-size-texts">

              {getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_state === 2  && (
                <div className="tooltip-element-container-connect-button">

                  <div className="tooltip-element-text-connect-button">
                    Your Outposts alive: {outpostsAmount}
                  </div>
                </div>)}

              {getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_state === 1 && (
                <div className="tooltip-element-container-connect-button">

                  <div className="tooltip-element-text-connect-button">
                    Outposts bought: {outpostsAmount}
                  </div>
                </div>)}





              <div className="tooltip-element-container-connect-button">

                <div className="tooltip-element-text-connect-button">
                  Reinforcements: {reinforcementsAmount}
                </div>
              </div>

              <div className="tooltip-element-container-connect-button">

                <div className="tooltip-element-text-connect-button">
                  Lords: {lordsAmount}
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
          navbarOpacity={navbarOpacity}
        />
      </div>

      <div className="page-container">
        {actualMenuState === MenuState.MAIN && (<MainReactComp layer={layer} timerPassed={timerPassed} />)}
        {actualMenuState === MenuState.MAP && <MapReactComp layer={layer} />}
        {actualMenuState === MenuState.TRADES && <TradesReactComp />}
        {actualMenuState === MenuState.PROFILE && (<ProfilePage layer={layer} />)}
        {actualMenuState === MenuState.STATS && <StatsReactComp />}
        {actualMenuState === MenuState.RULES && <RulesReactComp />}
      </div>

      {actualMenuState === MenuState.MAP && <ToolTipData layer={layer} useDojoContents={useDojoContents} />}

    </div>
  );
};
