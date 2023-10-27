use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

#[starknet::interface]
trait IRevenantActions<TContractState> {
    fn create(self: @TContractState, game_id: u32, name: felt252) -> (u128, u128);

    fn purchase_reinforcement(self: @TContractState, game_id: u32, count: u32) -> bool;

    fn reinforce_outpost(self: @TContractState, game_id: u32, outpost_id: u128);
}


#[dojo::contract]
mod revenant_actions {
    use starknet::{ContractAddress, get_block_info, get_caller_address, get_contract_address};
    use openzeppelin::token::erc20::interface::{
        IERC20, IERC20Dispatcher, IERC20DispatcherImpl, IERC20DispatcherTrait
    };

    use RealmsRisingRevenant::components::game::{
        Game, GameStatus, GameTracker, GameEntityCounter, GameTrait, GameImpl
    };
    use RealmsRisingRevenant::components::revenant::{
        Revenant, RevenantStatus, RevenantImpl, RevenantTrait
    };
    use RealmsRisingRevenant::components::outpost::{
        Outpost, OutpostPosition, OutpostStatus, OutpostImpl, OutpostTrait
    };
    use RealmsRisingRevenant::components::reinforcement::Reinforcement;
    use RealmsRisingRevenant::constants::{MAP_HEIGHT, MAP_WIDTH, OUTPOST_INIT_LIFE};
    use RealmsRisingRevenant::utils::random::{Random, RandomImpl};
    use super::IRevenantActions;

    #[external(v0)]
    impl RevenantActionImpl of IRevenantActions<ContractState> {
        fn create(self: @ContractState, game_id: u32, name: felt252) -> (u128, u128) {
            assert(name != 0, 'name length must larger than 0');

            let world = self.world_dispatcher.read();
            let player = get_caller_address();
            let (mut game, mut game_data) = get!(world, game_id, (Game, GameEntityCounter));
            game.assert_can_create_outpost(world);

            game_data.revenant_count += 1;

            let entity_id: u128 = game_data.revenant_count.into();

            let revenant = Revenant {
                game_id,
                entity_id,
                owner: player,
                name: name,
                outpost_count: 1,
                status: RevenantStatus::started
            };

            let reinforcement = Reinforcement { game_id, owner: player, balance: 0 };

            set!(world, (revenant, game_data, reinforcement));

            let outpost_id = create_outpost(world, game_id);
            (entity_id, outpost_id)
        }

        fn purchase_reinforcement(self: @ContractState, game_id: u32, count: u32) -> bool {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();
            let mut game = get!(world, game_id, Game);
            game.assert_can_create_outpost(world);

            let erc20 = IERC20Dispatcher { contract_address: game.erc_addr };
            let result = erc20
                .transfer_from(
                    sender: player, recipient: get_contract_address(), amount: count.into()
                );
            assert(result, 'need approve for erc20');

            let mut reinforcements = get!(world, (game_id, player), Reinforcement);
            reinforcements.balance += count;
            set!(world, (reinforcements));

            true
        }

        fn reinforce_outpost(self: @ContractState, game_id: u32, outpost_id: u128) {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();
            let mut game = get!(world, game_id, Game);
            game.assert_is_playing(world);

            let mut outpost = get!(world, (game_id, outpost_id), (Outpost));
            outpost.assert_existed();

            assert(player == outpost.owner, 'not owner');

            let mut reinforcement = get!(world, (game_id, player), Reinforcement);

            assert(reinforcement.balance > 0, 'no reinforcement');

            outpost.lifes += 1;
            reinforcement.balance = reinforcement.balance - 1;

            set!(world, (outpost, reinforcement));

            return ();
        }
    }

    fn create_outpost(world: IWorldDispatcher, game_id: u32) -> u128 {
        let mut game_data = get!(world, game_id, (GameEntityCounter));

        game_data.outpost_count += 1;
        game_data.outpost_exists_count += 1;

        let player = get_caller_address();
        let entity_id: u128 = game_data.outpost_count.into();

        // We set the position of the outpost
        let seed = starknet::get_tx_info().unbox().transaction_hash;
        let mut random = RandomImpl::new(seed);
        let mut x = (MAP_WIDTH / 2) - random.next_u32(0, 400);
        let mut y = (MAP_HEIGHT / 2) - random.next_u32(0, 400);

        let mut prev_outpost = get!(world, (game_id, x, y), OutpostPosition);

        // avoid multiple outpost appearing in the same position
        if prev_outpost.entity_id > 0 {
            loop {
                x = (MAP_WIDTH / 2) - random.next_u32(0, 400);
                y = (MAP_HEIGHT / 2) - random.next_u32(0, 400);
                prev_outpost = get!(world, (game_id, x, y), OutpostPosition);
                if prev_outpost.entity_id == 0 {
                    break;
                };
            }
        };

        let outpost = Outpost {
            game_id,
            entity_id,
            x,
            y,
            owner: player,
            name: 'Outpost',
            lifes: OUTPOST_INIT_LIFE,
            status: OutpostStatus::created,
            last_affect_event_id: 0
        };

        let position = OutpostPosition { game_id, x, y, entity_id };
        set!(world, (outpost, game_data, position));

        entity_id
    }
}
