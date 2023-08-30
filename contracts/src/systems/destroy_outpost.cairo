#[system]
mod destroy_outpost{
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsRisingRevenant::components::Position;
    use RealmsRisingRevenant::components::Lifes;
    use RealmsRisingRevenant::components::Defence;
    use RealmsRisingRevenant::components::Name;
    use RealmsRisingRevenant::components::Prosperity;
    use RealmsRisingRevenant::components::Game;
    use RealmsRisingRevenant::components::WorldEvent;

    // This should remove lifes and defence from the entity
    // TODO: Check if the entity is within the radius of the current event
    // TODO: Send reward to destroy of outpost
    fn execute(ctx: Context, outpost_id: u128, game_id: u32, event_id: u128) {
        // Check if the game is active
        let mut game = get!(ctx.world, game_id, Game);
        assert(game.status, 'Game is not active');

        // Get the event
        let (world_event, event_position) = get!(
            ctx.world, (event_id, game_id), (WorldEvent, Position)
        );

        // Get the outpost
        let (mut lifes, mut defence, position) = get!(
            ctx.world, (outpost_id, game_id), (Lifes, Defence, Position)
        );

        // check if within radius of event -> revert if not
        let dx = if event_position.x > position.x {
            event_position.x - position.x
        } else {
            position.x - event_position.x
        };
        
        let dy = if event_position.y > position.y {
            event_position.y - position.y
        } else {
            position.y - event_position.y
        };

        let distance = dx + dy;
        if distance > world_event.radius {
            return ();
        }

        // update lifes and defence
        lifes.count -= 1;
        defence.plague -= 1;
        let _ = set!(ctx.world, (lifes, defence));

        // Emit World Event
        return ();
    }
}
