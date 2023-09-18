mod outpost;
mod revenant;

#[derive(Component, Copy, Drop, Serde)]
struct Position {
    #[key]
    entity_id: u128,
    #[key]
    game_id: u32,
    x: u32,
    y: u32
}

// TODO: Could be ENUM
#[derive(Component, Copy, Drop, Serde)]
struct WorldEvent {
    #[key]
    entity_id: u128,
    #[key]
    game_id: u32,
    radius: u32,
    event_type: u32,
    block_number: u64
}
// TODO: Impl World
// is x,y within radius?

#[derive(Component, Copy, Drop, Serde)]
struct Game {
    #[key]
    game_id: u32, // increment
    start_time: u64,
    prize: u32,
    status: bool
}

// Config Components ---------------------------------------------------------------------

// This will track the number of games played
#[derive(Component, Copy, Drop, Serde)]
struct GameTracker {
    #[key]
    entity_id: u128, // FIXED
    count: u32
}

// Components to check ---------------------------------------------------------------------

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct GameEntityCounter {
    #[key]
    game_id: u32,
    outpost_count: u128,
    event_count: u128
}
