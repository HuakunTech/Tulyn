import { expect, test } from "bun:test"
import { decompressFrame, deserializeFrame } from "../index"

test("Test Deserialize", () => {
	const frame_str = "ooolloo\nllolloo"
	const frame = [
		[0, 0, 0, 1, 1, 0, 0],
		[1, 1, 0, 1, 1, 0, 0]
	]
	expect(deserializeFrame(frame_str)).toEqual(frame)
})

test("Test Decompress", () => {
	const compressed_frame = "3o2l2o\n2lo2l2o"
	const decompressed_frame = "ooolloo\nllolloo"
	expect(decompressFrame(compressed_frame)).toBe(decompressed_frame)
})
