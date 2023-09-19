#[system]
mod create_outpost {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsRisingRevenant::components::Game;
    use RealmsRisingRevenant::components::outpost::{
        Outpost, OutpostStatus, OutpostImpl, OutpostTrait
    };
    use RealmsRisingRevenant::components::revenant::{
        Revenant, RevenantStatus, RevenantImpl, RevenantTrait
    };
    use RealmsRisingRevenant::utils::random::{Random, RandomImpl};

    use RealmsRisingRevenant::components::GameEntityCounter;

    // this will create a newoutpostat random coordinates
    // TODO: Add Lords Deposit
    fn execute(ctx: Context, game_id: u32) -> u128 {
        let mut game = get!(ctx.world, game_id, Game);

        let mut gameData = get!(ctx.world, game_id, GameEntityCounter);
        // check if the game has started
        assert(game.status, 'game is not running');

        let mut revenant = get!(ctx.world, (game_id, ctx.origin), Revenant);
        revenant.assert_started();
        // TODO: Should we check revenant's outpost count reach the limit?

        gameData.outpost_count += 1;

        let outpost_count: u128 = gameData.outpost_count.into();

        let entity_id: u128 = outpost_count;

        // We set the position of the outpost
        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let mut random = RandomImpl::new(seed);
        let x = random.next_u32(0, 100);
        let y = random.next_u32(0, 100);

        let outpost = Outpost {
            game_id,
            entity_id,
            x,
            y,
            owner: ctx.origin,
            name: 'Outpost',
            lifes: 5,
            status: OutpostStatus::created
        };

        revenant.outpost_count = revenant.outpost_count + 1;
        set!(ctx.world, (revenant, outpost, gameData));

        entity_id
    }
}

