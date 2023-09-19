mod outpost;
mod revenant;
mod world_event;

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

#[derive(Component, Copy, Drop, Serde)]
struct GameEntityCounter {
    #[key]
    game_id: u32,
    revenant_count: u32,
    outpost_count: u32,
    event_count: u32
}
