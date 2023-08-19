#[system]
mod DestroySettlement {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsLastStanding::components::Position;
    use RealmsLastStanding::components::Lifes;
    use RealmsLastStanding::components::Defence;
    use RealmsLastStanding::components::Name;
    use RealmsLastStanding::components::Prosperity;

    // This should remove lifes and defence from the entity
    // TODO: Check if the entity is within the radius of the current event
    fn execute(ctx: Context, entity_id: u32) {
        get!(ctx.world, entity_id, (Lifes, Defence, Position));

        set!(
            ctx.world,
            (
                Lifes {
                    entity_id: entity_id, count: 100
                    }, Defence {
                    entity_id: entity_id, plague: 1
                }
            )
        );

        // Emit World Event
        return ();
    }
}
