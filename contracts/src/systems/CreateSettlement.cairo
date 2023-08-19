#[system]
mod CreateSettlement {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsLastStanding::components::Position;
    use RealmsLastStanding::components::Lifes;
    use RealmsLastStanding::components::Defence;
    use RealmsLastStanding::components::Name;
    use RealmsLastStanding::components::Prosperity;

    // this will create a new settlement at random coordinates
    // TODO: Add Lords Deposit
    fn execute(ctx: Context) {
        let mut id = ctx.world.uuid();

        // TODO: Get random coordinates
        let (x, y) = getRandomCoordinates(ctx);

        set!(
            ctx.world,
            (
                Position {
                    entity_id: id, x: x, y: y
                    }, Lifes {
                    entity_id: id, count: 100
                    }, Defence {
                    entity_id: id, plague: 1
                    }, Name {
                    entity_id: id, value: 'Settlement'.into()
                    }, Prosperity {
                    entity_id: id, value: 1000
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
