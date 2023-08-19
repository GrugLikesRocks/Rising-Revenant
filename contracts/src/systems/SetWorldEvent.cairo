#[system]
mod SetWorldEvent {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsLastStanding::components::Position;
    use RealmsLastStanding::components::Lifes;
    use RealmsLastStanding::components::Defence;
    use RealmsLastStanding::components::Name;
    use RealmsLastStanding::components::WorldEvent;
    use RealmsLastStanding::components::Game;

    use RealmsLastStanding::constants::GAME_CONFIG;

    // This should remove lifes and defence from the entity
    fn execute(ctx: Context, game_id: u32) {
        // check game is active
        let mut game = get!(ctx.world, GAME_CONFIG, Game);

        assert(game.status, 'Game is not active');

        let entity_id = ctx.world.uuid();

        // These should be random
        let radius = 100;
        let event_type = 1;
        let world_event = WorldEvent { entity_id, game_id, radius, event_type };

        let (x, y) = getRandomCoordinates(ctx);
        let position = Position { entity_id, game_id, x, y,  };

        set!(ctx.world, (world_event, position));

        // Emit World Event
        return ();
    }

    fn getRandomCoordinates(ctx: Context) -> (u32, u32) {
        // TODO: get random coordinates
        return (1, 1);
    }
}
