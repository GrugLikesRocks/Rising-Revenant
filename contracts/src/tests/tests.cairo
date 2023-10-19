#[cfg(test)]
mod tests {
    use starknet::{ContractAddress, syscalls::deploy_syscall};

    use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
    use dojo::test_utils::spawn_test_world;

    use RealmsRisingRevenant::constants::{EVENT_INIT_RADIUS, GAME_CONFIG, OUTPOST_INIT_LIFE};
    use RealmsRisingRevenant::components::game::{
        game, Game, game_tracker, GameTracker, GameStatus, GameEntityCounter, GameImpl, GameTrait
    };
    use RealmsRisingRevenant::components::outpost::{
        outpost, Outpost, OutpostStatus, OutpostImpl, OutpostTrait
    };
    use RealmsRisingRevenant::components::reinforcement::Reinforcement;
    use RealmsRisingRevenant::components::revenant::{
        revenant, Revenant, RevenantStatus, RevenantImpl, RevenantTrait
    };
    use RealmsRisingRevenant::components::world_event::{world_event, WorldEvent};

    use RealmsRisingRevenant::systems::game::{
        game_actions, IGameActionsDispatcher, IGameActionsDispatcherTrait
    };
    use RealmsRisingRevenant::systems::revenant::{
        revenant_actions, IRevenantActionsDispatcher, IRevenantActionsDispatcherTrait
    };
    use RealmsRisingRevenant::systems::world_event::{
        world_event_actions, IWorldEventActionsDispatcher, IWorldEventActionsDispatcherTrait
    };

    const EVENT_BLOCK_INTERVAL: u64 = 3;
    const PREPARE_PHRASE_INTERVAL: u64 = 10;

    // region ---- base method ----

    fn _init_world() -> (
        IWorldDispatcher,
        ContractAddress,
        IGameActionsDispatcher,
        IRevenantActionsDispatcher,
        IWorldEventActionsDispatcher
    ) {
        let caller = starknet::contract_address_const::<0x0>();

        // components
        let mut models = array![
            game::TEST_CLASS_HASH,
            game_tracker::TEST_CLASS_HASH,
            outpost::TEST_CLASS_HASH,
            revenant::TEST_CLASS_HASH,
            world_event::TEST_CLASS_HASH
        ];

        // deploy executor, world and register components/systems
        let world = spawn_test_world(models);

        let game_action_system = IGameActionsDispatcher {
            contract_address: world
                .deploy_contract('salt', game_actions::TEST_CLASS_HASH.try_into().unwrap())
        };

        let revenant_action_system = IRevenantActionsDispatcher {
            contract_address: world
                .deploy_contract('salt', revenant_actions::TEST_CLASS_HASH.try_into().unwrap())
        };

        let world_event_action_system = IWorldEventActionsDispatcher {
            contract_address: world
                .deploy_contract('salt', world_event_actions::TEST_CLASS_HASH.try_into().unwrap())
        };

        (world, caller, game_action_system, revenant_action_system, world_event_action_system)
    }

    fn _init_game() -> (
        IWorldDispatcher,
        ContractAddress,
        u32,
        IGameActionsDispatcher,
        IRevenantActionsDispatcher,
        IWorldEventActionsDispatcher
    ) {
        let (world, caller, game_action_system, revenant_action_system, world_event_action_system) =
            _init_world();
        let game_id = game_action_system.create(PREPARE_PHRASE_INTERVAL, EVENT_BLOCK_INTERVAL);

        (
            world,
            caller,
            game_id,
            game_action_system,
            revenant_action_system,
            world_event_action_system
        )
    }

    fn _create_revenant(
        revenant_action_system: IRevenantActionsDispatcher, game_id: u32
    ) -> (u128, u128) {
        // 5937281861773520500 => 'Revenant'
        let (revenant_id, outpost_id) = revenant_action_system.create(game_id, 5937281861773520500);

        (revenant_id, outpost_id)
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
        let (world, caller, game_actions, _, _) = _init_world();
        let game_id = game_actions.create(PREPARE_PHRASE_INTERVAL, EVENT_BLOCK_INTERVAL);
        assert(game_id == 1, 'game id incorrect');

        let game_tracker = get!(world, GAME_CONFIG, GameTracker);
        assert(game_tracker.count == 1, 'wrong game trakcer');

        let (mut game, game_counter) = get!(world, (game_id), (Game, GameEntityCounter));
        game.assert_existed();
        game.assert_can_create_outpost(world);

        assert(game.status == GameStatus::preparing, 'wrong game status');
        assert(game_counter.outpost_count == 0, 'wrong outpost count');

        _add_block_number(PREPARE_PHRASE_INTERVAL + 1);
        game_actions.refresh_status(game_id);

        let mut game = get!(world, (game_id), Game);
        // Cannot test refresh_status because it calls `set!`
        // which will cause error `must be called thru executor` during testing.
        game.assert_is_playing(world);
    }


    #[test]
    #[available_gas(3000000000)]
    fn test_create_revenant() {
        let (world, caller, game_id, _, revenant_actions, _) = _init_game();
        let (revenant_id, outpost_id) = _create_revenant(revenant_actions, game_id);

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
        let (world, caller, game_id, _, revenant_actions, _) = _init_game();
        let (revenant_id, outpost_id) = _create_revenant(revenant_actions, game_id);

        let purchase_count = 10_u32;
        let purchase_result = revenant_actions.purchase_reinforcement(game_id, purchase_count);
        assert(purchase_result, 'Failed to purchase');

        let reinforcement = get!(world, (game_id, caller), Reinforcement);
        assert(reinforcement.balance == purchase_count, 'wrong purchase count');

        _add_block_number(PREPARE_PHRASE_INTERVAL + 1);
        revenant_actions.reinforce_outpost(game_id, outpost_id);

        let outpost = get!(world, (game_id, outpost_id), (Outpost));
        assert(outpost.lifes == OUTPOST_INIT_LIFE + 1, 'life value is wrong');
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_set_world_event() {
        let (world, caller, game_id, _, _, world_event_actions) = _init_game();

        _add_block_number(PREPARE_PHRASE_INTERVAL + 1);

        let world_event = world_event_actions.create(game_id);
        assert(world_event.radius == EVENT_INIT_RADIUS, 'event radius is wrong');

        _add_block_number(EVENT_BLOCK_INTERVAL + 1);
        let world_event_2 = world_event_actions.create(game_id);
        assert(world_event_2.radius == EVENT_INIT_RADIUS + 1, 'event radius is wrong');

        let game_counter = get!(world, (game_id), GameEntityCounter);
        assert(game_counter.event_count == 2, 'wrong game counter');
    }

    #[test]
    #[available_gas(3000000000)]
    fn test_destroy_outpost() {
        let (world, caller, game_id, _, revenant_actions, world_event_actions) = _init_game();
        let (revenant_id, outpost_id) = _create_revenant(revenant_actions, game_id);

        _add_block_number(PREPARE_PHRASE_INTERVAL + 1);
        let world_event = world_event_actions.create(game_id);
        let destoryed = world_event_actions
            .destroy_outpost(game_id, world_event.entity_id, outpost_id);

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
        let (world, caller, game_id, _, revenant_actions, world_event_actions) = _init_game();
        let (revenant_id, outpost_id) = _create_revenant(revenant_actions, game_id);
        let (_, _) = _create_revenant(
            revenant_actions, game_id
        ); // need two outpost for checking game end

        _add_block_number(PREPARE_PHRASE_INTERVAL + 1);

        // Loop world event
        loop {
            _add_block_number(EVENT_BLOCK_INTERVAL + 1);
            let world_event = world_event_actions.create(game_id);
            let destoryed = world_event_actions
                .destroy_outpost(game_id, world_event.entity_id, outpost_id);

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
