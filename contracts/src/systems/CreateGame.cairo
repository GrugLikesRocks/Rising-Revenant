#[system]
mod CreateGame {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsLastStanding::components::Game;
    use RealmsLastStanding::components::GameTracker;

    use RealmsLastStanding::constants::GAME_CONFIG;

    // Creates a new game
    // increments game id
    // sets game tracker
    // TODO: Add Lords Deposit
    fn execute(ctx: Context) {
        let mut game_tracker = get!(ctx.world, GAME_CONFIG, GameTracker);

        let game_id = game_tracker.count + 1; // game id increment

        let start_time = 0; // blocknumber
        let prize = 0; // total prize
        let status = true; // game status

        set!(ctx.world, (Game { game_id, start_time, prize, status }));

        set!(ctx.world, (GameTracker { entity_id: GAME_CONFIG, count: game_id }));

        // Emit World Event
        return ();
    }
}


#[cfg(test)]
mod tests {
    #[test]
    #[available_gas(1000000000)]
    fn it_works() {
        assert(true, 'it works!');
    }
}
