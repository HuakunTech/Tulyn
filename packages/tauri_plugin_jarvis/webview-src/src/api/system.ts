import { invoke } from "@tauri-apps/api";
import { TCommand, CommandType } from "src/model/command";
import { IconType, TListItem } from "src/model/list";

export function openTrash(): Promise<void> {
  return invoke("plugin:jarvis|open_trash");
}

export function emptyTrash(): Promise<void> {
  return invoke("plugin:jarvis|empty_trash");
}

export function shutdown(): Promise<void> {
  return invoke("plugin:jarvis|shutdown");
}

export function reboot(): Promise<void> {
  return invoke("plugin:jarvis|reboot");
}

export function sleep(): Promise<void> {
  return invoke("plugin:jarvis|sleep");
}

export function toggleSystemAppearance(): Promise<void> {
  return invoke("plugin:jarvis|toggle_system_appearance");
}

export function showDesktop(): Promise<void> {
  return invoke("plugin:jarvis|show_desktop");
}

export function quitAllApps(): Promise<void> {
  return invoke("plugin:jarvis|quit_app_apps");
}

export function sleepDisplays(): Promise<void> {
  return invoke("plugin:jarvis|sleep_displays");
}

export function setVolume(percentage: number): Promise<void> {
  return invoke("plugin:jarvis|set_volume", { percentage });
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
  return invoke("plugin:jarvis|turn_volume_up");
}

export function turnVolumeDown(): Promise<void> {
  return invoke("plugin:jarvis|turn_volume_down");
}

export function toggleStageManager(): Promise<void> {
  return invoke("plugin:jarvis|toggle_stage_manager");
}

export function toggleBluetooth(): Promise<void> {
  return invoke("plugin:jarvis|toggle_bluetooth");
}

export function toggleHiddenFiles(): Promise<void> {
  return invoke("plugin:jarvis|toggle_hidden_files");
}

export function ejectAllDisks(): Promise<void> {
  return invoke("plugin:jarvis|eject_all_disks");
}

export function logoutUser(): Promise<void> {
  return invoke("plugin:jarvis|logout_user");
}

export function toggleMute(): Promise<void> {
  return invoke("plugin:jarvis|toggle_mute");
}

export function mute(): Promise<void> {
  return invoke("plugin:jarvis|mute");
}

export function unmute(): Promise<void> {
  return invoke("plugin:jarvis|unmute");
}

export function hideAllAppsExceptFrontmost(): Promise<void> {
  return invoke("plugin:jarvis|hide_all_apps_except_frontmost");
}

export const rawSystemCommands = [
  {
    name: "Open Trash",
    icon: "uil:trash",
    function: openTrash,
  },
  {
    name: "Empty Trash",
    icon: "uil:trash",
    function: emptyTrash,
  },
  {
    name: "Shutdown",
    icon: "mdi:shutdown",
    function: shutdown,
  },
  {
    name: "Reboot",
    icon: "mdi:restart",
    function: reboot,
  },
  {
    name: "Sleep",
    icon: "carbon:asleep",
    function: sleep,
  },
  {
    name: "Toggle System Appearance",
    icon: "line-md:light-dark",
    function: toggleSystemAppearance,
  },
  {
    name: "Show Desktop",
    icon: "bi:window-desktop",
    function: showDesktop,
  },
  {
    name: "Quit App",
    icon: "charm:cross",
    function: quitAllApps,
  },
  {
    name: "Sleep Displays",
    icon: "solar:display-broken",
    function: sleepDisplays,
  },
  {
    name: "Set Volume to 0%",
    icon: "flowbite:volume-mute-outline",
    function: setVolumeTo0,
  },
  {
    name: "Set Volume to 25%",
    icon: "flowbite:volume-down-solid",
    function: setVolumeTo25,
  },
  {
    name: "Set Volume to 50%",
    icon: "flowbite:volume-down-solid",
    function: setVolumeTo50,
  },
  {
    name: "Set Volume to 75%",
    icon: "flowbite:volume-down-solid",
    function: setVolumeTo75,
  },
  {
    name: "Set Volume to 100%",
    icon: "flowbite:volume-up-solid",
    function: setVolumeTo100,
  },
  {
    name: "Turn Volume Up",
    icon: "flowbite:volume-down-solid",
    function: turnVolumeUp,
  },
  {
    name: "Turn Volume Down",
    icon: "flowbite:volume-down-outline",
    function: turnVolumeDown,
  },
  {
    name: "Toggle Mute",
    icon: "flowbite:volume-mute-outline",
    function: toggleMute,
  },
  {
    name: "Mute",
    icon: "flowbite:volume-mute-solid",
    function: mute,
  },
  {
    name: "Unmute",
    icon: "flowbite:volume-mute-solid",
    function: unmute,
  },
  {
    name: "Toggle Stage Manager",
    icon: "material-symbols:dashboard",
    function: toggleStageManager,
  },
  {
    name: "Toggle Bluetooth",
    icon: "material-symbols:bluetooth",
    function: toggleBluetooth,
  },
  {
    name: "Toggle Hidden Files",
    icon: "mdi:hide",
    function: toggleHiddenFiles,
  },
  {
    name: "Eject All Disks",
    icon: "ph:eject-fill",
    function: ejectAllDisks,
  },
  {
    name: "Log Out User",
    icon: "ic:baseline-logout",
    function: logoutUser,
  },
  {
    name: "Hide All Apps Except Frontmost",
    icon: "mdi:hide",
    function: hideAllAppsExceptFrontmost,
  },
];

export const systemCommands: TCommand[] = rawSystemCommands.map((cmd) => ({
  name: cmd.name,
  value: cmd.name.split(" ").join("-").toLowerCase(),
  icon: cmd.icon,
  keywords: cmd.name.split(" "),
  commandType: CommandType.Enum.system,
  function: cmd.function,
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
