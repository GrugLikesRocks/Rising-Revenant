import styled from "styled-components";
import { store } from "../store/store";
import { Wrapper } from "./wrapper";
import { ClickWrapper } from "./clickWrapper";
import {
  DefenceComponent,
  NameComponent,
  LifeComponent,
  ProsperityComponent,
  GetOutpostsReact,
} from "./testComp";
import Navbar from "./navbar";
import React, { useState } from 'react';

import {BuyRevenantButton} from "./buyRevenantButton";

enum MenuState {
    MAIN,
    RULES,
    MAP,
    STATS,
    TRADES,
    PROFILE,
  }
  
  export const UI = () => {
    const [menuState, setMenuState] = useState<MenuState>(MenuState.MAIN);
    const layers = store((state) => {
      return {
        networkLayer: state.networkLayer,
        phaserLayer: state.phaserLayer,
      };
    });
  
    if (!layers.networkLayer || !layers.phaserLayer) return <></>;
  
    return (
        <Wrapper>
          <ClickWrapper>  
            {/* Only render these elements when not in MenuState.MAP */}
            {menuState !== MenuState.MAP && (
              <>
                <div className="game-title-main-menu">Game Title</div>
                <div className="game-initial-main-menu">GI</div>
                <button className="connect-button">Connect</button>
              </>
            )}
    
            {menuState === MenuState.MAIN && <BuyRevenantButton layer={layers.phaserLayer} />}
          

          <Navbar menuState={menuState} setMenuState={setMenuState} layer={layers.phaserLayer}/>
                </ClickWrapper>
        </Wrapper>
      );
  };

// const HeaderContainer = styled.div`
//   position: absolute;
//   top: 5%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   color: white;
//   display: flex;
//   flex-direaction: row;
//   gap: 20px;
// `;

//  {/* <HeaderContainer>
//                 <SpawnBtn />
//                 <DefenceComponent layer={layers.phaserLayer} />
//                 {/* <NameComponent layer={layers.phaserLayer} /> */}
//                 <LifeComponent layer={layers.phaserLayer} />
//                 {/* <ProsperityComponent layer={layers.phaserLayer} /> */}
//                 <GetOutpostsReact layer={layers.phaserLayer} />
//             </HeaderContainer> */}
