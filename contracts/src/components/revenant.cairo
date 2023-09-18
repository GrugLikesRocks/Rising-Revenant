use starknet::ContractAddress;

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Revenant {
    #[key]
    game_id: u32,
    #[key]
    address: ContractAddress,
    name: felt252,
    outpost_count: u32,
    status: u32
}

mod RevenantStatus {
    const not_start: u32 = 0;
    const started: u32 = 1;
// TODO: More status, like outpost has reach limit / has been beated / etc...
}

#[generate_trait]
impl RevenantImpl of RevenantTrait {
    fn assert_started(self: Revenant) {
        assert(self.status == RevenantStatus::started, 'Revenant has not been created');
    }
}
