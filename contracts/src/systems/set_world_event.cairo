#[system]
mod set_world_event {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::{Into, TryInto};
    use dojo::world::Context;
    use option::OptionTrait;

    use RealmsRisingRevenant::components::Position;
    use RealmsRisingRevenant::components::Lifes;
    use RealmsRisingRevenant::components::Defence;
    use RealmsRisingRevenant::components::Name;
    use RealmsRisingRevenant::components::WorldEvent;
    use RealmsRisingRevenant::components::Game;
    use RealmsRisingRevenant::components::GameEntityCounter;

    use RealmsRisingRevenant::constants::GAME_CONFIG;
   
    use RealmsRisingRevenant::utils::random::{Random, RandomImpl};
  
    // This should remove lifes and defence from the entity
    // This should be very random, it can be called by anyone after the blocks have ticked
    fn execute(ctx: Context, game_id: u32) -> (WorldEvent, Position) {
        // check game is active
        let mut game = get!(ctx.world, game_id, Game);
        assert(game.status, 'Game is not active');

        let mut gameData = get !(
            ctx.world, game_id, GameEntityCounter
        );  

        gameData.event_count += 1;

        let entity_id: u128 = gameData.event_count;

        // These should be random
        let radius = 100;
        let event_type = 1; // TOOD: Make enum of event types
        let block_number = 100; // TODO: Get block number
        let world_event = WorldEvent { entity_id, game_id, radius, event_type, block_number };
        
        let seed = starknet::get_tx_info().unbox().transaction_hash;
	    let mut random = RandomImpl::new(seed);
        let x = random.next_u32(0, 100);
        let y = random.next_u32(0, 100);
        let position = Position { entity_id, game_id, x, y };

        set!(ctx.world, (world_event, position, gameData));


        // TODO: Emit this as event
        (world_event, position)
    }
}