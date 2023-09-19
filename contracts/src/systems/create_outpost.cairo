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
    fn execute(ctx: Context, game_id: u32, revenant_id: u128) -> u128 {
        let (game, mut game_data) = get!(ctx.world, game_id, (Game, GameEntityCounter));
        // check if the game has started
        assert(game.status, 'game is not running');

        let mut revenant = get!(ctx.world, (game_id, revenant_id, ctx.origin), Revenant);
        revenant.assert_can_create_outpost();

        game_data.outpost_count += 1;
        revenant.outpost_count = revenant.outpost_count + 1;

        let entity_id: u128 = game_data.outpost_count.into();

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

        set!(ctx.world, (revenant, outpost, game_data));

        entity_id
    }
}

