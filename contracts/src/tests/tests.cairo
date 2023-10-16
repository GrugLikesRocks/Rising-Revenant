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
    use RealmsRisingRevenant::components::game::{
        game, Game, game_tracker, GameTracker, GameStatus, GameEntityCounter, GameImpl, GameTrait
    };
    use RealmsRisingRevenant::components::outpost::{
        outpost, Outpost, OutpostStatus, OutpostImpl, OutpostTrait
    };
    use RealmsRisingRevenant::components::revenant::{
        revenant, Revenant, RevenantStatus, RevenantImpl, RevenantTrait
    };
    use RealmsRisingRevenant::components::world_event::{world_event, WorldEvent};

    use RealmsRisingRevenant::constants::{EVENT_INIT_RADIUS, GAME_CONFIG, OUTPOST_INIT_LIFE};
    // systems
    use RealmsRisingRevenant::systems::create_game::{create_game, refresh_game_status};
    use RealmsRisingRevenant::systems::create_revenant::create_revenant;
    use RealmsRisingRevenant::systems::purchase_reinforcement::purchase_reinforcement;
    use RealmsRisingRevenant::components::reinforcement::Reinforcement;
    use RealmsRisingRevenant::systems::reinforce_outpost::reinforce_outpost;
    use RealmsRisingRevenant::systems::set_world_event::set_world_event;
    use RealmsRisingRevenant::systems::destroy_outpost::destroy_outpost;

    const EVENT_BLOCK_INTERVAL: u64 = 3;
    const PREPARE_PHRASE_INTERVAL: u64 = 10;

    // region ---- base method ----

    fn _init_world() -> (IWorldDispatcher, ContractAddress) {
        let caller = starknet::contract_address_const::<0x0>();

        // components
        let mut components = array![
            game::TEST_CLASS_HASH,
            game_tracker::TEST_CLASS_HASH,
            outpost::TEST_CLASS_HASH,
            revenant::TEST_CLASS_HASH,
            world_event::TEST_CLASS_HASH
        ];

        // systems
        let mut systems = array![
            create_game::TEST_CLASS_HASH,
            create_revenant::TEST_CLASS_HASH,
            purchase_reinforcement::TEST_CLASS_HASH,
            refresh_game_status::TEST_CLASS_HASH,
            reinforce_outpost::TEST_CLASS_HASH,
            set_world_event::TEST_CLASS_HASH,
            destroy_outpost::TEST_CLASS_HASH
        ];

        // deploy executor, world and register components/systems
        let world = spawn_test_world(components, systems);
        (world, caller)
    }

    fn _init_game() -> (IWorldDispatcher, ContractAddress, u32) {
        let (world, caller) = _init_world();
        let calldata = array![PREPARE_PHRASE_INTERVAL.into(), EVENT_BLOCK_INTERVAL.into()];
        let mut res = world.execute('create_game'.into(), calldata);
        let game_id = serde::Serde::<u32>::deserialize(ref res)
            .expect('spawn deserialization failed');
        (world, caller, game_id)
    }

    fn _create_revenant(world: IWorldDispatcher, game_id: u32) -> (u128, u128) {
        let mut array = array![
            game_id.into(), 5937281861773520500
        ]; // 5937281861773520500 => 'Revenant'
        let mut res = world.execute('create_revenant'.into(), array);
        let (revenant_id, outpost_id) = serde::Serde::<(u128, u128)>::deserialize(ref res)
            .expect('id deserialization fail');

        (revenant_id, outpost_id)
    }

    fn _create_starter_revenant() -> (IWorldDispatcher, ContractAddress, u32, u128, u128) {
        let (world, caller, game_id) = _init_game();
        let (revenant_id, outpost_id) = _create_revenant(world, game_id);
        (world, caller, game_id, revenant_id, outpost_id)
    }

    fn _add_block_number(number: u64) -> u64 {
        let mut block_number = starknet::get_block_info().unbox().block_number;
        block_number += PREPARE_PHRASE_INTERVAL + 1;
        starknet::testing::set_block_number(block_number);
        block_number
    }
    // endregion ---- base method ----

    #[test]
    #[available_gas(30000000)]
    fn test_create_game() {
        let (world, caller) = _init_world();

        let calldata = array![PREPARE_PHRASE_INTERVAL.into(), EVENT_BLOCK_INTERVAL.into()];
        let mut res = world.execute('create_game'.into(), calldata);
        let game_id = serde::Serde::<u32>::deserialize(ref res)
            .expect('spawn deserialization failed');
        assert(game_id == 1, 'game id incorrect');

        let game_tracker = get!(world, GAME_CONFIG, GameTracker);
        assert(game_tracker.count == 1, 'wrong game trakcer');

        let (mut game, game_counter) = get!(world, (game_id), (Game, GameEntityCounter));
        game.assert_existed();
        game.assert_can_create_outpost(world);

        assert(game.status == GameStatus::preparing, 'wrong game status');
        assert(game_counter.outpost_count == 0, 'wrong outpost count');

        _add_block_number(PREPARE_PHRASE_INTERVAL + 1);
        world.execute('refresh_game_status'.into(), array![game_id.into()]);
        let mut game = get!(world, (game_id), Game);
        // Cannot test refresh_status because it calls `set!`
        // which will cause error `must be called thru executor` during testing.
        game.assert_is_playing(world);
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_create_revenant() {
        let (world, caller, game_id) = _init_game();
        let (revenant_id, outpost_id) = _create_revenant(world, game_id);

        let (game, game_counter) = get!(world, (game_id), (Game, GameEntityCounter));
        assert(game_counter.revenant_count == 1, 'wrong revenant count');
        assert(game_counter.outpost_count == 1, 'wrong outpost count');
        assert(game_counter.outpost_exists_count == 1, 'wrong outpost count');

        let revenant = get!(world, (game_id, revenant_id), Revenant);
        assert(revenant.outpost_count == 1, 'wrong revenant info');
        assert(revenant.owner == caller, 'wrong revenant info');
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_purchase_reinforcement() {
        let (world, caller, game_id, revenant_id, outpost_id) = _create_starter_revenant();

        let purchase_count = 10_u32;
        let mut purchase_event = world
            .execute(
                'purchase_reinforcement'.into(), array![game_id.into(), purchase_count.into()]
            );
        let purchase_result = serde::Serde::<bool>::deserialize(ref purchase_event)
            .expect('Purchase d fail');
        assert(purchase_result, 'Failed to purchase');

        let reinforcement = get!(world, (game_id, caller), Reinforcement);
        assert(reinforcement.balance == purchase_count, 'wrong purchase count');
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_reinforce_outpost() {
        let (world, caller, game_id, revenant_id, outpost_id) = _create_starter_revenant();

        let purchase_count = 10_u32;
        world
            .execute(
                'purchase_reinforcement'.into(), array![game_id.into(), purchase_count.into()]
            );

        _add_block_number(PREPARE_PHRASE_INTERVAL + 1);
        world.execute('reinforce_outpost'.into(), array![game_id.into(), outpost_id.into()]);
        let outpost = get!(world, (game_id, outpost_id), (Outpost));
        assert(outpost.lifes == OUTPOST_INIT_LIFE + 1, 'life value is wrong');
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_set_world_event() {
        let (world, _, game_id) = _init_game();
        _add_block_number(PREPARE_PHRASE_INTERVAL + 1);

        let mut event = world.execute('set_world_event'.into(), array![game_id.into()]);
        let world_event = serde::Serde::<WorldEvent>::deserialize(ref event)
            .expect('Event deserialization fail');
        assert(world_event.radius == EVENT_INIT_RADIUS, 'event radius is wrong');

        _add_block_number(EVENT_BLOCK_INTERVAL + 1);
        let mut event2 = world.execute('set_world_event'.into(), array![game_id.into()]);
        let world_event2 = serde::Serde::<WorldEvent>::deserialize(ref event2)
            .expect('Event deserialization fail');
        assert(world_event2.radius == EVENT_INIT_RADIUS + 1, 'event radius is wrong');

        let game_counter = get!(world, (game_id), GameEntityCounter);
        assert(game_counter.event_count == 2, 'wrong game counter');
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_destroy_outpost() {
        let (world, caller, game_id, revenant_id, outpost_id) = _create_starter_revenant();

        _add_block_number(PREPARE_PHRASE_INTERVAL + 1);
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

        let outpost = get!(world, (game_id, outpost_id), Outpost);
        if destoryed {
            assert(outpost.lifes == OUTPOST_INIT_LIFE - 1, 'life value is wrong');
            assert(outpost.last_affect_event_id == world_event.entity_id, 'wrong affect id');
            let world_event2 = get!(world, (game_id, world_event.entity_id), WorldEvent);
            assert(world_event2.destroy_count == 1, 'wrong destory count');
        } else {
            assert(outpost.lifes == OUTPOST_INIT_LIFE, 'life value is wrong');
            let world_event2 = get!(world, (game_id, world_event.entity_id), WorldEvent);
            assert(world_event2.destroy_count == 0, 'wrong destory count');
        }
    }
    #[test]
    #[available_gas(3000000000)]
    fn test_game_end() {
        // Create initial outposts
        let (world, caller, game_id) = _init_game();
        let (revenant_id, outpost_id) = _create_revenant(world, game_id);
        let (_, _) = _create_revenant(world, game_id); // need two outpost for checking game end

        _add_block_number(PREPARE_PHRASE_INTERVAL + 1);

        // Loop world event
        loop {
            _add_block_number(EVENT_BLOCK_INTERVAL + 1);
            let mut event = world.execute('set_world_event'.into(), array![game_id.into()]);
            let world_event = serde::Serde::<WorldEvent>::deserialize(ref event)
                .expect('W event deserialization fail');

            let mut result = world
                .execute(
                    'destroy_outpost'.into(),
                    array![game_id.into(), world_event.entity_id.into(), outpost_id.into()]
                );
            let destoryed = serde::Serde::<bool>::deserialize(ref result)
                .expect('destory deserialization fail');

            if destoryed {
                let game_counter = get!(world, (game_id), GameEntityCounter);
                if game_counter.outpost_exists_count == 1 {
                    break;
                };
            };
        };

        let game = get!(world, (game_id), Game);
        assert(game.status == GameStatus::ended, 'wrong game status');
    }
}
