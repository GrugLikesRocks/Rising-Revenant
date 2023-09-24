#[system]
mod create_revenant {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsRisingRevenant::components::{Game, GameEntityCounter};
    use RealmsRisingRevenant::components::revenant::{Revenant, RevenantStatus};

    // this will create a revenant with name
    fn execute(ctx: Context, game_id: u32, name: felt252) -> u128 {
        assert(name != 0, 'name length must larger than 0');

        let (game, mut game_data) = get!(ctx.world, game_id, (Game, GameEntityCounter));
        assert(game.status, 'game is not running');

        game_data.revenant_count += 1;

        let entity_id: u128 = game_data.revenant_count.into();

        let revenant = Revenant {
            game_id,
            entity_id,
            owner: ctx.origin,
            name: name,
            outpost_count: 0,
            status: RevenantStatus::started
        };
        set!(ctx.world, (revenant, game_data));

        entity_id
    }
}



#[system]
mod fetch_revenant_data {
       use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsRisingRevenant::components::{Game, GameEntityCounter};
    use RealmsRisingRevenant::components::revenant::{Revenant, RevenantStatus};

    fn execute(ctx: Context,game_id :u32, entity_id: u128) -> Revenant{
        let game = get!(ctx.world, game_id, Game);
        // check if the game has started
        assert(game.status, 'game is not running');

        let revenant = get!(ctx.world, (game_id,entity_id), Revenant);

        revenant
    }
}
