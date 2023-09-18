#[system]
mod reinforce_outpost {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsRisingRevenant::components::Game;
    use RealmsRisingRevenant::components::outpost::{
        Outpost, OutpostStatus, OutpostImpl, OutpostTrait
    };

    // this will create a newoutpostat random coordinates
    // TODO: Add Lords Deposit
    fn execute(ctx: Context, entity_id: u128, game_id: u32) {
        let mut game = get!(ctx.world, game_id, Game);

        assert(game.status, 'game is not running');

        let mut outpost = get!(ctx.world, (game_id, entity_id), (Outpost));
        outpost.assert_existed();

        assert(ctx.origin == outpost.owner, 'not owner');

        outpost.lifes += 1;

        set!(ctx.world, (outpost));

        return ();
    }
}
