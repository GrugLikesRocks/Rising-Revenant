import { useEffect } from "react";
import { useDojo } from "../hooks/useDojo";
import { GAME_CONFIG, MAP_HEIGHT, MAP_WIDTH } from "../phaser/constants";
import { createComponentStructure, getFullEventGameData, getFullOutpostGameData, getGameEntitiesSpecific, getGameTrackerEntity, setClientGameComponent } from "../dojo/testCalls";
import { getEntityIdFromKeys, setComponentFromGraphQLEntity } from "@dojoengine/utils";
import { decimalToHexadecimal } from "../utils";
import { CreateGameProps } from "../dojo/types";
import { getComponentValue, getComponentValueStrict } from "@latticexyz/recs";


export const LoadingComponent = ({
    handleLoadingComplete,
}: {
    handleLoadingComplete: () => void;
}) => {

    const {
        account: { account },
        networkLayer: {
            systemCalls: { create_game, view_block_count },
            network: { graphSdk, contractComponents, clientComponents },
        },
    } = useDojo();

    const createGame = async () => {
        const createGameProps: CreateGameProps = {
            account: account,
            preparation_phase_interval: 30,
            event_interval: 30,
            erc_addr: account.address,
        };

        await create_game(createGameProps);
    };

    useEffect(() => {

        const preloadImages = async () => {
            const imageUrls = [
                "Page_Bg/SETTINGS_PAGE_BG.png",
                "Page_Bg/STATS_PAGE_BG.png",
                "Page_Bg/PROFILE_PAGE_BG.png",
                "map_Island.png",
            ];

            const imagePromises = imageUrls.map((url) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = url;
                });
            });

            await Promise.all(imagePromises);

            // await new Promise((resolve) => setTimeout(resolve, 5000));
        };

        const createClientComponent = async (game_id: number, start_block: number, prep_phase_length: number) => {

            const componentSchemaClientCamera = {
                "x": MAP_WIDTH / 2,
                "y": MAP_HEIGHT / 2,
                "tile_index": 2,
            };

            const keys = ["0x1"];
            let componentName = "ClientCameraPosition";

            let craftedEdgeGT = createComponentStructure(componentSchemaClientCamera, keys, componentName);

            setComponentFromGraphQLEntity(clientComponents, craftedEdgeGT)

            const componentSchemaClientClick = {
                "xFromOrigin": 0,
                "yFromOrigin": 0,

                "xFromMiddle": 0,
                "yFromMiddle": 0,
            };

            componentName = "ClientClickPosition";

            craftedEdgeGT = createComponentStructure(componentSchemaClientClick, keys, componentName);
            setComponentFromGraphQLEntity(clientComponents, craftedEdgeGT)

            const current_block = await view_block_count();

            let phase = 3;

            if (start_block + prep_phase_length > current_block!) {
                phase = 1;
            }
            else {
                phase = 2;
            }

            await setClientGameComponent(phase, account.address, game_id, current_block!, clientComponents);
        };

        const fetchTheCurrentGame = async () => {
            let last_game_id: any = await getGameTrackerEntity();

            if (last_game_id === 0 || last_game_id === undefined) {
                console.log("creating game");
                await createGame();

                await new Promise((resolve) => setTimeout(resolve, 5000));
                last_game_id = 1;
            }

            const componentSchema = {
                "entity_id": 1,
                "count": last_game_id,
            };
            const keys = ["0x1"];
            const componentName = "GameTracker";
            const craftedEdgeGT = createComponentStructure(componentSchema, keys, componentName);
            setComponentFromGraphQLEntity(contractComponents, craftedEdgeGT);

            const entityEdge: any = await getGameEntitiesSpecific(graphSdk, decimalToHexadecimal(last_game_id));
            await createClientComponent(last_game_id, entityEdge.node.models[0].start_block_number, entityEdge.node.models[0].preparation_phase_interval);

            setComponentFromGraphQLEntity(contractComponents, entityEdge);

            await fetchEvents(decimalToHexadecimal(last_game_id), entityEdge.node.models[1].event_count);
            await getReinforcement();
            return {
                hexLastGameId: decimalToHexadecimal(last_game_id),
                revenantCount: entityEdge.node.models[1].revenant_count
            };
        };

        const fetchTheRevenant = async (game_id: string, rev_amount: number) => {
            // const entity = await getOutpostEntitySpecific(graphSdk, game_id, "0x1");


            const data = await getFullOutpostGameData(graphSdk, game_id, rev_amount);

            for (let index = 0; index < data.length; index++) {
                const element = data[index];

                const owner = element.node.models[1].owner;
                const key = element.node.models[1].entity_id;
                let owned = false;

                if (owner === account.address) { owned = true; }

                const componentSchemaClientOutpostData = {
                    "id": +key,
                    "owned": owned,
                    "event_effected": false,
                    "selected": false,
                    "visible": false
                };

                const keys = ["0x1", decimalToHexadecimal(index + 1)];
                const componentName = "ClientOutpostData";

                const craftedEdgeCOD = createComponentStructure(componentSchemaClientOutpostData, keys, componentName);

                console.log(craftedEdgeCOD)
                
                setComponentFromGraphQLEntity(clientComponents, craftedEdgeCOD);

                setComponentFromGraphQLEntity(contractComponents, element);
            }
        };

        const getReinforcement = async () => {

        };

        const fetchEvents = async (game_id: string, event_amount: number) => {

            const data = await getFullEventGameData(graphSdk, game_id, event_amount);

            for (let index = 0; index < data.length; index++) {
                const element = data[index];

                setComponentFromGraphQLEntity(contractComponents, element);
            }
        };

        const orderOfOperations = async () => {
            await preloadImages();
            const entity_data = await fetchTheCurrentGame();
            await fetchTheRevenant(entity_data.hexLastGameId, entity_data.revenantCount);

            await checkLoadingComplete();
        };

        const checkLoadingComplete = async () => {

            const clientGameData = getComponentValue(clientComponents.ClientGameData, decimalToHexadecimal(GAME_CONFIG));

            const gameData = getComponentValue(contractComponents.Game, getEntityIdFromKeys([BigInt(clientGameData.current_game_id)]));
            const gameTracker = getComponentValue(contractComponents.GameTracker, getEntityIdFromKeys([BigInt(clientGameData.current_game_id)]));

            if (gameData === undefined || gameTracker === undefined || clientGameData === undefined) {
                await new Promise((resolve) => setTimeout(resolve, 5000));
                console.log("there was an error in the laoding of all assets, going to try again")
                orderOfOperations();
            }
            else {
                handleLoadingComplete();
            }
        };

        console.log("Loading data...");
        orderOfOperations();
    }, []);

    return <>
        <h1 style={{ position: "absolute", top: "50%", left: "50%", color: "white" }}>LOADING...</h1>
    </>;
};