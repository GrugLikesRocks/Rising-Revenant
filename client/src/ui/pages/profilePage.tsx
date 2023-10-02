import React from 'react';
import { OutpostList } from '../components/profileList';
import { PhaserLayer } from '../../phaser';
import "../styles/ProfilePageStyle.css";

import { BuyReinforcementComponent } from '../components/buyReinforcementButton';
import { getComponentValueStrict } from '@latticexyz/recs';
import { GAME_CONFIG } from '../../phaser/constants';

export const ProfilePage: React.FC<{ layer: PhaserLayer }> = ({ layer }) => {

  const {
    networkLayer: {
      components: {ClientGameData },
    },
  } = layer;

  return <div className="profile-page-container">
    <OutpostList layer={layer} />

    {getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_state === 1 && (<BuyReinforcementComponent />)}
    
  </div>;
};


