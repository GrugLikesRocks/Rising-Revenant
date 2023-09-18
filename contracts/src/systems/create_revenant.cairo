#[system]
mod create_revenant {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsRisingRevenant::components::Game;
    use RealmsRisingRevenant::components::revenant::{Revenant, RevenantStatus};

    // this will create a revenant with name
    fn execute(ctx: Context, game_id: u32, name: felt252) -> u128 {
        assert(name != 0, 'name length must larger than 0');

        let game = get!(ctx.world, game_id, Game);
        assert(game.status, 'game is not running');

        let existed_revenant = get!(ctx.world, (game_id, ctx.origin), (Revenant));
        assert(
            existed_revenant.status == RevenantStatus::not_start, 'Revenant has already created'
        );

        let revenant = Revenant {
            game_id,
            address: ctx.origin,
            name: name,
            outpost_count: 0,
            status: RevenantStatus::started
        };
        set!(ctx.world, (revenant));

        // TODO: What should return after create revenant successfully 
        0
    }
}
