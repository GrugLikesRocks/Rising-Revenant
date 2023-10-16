use starknet::ContractAddress;

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Reinforcement {
    #[key]
    game_id: u32,
    #[key]
    owner: ContractAddress,
    balance: u32
}
