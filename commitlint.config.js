export default {
	extends: ["@commitlint/config-conventional"],
	rules: {
		"body-max-line-length": [0, "always", 500],
		"subject-empty": [0, "always", ""],
		"type-empty": [0, "always", ""]
	}
}
