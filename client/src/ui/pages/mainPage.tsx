import React from "react";
import { BuyRevenantButton } from "../components/buyRevenantButton";
import { PhaserLayer } from "../../phaser";
import "../../App.css";
import { ClickWrapper } from "../clickWrapper";
import "../styles/MainPageStyle.css";

export const MainReactComp: React.FC<{ layer: PhaserLayer }> = ({ layer }) => {
  const listItems = ["Item1", "Item2", "Item3", ];
  // const listItems = ["Item1", "Item2", "Item3","Item1", "Item2", "Item3","Item1", "Item2", "Item3","Item1", "Item2", "Item3","Item1", "Item2", "Item3","Item1", "Item2", "Item3","Item1", "Item2", "Item3" ]; 

  return (
    <div className="main-page-container">
      <div className="main-page-middle-container">
        <div className="side-section-container"></div>
        <div className="middle-image"></div>
        <div className="side-section-container">
          <div className="list-container-main-page">
            <div className="list-main-page-title">EVENT FEED</div>
            <ClickWrapper> 
            <ul className="list-element-main-page ">
              {listItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            </ClickWrapper>
          </div>
        </div>
      </div>

      <div className="bottom-button-container">
        <ClickWrapper>
          <BuyRevenantButton layer={layer} />
        </ClickWrapper>
      </div>
    </div>
  );
};
