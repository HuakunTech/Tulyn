import { parseArgs } from "jsr:@std/cli/parse-args"

console.log("deno-script")
// make a file on desktop with deno
// const desktopPath = path.join(os.homedir(), "Desktop")
// fs.writeFileSync(path.join(desktopPath, "deno-script.txt"), "deno-script")
// how to get desktop path
const HOME = Deno.env.get("HOME")
// print cwd
console.log("CWD:", Deno.cwd())
await Deno.writeTextFile(`./hello2.txt`, "Hello World!");
// await Deno.writeTextFile(`${HOME}/Desktop/hello.txt`, "Hello World!");
const args = parseArgs(Deno.args)
console.log(args)
// await Deno.writeTextFile("./hello.txt", "Hello World!")
// console.log("File written to ./hello.txt")
