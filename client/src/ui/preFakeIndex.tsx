import { MainStateManager } from "./fakeIndex";

import { LoadingComponent } from "./loadingComponent";
import { useEffect, useState } from "react";
import { useDojo } from "../hooks/useDojo";
import { ClickWrapper } from "./clickWrapper";

export const PreFakeIndex = () => {
  const [loadingComplete, setLoadingState] = useState(false);
  const [canLoad, setCanLoad] = useState(false);

  const {
    account: { account, create, isDeploying },
  } = useDojo()

  useEffect(() => {

    console.log("isDeploying", isDeploying);
    if (isDeploying === true) {
      setCanLoad(true);
    }

  }, [isDeploying]);

  useEffect(() => {

    const isLocalStorageEmptyGeneral = Object.keys(localStorage).length === 0;

    if (isLocalStorageEmptyGeneral === false) {
      setCanLoad(true);
    }

  }, []);


  useEffect(() => {

    console.error("change of address", account.address)

  }, [account]);


  const handleLoadingComplete = () => {

    setLoadingState(true);

  };


  return (
    <div>
      {canLoad === true ? (
        <>
          {loadingComplete === false && <LoadingComponent handleLoadingComplete={handleLoadingComplete} account={account} />}
          {loadingComplete && <MainStateManager />}
        </>
      ) : <ClickWrapper>

        <div className="button-container-1" style={{position:"absolute", top:"50%", left:"50%", width:"fit-content", fontSize: "20px", transform: "translate(-50%, -50%)"}}>
          <span className="mas">Click to create a Burner and Join the game</span>
          <button id='work' type="button" name="Hover" onClick={create} className="buttonCool">Click to create a Burner and Join the game</button>
        </div>

        {/* <button style={{position:"absolute", top:"50%", left:"50%", width:"fit-content"}} onClick={create}>Create Burner</button>   */}
      </ClickWrapper>}
    </div>
  );

};

