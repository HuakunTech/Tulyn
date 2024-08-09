import {
	ClipboardPermissionSchema,
	DialogPermissionSchema,
	FetchPermissionSchema,
	FsPermissionSchema,
	NetworkPermissionSchema,
	NotificationPermissionSchema,
	OsPermissionSchema,
	ShellPermissionSchema,
	SystemInfoPermissionSchema,
	// AllPermissionSchema as TauriApiAdapterAllPermissionSchema,
	UpdownloadPermissionSchema
} from "tauri-api-adapter/permissions"
import { array, literal, object, optional, string, union, type InferOutput } from "valibot"

export const SystemPermissionSchema = union([
	literal("system:volumn"),
	literal("system:boot"),
	literal("system:disk"),
	literal("system:apps"),
	literal("system:fs"),
	literal("system:ui")
])
export const KunkunFsPermissionSchema = union([
	FsPermissionSchema,
	literal("fs:read-dir"),
	literal("fs:stat"),
	literal("fs:search")
])
export const PermissionScopeSchema = object({ path: optional(string()), url: optional(string()) })
export type KunkunFsPermission = InferOutput<typeof KunkunFsPermissionSchema>
export const FsPermissionScopedSchema = object({
	permission: KunkunFsPermissionSchema,
	allow: optional(array(PermissionScopeSchema)),
	deny: optional(array(PermissionScopeSchema))
})
export type FsPermissionScoped = InferOutput<typeof FsPermissionScopedSchema>

export const OpenPermissionSchema = union([
	literal("open:url"),
	literal("open:file"),
	literal("open:folder")
])
export const OpenPermissionScopedSchema = object({
	permission: OpenPermissionSchema,
	allow: optional(array(PermissionScopeSchema)),
	deny: optional(array(PermissionScopeSchema))
})
export type OpenPermissionScoped = InferOutput<typeof OpenPermissionScopedSchema>

// export const FsPermissionSchema = union([
// 	literal("fs:allow-desktop-read-recursive"),
// 	literal("fs:allow-desktop-write-recursive"),
// 	literal("fs:allow-documents-read-recursive"),
// 	literal("fs:allow-documents-write-recursive"),
// 	literal("fs:allow-downloads-read-recursive"),
// 	literal("fs:allow-downloads-write-recursive")
// ])
// export type FsPermission = InferOutput<typeof FsPermissionSchema>

// export const FsScopePermissionSchema = union([
// 	literal("fs:allow-desktop-read-recursive"),
// 	literal("fs:allow-desktop-write-recursive"),
// 	literal("fs:allow-documents-read-recursive"),
// 	literal("fs:allow-documents-write-recursive"),
// 	literal("fs:allow-downloads-read-recursive"),
// 	literal("fs:allow-downloads-write-recursive"),
// 	literal("fs:scope-download-recursive"),
// 	literal("fs:scope-desktop-recursive"),
// 	literal("fs:scope-documents-recursive")
// ])
// export type FsScopePermission = InferOutput<typeof FsScopePermissionSchema>
export type SystemPermission = InferOutput<typeof SystemPermissionSchema>
export const KunkunManifestPermission = union([
	// TauriApiAdapterAllPermissionSchema,
	ClipboardPermissionSchema,
	DialogPermissionSchema,
	NotificationPermissionSchema,
	// FsPermissionSchema,
	OsPermissionSchema,
	ShellPermissionSchema,
	FetchPermissionSchema,
	SystemInfoPermissionSchema,
	NetworkPermissionSchema,
	UpdownloadPermissionSchema,
	SystemPermissionSchema
	// FsScopePermissionSchema
])
export const AllKunkunPermission = union([
	KunkunManifestPermission,
	KunkunFsPermissionSchema,
	OpenPermissionSchema
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
	"updownload:upload": "Allows uploading files",
	/* -------------------------------------------------------------------------- */
	/*                                 File System                                */
	/* -------------------------------------------------------------------------- */
	// fs:allow-app-write-recursive
	"fs:search": "Allows searching files in the file system",
	"fs:read": "Allows reading files from the file system",
	"fs:read-dir":
		"Allows reading directories from the file system. Permissions to read files not granted, must be declared separately",
	"fs:write": "Allows writing files to the file system",
	"fs:exists": "Allows checking if a file exists in the file system",
	"fs:stat": "Allows getting file metadata from the file system",
	/* ---------------------------- File System Scope --------------------------- */
	// "fs:scope-download-recursive": "Allows reading files from the download directory and its subdirectories",
	// "fs:allow-desktop-read-recursive":
	// 	"Allows reading files from the desktop directory and its subdirectories",
	// "fs:allow-desktop-write-recursive":
	// 	"Allows writing files to the desktop directory and its subdirectories",
	// "fs:allow-documents-read-recursive":
	// 	"Allows reading files from the documents directory and its subdirectories",
	// "fs:allow-documents-write-recursive":
	// 	"Allows writing files to the documents directory and its subdirectories",
	// "fs:allow-downloads-read-recursive":
	// 	"Allows reading files from the download directory and its subdirectories",
	// "fs:allow-downloads-write-recursive":
	// 	"Allows writing files to the download directory and its subdirectories",
	// "fs:scope-download-recursive":
	// 	"Allow reading files from the download directory and its subdirectories",
	// "fs:scope-desktop-recursive":
	// 	"Allow reading files from the desktop directory and its subdirectories",
	// "fs:scope-documents-recursive":
	// 	"Allow reading files from the documents directory and its subdirectories"
	"open:url": "Open URLs",
	"open:file": "Open Files",
	"open:folder": "Open Folders"
}
