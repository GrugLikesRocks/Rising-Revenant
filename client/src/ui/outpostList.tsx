import { useEntityQuery } from "@latticexyz/react";
import {
  EntityID,
  EntityIndex,
  Has,
  getComponentValue,
  getComponentValueStrict,
} from "@latticexyz/recs";
import { PhaserLayer } from "../phaser";
import "../App.css";
import { GAME_ID, OUTPOST_ID } from "../phaser/constants";
import { useDojo } from "../hooks/useDojo";


type Props = {
  layer: PhaserLayer;
};

export const OutpostList = ({ layer }: Props) => {
  const {
    networkLayer: {
      components: { Defence },
    },
  } = layer;


  const {
    networkLayer: {
        systemCalls: { life_def_increment},
    },
} = useDojo();


  const entities = useEntityQuery([Has(Defence)]);

  if (entities.length === 0) {
    return <div>No entities found.</div>;
  }

  return (
    
    <div className="defence-container">
      <span className="revenant-title">Your Revenants:</span>
      <div className="data-container">
        <div className="fields-container">
          <div className="fields-name">Revenant_ID</div>
          <div className="fields-name">OUTPOST_ID</div>
          <div className="fields-name">Reinforcements</div>
        </div>
        <div className="elements-container">
          {entities.map((entity, index) => (
            <div className="sub-element-container" key={index}>
              <div className="element-data">{OUTPOST_ID}</div>
              <div className="element-data">{GAME_ID}</div>
              <div className="element-data">
                {getComponentValue(Defence, entity)?.plague || 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

//   return (
//       <div className="defence-container">
//         <span className="revenant-title">Your Revenants:</span>
//         <ul className="defence-list">
//           {entities.map((entity, index) => (
//             <li className="defence-item" key={index}>
//               <div className="fields">
//                 <span className="outpost-id">Outpost ID</span>
//                 <span className="revenant-id">Revenant ID</span>
//                 <span className="defence-value">Reinforcements</span>
//               </div>
//               <div className="values">
//                 <span>{OUTPOST_ID}</span>
//                 <span>{GAME_ID}</span>
//                 <span>{getComponentValue(Defence, entity)?.plague || 0}</span>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
};
