// use fuzzy_matcher::skim::SkimMatcherV2;
// use fuzzy_matcher::FuzzyMatcher;
use sublime_fuzzy::{best_match, format_simple};

fn main() {
    // let matcher = SkimMatcherV2::default();

    // // let (score, indices) = matcher
    // //     .fuzzy_indices("restart", "system command reboot - restart")
    // //     .unwrap();
    // // // assert_eq!(indices, [0, 2, 4]);
    // // println!("score: {}, indices: {:?}", score, indices);

    // let (score, indices) = matcher.fuzzy_indices("reboot", "restart - rebo").unwrap();
    // // assert_eq!(indices, [0, 2, 4]);
    // println!("score: {}, indices: {:?}", score, indices);
    // use sublime_fuzzy::best_match;

    // let result = best_match("something", "some search thing");

    let target = "reboot - restart";

    let result = best_match("shutdown", target).unwrap();

    println!("{:?}", result);
}
