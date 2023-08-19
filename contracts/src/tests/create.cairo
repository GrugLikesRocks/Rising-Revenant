#[cfg(test)]
mod tests {
    #[test]
    #[available_gas(1000000000)]
    fn it_works() {
        assert(true, 'it works!');
    }
}
