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
export const EventPermissionSchema = union([
	literal("event:drag-drop"),
	literal("event:drag-enter"),
	literal("event:drag-leave"),
	literal("event:drag-over"),
	literal("event:window-blur"),
	literal("event:window-close-requested"),
	literal("event:window-focus")
])
export type EventPermission = InferOutput<typeof EventPermissionSchema>
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
	EventPermissionSchema,
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
