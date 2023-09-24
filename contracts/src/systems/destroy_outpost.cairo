#[system]
mod destroy_outpost {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsRisingRevenant::components::Game;
    use RealmsRisingRevenant::components::outpost::{
        Outpost, OutpostStatus, OutpostImpl, OutpostTrait
    };
    use RealmsRisingRevenant::components::world_event::WorldEvent;
    use RealmsRisingRevenant::utils;

    // This should remove lifes and defence from the entity
    // TODO: Check if the entity is within the radius of the current event
    // TODO: Send reward to destroy of outpost
    fn execute(ctx: Context, game_id: u32, event_id: u128, outpost_id: u128) {   //returns a bool here
        // Check if the game is active
        let mut game = get!(ctx.world, game_id, Game);
        assert(game.status, 'Game is not active');

        // Get the event
        let mut world_event = get!(ctx.world, (game_id, event_id), WorldEvent);

        // Get the outpost
        let mut outpost = get!(ctx.world, (game_id, outpost_id), Outpost);
        outpost.assert_existed();

        // check if within radius of event -> revert if not
        let distance = utils::calculate_distance(
            world_event.x, world_event.y, outpost.x, outpost.y, 100
        );
        if distance > world_event.radius {
            return false;
        }

        // update lifes
        outpost.lifes -= 1;
        world_event.destroy_count += 1;

        set!(ctx.world, (outpost, world_event));

        // TODO: Should we reduce outpost_count of revenant after outpost has been destroy?

        // Emit World Event
        true
    }
}
