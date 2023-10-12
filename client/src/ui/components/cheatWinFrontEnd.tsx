import { EntityIndex, Has, getComponentValue, getComponentValueStrict } from "@latticexyz/recs";
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
      components: {Outpost,Game , ClientGameData},
    },
  } = layer;

 
  const clientGameData = getComponentValue(ClientGameData,GAME_CONFIG)


  if (clientGameData === undefined )
  {
    return null;
  }

  const gameData = getComponentValue(Game, clientGameData.current_game_id as EntityIndex) 

  const AliveOutposts = useEntityQuery([Has(Outpost)]);

  const aliveOutpostsWithMoreThanOneLife = AliveOutposts.filter(entity => {
      const outpostData = getComponentValueStrict(Outpost, entity);
      return outpostData.lifes > 1;
  });
   
  if (gameData === undefined ||aliveOutpostsWithMoreThanOneLife.length > 1 || clientGameData.current_game_state === 1) { return null;}

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
};
