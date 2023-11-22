const GAME_CONFIG: u128 = 1;
// each outpost will spawn with a default 3 reinforcements on it 
const OUTPOST_INIT_LIFE: u32 = 1;
// the max of outpost count for each revenant is 1. 
const OUTPOST_MAX_COUNT: u32 = 1;
// Outposts, can be bolstered up to 20 times in their lifetime
const OUTPOST_MAX_REINFORCEMENT: u32 = 20;
// Each wallet can mint 2 Revenants 
const REVENANT_MAX_COUNT: u32 = 2;
// each wallet has 0 reinforcements to put as they will 
// When we need to perform a demonstration, we can modify this value.
const REINFORCEMENT_INIT_COUNT: u32 = 0;

// Check whether to automatically create a new world event after destroying an outpost.
const AUTO_CREATE_NEW_WORLD_EVENT: u32 = 0;

const EVENT_INIT_RADIUS: u32 = 155;

const MAP_WIDTH: u32 = 10240;
const MAP_HEIGHT: u32 = 5164;
