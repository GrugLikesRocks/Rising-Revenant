use starknet::{ContractAddress, syscalls::deploy_syscall};

use dojo::world::{IWorldDispatcherTrait, IWorldDispatcher};
use dojo::test_utils::spawn_test_world;

use openzeppelin::token::erc20::interface::{
    IERC20, IERC20Dispatcher, IERC20DispatcherImpl, IERC20DispatcherTrait
};

use RealmsRisingRevenant::constants::{EVENT_INIT_RADIUS, GAME_CONFIG, OUTPOST_INIT_LIFE};
use RealmsRisingRevenant::components::game::{game, game_tracker};
use RealmsRisingRevenant::components::outpost::outpost;
use RealmsRisingRevenant::components::reinforcement::Reinforcement;
use RealmsRisingRevenant::components::revenant::revenant;
use RealmsRisingRevenant::components::world_event::world_event;

use RealmsRisingRevenant::systems::game::{
    game_actions, IGameActionsDispatcher, IGameActionsDispatcherTrait
};
use RealmsRisingRevenant::systems::revenant::{
    revenant_actions, IRevenantActionsDispatcher, IRevenantActionsDispatcherTrait
};
use RealmsRisingRevenant::systems::world_event::{
    world_event_actions, IWorldEventActionsDispatcher, IWorldEventActionsDispatcherTrait
};
use RealmsRisingRevenant::tests::foo_erc::FooErc20;

const EVENT_BLOCK_INTERVAL: u64 = 3;
const PREPARE_PHRASE_INTERVAL: u64 = 10;

#[derive(Copy, Drop)]
struct DefaultWorld {
    world: IWorldDispatcher,
    caller: ContractAddress,
    game_action: IGameActionsDispatcher,
    revenant_action: IRevenantActionsDispatcher,
    world_event_action: IWorldEventActionsDispatcher,
    test_erc: IERC20Dispatcher,
}

// region ---- base method ----

fn _init_world() -> DefaultWorld {
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

    let game_action = IGameActionsDispatcher {
        contract_address: world
            .deploy_contract('salt', game_actions::TEST_CLASS_HASH.try_into().unwrap())
    };

    let revenant_action = IRevenantActionsDispatcher {
        contract_address: world
            .deploy_contract('salt', revenant_actions::TEST_CLASS_HASH.try_into().unwrap())
    };

    let world_event_action = IWorldEventActionsDispatcher {
        contract_address: world
            .deploy_contract('salt', world_event_actions::TEST_CLASS_HASH.try_into().unwrap())
    };

    let (test_erc_addr, _) = deploy_syscall(
        FooErc20::TEST_CLASS_HASH.try_into().unwrap(), 0, array![].span(), false
    )
        .expect('error deploy erc');
    let test_erc = IERC20Dispatcher { contract_address: test_erc_addr };

    DefaultWorld { world, caller, game_action, revenant_action, world_event_action, test_erc }
}

fn _init_game() -> (DefaultWorld, u32) {
    let world = _init_world();
    let game_id = world
        .game_action
        .create(PREPARE_PHRASE_INTERVAL, EVENT_BLOCK_INTERVAL, world.test_erc.contract_address);

    (world, game_id)
}

fn _create_revenant(revenant_action: IRevenantActionsDispatcher, game_id: u32) -> (u128, u128) {
    // 5937281861773520500 => 'Revenant'
    let (revenant_id, outpost_id) = revenant_action.create(game_id, 5937281861773520500);

    (revenant_id, outpost_id)
}

fn _add_block_number(number: u64) -> u64 {
    let mut block_number = starknet::get_block_info().unbox().block_number;
    block_number += PREPARE_PHRASE_INTERVAL + 1;
    starknet::testing::set_block_number(block_number);
    block_number
}
