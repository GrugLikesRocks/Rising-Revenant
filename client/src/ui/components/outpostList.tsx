import { useEntityQuery } from "@latticexyz/react";
import { EntityIndex, Has, getComponentValueStrict, setComponent } from "@latticexyz/recs";
import { PhaserLayer } from "../../phaser";
import "../../App.css";

import { useState } from "react";

import { useDojo } from "../../hooks/useDojo";
import { ClickWrapper } from "../clickWrapper";
import { bigIntToHexWithPrefix } from "../../utils";
import { GAME_CONFIG } from "../../phaser/constants";
import { set } from "mobx";

type Props = {
    layer: PhaserLayer;
};

export const OutpostList = ({ layer }: Props) => {

    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipText, setTooltipText] = useState("");
    const [tooltipIndex, setTooltipIndex] = useState(0);
    const [divRect, setDivRect] = useState<any>(null);

    const {
        networkLayer: {
            components: { Outpost, ClientOutpostData, ClientCameraPosition, ClientGameData },
        },
    } = layer;

    const {
        account: { account },
        networkLayer: {
            systemCalls: { reinforce_outpost },
        },
    } = useDojo();

    const outpostEntities = useEntityQuery([Has(Outpost)]);

    const playerOutpostsOnly = outpostEntities.filter((entity) => {
        const ownerAddressOfOutpost = getComponentValueStrict(
            Outpost,
            entity
        ).owner;

        return account.address === bigIntToHexWithPrefix(BigInt(ownerAddressOfOutpost));
    });


    const setCameraToCoordinate = (x: number, y: number) => {
        setComponent(ClientCameraPosition, GAME_CONFIG, { x, y })
    };

    if (playerOutpostsOnly.length === 0) {
        return (
            <div className="player-outpost-list-container">
                <div className="player-outpost-list-fields-container">
                    <div className="player-outpost-list-fields font-size-mid-titles">REVENANT ID</div>
                    <div className="player-outpost-list-fields font-size-mid-titles">POSITION</div>
                    <div className="player-outpost-list-fields font-size-mid-titles">REINFORCEMENTS</div>
                    <div className="player-outpost-list-field-spacer"></div>
                </div>
                <div className="player-outpost-list-data-container">
                    <div className="player-outpost-subdata-container">
                        <div className="player-outpost-data-element font-size-texts"> No data available </div>
                        <div className="player-outpost-data-element font-size-texts"> No data available </div>
                        <div className="player-outpost-data-element font-size-texts"> No data available </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="player-outpost-list-container">

            <div className="player-outpost-list-fields-container">
                    <div className="player-outpost-list-fields font-size-mid-titles" >REVENANT ID</div>
                    <div className="player-outpost-list-fields font-size-mid-titles">POSITION</div>
                    <div className="player-outpost-list-fields font-size-mid-titles">REINFORCEMENTS</div>  
                <div className="player-outpost-list-field-spacer"></div>
            </div>

            <ClickWrapper className="player-outpost-list-data-container">
                {playerOutpostsOnly.map((entity, index) => (
                    <div className="player-outpost-subdata-container" key={index}>
                        <div className="player-outpost-data-element font-size-texts">
                            {String(getComponentValueStrict(ClientOutpostData, entity).id)}
                        </div>

                        <div
                            className="player-outpost-data-element font-size-texts"
                            style={{ cursor: getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_state === 2 ? "pointer" : "auto" }}
                            onMouseLeave={() => {
                                setShowTooltip(false);
                                setTooltipIndex(0);
                            }}
                            onMouseEnter={(event) => {
                                if (getComponentValueStrict(ClientGameData, GAME_CONFIG).current_game_state === 2) {
                                    setShowTooltip(true);
                                    setTooltipIndex(index);
                                    setTooltipText("Click to move camera to this outpost");
                                    setDivRect(event.currentTarget.getBoundingClientRect());
                                }
                            }}
                            onMouseDown={() =>
                                setCameraToCoordinate(
                                    getComponentValueStrict(Outpost, entity).x,
                                    getComponentValueStrict(Outpost, entity).y
                                )}
                        >
                            x: {getComponentValueStrict(Outpost, entity).x} y: {getComponentValueStrict(Outpost, entity)?.y}
                        </div>

                        <div
                            className="player-outpost-data-element font-size-texts"
                            style={{ cursor: "pointer" }}
                            onMouseLeave={() => {
                                setShowTooltip(false);
                                setTooltipIndex(-1);
                            }}
                            onMouseEnter={(event) => {
                                setShowTooltip(true);
                                setTooltipIndex(index);
                                setTooltipText("Click to reinforce this outpost");
                                setDivRect(event.currentTarget.getBoundingClientRect());
                            }}
                            onMouseDown={() =>
                                reinforce_outpost(account, getComponentValueStrict(ClientOutpostData, entity).id)
                            }
                        >
                            {String(getComponentValueStrict(Outpost, entity).lifes)}
                        </div>

                        {showTooltip && tooltipIndex === index && (
                            <div
                                className="player-outpost-data-element-tooltip font-size-texts"
                                style={{ top: divRect ? `${divRect.y}px` : "0" }}
                            >
                                {tooltipText}
                            </div>
                        )}
                    </div>
                ))}

            </ClickWrapper>
        </div>
    )
};

