use dojo::world::Context;
use box::BoxTrait;
use traits::{Into,TryInto};
use option::OptionTrait;
// Calculate the distance between two points (x1, y1) and (x2, y2)
// Inputs are u32 type coordinates and a scale factor for improved precision in the sqrt function
fn calculate_distance(x1: u32, y1: u32, x2: u32, y2: u32, scale: u32) -> u32 {

    let mut diff_x: u32 = 0;
    let mut diff_y: u32 = 0;
    if (x1 > x2) {
        diff_x = x1 - x2;
    } else {
        diff_x = x2 - x1;
    }

    if (y1 > y2) {
        diff_y = y1 - y2;
    } else {
        diff_y = y2 - y1;
    }

    return sqrt(diff_x * diff_x + diff_y * diff_y, scale);
}

#[test]
#[available_gas(3000000000)]
fn test_calculate_distance() {
    let pointX1 = 4;
    let pointY1 = 7;
    let pointX2 = 8;
    let pointY2 = 3;

    assert(calculate_distance(pointX1, pointY1, pointX2, pointY2, 100) == 5, 'invalid result');
}

// Calculates the integer square root of n using Newton's iterative method
// Multiplies and divides by the scale factor to improve precision during integer division
fn sqrt(n: u32, scale: u32) -> u32 {
    let n_scaled = n * scale * scale;
    let mut x = n_scaled;
    let mut y = 0;

    loop {
        y = (x + n_scaled / x) / 2;
        if y >= x {
            break;
        } else {
            x = y;
        };
    };

    return x / scale;
}

fn getRandomNum(seed: felt252, min: u128, max: u128) -> u32 {
    let seed: u256 = seed.into();
 
    let range = max - min;

    let random = (seed.low % range) + min;

    random.try_into().unwrap()
}

#[test]
#[available_gas(3000000000)]
fn test_sqrt() {
    let v1 = 10;
    let v2 = 25;
    let v3 = 10000;

    assert(sqrt(v1, 100) == 3, 'invalid result');
    assert(sqrt(v2, 100) == 5, 'invalid result');
    assert(sqrt(v3, 100) == 100, 'invalid result');
}