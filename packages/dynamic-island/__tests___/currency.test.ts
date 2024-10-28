import { expect, test } from "bun:test"
import { currency } from ".."

test("detectCurrencyConversion", () => {
	expect(currency.detectCurrencyConversion("USD to CAD")).toEqual(["USD", "CAD"])
	expect(currency.detectCurrencyConversion("CNY    to    JPY", currency.CURRENCY_SYMBOLS)).toEqual([
		"CNY",
		"JPY"
	])
	expect(currency.detectCurrencyConversion("USD to XYZ", currency.CURRENCY_SYMBOLS)).toEqual(null)
	expect(currency.detectCurrencyConversion("XYZ to CAD", currency.CURRENCY_SYMBOLS)).toEqual(null)
})
