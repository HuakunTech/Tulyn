import i18next from "i18next"
import en, { type Translation } from "./en"
import zh from "./zh"

export function setupI18n() {
	i18next.init({
		resources: {
			en: {
				translation: en
			},
			fr: {
				translation: zh
			}
		},
		lng: "en", // default language
		fallbackLng: "en"
	})
}

export const t = (key: keyof Translation, options?: any) => i18next.t(key, options)
