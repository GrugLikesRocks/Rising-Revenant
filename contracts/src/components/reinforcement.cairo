use starknet::ContractAddress;

#[derive(Model, Copy, Drop, Serde, SerdeLen)]
struct Reinforcement {
    #[key]
    game_id: u32,
    #[key]
    owner: ContractAddress,
    balance: u32
}
