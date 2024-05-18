import { invoke } from "@tauri-apps/api/core";
import { TCommand, CommandType } from "@/lib/model/command";
import { IconType, TListItem } from "@/lib/model/list";

export function openTrash(): Promise<void> {
  return invoke("open_trash");
}

export function emptyTrash(): Promise<void> {
  return invoke("empty_trash");
}

export function shutdown(): Promise<void> {
  return invoke("shutdown");
}

export function reboot(): Promise<void> {
  return invoke("reboot");
}

export function sleep(): Promise<void> {
  return invoke("sleep");
}

export function toggleSystemAppearance(): Promise<void> {
  return invoke("toggle_system_appearance");
}

export function showDesktop(): Promise<void> {
  return invoke("show_desktop");
}

export function quitAllApps(): Promise<void> {
  return invoke("quit_app_apps");
}

export function sleepDisplays(): Promise<void> {
  return invoke("sleep_displays");
}

export function setVolume(percentage: number): Promise<void> {
  return invoke("set_volume", { percentage });
}

export function setVolumeTo0(): Promise<void> {
  return setVolume(0);
}

export function setVolumeTo25(): Promise<void> {
  return setVolume(25);
}

export function setVolumeTo50(): Promise<void> {
  return setVolume(50);
}

export function setVolumeTo75(): Promise<void> {
  return setVolume(75);
}

export function setVolumeTo100(): Promise<void> {
  return setVolume(100);
}

export function turnVolumeUp(): Promise<void> {
  return invoke("turn_volume_up");
}

export function turnVolumeDown(): Promise<void> {
  return invoke("turn_volume_down");
}

export function toggleStageManager(): Promise<void> {
  return invoke("toggle_stage_manager");
}

export function toggleBluetooth(): Promise<void> {
  return invoke("toggle_bluetooth");
}

export function toggleHiddenFiles(): Promise<void> {
  return invoke("toggle_hidden_files");
}

export function ejectAllDisks(): Promise<void> {
  return invoke("eject_all_disks");
}

export function logoutUser(): Promise<void> {
  return invoke("logout_user");
}

export function toggleMute(): Promise<void> {
  return invoke("toggle_mute");
}

export function mute(): Promise<void> {
  return invoke("mute");
}

export function unmute(): Promise<void> {
  return invoke("unmute");
}

export function hideAllAppsExceptFrontmost(): Promise<void> {
  return invoke("hide_all_apps_except_frontmost");
}

export const rawSystemCommands = [
  {
    name: "Open Trash",
    icon: "uil:trash",
    confirmRequired: false,
    function: openTrash,
    platform: ["darwin"],
  },
  {
    name: "Empty Trash",
    icon: "uil:trash",
    confirmRequired: true,
    function: emptyTrash,
    platform: ["darwin"],
  },
  {
    name: "Shutdown",
    icon: "mdi:shutdown",
    confirmRequired: true,
    function: shutdown,
    platform: ["darwin"],
  },
  {
    name: "Reboot",
    icon: "mdi:restart",
    confirmRequired: true,
    function: reboot,
    platform: ["darwin"],
  },
  {
    name: "Sleep",
    icon: "carbon:asleep",
    confirmRequired: false,
    function: sleep,
    platform: ["darwin"],
  },
  {
    name: "Toggle System Appearance",
    icon: "line-md:light-dark",
    confirmRequired: false,
    function: toggleSystemAppearance,
    platform: ["darwin"],
  },
  {
    name: "Show Desktop",
    icon: "bi:window-desktop",
    confirmRequired: false,
    function: showDesktop,
    platform: ["darwin"],
  },
  {
    name: "Quit App",
    icon: "charm:cross",
    confirmRequired: false,
    function: quitAllApps,
    platform: ["darwin"],
  },
  {
    name: "Sleep Displays",
    icon: "solar:display-broken",
    confirmRequired: false,
    function: sleepDisplays,
    platform: ["darwin"],
  },
  {
    name: "Set Volume to 0%",
    icon: "flowbite:volume-mute-outline",
    confirmRequired: false,
    function: setVolumeTo0,
    platform: ["darwin"],
  },
  {
    name: "Set Volume to 25%",
    icon: "flowbite:volume-down-solid",
    confirmRequired: false,
    function: setVolumeTo25,
    platform: ["darwin"],
  },
  {
    name: "Set Volume to 50%",
    icon: "flowbite:volume-down-solid",
    confirmRequired: false,
    function: setVolumeTo50,
    platform: ["darwin"],
  },
  {
    name: "Set Volume to 75%",
    icon: "flowbite:volume-down-solid",
    confirmRequired: false,
    function: setVolumeTo75,
    platform: ["darwin"],
  },
  {
    name: "Set Volume to 100%",
    icon: "flowbite:volume-up-solid",
    confirmRequired: false,
    function: setVolumeTo100,
    platform: ["darwin"],
  },
  {
    name: "Turn Volume Up",
    icon: "flowbite:volume-down-solid",
    confirmRequired: false,
    function: turnVolumeUp,
    platform: ["darwin"],
  },
  {
    name: "Turn Volume Down",
    icon: "flowbite:volume-down-outline",
    confirmRequired: false,
    function: turnVolumeDown,
    platform: ["darwin"],
  },
  {
    name: "Toggle Mute",
    icon: "flowbite:volume-mute-outline",
    confirmRequired: false,
    function: toggleMute,
    platform: ["darwin"],
  },
  {
    name: "Mute",
    icon: "flowbite:volume-mute-solid",
    confirmRequired: false,
    function: mute,
    platform: ["darwin"],
  },
  {
    name: "Unmute",
    icon: "flowbite:volume-mute-solid",
    confirmRequired: false,
    function: unmute,
    platform: ["darwin"],
  },
  {
    name: "Toggle Stage Manager",
    icon: "material-symbols:dashboard",
    confirmRequired: false,
    function: toggleStageManager,
    platform: ["darwin"],
  },
  {
    name: "Toggle Bluetooth",
    icon: "material-symbols:bluetooth",
    confirmRequired: false,
    function: toggleBluetooth,
    platform: ["darwin"],
  },
  {
    name: "Toggle Hidden Files",
    icon: "mdi:hide",
    confirmRequired: false,
    function: toggleHiddenFiles,
    platform: ["darwin"],
  },
  {
    name: "Eject All Disks",
    icon: "ph:eject-fill",
    confirmRequired: true,
    function: ejectAllDisks,
    platform: ["darwin"],
  },
  {
    name: "Log Out User",
    icon: "ic:baseline-logout",
    confirmRequired: false,
    function: logoutUser,
    platform: ["darwin"],
  },
  {
    name: "Hide All Apps Except Frontmost",
    icon: "mdi:hide",
    confirmRequired: false,
    function: hideAllAppsExceptFrontmost,
    platform: ["darwin"],
  },
];

export const systemCommands: TCommand[] = rawSystemCommands
  .filter((cmd) => cmd.platform.includes(process.platform)) // Filter out system commands that are not supported on the current platform
  .map((cmd) => ({
    name: cmd.name,
    value: "system-cmd" + cmd.name.split(" ").join("-").toLowerCase(),
    icon: cmd.icon,
    keywords: cmd.name.split(" "),
    commandType: CommandType.Enum.system,
    function: cmd.function,
    confirmRequired: cmd.confirmRequired,
  }));

export const systemCommandListItems: TListItem[] = systemCommands.map((cmd) =>
  TListItem.parse({
    title: cmd.name,
    value: cmd.value,
    description: "System",
    type: CommandType.Enum.system,
    icon: {
      value: cmd.icon,
      type: IconType.Enum.iconify,
    },
    keywords: cmd.keywords,
  }),
);
