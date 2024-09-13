import { parseArgs } from "jsr:@std/cli/parse-args"
import sharp from "npm:sharp"

const args = parseArgs(Deno.args)
console.log(args)

const input = args.i
const output = args.o

sharp(input).blur(10).resize(300, 300).toFile(output)
