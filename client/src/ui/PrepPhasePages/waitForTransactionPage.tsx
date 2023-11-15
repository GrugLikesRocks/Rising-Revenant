// Import necessary dependencies from React
import React, { useState, useEffect } from "react";

import { PrepPhaseStages } from "./prepPhaseManager";
import { ClickWrapper } from "../clickWrapper";

interface WaitForTransactionPageProps {
    setMenuState: React.Dispatch<PrepPhaseStages>;
}

export const WaitForTransactionPage: React.FC<WaitForTransactionPageProps> = ({ setMenuState }) => {

    const [ellipsisCount, setEllipsisCount] = useState(0);

    const goNextPage = () => {
        setMenuState(PrepPhaseStages.BUY_REIN);
    };

    const updateEllipsis = () => {
        setEllipsisCount((prevCount) => (prevCount < 3 ? prevCount + 1 : 0));
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            
            updateEllipsis();
        }, 500);

        updateEllipsis();
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {

        const timeoutId = setTimeout(() => {
            goNextPage();
        }, 5000);
        
        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <ClickWrapper className="ppe-page-container">
            <h1>
                YOUR REVENANTS ARE BEING SUMMONED <br /> READY TO CREATE AN OUTPOST
                <span >
                    {Array.from({ length: ellipsisCount }, (_, index) => (
                        <span key={index}>.</span>
                    ))}
                </span>
            </h1>
        </ClickWrapper>
    );
};
