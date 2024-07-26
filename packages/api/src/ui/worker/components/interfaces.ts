import { enum_, literal, union, type InferOutput } from "valibot"
import type { NodeName } from "../../../models"

export interface IComponent<T> {
	nodeName: NodeName
	toModel(): T
}
