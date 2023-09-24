import { defineContractComponents } from "./contractComponents";
import { world } from "./world";
import { RPCProvider, Query } from "@dojoengine/core";
import { Account, num } from "starknet";
import { GraphQLClient } from 'graphql-request';
import { getSdk } from '../generated/graphql';

export const WORLD_ADDRESS = import.meta.env.VITE_PUBLIC_WORLD_ADDRESS!

export type SetupNetworkResult = Awaited<ReturnType<typeof setupNetwork>>;

export async function setupNetwork() {

    const client = new GraphQLClient(import.meta.env.VITE_PUBLIC_TORII!);
    const graphSdk = getSdk(client);

    const contractComponents = defineContractComponents(world);

    const provider = new RPCProvider(WORLD_ADDRESS, import.meta.env.VITE_PUBLIC_NODE_URL!);

    return {
        contractComponents,
        provider,

        execute: async (signer: Account, system: string, call_data: num.BigNumberish[]) => {
            return provider.execute(signer, system, call_data);
        },

        // Entity query function.
        entity: async (component: string, query: Query) => {
            return provider.entity(component, query);
        },

        // Entities query function.
        entities: async (component: string, partition: number) => {
            return provider.entities(component, partition);
        },

        // Call function.
        call: async (selector: string, call_data: num.BigNumberish[]) => {
            return provider.call(selector, call_data);
        },
        
        world,
        graphSdk
    };
}