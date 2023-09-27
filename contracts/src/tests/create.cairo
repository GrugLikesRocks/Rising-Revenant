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
    use RealmsRisingRevenant::components::{game, Game};
    use RealmsRisingRevenant::components::{game_tracker, GameTracker};
    use RealmsRisingRevenant::components::outpost::{
        outpost, Outpost, OutpostStatus, OutpostImpl, OutpostTrait
    };

    use RealmsRisingRevenant::components::world_event::{world_event, WorldEvent, INIT_RADIUS};

    // systems
    use RealmsRisingRevenant::systems::create::create_game;

    use RealmsRisingRevenant::systems::create_outpost::create_outpost;
    use RealmsRisingRevenant::systems::reinforce_outpost::reinforce_outpost;
    use RealmsRisingRevenant::systems::set_world_event::set_world_event;
    use RealmsRisingRevenant::systems::destroy_outpost::destroy_outpost;


    fn mock_game() -> (IWorldDispatcher, u32, felt252) {
        let caller = starknet::contract_address_const::<0x0>();

        // components
        let mut components = array![
            game::TEST_CLASS_HASH,
            game_tracker::TEST_CLASS_HASH,
            outpost::TEST_CLASS_HASH,
   
            world_event::TEST_CLASS_HASH
        ];

        // systems
        let mut systems = array![
            create_game::TEST_CLASS_HASH,
       
            create_outpost::TEST_CLASS_HASH,
            reinforce_outpost::TEST_CLASS_HASH,
            set_world_event::TEST_CLASS_HASH,
            destroy_outpost::TEST_CLASS_HASH
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

    fn create_starter_outpost() -> (IWorldDispatcher, u32, felt252, u128) {
        let (world, game_id, caller) = mock_game();

        let mut array = array![
            game_id.into(), 5937281861773520500
        ]; // 5937281861773520500 => 'Revenant'
        starknet::testing::set_block_number(5_u64);
        let mut res = world.execute('create_outpost'.into(), array);
        let outpost_id = serde::Serde::<u128>::deserialize(ref res)
            .expect('id deserialization fail');

        (world, game_id, caller, outpost_id)
    }
    #[test]
    #[available_gas(30000000)]
    fn test_create_game() {
        let (world, _, _) = mock_game();
    }


    #[test]
    #[available_gas(3000000000)]
    fn test_create_outpost() {
        let (world, game_id, caller, outpost_id) = create_starter_outpost();
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_reinforce_outpost() {
        let (world, game_id, caller, outpost_id) = create_starter_outpost();

        let reinforce_array = array![outpost_id.into(), game_id.into()];
        world.execute('reinforce_outpost'.into(), reinforce_array);

        let g_id: felt252 = game_id.into();
        let s_id: felt252 = outpost_id.into();
        let compound_key_array = array![s_id, g_id];

        // assert plague value increased
        let outpost = world
            .entity(
                'Outpost'.into(),
                compound_key_array.span(),
                0,
                dojo::SerdeLen::<Outpost>::len()
            );
        assert(*outpost[4] == 6, 'life value is wrong');
    }
    #[test]
    #[available_gas(3000000000)]
    fn test_set_world_event() {
        let (world, game_id, _) = mock_game();
        starknet::testing::set_block_number(5_u64);
        let mut event = world.execute('set_world_event'.into(), array![game_id.into()]);

        let world_event = serde::Serde::<WorldEvent>::deserialize(ref event)
            .expect('Event deserialization fail');

        assert(world_event.radius == INIT_RADIUS, 'event radius is wrong');
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_destroy_outpost() {
        let (world, game_id, caller, outpost_id) = create_starter_outpost();
        let mut event = world.execute('set_world_event'.into(), array![game_id.into()]);
        let world_event = serde::Serde::<WorldEvent>::deserialize(ref event)
            .expect('W event deserialization fail');

        let mut result = world
            .execute(
                'destroy_outpost'.into(),
                array![outpost_id.into(), game_id.into(), world_event.entity_id.into()]
            );

        let destoryed = serde::Serde::<bool>::deserialize(ref result)
            .expect('destory deserialization fail');

        let g_id: felt252 = game_id.into();
        let s_id: felt252 = outpost_id.into();
        let compound_key_array = array![s_id, g_id];

        // assert plague value decreased
        let outpost = world
            .entity(
                'Outpost'.into(),
                compound_key_array.span(),
                0,
                dojo::SerdeLen::<Outpost>::len()
            );

        if destoryed {
            assert(*outpost[4] == 4, 'life value is wrong');
        } else {
            assert(*outpost[4] == 5, 'life value is wrong');
        }

        // Check the next world event's radius
        let mut event2 = world.execute('set_world_event'.into(), array![game_id.into()]);
        let world_event2 = serde::Serde::<WorldEvent>::deserialize(ref event2)
            .expect('W event deserialization fail');
        if destoryed {
            assert(world_event2.radius == INIT_RADIUS, 'radius value is wrong');
        } else {
            assert(world_event2.radius == INIT_RADIUS + 1, 'radius value is wrong');
        }
    }
}
