#[cfg(test)]
mod tests {
    use array::ArrayTrait;
    use option::OptionTrait;
    use box::BoxTrait;
    use clone::Clone;
    use debug::PrintTrait;
    use traits::{TryInto, Into};

    use starknet::{ContractAddress, syscalls::deploy_syscall};

    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};

    use dojo::test_utils::spawn_test_world;

    // components
    use RealmsLastStanding::components::{game, Game};
    use RealmsLastStanding::components::{game_tracker, GameTracker};
    use RealmsLastStanding::components::{position, Position};
    use RealmsLastStanding::components::{lifes, Lifes};
    use RealmsLastStanding::components::{defence, Defence};
    use RealmsLastStanding::components::{name, Name};
    use RealmsLastStanding::components::{prosperity, Prosperity};
    use RealmsLastStanding::components::{ownership, Ownership};

    // systems
    use RealmsLastStanding::systems::create::create_game;
    use RealmsLastStanding::systems::create_settlement::create_settlement;


    fn mock_game() -> (IWorldDispatcher, u32, felt252) {
        let caller = starknet::contract_address_const::<0x0>();

        // components
        let mut components = array![
            game::TEST_CLASS_HASH,
            game_tracker::TEST_CLASS_HASH,
            position::TEST_CLASS_HASH,
            lifes::TEST_CLASS_HASH,
            defence::TEST_CLASS_HASH,
            name::TEST_CLASS_HASH,
            prosperity::TEST_CLASS_HASH,
            game::TEST_CLASS_HASH,
            ownership::TEST_CLASS_HASH
        ];

        // systems
        let mut systems = array![create_game::TEST_CLASS_HASH, create_settlement::TEST_CLASS_HASH];

        // deploy executor, world and register components/systems
        let world = spawn_test_world(components, systems);

        let calldata = array![];
        let mut res = world.execute('create_game'.into(), calldata);
        let game_id = serde::Serde::<u32>::deserialize(ref res)
            .expect('spawn deserialization failed');
        assert(game_id == 1, 'game id incorrect');

        (world, game_id, caller.into())
    }

    #[test]
    #[available_gas(30000000)]
    fn test_create_game() {
        let (world, _, _) = mock_game();
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_create_settlement() {
        let (world, game_id, _) = mock_game();

        let mut array = array![game_id.into()];

        let mut res = world.execute('create_settlement'.into(), array);
    }
}
