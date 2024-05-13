import { invoke } from "@tauri-apps/api";

export function openTrash() {
  return invoke("plugin:jarvis|open_trash");
}

export function emptyTrash() {
  return invoke("plugin:jarvis|empty_trash");
}

export function shutdown() {
  return invoke("plugin:jarvis|shutdown");
}

export function reboot() {
  return invoke("plugin:jarvis|reboot");
}

export function sleep() {
  return invoke("plugin:jarvis|sleep");
}

export function lock() {
  return invoke("plugin:jarvis|lock");
}

export function toggleSystemAppearance() {
  return invoke("plugin:jarvis|toggle_system_appearance");
}

export function showDesktop() {
  return invoke("plugin:jarvis|show_desktop");
}

export function quitAppApps() {
  return invoke("plugin:jarvis|quit_app_apps");
}

export function sleepDisplays() {
  return invoke("plugin:jarvis|sleep_displays");
}

export function setVolume() {
  return invoke("plugin:jarvis|set_volume");
}

export function turnVolumeUp() {
  return invoke("plugin:jarvis|turn_volume_up");
}

export function turnVolumeDown() {
  return invoke("plugin:jarvis|turn_volume_down");
}

export function toggleStageManager() {
  return invoke("plugin:jarvis|toggle_stage_manager");
}

export function toggleBluetooth() {
  return invoke("plugin:jarvis|toggle_bluetooth");
}

export function toggleHiddenFiles() {
  return invoke("plugin:jarvis|toggle_hidden_files");
}

export function ejectAllDisks() {
  return invoke("plugin:jarvis|eject_all_disks");
}

export function logoutUser() {
  return invoke("plugin:jarvis|logout_user");
}

export function toggleMute() {
  return invoke("plugin:jarvis|toggle_mute");
}

export function mute() {
  return invoke("plugin:jarvis|mute");
}

export function unmute() {
  return invoke("plugin:jarvis|unmute");
}

export function hideAllAppsExceptFrontmost() {
  return invoke("plugin:jarvis|hide_all_apps_except_frontmost");
}
