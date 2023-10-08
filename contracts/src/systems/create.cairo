#[system]
mod create_game {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use dojo::world::Context;
    use option::OptionTrait;

    use RealmsRisingRevenant::components::game::{Game, GameStatus, GameTracker, GameEntityCounter};
    use RealmsRisingRevenant::constants::GAME_CONFIG;

    // Creates a new game
    // increments game id
    // sets game tracker
    // TODO: Add Lords Deposit
    fn execute(ctx: Context, preparation_phase_interval: u64, event_interval: u64) -> u32 {
        let mut game_tracker = get!(ctx.world, (GAME_CONFIG), GameTracker);
        let game_id = game_tracker.count + 1; // game id increment

        let start_block_number = starknet::get_block_info().unbox().block_number; // blocknumber
        let prize = 0; // total prize
        let status = GameStatus::preparing; // game status

        set!(
            ctx.world,
            (Game {
                game_id,
                start_block_number,
                prize,
                preparation_phase_interval,
                event_interval,
                status
            })
        );

        set!(
            ctx.world,
            (GameEntityCounter { game_id, revenant_count: 0, outpost_count: 0, event_count: 0, outpost_exists_count: 0 })
        );

        set!(
            ctx.world, (GameTracker { entity_id: GAME_CONFIG.try_into().unwrap(), count: game_id })
        );

        // Emit World Event
        return (game_id);
    }
}


#[system]
mod fetch_game_data {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use dojo::world::Context;
    use option::OptionTrait;

    use RealmsRisingRevenant::components::game::Game;

    fn execute(ctx: Context, game_id: u32) -> Game {
        let game = get!(ctx.world, game_id, Game);
        game
    }
}


#[system]
mod fetch_game_tracker_data {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use dojo::world::Context;
    use option::OptionTrait;

    use RealmsRisingRevenant::components::game::GameTracker;

    use RealmsRisingRevenant::constants::GAME_CONFIG;

    fn execute(ctx: Context) -> GameTracker {
        let game_tracker = get!(ctx.world, GAME_CONFIG, GameTracker);
        game_tracker
    }
}


#[system]
mod fetch_game_entity_counter_data {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use dojo::world::Context;
    use option::OptionTrait;

    use RealmsRisingRevenant::components::game::GameEntityCounter;

    fn execute(ctx: Context, game_id: u32) -> GameEntityCounter {
        let game_entity_counter = get!(ctx.world, game_id, GameEntityCounter);
        game_entity_counter
    }
}
