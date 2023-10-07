#[system]
mod purchase_reinforcement {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsRisingRevenant::components::Game;

    use RealmsRisingRevenant::components::reinforcement::{Reinforcement};

    use RealmsRisingRevenant::constants::PREPARE_PHRASE_INTERVAL;

    // this will create a newoutpost at a random coordinate
    // TODO: Add Lords Deposit
    fn execute(ctx: Context, game_id: u32, count: u32) -> bool {
        let game = get!(ctx.world, game_id, Game);
        // check if the game has started
        let block_number = starknet::get_block_info().unbox().block_number;
        assert(
            (block_number - game.start_block_number) <= PREPARE_PHRASE_INTERVAL,
            'prepare phrase end'
        );

        let mut reinforcements = get!(ctx.world, (game_id, ctx.origin), Reinforcement);
        reinforcements.balance += count;
        set!(ctx.world, (reinforcements));

        true
    }
}


#[system]
mod fetch_reinforcement_balance {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsRisingRevenant::components::reinforcement::{Reinforcement};

    fn execute(ctx: Context, game_id: u32, address: felt252) -> Reinforcement {
        let reinforcements = get!(ctx.world, (game_id, address), Reinforcement);

        reinforcements
    }
}
