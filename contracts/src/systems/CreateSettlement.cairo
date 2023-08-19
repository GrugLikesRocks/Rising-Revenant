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
    use RealmsLastStanding::components::Game;
    use RealmsLastStanding::components::Ownership;

    // this will create a new settlement at random coordinates
    // TODO: Add Lords Deposit
    fn execute(ctx: Context, game_id: u32) {
        let mut game = get!(ctx.world, game_id, Game);

        assert(game.status, 'game is not running');

        // increment entity_id
        let mut entity_id = ctx.world.uuid();

        // We set the lifes of the settlement
        let lifes = Lifes { entity_id, game_id, count: 5 };

        // We set the defence of the settlement
        let defence = Defence { entity_id, game_id, plague: 1 };

        // We set the name of the settlement
        let name = Name { entity_id, game_id, value: 'Settlement'.into() };

        // We set a random prosperity for the settlement
        let prosperity = Prosperity { entity_id, game_id, value: 1000 };

        // We set the position of the settlement
        // TODO: Get random coordinates
        let (x, y) = getRandomCoordinates(ctx);
        let position = Position { entity_id, game_id, x, y };

        // We set the ownership of the settlement to the player who created it
        let ownership = Ownership { entity_id, game_id, address: ctx.origin.into() };

        set!(ctx.world, (position, lifes, defence, name, prosperity, ownership));

        return ();
    }

    fn getRandomCoordinates(ctx: Context) -> (u32, u32) {
        // TODO: get random coordinates
        return (1, 1);
    }
}
