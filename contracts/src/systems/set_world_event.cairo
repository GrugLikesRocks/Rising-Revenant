#[system]
mod set_world_event {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use dojo::world::Context;
    use option::OptionTrait;

    use RealmsRisingRevenant::components::Game;
    use RealmsRisingRevenant::components::GameEntityCounter;

    use RealmsRisingRevenant::constants::GAME_CONFIG;

    use RealmsRisingRevenant::components::world_event::{INIT_RADIUS, WorldEvent};
    use RealmsRisingRevenant::utils::MAX_U32;
    use RealmsRisingRevenant::utils::random::{Random, RandomImpl};

    // This should remove lifes and defence from the entity
    // This should be very random, it can be called by anyone after the blocks have ticked
    fn execute(ctx: Context, game_id: u32) -> WorldEvent {
        // check game is active
        let mut game = get!(ctx.world, game_id, Game);
        assert(game.status, 'Game is not active');

        let mut gameData = get!(ctx.world, game_id, GameEntityCounter);
        gameData.event_count += 1;

        let entity_id: u128 = gameData.event_count.into();
        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let mut random = RandomImpl::new(seed);
        let x = random.next_u32(0, 100);
        let y = random.next_u32(0, 100);

        // Radius is auto increment
        let mut radius: u32 = 0;
        if gameData.event_count >= MAX_U32 - INIT_RADIUS {
            radius = MAX_U32;
        } else {
            radius = INIT_RADIUS + gameData.event_count;
        }

        let world_event = WorldEvent { game_id, entity_id, x, y, radius };

        set!(ctx.world, (world_event, gameData));

        world_event
    }
}
