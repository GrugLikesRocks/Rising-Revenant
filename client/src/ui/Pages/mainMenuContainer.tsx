//libs
import React, { useState, useEffect } from 'react';
import {
    EntityIndex,
    Has,
    getComponentValue,
    getComponentValueStrict,
} from "@latticexyz/recs";
import { store } from '../../store/store';


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
import { useDojo } from '../../hooks/useDojo';
import { setComponentFromGraphQLEntity } from '@dojoengine/utils';
import { createComponentStructure, getGameEntitiesSpecific, getOutpostEntitySpecific, setComponentQuick } from '../../dojo/testCalls';
import { decimalToHexadecimal } from '../../utils';
import { GAME_CONFIG, MAP_HEIGHT, MAP_WIDTH } from '../../phaser/constants';
import { useWASDKeys } from '../../phaser/systems/eventSystems/keyPressListener';

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

    const keysDown = useWASDKeys();

    const {
        account: { account },
        networkLayer: {
            network: { graphSdk, contractComponents, clientComponents },
        },
    } = useDojo();

    const CAMERA_SPEED = 10;

    const layers = store((state) => {
        return {
          phaserLayer: state.phaserLayer,
        };
      });


    const {
      scenes: {
        Main: { camera },
      },
      networkLayer: {
        components: { ClientCameraPosition },
      },
    } = layers.phaserLayer;
  
    let prevX: number = 0;
    let prevY: number = 0;

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

    useEffect(() => {
        const intervalId = setInterval(() => {
            console.log('Running code every 10 seconds');
            getUpdatedGameData();

        }, 10000);

        const getUpdatedGameData = async () => {

            const clientGameComp = getComponentValueStrict(clientComponents.ClientGameData, decimalToHexadecimal(GAME_CONFIG));

            const gameComp = getComponentValueStrict(clientComponents.ClientGameData, decimalToHexadecimal(clientGameComp.current_game_id));
            const gameEntityCounter = getComponentValueStrict(contractComponents.GameEntityCounter, decimalToHexadecimal(gameComp.current_game_id));

            const entityEdge: any = await getGameEntitiesSpecific(graphSdk, decimalToHexadecimal(clientGameComp.current_game_id));

            const revenantCount = entityEdge.node.models[1].revenant_count;
            const outpostCount = entityEdge.node.models[1].outpost_count;
            const eventCount = entityEdge.node.models[1].event_count;

            if (revenantCount > gameEntityCounter.revenant_count || outpostCount > gameEntityCounter.outpost_count) {

                for (let index = gameEntityCounter.revenant_count + 1; index < revenantCount + 1; index++) {

                    const entity: any = await getOutpostEntitySpecific(graphSdk, decimalToHexadecimal(clientGameComp.current_game_id), decimalToHexadecimal(index));

                    const owner = entity.edges[0].node.models.owner;
                    const key = +entity.edges[0].node.models.entity_id;

                    let owned = false;

                    if (owner === account.address) { owned = true; }

                    const componentSchemaClientOutpostData = {
                        "id": key,
                        "owned": owned,
                        "event_effected": false,
                        "selected": false,
                        "visible": false
                    };

                    const keys = ["0x1", decimalToHexadecimal(index)];
                    const componentName = "ClientOutpostData";

                    const craftedEdgeCOD = createComponentStructure(componentSchemaClientOutpostData, keys, componentName);
                    setComponentFromGraphQLEntity(clientComponents, craftedEdgeCOD);


                    setComponentFromGraphQLEntity(contractComponents, entity.edges[0]);
                }
            }

            if (eventCount > gameEntityCounter.event_count) {
                console.log("new event");

            }

            setComponentFromGraphQLEntity(contractComponents, entityEdge);
        }

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        let animationFrameId: number;
    
        let currentZoomValue = 0;
    
        // Subscribe to zoom$ observable
        const zoomSubscription = camera.zoom$.subscribe((currentZoom :any ) => {
          currentZoomValue = currentZoom; // Update the current zoom value
        });
    
        const update = () => {
          const current_pos = getComponentValue(
            clientComponents.ClientCameraPosition,
            GAME_CONFIG
          ) || { x: MAP_WIDTH / 2, y: MAP_HEIGHT / 2 };
    
          if (!current_pos) {
            console.log("failed");
            return;
          }
    
          let newX = current_pos.x;
          let newY = current_pos.y;
    
          if (keysDown.W) {
            newY = current_pos.y - CAMERA_SPEED;
          }
          if (keysDown.A) {
            newX = current_pos.x - CAMERA_SPEED;
          }
    
          if (keysDown.S) {
            newY = current_pos.y + CAMERA_SPEED;
          }
          if (keysDown.D) {
            newX = current_pos.x + CAMERA_SPEED;
          }
    
          if (newX > MAP_WIDTH - camera.phaserCamera.width / currentZoomValue / 2) {
            newX = MAP_WIDTH - camera.phaserCamera.width / currentZoomValue / 2;
          }
          if (newX < camera.phaserCamera.width / currentZoomValue / 2) {
            newX = camera.phaserCamera.width / currentZoomValue / 2;
          }
          if (
            newY >
            MAP_HEIGHT - camera.phaserCamera.height / currentZoomValue / 2
          ) {
            newY = MAP_HEIGHT - camera.phaserCamera.height / currentZoomValue / 2;
          }
          if (newY < camera.phaserCamera.height / currentZoomValue / 2) {
            newY = camera.phaserCamera.height / currentZoomValue / 2;
          }
    
          if (newX !== prevX || newY !== prevY) {
            

            setComponentQuick({"x": newX, "y": newY, "tile_index": current_pos.tile_index},[decimalToHexadecimal(GAME_CONFIG)], "ClientCameraPosition", clientComponents);
            
            prevX = newX;
            prevY = newY;
          }
    
          animationFrameId = requestAnimationFrame(update);
        };
    
        update();
    
        return () => {
          cancelAnimationFrame(animationFrameId);
          zoomSubscription.unsubscribe();
        };
      }, [keysDown]);

  

    return (
        <>
            <div className="main-page-container-layout">
                <div className='main-page-topbar'>
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
            {currentMenuState === MenuState.NONE && <OutpostTooltipComponent />}

            {/* <div className='image-test' /> */}
        </>
    );
}
