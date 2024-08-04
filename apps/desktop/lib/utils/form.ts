/**
 * This file is designed for auto form, convert objects to zod schema for auto form to render
 */

import { FormNodeName, FormNodeNameEnum, FormSchema } from "@kksh/api/ui/worker"
import { z } from "zod"

function convertBasicFormField(input: FormSchema.FormField) {
	console.log("input 2", input)

	let baseSchema:
		| z.ZodString
		| z.ZodNumber
		| z.ZodEnum<[string, ...string[]]>
		| z.ZodBoolean
		| z.ZodDate
	switch (input.nodeName) {
		case FormNodeNameEnum.Input:
			baseSchema = z.string()
			break
		// return convert2(input as FormSchema.InputField)
		// return z.string()
		case FormNodeNameEnum.Number:
			baseSchema = z.number()
			break
		case FormNodeNameEnum.Select:
			const field = input as FormSchema.SelectField
			baseSchema = z.enum(field.options as [string, ...string[]])
			break
		case FormNodeNameEnum.Boolean:
			baseSchema = z.boolean()
			break
		case FormNodeNameEnum.Date:
			baseSchema = z.date()
			break
		// case FormNodeNameEnum.Array:

		// // return z.array(convert(input as FormSchema.ArrayField))
		// case FormNodeNameEnum.Form:
		// 	const form = input as FormSchema.Form
		// 	// const formObj = form.fields.map()
		// 	break
		default:
			throw new Error(`Unknown field nodeName: ${input.nodeName}`)
	}
	if (input.description) {
		baseSchema = baseSchema.describe(input.description!)
	}
	if (input.optional) {
		return baseSchema.optional()
	}
	return baseSchema
}

export function convertFormToZod(input: FormSchema.FormField | FormSchema.Form) {
	console.log("input", input)

	if (input.nodeName === FormNodeNameEnum.Array) {
		const field = input as FormSchema.ArrayField
		return z.array(convertBasicFormField(field.content))
	} else if (input.nodeName === FormNodeNameEnum.Form) {
		const f: Record<string, any> = {}
		const form = input as FormSchema.Form
		console.log("form", form)

		form.fields.forEach((field: FormSchema.FormField | FormSchema.Form) => {
			f[field.key] = convertFormToZod(field as FormSchema.FormField)
		})
		return z.object(f)
	} else {
		return convertBasicFormField(input as FormSchema.FormField)
	}
}
