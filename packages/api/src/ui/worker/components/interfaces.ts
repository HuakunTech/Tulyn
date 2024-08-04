import { enum_, literal, union, type InferOutput } from "valibot"
import type { FormNodeName, NodeName } from "../../../models"

export interface IComponent<T> {
	nodeName: NodeName | FormNodeName
	toModel(): T
}
