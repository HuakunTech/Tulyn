import { AllPermissionSchema as TauriApiAdapterAllPermissionSchema } from "tauri-api-adapter/permissions"
import { literal, union, type InferOutput } from "valibot"

export const SystemPermissionSchema = union([
  literal("system:volumn"),
  literal("system:boot"),
  literal("system:disk"),
  literal("system:apps"),
  literal("system:fs"),
  literal("system:ui")
])
export type SystemPermission = InferOutput<typeof SystemPermissionSchema>
export const AllKunkunPermission = union([
  TauriApiAdapterAllPermissionSchema,
  SystemPermissionSchema
])
export type AllKunkunPermission = InferOutput<typeof AllKunkunPermission>
export type PermissionDescriptions = Record<AllKunkunPermission, string>
export const permissionDescriptions: PermissionDescriptions = {
  "system:volumn": "Allows access to control system volume",
  "system:boot": "Allows sleep, restart, logout and shutdown, etc.",
  "system:disk": "Allows access to control disk (e.g. eject)",
  "system:apps": "Allows access to applications (e.g. find frontmost app, kill app)",
  "system:fs": "Allows access to the clean trash, get selected files",
  "system:ui": "Allows access to system UI components",
  "clipboard:read-all": "Allows reading all clipboard data",
  "clipboard:write-all": "Allows writing all clipboard data",
  "clipboard:read-text": "Allows reading text/html/rtf from the clipboard",
  "clipboard:write-text": "Allows writing text/html/rtf to the clipboard",
  "clipboard:read-image": "Allows reading images from the clipboard",
  "clipboard:write-image": "Allows writing images to the clipboard",
  "clipboard:read-files": "Allows reading copied files from the clipboard",
  "clipboard:write-files": "Allows writing files to the clipboard",
  "dialog:all": "Allows access to system dialog APIs, e.g. confirm, save, open, etc.",
  "notification:all": "Allows sending system notifications",
  "fs:read": "Allows reading files from the file system",
  "fs:write": "Allows writing files to the file system",
  "fs:exists": "Allows checking if a file exists in the file system",
  "os:all": "Allows access to all operating system information",
  "shell:open": "Allows opening shell commands",
  "shell:execute": "Allows executing shell commands",
  "fetch:all": "Allows making network requests",
  "system-info:all": "Allows access to all system information",
  "system-info:memory": "Allows access to system memory information",
  "system-info:cpu": "Allows access to system CPU information",
  "system-info:os": "Allows access to operating system information",
  "system-info:disk": "Allows access to disk information",
  "system-info:network": "Allows access to network information",
  "system-info:battery": "Allows access to battery information",
  "system-info:process": "Allows access to process information",
  "system-info:components": "Allows access to system components information",
  "network:interface": "Allows access to network interface information",
  "network:port": "Allows access to network port information",
  "updownload:download": "Allows downloading files",
  "updownload:upload": "Allows uploading files"
}
