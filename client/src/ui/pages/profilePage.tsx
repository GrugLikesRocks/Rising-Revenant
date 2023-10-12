import React, { useEffect, useState } from 'react';
// import { OutpostList } from '../components/profileList';
import { OutpostList } from '../components/outpostList';
import { PhaserLayer } from '../../phaser';
import "../styles/ProfilePageStyle.css";

import { BuyReinforcementComponent } from '../components/buyReinforcementButton';
import { Has, getComponentValueStrict } from '@latticexyz/recs';
import { GAME_CONFIG } from '../../phaser/constants';
import { getEntityIdFromKeys } from '../../dojo/createSystemCalls';

import { useDojo } from '../../hooks/useDojo';
import { useEntityQuery } from '@latticexyz/react';

export const ProfilePage: React.FC<{ layer: PhaserLayer }> = ({ layer }) => {

  const [outpostsAmount , setOutpostsAmount] = useState<number>(0);
  const [reinforcementsAmount , setReinforcementsAmount] = useState<number>(0);

  const {
    networkLayer: {
      components: { ClientGameData, Reinforcement,Outpost , ClientOutpostData },
    },
  } = layer;

  const {
    account: { account },
    networkLayer: {
      systemCalls: { fetch_user_reinforcement_balance },
    },
  } = useDojo();

  const allOutpostsEntities = useEntityQuery([Has(Outpost)]);


  useEffect(() => {

      let num = 0;

      allOutpostsEntities.forEach(element => {
        const entityClientData = getComponentValueStrict(ClientOutpostData, element);

        if (entityClientData.owned) {
          num++;
        }
      });

      setOutpostsAmount(num);
    
  }, [allOutpostsEntities]);


  useEffect(() => {

    const FetchBalance = async () => {
      await fetch_user_reinforcement_balance(account);

      const entityIndex = getEntityIdFromKeys([BigInt(getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_id), BigInt(account.address)]);
      setReinforcementsAmount(getComponentValueStrict(Reinforcement, entityIndex).balance);
    };

    FetchBalance();

    const getStuffInterval = setInterval(() => {
      FetchBalance();

    }, 10000);
  
    return () => clearInterval(getStuffInterval); 
  }, []);

  return <div className="profile-page-container">

    <div className="above-table-main-container">

      <div className="above-table-text font-size-titles">Your Revenants</div>
      <div className="above-table-container">
        <div className="above-table-text font-size-mid-titles" style={{flex : 1}}>Reinforcements avaialble: {reinforcementsAmount}</div>
        <div className="above-table-text font-size-mid-titles" style={{flex : 1}}>Number of Outposts: {outpostsAmount}</div>
      </div>
    </div>


    <OutpostList layer={layer} />
    {getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_state === 1 && (<BuyReinforcementComponent />)}
  </div>;
};


