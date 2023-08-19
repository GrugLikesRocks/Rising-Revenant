#[system]
mod reinforce_settlement {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsLastStanding::components::Position;
    use RealmsLastStanding::components::Lifes;
    use RealmsLastStanding::components::Defence;
    use RealmsLastStanding::components::Name;
    use RealmsLastStanding::components::Prosperity;
    use RealmsLastStanding::components::Game;
    use RealmsLastStanding::components::Ownership;

    // this will create a new settlement at random coordinates
    // TODO: Add Lords Deposit
    fn execute(ctx: Context, entity_id: u128, game_id: u32) {
        let mut game = get!(ctx.world, game_id, Game);

        // assert game is running
        assert(game.status, 'game is not running');

        let (mut lifes, mut defence, ownership) = get!(ctx.world, (entity_id, game_id), (Lifes, Defence, Ownership));
        
        // check caller is owner
        assert(ctx.origin.into() == ownership.address, 'not owner');

        lifes.count += 1;

        defence.plague += 1;

        set!(ctx.world, (lifes, defence));

        return ();
    }
}
