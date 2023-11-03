use realmsrisingrevenant::components::world_event::WorldEvent;

#[starknet::interface]
trait IWorldEventActions<TContractState> {
    fn create(self: @TContractState, game_id: u32) -> WorldEvent;

    fn destroy_outpost(
        self: @TContractState, game_id: u32, event_id: u128, outpost_id: u128
    ) -> bool;
}

#[dojo::contract]
mod world_event_actions {
    use realmsrisingrevenant::components::game::{
        Game, GameEntityCounter, GameStatus, GameTrait, GameImpl
    };
    use realmsrisingrevenant::components::outpost::{
        Outpost, OutpostPosition, OutpostStatus, OutpostImpl, OutpostTrait
    };
    use realmsrisingrevenant::components::world_event::{WorldEvent, WorldEventTracker};
    use realmsrisingrevenant::constants::{EVENT_INIT_RADIUS, MAP_HEIGHT, MAP_WIDTH};
    use realmsrisingrevenant::utils::MAX_U32;
    use realmsrisingrevenant::utils::random::{Random, RandomImpl};
    use realmsrisingrevenant::utils;
    use starknet::{ContractAddress, get_block_info, get_caller_address};
    use super::IWorldEventActions;

    #[external(v0)]
    impl WorldEventActionImpl of IWorldEventActions<ContractState> {
        fn create(self: @ContractState, game_id: u32) -> WorldEvent {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();
            // check game is active
            let mut game = get!(world, game_id, Game);
            game.assert_is_playing(world);

            let mut game_data = get!(world, game_id, GameEntityCounter);
            game_data.event_count += 1;

            let entity_id: u128 = game_data.event_count.into();
            let seed = starknet::get_tx_info().unbox().transaction_hash;

            let mut random = RandomImpl::new(seed);
            let x = (MAP_WIDTH / 2) - random.next_u32(0, 400);
            let y = (MAP_HEIGHT / 2) - random.next_u32(0, 400);

            let block_number = starknet::get_block_info().unbox().block_number;
            // Radius increases when the previous world event does not cause damage.
            let mut radius: u32 = 0;
            if entity_id <= 1 {
                radius = EVENT_INIT_RADIUS;
            } else {
                let prev_world_event = get!(world, (game_id, entity_id - 1), WorldEvent);

                assert(
                    (block_number - prev_world_event.block_number) > game.event_interval,
                    'event occur interval too small'
                );

                if prev_world_event.destroy_count == 0 && prev_world_event.radius < MAX_U32 {
                    radius = prev_world_event.radius + 1;
                } else {
                    radius = prev_world_event.radius;
                }
            }

            let world_event = WorldEvent {
                game_id, entity_id, x, y, radius, destroy_count: 0, block_number
            };

            set!(world, (world_event, game_data));

            world_event
        }

        fn destroy_outpost(
            self: @ContractState, game_id: u32, event_id: u128, outpost_id: u128
        ) -> bool {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();

            // Check if the game is active
            let (mut game, mut game_data) = get!(world, game_id, (Game, GameEntityCounter));
            game.assert_is_playing(world);

            // Get the event
            let mut world_event = get!(world, (game_id, event_id), WorldEvent);

            // Get the outpost
            let mut outpost = get!(world, (game_id, outpost_id), Outpost);
            outpost.assert_existed();

            assert(
                outpost.last_affect_event_id != world_event.entity_id,
                'outpost affected by same event'
            );

            // check if within radius of event -> revert if not
            let distance = utils::calculate_distance(
                world_event.x, world_event.y, outpost.x, outpost.y, 100
            );
            if distance > world_event.radius {
                return false;
            }

            // update lifes
            outpost.lifes -= 1;
            outpost.last_affect_event_id = world_event.entity_id;
            world_event.destroy_count += 1;

            let event_tracker = WorldEventTracker {
                game_id, event_id: world_event.entity_id, outpost_id: outpost.entity_id
            };

            if outpost.lifes == 0 {
                game_data.outpost_exists_count -= 1;

                if game_data.outpost_exists_count <= 1 {
                    game.status = GameStatus::ended;
                    set!(world, (outpost, world_event, event_tracker, game_data, game));
                } else {
                    set!(world, (outpost, world_event, event_tracker, game_data));
                }
            } else {
                set!(world, (outpost, world_event, event_tracker));
            }

            // Emit World Event
            true
        }
    }
}
