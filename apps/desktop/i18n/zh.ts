import type { I18nMessages } from "./en"
import type { RecursivePartial } from "./types"

const zhMessages: I18nMessages = {
	/* -------------------------------------------------------------------------- */
	/*                                   Common                                   */
	/* -------------------------------------------------------------------------- */
	common: {
		welcome: "欢迎",
		appName: "鲲鲲"
	},
	/* -------------------------------------------------------------------------- */
	/*                                  Main Page                                 */
	/* -------------------------------------------------------------------------- */
	main: {
		searchBarSearchForAppsOrCmds: "搜索应用或命令..."
	},
	/* -------------------------------------------------------------------------- */
	/*                                  settings                                  */
	/* -------------------------------------------------------------------------- */
	settings: {
		general: {
			name: "通用",
			startup: "启动",
			launchAtLogin: "开机自启",
			language: "语言",
			selectLang: "选择语言",
			triggerHotkey: "唤醒快捷键",
			recordHotkey: "录制快捷键",
			menubarIcon: "菜单栏图标",
			showInMenuBar: "显示在菜单栏",
			theme: "主题颜色",
			editStyle: "编辑风格",
			developerSettings: "开发者设置",
			devExtensionMode: "插件开发模式",
			pickDevExtensionLoadMode: "选择开发插件加载模式",
			devExtLoadMode: "插件开发加载模式",
			devMode: "开发模式",
			prodMode: "正常模式",
			"window-blur-bahavior": "窗口失焦行为",
			"hide-on-blur": "失焦隐藏",
			"extension-upgrade": "插件更新模式",
			"extension-upgrade.auto": "自动更新",
			"extension-upgrade.manual": "手动更新(插件商店中)",
			"join-beta": "加入测试版",
			"join-beta.explain-true": "接收稳定版和测试版",
			"join-beta.explain-false": "仅接收稳定版"
		},
		extensions: {
			name: "扩展"
		},
		developer: {
			name: "开发者",
			serverStatus: "服务器状态",
			installation: "安装",
			devVars: "开发变量",
			// installation
			developerModeExtensionInstallationWarning:
				"警告: Powerful Extensions comes with Potential Security Risks"
		},
		about: {
			name: "关于",
			author: "作者",
			version: "版本",
			sourceCode: "源代码",
			extensionsSourceCode: "插件源代码",
			checkUpdate: "检查更新"
		}
	}
}

export default zhMessages
