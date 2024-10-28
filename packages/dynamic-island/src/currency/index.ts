export { CURRENCY_SYMBOLS } from "./constant"

export function detectCurrencyConversion(
	str: string,
	currencySet: Set<string>
): {
	amount?: number
	fromCurrency: string
	toCurrency: string
} | null {
	// Removed \b from start and handle leading dot explicitly
	const regex = /(\d*\.?\d+|\.\d+)?\s*([A-Z]{3})\s*to\s*([A-Z]{3})\b/i
	const match = str.match(regex)
	if (match) {
		const [_, amount, fromCurrency, toCurrency] = match
		// Check if both currencies are in the available set
		if (currencySet.has(fromCurrency.toUpperCase()) && currencySet.has(toCurrency.toUpperCase())) {
			return {
				amount: amount ? parseFloat(amount) : undefined,
				fromCurrency: fromCurrency.toUpperCase(),
				toCurrency: toCurrency.toUpperCase()
			}
		}
	}
	return null // Return null if either currency is not in availableCurrencies
}
