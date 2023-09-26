use starknet::ContractAddress;

#[derive(Component, Copy, Drop, Serde,SerdeLen)]
struct Outpost {
    #[key]
    game_id: u32,
    #[key]
    entity_id: u128,
    owner: ContractAddress,
    name: felt252,
    x: u32,
    y: u32,
    lifes: u32,
    status: u32
}

mod OutpostStatus {
    const not_created: u32 = 0;
    const created: u32 = 1;
// const destroyed: u32 = 2;
}

#[generate_trait]
impl OutpostImpl of OutpostTrait {
    fn assert_existed(self: Outpost) {
        // assert(self.status != OutpostStatus::destroyed, 'Outpost has been destroyed');
        assert(self.status != OutpostStatus::not_created, 'Outpost not exist');
    }
}
