import { EntityIndex, Has, HasValue, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";
import { PhaserLayer } from "../../phaser";

import "../../App.css";
import { GAME_CONFIG } from "../../phaser/constants";
import { ClickWrapper } from "../clickWrapper";
import { useEntityQuery } from "@latticexyz/react";


import { toast } from 'react-toastify';

type ExampleComponentProps = {
  layer: PhaserLayer;
  timerPassed: boolean;
};

export const CheatWin = ({ layer,timerPassed }: ExampleComponentProps) => {
  const {
    networkLayer: {
      components: {Outpost,Game , ClientGameData,ClientOutpostData},
    },
  } = layer;

 
  const clientGameData = getComponentValue(ClientGameData,GAME_CONFIG)


  if (clientGameData === undefined )
  {
    return null;
  }

  const gameData = getComponentValue(Game, clientGameData.current_game_id as EntityIndex) 

  const allOutposts = useEntityQuery([Has(Outpost)]);
  const deadOutpostsEntities = useEntityQuery([HasValue(Outpost, { lifes: 0 })]);

   
  if (gameData === undefined ||  (allOutposts.length - deadOutpostsEntities.length) !== 1 || clientGameData.current_game_state === 1) { return null;}





  const lastOutpost = (allOutposts.filter((entity) => {
    const outpost = getComponentValueStrict(Outpost, entity);
    return outpost.lifes > 0;
  }));


  const notify = (message: string) => toast(message, {
    position: "top-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "dark",
  });
  

  const lastOutpostData = getComponentValueStrict(ClientOutpostData, lastOutpost[0]);

  if (lastOutpostData.owned)
  {
    return (
      <ClickWrapper className={` ${timerPassed ? "opaque-on" : "opaque-off"}`}>
          <button
            className="buy-revenant-button font-size-mid-titles"  
            onClick={() =>
              notify("WOW WELL DONE YOU WON THE GAME, HERE IS YOU TOTAL PRIZE OF " +  gameData.prize + " LORD TOKENS")
            }
          >
            Confirm Win
          </button>
        </ClickWrapper>
    );
  }
  else
  {
    <ClickWrapper className={` ${timerPassed ? "opaque-on" : "opaque-off"}`}>
          <button
            className="buy-revenant-button font-size-mid-titles"  
            onClick={() =>
              notify("FAILED TO WIN, YOU NEED TO OWN THE LAST OUTPOST")
            }
          >
            ANOTHER PLAYER WON
          </button>
        </ClickWrapper>
  }



};
