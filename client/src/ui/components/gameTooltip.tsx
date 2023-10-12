import { EntityIndex,  HasValue,  getComponentValueStrict, setComponent } from "@latticexyz/recs";
import { PhaserLayer } from "../../phaser";
import { useDojo } from "../../hooks/useDojo";

import "../styles/componentsStyle/GameMapTooltipStyle.css"

import { useState, useEffect } from "react";

import "../../App.css";
import { GAME_CONFIG } from "../../phaser/constants";
import { ClickWrapper } from "../clickWrapper";

import { setTooltipArray } from "../../phaser/systems/eventSystems/eventEmitter";
import { bigIntToHexAndAscii, bigIntToHexWithPrefix } from "../../utils";
import { useEntityQuery } from "@latticexyz/react";


type ExampleComponentProps = {
    layer: PhaserLayer;
};

export const GameToolTipList = ({ layer }: ExampleComponentProps) => {

    const [selectedIndexFromArray, setSelectedIndexFromArray] = useState<any>(0);
    const [entityIdSelected, setEntityIdSelected] = useState<any>(0);

    const [arrayOfEntities, setArrayOfEntities] = useState<any>([]);

    const {
        networkLayer: {
            components: { Outpost, Revenant, ClientOutpostData, GameEntityCounter ,ClientGameData},
        },
    } = layer;

    const {
        account: { account },
        networkLayer: {
            systemCalls: {
                reinforce_outpost, destroy_outpost
            },
        },
    } = useDojo();


    let selectedOutposts = useEntityQuery([HasValue(ClientOutpostData, { selected: true })]);


    const setArray = (array: EntityIndex[]) => {
        
        // this loop does not convince me
        for (let index = 0; index < selectedOutposts.length; index++) {
            
            const element = selectedOutposts[index];
            console.log("this is in the loop and for elemtne ", element)
            const clientCompData = getComponentValueStrict(ClientOutpostData, element);
            setComponent(ClientOutpostData, element, { id : clientCompData.id, event_effected : clientCompData.event_effected, selected : false, owned : clientCompData.owned})
        }
       
        if (array.length === 0) { setArrayOfEntities([]); return; }
        console.log(array.length);
        setSelectedIndexFromArray(0);
        setArrayOfEntities(array);

        setEntityIdSelected(array[0]);
    }

    useEffect(() => {
        setTooltipArray.on("setToolTipArray", setArray);

        return () => {
            setTooltipArray.off("setToolTipArray", setArray);
        };
    }, []);

    useEffect (() => 
    {

        for (let index = 0; index < selectedOutposts.length; index++) {
            const element = selectedOutposts[index];
            console.log("this is in the loop and for elemtne ", element)
            const clientCompData = getComponentValueStrict(ClientOutpostData, element);
            setComponent(ClientOutpostData, element, { id : clientCompData.id, event_effected : clientCompData.event_effected, selected : false, owned : clientCompData.owned})
        }

        if (arrayOfEntities.length === 0) { return; }

        const outpostClientData = getComponentValueStrict(ClientOutpostData, entityIdSelected);

        setComponent(ClientOutpostData, entityIdSelected, { id : outpostClientData.id, event_effected : outpostClientData.event_effected, selected : true, owned : outpostClientData.owned})

    }, [entityIdSelected])


    if (arrayOfEntities.length === 0) { return <div></div>; }

    const outpostClientData = getComponentValueStrict(ClientOutpostData, entityIdSelected);
    const revenantData = getComponentValueStrict(Revenant, entityIdSelected);
    const outpostData = getComponentValueStrict(Outpost, entityIdSelected);


    const ChangeCounter = (number: number) => {
        //check if the new addtion of the numebr to selected index is bigger than the array save or is smaller than 0 in case wrap

        const outpostClientData = getComponentValueStrict(ClientOutpostData, entityIdSelected);

        setComponent(ClientOutpostData, entityIdSelected, { id : outpostClientData.id, event_effected : outpostClientData.event_effected, selected : false, owned : outpostClientData.owned})

        if (arrayOfEntities.length === 1) { 
            return; 
        }

        if (selectedIndexFromArray + number >= arrayOfEntities.length) {
            setSelectedIndexFromArray(0);
            setEntityIdSelected(arrayOfEntities[0]);
            return;
        }
        else if (selectedIndexFromArray + number < 0) {
            setSelectedIndexFromArray(arrayOfEntities.length - 1);
            setEntityIdSelected(arrayOfEntities[arrayOfEntities.length - 1]);
            return;
        }
        else {
            setSelectedIndexFromArray(selectedIndexFromArray + number);
            setEntityIdSelected(arrayOfEntities[selectedIndexFromArray + number]);
            return;
        }
    }


    const GetOutpostStatus = () => {
       
        if (outpostData.lifes === 0) {
            return "Destroyed";
        }
        if (outpostClientData.event_effected) {
            return "In event radius";
        }

        return "Safe";
    }

    return (
       
        <div className="game-tooltip-main-container">

            <ClickWrapper className="game-tooltip-exit-box" onPointerDown={() => {setArray([]) }}>X</ClickWrapper>
            <div className="game-tooltip-title-text font-size-mid-titles">Outpost Data:</div>
            <div className="game-tooltip-normal-text font-size-texts">x: {outpostData.x}, y: {outpostData.y}</div>
            <div className="game-tooltip-normal-text font-size-texts">Name: {bigIntToHexAndAscii(BigInt(outpostData.name))}</div>

            {GetOutpostStatus() === "Destroyed" ? (
                        <>
                            <div className="game-tooltip-normal-text font-size-texts">Reinforcements: 0</div>
                            <div className="game-tooltip-normal-text font-size-texts">State: <span style={{ color: 'red' }}>Destroyed</span></div>
                        </>
            ) : GetOutpostStatus() === "Safe" ? (
                        <>
                            <div className="game-tooltip-normal-text font-size-texts">Reinforcements {outpostData.lifes}</div>
                            <div className="game-tooltip-normal-text font-size-texts">State: <span style={{ color: 'green' }}>Safe</span></div>

                            {outpostClientData.owned && (<ClickWrapper className="game-tooltip-button standard-orange-color-palette font-size-texts" onPointerDown={() => {reinforce_outpost(account, outpostClientData.id)}}>Add reinforcements</ClickWrapper>)}
                        </>
            ) : (
                        <>
                            <div className="game-tooltip-section-text font-size-texts">Reinforcements {outpostData.lifes}</div>
                            <div className="game-tooltip-normal-text font-size-texts">State: <span style={{ color: 'orange' }}>In Event</span></div>
                            
                            {outpostClientData.owned && (<ClickWrapper className="game-tooltip-button standard-orange-color-palette font-size-texts" onPointerDown={() => {destroy_outpost(account, getComponentValueStrict(GameEntityCounter, getComponentValueStrict(ClientGameData,GAME_CONFIG).current_game_id as EntityIndex).event_count, outpostClientData.id) }}>Click event</ClickWrapper>)}
                        </>
            )}
            
            <div style={{ marginTop: '5%' }} className="game-tooltip-title-text font-size-mid-titles">Revenant Data:</div>
            <div className="game-tooltip-normal-text font-size-texts">Owner: {bigIntToHexWithPrefix(BigInt(revenantData.owner)).substring(0, 8) + "..." }</div>
            <div className="game-tooltip-normal-text font-size-texts">Name: {bigIntToHexAndAscii(BigInt(revenantData.name))}</div>
            <div className="game-tooltip-normal-text font-size-texts">Id: {outpostClientData.id}</div>

            {arrayOfEntities.length > 1 && (
                <div style={{ marginTop: '5%' }} className="game-tooltip-select-container">
                <ClickWrapper className="game-tooltip-button font-size-texts standard-orange-color-palette" onPointerDown={() => ChangeCounter(-1)}>Previous</ClickWrapper>
                <div className="game-tooltip-normal-text font-size-texts">{selectedIndexFromArray + 1}/{arrayOfEntities.length}</div>
                <ClickWrapper className="game-tooltip-button font-size-texts standard-orange-color-palette" onPointerDown={() => ChangeCounter(1)}>Next</ClickWrapper>
            </div>
            )}
            
        </div>
    );
};
