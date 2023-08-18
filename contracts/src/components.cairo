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
