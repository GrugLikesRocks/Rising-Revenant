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
        Revenant, RevenantStatus, RevenantImpl, RevenantTrait};

    use RealmsRisingRevenant::constants::MAP_WIDTH;
    use RealmsRisingRevenant::constants::MAP_HEIGHT;

    use RealmsRisingRevenant::utils::random::{Random, RandomImpl};

    use RealmsRisingRevenant::components::GameEntityCounter;

    use RealmsRisingRevenant::constants::PREPARE_PHRASE_INTERVAL;

    // this will create a newoutpost at a random coordinate
    // TODO: Add Lords Deposit
    fn execute(ctx: Context, game_id: u32, revenant_id: u128) -> u128 {
        let (game, mut game_data) = get!(ctx.world, game_id, (Game, GameEntityCounter));
        // check if the game has started
        assert(0 == 1,  'not used');

        let block_number =  starknet::get_block_info().unbox().block_number;
        assert((block_number - game.start_block_number  ) > PREPARE_PHRASE_INTERVAL , 'game not start');

        let mut revenant = get!(ctx.world, (game_id, revenant_id), Revenant);
        revenant.assert_can_create_outpost();

        game_data.outpost_count += 1;
        revenant.outpost_count = revenant.outpost_count + 1;

        let entity_id: u128 = game_data.outpost_count.into();

        // We set the position of the outpost
        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let mut random = RandomImpl::new(seed);
        let x = random.next_u32((MAP_HEIGHT/2) - 400,(MAP_HEIGHT/2) + 400);
        let y = random.next_u32((MAP_HEIGHT/2) - 400,(MAP_HEIGHT/2) + 400);

        let wordOne: felt252 = entity_id.into();
        let wordTwo: felt252 = 'Outpost '.into();
        let wordThree: felt252 = wordOne;

        let outpost = Outpost {
            game_id,
            entity_id,
            x,
            y,
            owner: ctx.origin,
            name: wordThree.into(),
            lifes: 1,
            status: OutpostStatus::created,
            last_affect_event_id: 0
        };

        set!(ctx.world, (revenant, outpost, game_data));

        entity_id
    }
}



