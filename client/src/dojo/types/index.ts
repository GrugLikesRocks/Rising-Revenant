import { Account, num } from "starknet";

export interface SystemSigner {
    account: Account
}


export interface CreateGameProps extends SystemSigner {
    preparation_phase_interval: num.BigNumberish;
    event_interval: num.BigNumberish;
    erc_addr: Account;
}