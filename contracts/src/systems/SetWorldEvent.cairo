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

    // This should remove lifes and defence from the entity
    fn execute(ctx: Context) {
        let mut id = ctx.world.uuid();

        // TODO: Get random coordinates
        let (x, y) = getRandomCoordinates(ctx);

        // These should be random
        let radius = 100;
        let event_type = 1;

        set!(
            ctx.world,
            (
                WorldEvent {
                    entity_id: id, radis: radius, event_type: event_type
                    }, Position {
                    entity_id: id, x, y
                }
            )
        );

        // Emit World Event
        return ();
    }

    fn getRandomCoordinates(ctx: Context) -> (u32, u32) {
        // TODO: get random coordinates
        return (1, 1);
    }
}
