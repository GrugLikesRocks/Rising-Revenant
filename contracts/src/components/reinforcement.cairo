use cubit::f128::types::fixed::{Fixed, FixedTrait};
use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};
use dojo_defi::dutch_auction::vrgda::{LogisticVRGDA, LogisticVRGDATrait};
use starknet::{ContractAddress, get_block_timestamp};

#[derive(Model, Copy, Drop, Serde, SerdeLen)]
struct Reinforcement {
    #[key]
    game_id: u32,
    #[key]
    owner: ContractAddress,
    balance: u32
}

#[derive(Model, Copy, Drop, Serde, SerdeLen)]
struct ReinforcementBalance {
    #[key]
    game_id: u32,
    target_price: u128,
    start_timestamp: u64,
    count: u128,
}

const target_price: u128 = 10;
const decay_constant: u128 = 571849066284996100; // 0.031
const max_sellable: u128 = 1000000000;

#[generate_trait]
impl ReinforcementBalanceImpl of ReinforcementBalanceTrait {
    fn get_reinforcement_price(
        self: ReinforcementBalance, world: IWorldDispatcher, game_id: u32
    ) -> u128 {
        let balance_info = get!(world, (game_id), ReinforcementBalance);

        let time_since_start: u128 = get_block_timestamp().into()
            - balance_info.start_timestamp.into();

        let vrgda = LogisticVRGDA {
            target_price: FixedTrait::new_unscaled(balance_info.target_price, false),
            decay_constant: FixedTrait::new(decay_constant, false),
            max_sellable: FixedTrait::new_unscaled(max_sellable, false),
            time_scale: FixedTrait::new(decay_constant, false),
        };

        let price = vrgda
            .get_vrgda_price(
                FixedTrait::new_unscaled(time_since_start / 60, false),
                FixedTrait::new_unscaled(balance_info.count, false)
            );

        price.try_into().unwrap()
    }
}
