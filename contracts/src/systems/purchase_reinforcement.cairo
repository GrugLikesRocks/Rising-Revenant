#[system]
mod purchase_reinforcement {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsRisingRevenant::components::game::{Game, GameTrait, GameImpl};
    use RealmsRisingRevenant::components::reinforcement::Reinforcement;

    // this will create a newoutpost at a random coordinate
    // TODO: Add Lords Deposit
    fn execute(ctx: Context, game_id: u32, count: u32) -> bool {
        let mut game = get!(ctx.world, game_id, Game);
        game.assert_can_create_outpost(ctx.world);

        let mut reinforcements = get!(ctx.world, (game_id, ctx.origin), Reinforcement);
        reinforcements.balance += count;
        set!(ctx.world, (reinforcements));

        true
    }
}


#[system]
mod fetch_reinforcement_balance {
    use array::ArrayTrait;
    use box::BoxTrait;
    use traits::Into;
    use dojo::world::Context;

    use RealmsRisingRevenant::components::reinforcement::Reinforcement;

    fn execute(ctx: Context, game_id: u32, address: felt252) -> Reinforcement {
        let reinforcements = get!(ctx.world, (game_id, address), Reinforcement);

        reinforcements
    }
}
