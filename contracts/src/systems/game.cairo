#[starknet::interface]
trait IGameActions<TContractState> {
    fn create(self: @TContractState, preparation_phase_interval: u64, event_interval: u64) -> u32;

    fn refresh_status(self: @TContractState, game_id: u32);
}

#[dojo::contract]
mod game_actions {
    use starknet::{ContractAddress, get_block_info};
    use RealmsRisingRevenant::components::game::{
        Game, GameStatus, GameTracker, GameEntityCounter, GameTrait, GameImpl
    };
    use RealmsRisingRevenant::constants::GAME_CONFIG;
    use super::IGameActions;

    #[external(v0)]
    impl GameActionImpl of IGameActions<ContractState> {
        fn create(
            self: @ContractState, preparation_phase_interval: u64, event_interval: u64
        ) -> u32 {
            let world = self.world_dispatcher.read();
            let mut game_tracker = get!(world, GAME_CONFIG, (GameTracker));
            let game_id = game_tracker.count + 1; // game id increment

            let start_block_number = get_block_info().unbox().block_number; // blocknumber
            let prize = 0; // total prize
            let status = GameStatus::preparing; // game status

            let game = Game {
                game_id,
                start_block_number,
                prize,
                preparation_phase_interval,
                event_interval,
                status
            };
            let game_counter = GameEntityCounter {
                game_id,
                revenant_count: 0,
                outpost_count: 0,
                event_count: 0,
                outpost_exists_count: 0
            };
            let game_tracker = GameTracker { entity_id: GAME_CONFIG, count: game_id };

            set!(world, (game, game_counter, game_tracker));

            return (game_id);
        }

        fn refresh_status(self: @ContractState, game_id: u32) {
            let world = self.world_dispatcher.read();
            let mut game = get!(world, game_id, Game);
            game.assert_existed();
            game.refresh_status(world);
        }
    }
}
