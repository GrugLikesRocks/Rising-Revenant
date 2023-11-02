import React from "react";

import "./ComponentsStyles/JurnalEventStyles.css";

import { MenuState } from "../Pages/mainMenuContainer";

import { ClickWrapper } from "../clickWrapper";

interface JuornalEventProps {
    setMenuState: React.Dispatch<React.SetStateAction<MenuState>>;
}

export const JurnalEventComponent : React.FC<JuornalEventProps> = ({ setMenuState }) => {

    const openJurnal = () => {
        setMenuState(MenuState.REV_JURNAL);
    };

  return (
    <div className="jurnal-event-container">
      <ClickWrapper className="title-div-container">
        <h2>
          REVENANT JOURNAL {" "}
          <img
            src="LOGO_WHITE.png"
            style={{ maxHeight: "1em", verticalAlign: "top", marginLeft:"auto" }}
            alt="Logo"
            onMouseDown={() =>(openJurnal())}
          ></img>
        </h2>
      </ClickWrapper>

      <div className="current-data-container">
        <h3 className="sub-title">Current Event Data</h3>
        <h4>Radius: </h4>
        <h4>Type: </h4>
        <h4>Position: </h4>
      </div>

      <div className="outpost-hit-data-container">
        <h3 className="sub-title">Outpost Status</h3>
        <ClickWrapper className="outpost-hit-list-container">
          <h4>Outpost ID: 4852  ||  X:1425, Y:6274 </h4>
          <h4>Outpost ID: 4852  ||  X:1425, Y:6274 </h4>
          <h4>Outpost ID: 4852  ||  X:1425, Y:6274 </h4>
          <h4>Outpost ID: 4852  ||  X:1425, Y:6274 </h4>
          <h4 style={{textDecoration: "line-through"}}>Outpost ID: 4852  ||  X:1425, Y:6274 </h4>
          <h4>Outpost ID: 4852  ||  X:1425, Y:6274 </h4>
          <h4>Outpost ID: 4852  ||  X:1425, Y:6274 </h4>
          <h4>Outpost ID: 4852  ||  X:1425, Y:6274 </h4>
          <h4>Outpost ID: 4852  ||  X:1425, Y:6274 </h4>
          <h4>Outpost ID: 4852  ||  X:1425, Y:6274 </h4>
          <h4>Outpost ID: 4852  ||  X:1425, Y:6274 </h4>
          <h4>Outpost ID: 4852  ||  X:1425, Y:6274 </h4>
        </ClickWrapper>
      </div>
    </div>
  );
};
