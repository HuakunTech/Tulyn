import { describe, expect, test } from "vitest"
import { currency } from ".."

function randomFloat() {
	return Number((Math.random() * 100).toFixed(4))
}
describe("Currency Conversion Query Detection", () => {
	test("All Currency Combinations", () => {
		let count = 0
		const startTime = performance.now()
		for (const fromCurrency of currency.CURRENCY_SYMBOLS) {
			for (const toCurrency of currency.CURRENCY_SYMBOLS) {
				const randAmt = randomFloat()
				const query = `${randAmt} ${fromCurrency} to ${toCurrency}`
				const result = currency.detectCurrencyConversion(query, currency.CURRENCY_SYMBOLS)
				expect(result).toEqual({
					amount: randAmt,
					fromCurrency,
					toCurrency
				})
				count++
			}
		}
		const endTime = performance.now()
		const duration = endTime - startTime
		console.log(
			`Tested ${count} currency combinations in ${duration.toFixed(2)}ms (${(duration / count).toFixed(3)}ms per test)`
		)
	})

	test("Case: No Number", () => {
		const query = "USD to CAD"
		const result = currency.detectCurrencyConversion(query, currency.CURRENCY_SYMBOLS)
		expect(result).toEqual({
			amount: undefined,
			fromCurrency: "USD",
			toCurrency: "CAD"
		})
	})

	test("Case: Lowercase Currency", () => {
		const query = "10.5 usd to cad"
		const result = currency.detectCurrencyConversion(query, currency.CURRENCY_SYMBOLS)
		expect(result).toEqual({
			amount: 10.5,
			fromCurrency: "USD",
			toCurrency: "CAD"
		})
	})

	test("Case: Multiple Spaces and Leading Dot", () => {
		const query = ".5   UsD   to     cAd"
		const result = currency.detectCurrencyConversion(query, currency.CURRENCY_SYMBOLS)
		expect(result).toEqual({
			amount: 0.5,
			fromCurrency: "USD",
			toCurrency: "CAD"
		})
	})
})
