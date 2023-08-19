#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Position {
    #[key]
    entity_id: u128,
    #[key]
    game_id: u32,
    x: u32,
    y: u32
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Lifes {
    #[key]
    entity_id: u128,
    #[key]
    game_id: u32,
    count: u32
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Defence {
    #[key]
    entity_id: u128,
    #[key]
    game_id: u32,
    plague: u32
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Name {
    #[key]
    entity_id: u128,
    #[key]
    game_id: u32,
    value: felt252
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Prosperity {
    #[key]
    entity_id: u128,
    #[key]
    game_id: u32,
    value: felt252
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Balance {
    #[key]
    entity_id: u128,
    #[key]
    game_id: u32,
    value: felt252
}

// TODO: Could be ENUM
#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct WorldEvent {
    #[key]
    entity_id: u128,
    #[key]
    game_id: u32,
    radius: u32,
    event_type: u32
}
// TODO: Impl World
// is x,y within radius?

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Game {
    #[key]
    game_id: u32, // increment
    start_time: u64,
    prize: u32,
    status: bool // TODO: ENUM
}

// Config Components ---------------------------------------------------------------------

// This will track the number of games played
#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct GameTracker {
    #[key]
    entity_id: u128, // FIXED
    count: u32
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Ownership {
    #[key]
    entity_id: u128, // FIXED
    #[key]
    game_id: u32, // increment
    address: felt252
}
