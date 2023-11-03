#[starknet::interface]
trait ITradeActions<TContractState> {
    // Create a new trade
    fn create(self: @TContractState, game_id: u32, price: u128) -> u32;


    // Revoke an initiated trade
    fn revoke(self: @TContractState, game_id: u32, entity_id: u32);


    // Purchase an existing trade
    fn purchase(self: @TContractState, game_id: u32, player_id: u128, trade_id: u32);
}

#[dojo::contract]
mod trade_actions {
    use super::ITradeActions;

    use openzeppelin::token::erc20::interface::{
        IERC20, IERC20Dispatcher, IERC20DispatcherImpl, IERC20DispatcherTrait
    };

    use realmsrisingrevenant::components::game::{
        Game, GameStatus, GameTracker, GameEntityCounter, GameTrait, GameImpl,
    };

    use realmsrisingrevenant::components::reinforcement::{
        Reinforcement, ReinforcementBalance, ReinforcementBalanceImpl, ReinforcementBalanceTrait
    };

    use realmsrisingrevenant::components::revenant::{Revenant, RevenantStatus};

    use realmsrisingrevenant::components::trade::{Trade, TradeStatus};

    use starknet::{ContractAddress, get_block_info, get_caller_address};

    #[external(v0)]
    impl TradeActionImpl of ITradeActions<ContractState> {
        fn create(self: @ContractState, game_id: u32, price: u128) -> u32 {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();

            let (mut game, mut game_data) = get!(world, game_id, (Game, GameEntityCounter));
            game.assert_is_playing(world);

            let mut reinforcement = get!(world, (game_id, player), Reinforcement);
            assert(reinforcement.balance > 0, 'No reinforcement can sell');

            reinforcement.balance -= 1;
            game_data.trade_count += 1;

            let entity_id = game_data.trade_count;
            let trade = Trade {
                game_id,
                entity_id,
                price,
                seller: player,
                buyer: starknet::contract_address_const::<0x0>(),
                status: TradeStatus::selling,
            };

            set!(world, (reinforcement, game_data, trade));

            entity_id
        }

        fn revoke(self: @ContractState, game_id: u32, entity_id: u32) {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();

            let mut game = get!(world, game_id, Game);
            game.assert_is_playing(world);

            let mut trade = get!(world, (game_id, entity_id), Trade);
            assert(trade.status != TradeStatus::not_created, 'trade not exist');
            assert(trade.status != TradeStatus::sold, 'trade had been sold');
            assert(trade.status != TradeStatus::revoked, 'trade had been revoked');
            assert(trade.seller == player, 'not owner');

            trade.status = TradeStatus::revoked;

            let mut reinforcement = get!(world, (game_id, player), Reinforcement);
            reinforcement.balance += 1;

            set!(world, (reinforcement, trade));
        }

        fn purchase(self: @ContractState, game_id: u32, player_id: u128, trade_id: u32) {
            let world = self.world_dispatcher.read();
            let player = get_caller_address();

            let mut game = get!(world, game_id, Game);
            game.assert_is_playing(world);

            let revenant = get!(world, (game_id, player_id), Revenant);
            assert(revenant.owner == player, 'unable purchase for others');
            assert(revenant.status == RevenantStatus::started, 'not valid player');

            let mut trade = get!(world, (game_id, trade_id), Trade);
            assert(trade.status != TradeStatus::not_created, 'trade not exist');
            assert(trade.status != TradeStatus::sold, 'trade had been sold');
            assert(trade.status != TradeStatus::revoked, 'trade had been revoked');
            assert(trade.seller != player, 'unable purchase your own trade');

            let erc20 = IERC20Dispatcher { contract_address: game.erc_addr };
            let result = erc20
                .transfer_from(sender: player, recipient: trade.seller, amount: trade.price.into());
            assert(result, 'need approve for erc20');

            let mut reinforcement = get!(world, (game_id, player), Reinforcement);
            reinforcement.balance += 1;
            trade.status = TradeStatus::sold;
            trade.buyer = player;

            set!(world, (reinforcement, trade));
        }
    }
}
