use rust_search::SearchBuilder;

fn main(){
    let search: Vec<String> = SearchBuilder::default()
        .location("/Users/hacker/Dev/projects/Jarvis/apps/cli")
        .search_input("what to search")
        // .more_locations(vec!["/anotherPath/to/search", "/keepAddingIfYouWant/"])
        .limit(1000) // results to return
        .ext("rs")
        .strict()
        .depth(1)
        .ignore_case()
        .hidden()
        .build()
        .collect();

    for path in search {
        println!("{}", path);
    }
}