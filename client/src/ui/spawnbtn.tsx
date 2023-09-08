import { useDojo } from "../hooks/useDojo";
import { GAME_ID } from "../phaser/constants";
import { ClickWrapper } from "./clickWrapper";

// ALL TO DELETE

export const SpawnBtn = () => {
    const {
        account: {
            // create,
            // list,
            // get,
            // account,
            // select,
            // isDeploying
        },
        networkLayer: {
            systemCalls: {},
        },
    } = useDojo();

    return (
        <ClickWrapper>
            {/* <button onClick={create}>{isDeploying ? "deploying burner" : "create burner"}</button>
            <div className="card">
                select signer:{" "}
                <select onChange={e => select(e.target.value)}>
                    {list().map((account, index) => {
                        return <option value={account.address} key={index}>{account.address}</option>
                    })}
                </select>
            </div> */}
            {/* <button
                onClick={() => {
                    spawn(account);
                }}
            >
                Spawn
            </button> */}

            <button
                onClick={() => {
                    // life_def_increment(account);
                }}
            >
                increment
            </button>



        </ClickWrapper>
    );
};