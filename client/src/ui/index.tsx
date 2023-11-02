import { store } from "../store/store";
import { Wrapper } from "./wrapper";

import {MainMenuContainer} from "./Pages/mainMenuContainer";

export const UI = () => {
    const layers = store((state) => {
        return {
            networkLayer: state.networkLayer,
            phaserLayer: state.phaserLayer,
        };
    });

    if (!layers.networkLayer || !layers.phaserLayer) return <></>;

    return (
        <Wrapper>
            <MainMenuContainer />
        </Wrapper>
    );
};

