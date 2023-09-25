#[system]
mod set_world_event {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use dojo::world::Context;
    use option::OptionTrait;

    use RealmsRisingRevenant::components::Game;
    use RealmsRisingRevenant::components::GameEntityCounter;

    use RealmsRisingRevenant::constants::EVENT_BLOCK_INTERVAL;

    use RealmsRisingRevenant::components::world_event::{INIT_RADIUS, WorldEvent};
    use RealmsRisingRevenant::utils::MAX_U32;
    use RealmsRisingRevenant::utils::random::{Random, RandomImpl};

    // This should remove lifes and defence from the entity
    // This should be very random, it can be called by anyone after the blocks have ticked
    fn execute(ctx: Context, game_id: u32) -> WorldEvent {
        // check game is active
        let mut game = get!(ctx.world, game_id, Game);
        assert(game.status, 'Game is not active');

        let mut game_data = get!(ctx.world, game_id, GameEntityCounter);
        game_data.event_count += 1;

        let entity_id: u128 = game_data.event_count.into();
        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let block_number =  starknet::get_block_info().unbox().block_number;
        let mut random = RandomImpl::new(seed);
        let x = random.next_u32(0, 100);
        let y = random.next_u32(0, 100);

        // Radius increases when the previous world event does not cause damage.
        let mut radius: u32 = 0;
        if entity_id <= 1 {
            radius = INIT_RADIUS;
        } else {
            let prev_world_event = get!(ctx.world, (game_id, entity_id - 1), WorldEvent);

            assert((block_number - prev_world_event.block_number  ) > EVENT_BLOCK_INTERVAL , 'event occur interval too small');
            

            if prev_world_event.destroy_count == 0 && prev_world_event.radius < MAX_U32 {
                radius = prev_world_event.radius + 1;
            } else {
                radius = prev_world_event.radius;
            }
        }

      
        let world_event = WorldEvent { game_id, entity_id, x, y, radius, destroy_count: 0, block_number };

        set!(ctx.world, (world_event, game_data));

        world_event
    }
}
