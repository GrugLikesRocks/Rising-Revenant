use starknet::ContractAddress;

#[derive(Component, Copy, Drop, Serde)]
struct WorldEvent {
    #[key]
    game_id: u32,
    #[key]
    entity_id: u128,
    // TODO: see detail in EventType
    // event_type: u32,

    // TODO: Why we need this?
    // block_number: u64,
    x: u32,
    y: u32,
    radius: u32
}

const INIT_RADIUS: u32 = 5;

// mod EventType {
// const not_defined: u32 = 0;
// TODO: Define world event 
// const plague: u32 = 1;
// Goblin / Earthquake / Hurricane / Dragon / etc...
// }

// #[generate_trait]
// impl WorldEventImpl of OutpostTrait {
// fn assert_existed(self: Outpost) {
// assert(self.status != OutpostStatus::not_created, 'Outpost not exist');
// }
// }


