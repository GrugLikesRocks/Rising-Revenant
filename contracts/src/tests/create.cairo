#[cfg(test)]
mod tests {
    use core::traits::Into;
    use array::ArrayTrait;

    use dojo::world::IWorldDispatcherTrait;

    use dojo::test_utils::spawn_test_world;

    // components
    use RealmsLastStanding::components::{game, Game};
    use RealmsLastStanding::components::{game_tracker, GameTracker};

    // systems
    use RealmsLastStanding::systems::create::create_game;

    #[test]
    #[available_gas(30000000)]
    fn create_game() {
        let caller = starknet::contract_address_const::<0x0>();

        // components
        let mut components = array![game::TEST_CLASS_HASH, game_tracker::TEST_CLASS_HASH];

        // systems
        let mut systems = array![];

        // deploy executor, world and register components/systems
        let world = spawn_test_world(components, systems);
    }
}
