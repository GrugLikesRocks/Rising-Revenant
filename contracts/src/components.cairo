#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Position {
    #[key]
    entity_id: u32,
    x: u32,
    y: u32
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Lifes {
    #[key]
    entity_id: u32,
    count: u32
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Defence {
    #[key]
    entity_id: u32,
    plague: u32
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Name {
    #[key]
    entity_id: u32,
    value: felt252
}

#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct Prosperity {
    #[key]
    entity_id: u32,
    value: felt252
}

// TODO: Could be ENUM
#[derive(Component, Copy, Drop, Serde, SerdeLen)]
struct WorldEvent {
    #[key]
    entity_id: u32,
    radius: u32,
    event_type: u32
}
// TODO: Impl World
// is x,y within radius?


