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
    use RealmsLastStanding::components::{world_event, WorldEvent};

    // systems
    use RealmsLastStanding::systems::create::create_game;
    use RealmsLastStanding::systems::create_settlement::create_settlement;
    use RealmsLastStanding::systems::reinforce_settlement::reinforce_settlement;
    use RealmsLastStanding::systems::set_world_event::set_world_event;
    use RealmsLastStanding::systems::destroy_settlement::destroy_settlement;


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
            ownership::TEST_CLASS_HASH,
            world_event::TEST_CLASS_HASH
        ];

        // systems
        let mut systems = array![
            create_game::TEST_CLASS_HASH,
            create_settlement::TEST_CLASS_HASH,
            reinforce_settlement::TEST_CLASS_HASH,
            set_world_event::TEST_CLASS_HASH,
            destroy_settlement::TEST_CLASS_HASH
        ];

        // deploy executor, world and register components/systems
        let world = spawn_test_world(components, systems);

        let calldata = array![];
        let mut res = world.execute('create_game'.into(), calldata);
        let game_id = serde::Serde::<u32>::deserialize(ref res)
            .expect('spawn deserialization failed');
        assert(game_id == 1, 'game id incorrect');

        (world, game_id, caller.into())
    }

    fn create_starter_settlement() -> (IWorldDispatcher, u32, felt252, u128) {
        let (world, game_id, caller) = mock_game();

        let mut array = array![game_id.into()];
        let mut res = world.execute('create_settlement'.into(), array);
        let settlement_id = serde::Serde::<u128>::deserialize(ref res)
            .expect('id deserialization fail');

        (world, game_id, caller, settlement_id)
    }

    #[test]
    #[available_gas(30000000)]
    fn test_create_game() {
        let (world, _, _) = mock_game();
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_create_settlement() {
        let (world, game_id, caller, settlement_id) = create_starter_settlement();
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_reinforce_settlement() {
        let (world, game_id, caller, settlement_id) = create_starter_settlement();

        let reinforce_array = array![settlement_id.into(), game_id.into()];
        let mut res = world.execute('reinforce_settlement'.into(), reinforce_array);

        let g_id: felt252 = game_id.into();
        let s_id: felt252 = settlement_id.into();
        let compound_key_array = array![s_id, g_id];

        // assert plague value increased
        let mut defence = world
            .entity(
                'Defence'.into(), compound_key_array.span(), 0, dojo::SerdeLen::<Defence>::len()
            );
        assert(*defence[0] == 2, 'plague value is wrong');

        // assert life value increased
        let mut life = world
            .entity('Lifes'.into(), compound_key_array.span(), 0, dojo::SerdeLen::<Lifes>::len());
        assert(*life[0] == 6, 'life value is wrong');
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_set_world_event() {
        let (world, game_id, _) = mock_game();
        let mut event = world.execute('set_world_event'.into(), array![game_id.into()]);

        let (world_event, position) = serde::Serde::<(WorldEvent, Position)>::deserialize(ref event)
            .expect('W event deserialization fail');

        assert(world_event.event_type == 1, 'event type is wrong');
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_destroy_settlement() {
        let (world, game_id, caller, settlement_id) = create_starter_settlement();
        let mut event = world.execute('set_world_event'.into(), array![game_id.into()]);
        let (world_event, position) = serde::Serde::<(WorldEvent, Position)>::deserialize(ref event)
            .expect('W event deserialization fail');


        let mut destroy = world
            .execute(
                'destroy_settlement'.into(),
                array![settlement_id.into(), game_id.into(), world_event.entity_id.into()]
            );

        let g_id: felt252 = game_id.into();
        let s_id: felt252 = settlement_id.into();
        let compound_key_array = array![s_id, g_id];

        // assert plague value decreased
        let mut defence = world
            .entity(
                'Defence'.into(), compound_key_array.span(), 0, dojo::SerdeLen::<Defence>::len()
            );
        assert(*defence[0] == 0, 'plague value is wrong');

        // assert life value decreased
        let mut life = world
            .entity('Lifes'.into(), compound_key_array.span(), 0, dojo::SerdeLen::<Lifes>::len());
        assert(*life[0] == 4, 'life value is wrong');
    }


    
}
