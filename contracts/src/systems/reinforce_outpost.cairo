#[system]
mod reinforce_outpost {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsRisingRevenant::components::game::{Game, GameTrait, GameImpl};
    use RealmsRisingRevenant::components::outpost::{
        Outpost, OutpostStatus, OutpostImpl, OutpostTrait
    };
    use RealmsRisingRevenant::components::reinforcement::Reinforcement;

    // this will create a newoutpostat random coordinates
    // TODO: Add Lords Deposit
    fn execute(ctx: Context, game_id: u32, entity_id: u128,) {
        let mut game = get!(ctx.world, game_id, Game);
        game.assert_is_playing(ctx);

        let mut outpost = get!(ctx.world, (game_id, entity_id), (Outpost));
        outpost.assert_existed();

        assert(ctx.origin == outpost.owner, 'not owner');

        let mut reinforcement = get!(ctx.world, (game_id, ctx.origin), Reinforcement);

        assert(reinforcement.balance > 0, 'no reinforcement');

        outpost.lifes += 1;
        reinforcement.balance = reinforcement.balance - 1;

        set!(ctx.world, (outpost, reinforcement));

        return ();
    }
}
