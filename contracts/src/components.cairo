mod outpost;
mod world_event;

#[derive(Component, Copy, Drop, Serde,SerdeLen)]
struct Game {
    #[key]
    game_id: u32, // increment
    start_block_number: u64,
    prize: u32,
    status: bool
}

// Config Components ---------------------------------------------------------------------

// This will track the number of games played
#[derive(Component, Copy, Drop, Serde,SerdeLen)]
struct GameTracker {
    #[key]
    entity_id: u128, // FIXED
    count: u32
}

// Components to check ---------------------------------------------------------------------

#[derive(Component, Copy, Drop, Serde,SerdeLen)]
struct GameEntityCounter {
    #[key]
    game_id: u32,
    revenant_count: u32,
    outpost_count: u32,
    event_count: u32
}


// This will track the outpost destroied by each event
#[derive(Component, Copy, Drop, Serde,SerdeLen)]
struct WorldEventTracker {
    #[key]
    game_id: u32, 
    #[key]
    event_id: u128,
    outpost_id: u128
}
