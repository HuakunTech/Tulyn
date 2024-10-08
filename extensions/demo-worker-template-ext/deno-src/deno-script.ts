// import { parseArgs } from "jsr:@std/cli/parse-args"
// import sharp from "npm:sharp"

// const args = parseArgs(Deno.args)
// console.log(args)

// const input = args.i
// const output = args.o

// sharp(input).blur(10).resize(300, 300).toFile(output)
const data = new TextEncoder().encode("hello world 1")
// console.error(data);
// console.error(typeof data);

// Deno.stdout.write(data)
const writer1 = Deno.stdout.writable.getWriter()
writer1.write(data)
writer1.releaseLock()
const writer2 = Deno.stdout.writable.getWriter()
writer2.write(data)
writer2.releaseLock()

console.log("hello world 2")
