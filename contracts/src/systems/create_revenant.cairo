#[system]
mod create_revenant {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsRisingRevenant::components::{Game, GameEntityCounter};
    use RealmsRisingRevenant::components::revenant::{Revenant, RevenantStatus,  RevenantImpl, RevenantTrait};
    use RealmsRisingRevenant::components::outpost::{
        Outpost, OutpostStatus, OutpostImpl, OutpostTrait
    };

    use RealmsRisingRevenant::constants::MAP_WIDTH;
    use RealmsRisingRevenant::constants::MAP_HEIGHT;
    use RealmsRisingRevenant::constants::PREPARE_PHRASE_INTERVAL;
    use RealmsRisingRevenant::utils::random::{Random, RandomImpl};

    // this will create a revenant with name
    fn execute(ctx: Context, game_id: u32, name: felt252) -> u128 {
        assert(name != 0, 'name length must larger than 0');

        let (game, mut game_data) = get!(ctx.world, game_id, (Game, GameEntityCounter));
        assert(game.status, 'game is not running');
        
        let block_number =  starknet::get_block_info().unbox().block_number;
        assert((block_number - game.start_block_number  ) <= PREPARE_PHRASE_INTERVAL , 'prepare phrase end');

        game_data.revenant_count += 1;

        let entity_id: u128 = game_data.revenant_count.into();

        let revenant = Revenant {
            game_id,
            entity_id,
            owner: ctx.origin,
            name: name,
            outpost_count: 1,
            status: RevenantStatus::started
        };


        set!(ctx.world, (revenant, game_data));

        create_outpost(ctx, game_id);
        entity_id
    }

    fn create_outpost(ctx: Context, game_id: u32) -> u128 {
  
        let mut game_data = get!(ctx.world, game_id, (GameEntityCounter));

       // let mut revenant = get!(ctx.world, (game_id, revenant_id), Revenant);
        
        game_data.outpost_count += 1;
       
        let entity_id: u128 = game_data.outpost_count.into();

        // We set the position of the outpost
        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let mut random = RandomImpl::new(seed);
        let x =  (MAP_WIDTH/2) -  random.next_u32(0, 400);
        let y =  (MAP_HEIGHT/2) -  random.next_u32(0, 400);

        let outpost = Outpost {
            game_id,
            entity_id,
            x,
            y,
            owner: ctx.origin,
            name: 'Outpost',
            lifes: 5,
            status: OutpostStatus::created,
            last_affect_event_id: 0
        };

        set!(ctx.world, (outpost, game_data));

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
