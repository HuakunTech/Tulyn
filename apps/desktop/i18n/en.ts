const enMessages = {
	/* -------------------------------------------------------------------------- */
	/*                                   Common                                   */
	/* -------------------------------------------------------------------------- */
	common: {
		welcome: "Welcome",
		appName: "Kunkun"
	},
	/* -------------------------------------------------------------------------- */
	/*                                  Main Page                                 */
	/* -------------------------------------------------------------------------- */
	main: {
		searchBarSearchForAppsOrCmds: "Search for Apps or Commands..."
	},
	/* -------------------------------------------------------------------------- */
	/*                                  settings                                  */
	/* -------------------------------------------------------------------------- */
	settings: {
		general: {
			name: "General",
			startup: "Startup",
			launchAtLogin: "Launch at login",
			language: "Language",
			selectLang: "Select Language",
			triggerHotkey: "Trigger Hotkey",
			recordHotkey: "Record Hotkey",
			menubarIcon: "Menubar Icon",
			showInMenuBar: "Show in Menubar",
			theme: "Theme",
			editStyle: "Edit Style",
			developerSettings: "Developer Settings",
			devExtensionMode: "Dev Extension Mode",
			pickDevExtensionLoadMode: "Pick Dev Extension Load Mode",
			devExtLoadMode: "Dev Extension Load Mode",
			devMode: "Development Mode",
			prodMode: "Production Mode",
			"window-blur-bahavior": "Window Blur Behavior",
			"hide-on-blur": "Hide on Blur",
			"extension-upgrade": {
				name: "Extension Upgrade Mode",
				auto: "Auto Upgrade",
				manual: "Manual Upgrade in Store"
			},
			"join-beta": {
				name: "Join Beta Program",
				"explain-true": "Receive both stable and beta versions",
				"explain-false": "Receive only stable versions"
			}
		},
		extensions: {
			name: "Extensions"
		},
		developer: {
			name: "Developer",
			serverStatus: "Server Status",
			installation: "Installation",
			devVars: "Dev Variables",
			// installation
			developerModeExtensionInstallationWarning:
				"Warning: Powerful Extensions comes with Potential Security Risks"
		},
		about: {
			name: "About",
			author: "Author",
			version: "Version",
			sourceCode: "Source Code",
			extensionsSourceCode: "Extensions Source Code",
			checkUpdate: "Check Update"
		}
	}
}
export default enMessages
export type I18nMessages = typeof enMessages
