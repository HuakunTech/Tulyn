/**
 * This file is designed for auto form, convert objects to zod schema for auto form to render
 */

import { FormNodeName, FormNodeNameEnum, FormSchema } from "@kksh/api/ui/worker"
import { z } from "zod"

function convertBasicFormField(input: FormSchema.FormField) {
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

	if (input.default) {
		// @ts-ignore
		baseSchema = baseSchema.default(input.default)
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
	if (input.nodeName === FormNodeNameEnum.Array) {
		const field = input as FormSchema.ArrayField
		return z.array(convertBasicFormField(field.content))
	} else if (input.nodeName === FormNodeNameEnum.Form) {
		const f: Record<string, any> = {}
		const form = input as FormSchema.Form
		form.fields.forEach((field: FormSchema.FormField | FormSchema.Form) => {
			f[field.key] = convertFormToZod(field as FormSchema.FormField)
		})
		return z.object(f)
	} else {
		return convertBasicFormField(input as FormSchema.FormField)
	}
}

export function basicFieldToFieldConfig(field: FormSchema.BaseField) {
	const conf: Record<string, any> = { inputProps: {} }
	if (field.placeholder) {
		conf.inputProps.placeholder = field.placeholder
	}
	if (field.description) {
		conf.description = field.description
	}
	if (field.label) {
		conf.label = field.label
	}
	if (field.hideLabel) {
		conf.inputProps.showLabel = false
	}

	// @ts-ignore
	if (field.type) {
		// @ts-ignore
		conf.inputProps.type = field.type
	}
	// @ts-ignore
	if (field.component) {
		// @ts-ignore
		conf.component = field.component
	}
	return conf
}

export function buildFieldConfig(form: FormSchema.Form) {
	const config: Record<string, any> = {}
	for (const field of form.fields) {
		if (field.nodeName === FormNodeNameEnum.Array) {
		} else if (field.nodeName === FormNodeNameEnum.Form) {
		} else {
			config[field.key] = basicFieldToFieldConfig(field)
		}
	}
	return config
}
