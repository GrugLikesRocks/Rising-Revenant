#[system]
mod set_world_event {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsRisingRevenant::components::Position;
    use RealmsRisingRevenant::components::Lifes;
    use RealmsRisingRevenant::components::Defence;
    use RealmsRisingRevenant::components::Name;
    use RealmsRisingRevenant::components::WorldEvent;
    use RealmsRisingRevenant::components::Game;

    use RealmsRisingRevenant::constants::GAME_CONFIG;

 //   use xoroshiro::xoroshiro::{IXoroshiro,IXoroshiroDispatcher};

    // This should remove lifes and defence from the entity
    // This should be very random, it can be called by anyone after the blocks have ticked
    fn execute(ctx: Context, game_id: u32) -> (WorldEvent, Position) {
        // check game is active
        let mut game = get!(ctx.world, game_id, Game);
        assert(game.status, 'Game is not active');

        let entity_id: u128 = ctx.world.uuid().into();

        // These should be random
        let radius = 100;
        let event_type = 1; // TOOD: Make enum of event types
        let block_number = 100; // TODO: Get block number
        let world_event = WorldEvent { entity_id, game_id, radius, event_type, block_number };

        // TODO: Get Random coordinates
        let (x, y) = getRandomCoordinates(ctx);
        let position = Position { entity_id, game_id, x: 0, y: 0 };

        set!(ctx.world, (world_event, position));

        // TODO: Emit this as event
        (world_event, position)
    }

 fn getRandomCoordinates(ctx: Context) -> (u32, u32) {
     // TODO: get random coordinates
       // let seed = starknet::get_tx_info().unbox().transaction_hash;
     //   assert(1 != 1, seed);
       // let xoroshiro = IXoroshiroDispatcher { seed };
        return (1, 1);
 }
}
