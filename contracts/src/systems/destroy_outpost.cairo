#[system]
mod destroy_outpost {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsRisingRevenant::components::game::{
        Game, GameTrait, GameImpl, GameEntityCounter, GameStatus
    };
    use RealmsRisingRevenant::components::outpost::{
        Outpost, OutpostStatus, OutpostImpl, OutpostTrait
    };
    use RealmsRisingRevenant::components::world_event::{WorldEvent, WorldEventTracker};
    use RealmsRisingRevenant::utils;

    // This should remove lifes and defence from the entity
    // TODO: Send reward to destroy of outpost
    //returns a bool here
    fn execute(ctx: Context, game_id: u32, event_id: u128, outpost_id: u128) -> bool {
        // Check if the game is active
        let (mut game, mut game_data) = get!(ctx.world, game_id, (Game, GameEntityCounter));
        game.assert_is_playing(ctx);

        // Get the event
        let mut world_event = get!(ctx.world, (game_id, event_id), WorldEvent);

        // Get the outpost
        let mut outpost = get!(ctx.world, (game_id, outpost_id), Outpost);
        outpost.assert_existed();

        assert(
            outpost.last_affect_event_id != world_event.entity_id, 'outpost affected by same event'
        );

        // check if within radius of event -> revert if not
        let distance = utils::calculate_distance(
            world_event.x, world_event.y, outpost.x, outpost.y, 100
        );
        if distance > world_event.radius {
            return false;
        }

        // update lifes
        outpost.lifes -= 1;
        outpost.last_affect_event_id = world_event.entity_id;
        world_event.destroy_count += 1;

        let event_tracker = WorldEventTracker {
            game_id, event_id: world_event.entity_id, outpost_id: outpost.entity_id
        };

        if outpost.lifes == 0 {
            game_data.outpost_exists_count -= 1;

            if game_data.outpost_exists_count <= 1 {
                game.status = GameStatus::ended;
                set!(ctx.world, (outpost, world_event, event_tracker, game_data, game));
            } else {
                set!(ctx.world, (outpost, world_event, event_tracker, game_data));
            }
        } else {
            set!(ctx.world, (outpost, world_event, event_tracker));
        }

        // Emit World Event
        true
    }
}
