import en from "./en"
import zh from "./zh"

export default defineI18nConfig(() => ({
	legacy: false,
	locale: "en",
	fallbackLocale: "en",
	messages: {
		// en: { ...enMessages },
		en: en,
		zh: zh
	}
}))
