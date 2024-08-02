import type { I18nMessages } from "./en"
import type { RecursivePartial } from "./types"

const zhMessages: I18nMessages = {
	welcome: "Welcome",
	/* -------------------------------------------------------------------------- */
	/*                                   Common                                   */
	/* -------------------------------------------------------------------------- */
	appName: "鲲鲲",
	/* -------------------------------------------------------------------------- */
	/*                                  Main Page                                 */
	/* -------------------------------------------------------------------------- */
	searchBarSearchForAppsOrCmds: "搜索应用或命令...",
	/* -------------------------------------------------------------------------- */
	/*                                  settings                                  */
	/* -------------------------------------------------------------------------- */
	general: "通用",
	extensions: "扩展",
	developer: "开发者",
	about: "关于",
	/* ------------------------------- General Tab ------------------------------ */
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
	/* ------------------------------ Developer Tab ----------------------------- */
	serverStatus: "服务器状态",
	installation: "安装",
	devVars: "开发变量",
	// installation
	developerModeExtensionInstallationWarning: "警告: 强大的插件可能存在潜在的安全风险",
	/* -------------------------------- About Tab ------------------------------- */
	author: "作者",
	version: "版本",
	sourceCode: "源代码",
	extensionsSourceCode: "插件源代码",
	checkUpdate: "检查更新"
}

export default zhMessages
