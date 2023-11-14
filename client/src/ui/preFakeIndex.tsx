import { MainStateManager } from "./fakeIndex";

import { LoadingComponent } from "./loadingComponent";
import { useEffect, useState } from "react";
import { useDojo } from "../hooks/useDojo";
import { ClickWrapper } from "./clickWrapper";

export const PreFakeIndex = () => {
  const [loadingComplete, setLoadingState] = useState(false);
  const [canLoad, setCanLoad] = useState(false);

  const {
    account: { account, create , isDeploying},
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

    console.error("change of address" , account.address)

  }, [account]);


  const handleLoadingComplete = () => {

    console.log("\n\n\n\n\n\n\n\n\n")
    console.error(account.address)
    setLoadingState(true);

    console.error(account.address)
    console.log("\n\n\n\n\n\n\n\n\n")
  };


  return (
    <div>
      {canLoad === true ? (
        <>
          {loadingComplete === false && <LoadingComponent handleLoadingComplete={handleLoadingComplete}  account={account} />}
          {loadingComplete && <MainStateManager />}
        </>
      ) :   <ClickWrapper> <button style={{position:"absolute", top:"50%", left:"50%", width:"fit-content"}} onClick={create}>Create Burner</button> </ClickWrapper>}
    </div>
  );
  
};

