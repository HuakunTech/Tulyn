// /Users/hacker/Dev/projects/Jarvis/extensions/hacker-news/node_modules/valibot/dist/index.js
var getGlobalConfig = function(config2) {
  return {
    lang: config2?.lang ?? store?.lang,
    message: config2?.message,
    abortEarly: config2?.abortEarly ?? store?.abortEarly,
    abortPipeEarly: config2?.abortPipeEarly ?? store?.abortPipeEarly
  };
};
var getGlobalMessage = function(lang) {
  return store2?.get(lang);
};
var getSchemaMessage = function(lang) {
  return store3?.get(lang);
};
var getSpecificMessage = function(reference, lang) {
  return store4?.get(reference)?.get(lang);
};
var _stringify = function(input) {
  const type = typeof input;
  if (type === "string") {
    return `"${input}"`;
  }
  if (type === "number" || type === "bigint" || type === "boolean") {
    return `${input}`;
  }
  if (type === "object" || type === "function") {
    return (input && Object.getPrototypeOf(input)?.constructor?.name) ?? "null";
  }
  return type;
};
var _addIssue = function(context, label, dataset, config2, other) {
  const input = other && "input" in other ? other.input : dataset.value;
  const expected = other?.expected ?? context.expects ?? null;
  const received = other?.received ?? _stringify(input);
  const issue = {
    kind: context.kind,
    type: context.type,
    input,
    expected,
    received,
    message: `Invalid ${label}: ${expected ? `Expected ${expected} but r` : "R"}eceived ${received}`,
    requirement: context.requirement,
    path: other?.path,
    issues: other?.issues,
    lang: config2.lang,
    abortEarly: config2.abortEarly,
    abortPipeEarly: config2.abortPipeEarly
  };
  const isSchema = context.kind === "schema";
  const message = other?.message ?? context.message ?? getSpecificMessage(context.reference, issue.lang) ?? (isSchema ? getSchemaMessage(issue.lang) : null) ?? config2.message ?? getGlobalMessage(issue.lang);
  if (message) {
    issue.message = typeof message === "function" ? message(issue) : message;
  }
  if (isSchema) {
    dataset.typed = false;
  }
  if (dataset.issues) {
    dataset.issues.push(issue);
  } else {
    dataset.issues = [issue];
  }
};
var _isValidObjectKey = function(object2, key) {
  return Object.hasOwn(object2, key) && key !== "__proto__" && key !== "prototype" && key !== "constructor";
};
var hexColor = function(message) {
  return {
    kind: "validation",
    type: "hex_color",
    reference: hexColor,
    async: false,
    expects: null,
    requirement: HEX_COLOR_REGEX,
    message,
    _run(dataset, config2) {
      if (dataset.typed && !this.requirement.test(dataset.value)) {
        _addIssue(this, "hex color", dataset, config2);
      }
      return dataset;
    }
  };
};
var length = function(requirement, message) {
  return {
    kind: "validation",
    type: "length",
    reference: length,
    async: false,
    expects: `${requirement}`,
    requirement,
    message,
    _run(dataset, config2) {
      if (dataset.typed && dataset.value.length !== this.requirement) {
        _addIssue(this, "length", dataset, config2, {
          received: `${dataset.value.length}`
        });
      }
      return dataset;
    }
  };
};
var getDefault = function(schema, dataset, config2) {
  return typeof schema.default === "function" ? schema.default(dataset, config2) : schema.default;
};
var array = function(item, message) {
  return {
    kind: "schema",
    type: "array",
    reference: array,
    expects: "Array",
    async: false,
    item,
    message,
    _run(dataset, config2) {
      const input = dataset.value;
      if (Array.isArray(input)) {
        dataset.typed = true;
        dataset.value = [];
        for (let key = 0;key < input.length; key++) {
          const value2 = input[key];
          const itemDataset = this.item._run({ typed: false, value: value2 }, config2);
          if (itemDataset.issues) {
            const pathItem = {
              type: "array",
              origin: "value",
              input,
              key,
              value: value2
            };
            for (const issue of itemDataset.issues) {
              if (issue.path) {
                issue.path.unshift(pathItem);
              } else {
                issue.path = [pathItem];
              }
              dataset.issues?.push(issue);
            }
            if (!dataset.issues) {
              dataset.issues = itemDataset.issues;
            }
            if (config2.abortEarly) {
              dataset.typed = false;
              break;
            }
          }
          if (!itemDataset.typed) {
            dataset.typed = false;
          }
          dataset.value.push(itemDataset.value);
        }
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
};
var boolean = function(message) {
  return {
    kind: "schema",
    type: "boolean",
    reference: boolean,
    expects: "boolean",
    async: false,
    message,
    _run(dataset, config2) {
      if (typeof dataset.value === "boolean") {
        dataset.typed = true;
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
};
var date = function(message) {
  return {
    kind: "schema",
    type: "date",
    reference: date,
    expects: "Date",
    async: false,
    message,
    _run(dataset, config2) {
      if (dataset.value instanceof Date) {
        if (!isNaN(dataset.value)) {
          dataset.typed = true;
        } else {
          _addIssue(this, "type", dataset, config2, {
            received: '"Invalid Date"'
          });
        }
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
};
var enum_ = function(enum__, message) {
  const options = Object.entries(enum__).filter(([key]) => isNaN(+key)).map(([, value2]) => value2);
  return {
    kind: "schema",
    type: "enum",
    reference: enum_,
    expects: options.map(_stringify).join(" | ") || "never",
    async: false,
    enum: enum__,
    options,
    message,
    _run(dataset, config2) {
      if (this.options.includes(dataset.value)) {
        dataset.typed = true;
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
};
var function_ = function(message) {
  return {
    kind: "schema",
    type: "function",
    reference: function_,
    expects: "Function",
    async: false,
    message,
    _run(dataset, config2) {
      if (typeof dataset.value === "function") {
        dataset.typed = true;
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
};
var literal = function(literal_, message) {
  return {
    kind: "schema",
    type: "literal",
    reference: literal,
    expects: _stringify(literal_),
    async: false,
    literal: literal_,
    message,
    _run(dataset, config2) {
      if (dataset.value === this.literal) {
        dataset.typed = true;
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
};
var nullable = function(wrapped, ...args) {
  const schema = {
    kind: "schema",
    type: "nullable",
    reference: nullable,
    expects: `${wrapped.expects} | null`,
    async: false,
    wrapped,
    _run(dataset, config2) {
      if (dataset.value === null) {
        if ("default" in this) {
          dataset.value = getDefault(this, dataset, config2);
        }
        if (dataset.value === null) {
          dataset.typed = true;
          return dataset;
        }
      }
      return this.wrapped._run(dataset, config2);
    }
  };
  if (0 in args) {
    schema.default = args[0];
  }
  return schema;
};
var number = function(message) {
  return {
    kind: "schema",
    type: "number",
    reference: number,
    expects: "number",
    async: false,
    message,
    _run(dataset, config2) {
      if (typeof dataset.value === "number" && !isNaN(dataset.value)) {
        dataset.typed = true;
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
};
var object = function(entries, message) {
  return {
    kind: "schema",
    type: "object",
    reference: object,
    expects: "Object",
    async: false,
    entries,
    message,
    _run(dataset, config2) {
      const input = dataset.value;
      if (input && typeof input === "object") {
        dataset.typed = true;
        dataset.value = {};
        for (const key in this.entries) {
          const value2 = input[key];
          const valueDataset = this.entries[key]._run({ typed: false, value: value2 }, config2);
          if (valueDataset.issues) {
            const pathItem = {
              type: "object",
              origin: "value",
              input,
              key,
              value: value2
            };
            for (const issue of valueDataset.issues) {
              if (issue.path) {
                issue.path.unshift(pathItem);
              } else {
                issue.path = [pathItem];
              }
              dataset.issues?.push(issue);
            }
            if (!dataset.issues) {
              dataset.issues = valueDataset.issues;
            }
            if (config2.abortEarly) {
              dataset.typed = false;
              break;
            }
          }
          if (!valueDataset.typed) {
            dataset.typed = false;
          }
          if (valueDataset.value !== undefined || key in input) {
            dataset.value[key] = valueDataset.value;
          }
        }
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
};
var optional = function(wrapped, ...args) {
  const schema = {
    kind: "schema",
    type: "optional",
    reference: optional,
    expects: `${wrapped.expects} | undefined`,
    async: false,
    wrapped,
    _run(dataset, config2) {
      if (dataset.value === undefined) {
        if ("default" in this) {
          dataset.value = getDefault(this, dataset, config2);
        }
        if (dataset.value === undefined) {
          dataset.typed = true;
          return dataset;
        }
      }
      return this.wrapped._run(dataset, config2);
    }
  };
  if (0 in args) {
    schema.default = args[0];
  }
  return schema;
};
var record = function(key, value2, message) {
  return {
    kind: "schema",
    type: "record",
    reference: record,
    expects: "Object",
    async: false,
    key,
    value: value2,
    message,
    _run(dataset, config2) {
      const input = dataset.value;
      if (input && typeof input === "object") {
        dataset.typed = true;
        dataset.value = {};
        for (const entryKey in input) {
          if (_isValidObjectKey(input, entryKey)) {
            const entryValue = input[entryKey];
            const keyDataset = this.key._run({ typed: false, value: entryKey }, config2);
            if (keyDataset.issues) {
              const pathItem = {
                type: "object",
                origin: "key",
                input,
                key: entryKey,
                value: entryValue
              };
              for (const issue of keyDataset.issues) {
                issue.path = [pathItem];
                dataset.issues?.push(issue);
              }
              if (!dataset.issues) {
                dataset.issues = keyDataset.issues;
              }
              if (config2.abortEarly) {
                dataset.typed = false;
                break;
              }
            }
            const valueDataset = this.value._run({ typed: false, value: entryValue }, config2);
            if (valueDataset.issues) {
              const pathItem = {
                type: "object",
                origin: "value",
                input,
                key: entryKey,
                value: entryValue
              };
              for (const issue of valueDataset.issues) {
                if (issue.path) {
                  issue.path.unshift(pathItem);
                } else {
                  issue.path = [pathItem];
                }
                dataset.issues?.push(issue);
              }
              if (!dataset.issues) {
                dataset.issues = valueDataset.issues;
              }
              if (config2.abortEarly) {
                dataset.typed = false;
                break;
              }
            }
            if (!keyDataset.typed || !valueDataset.typed) {
              dataset.typed = false;
            }
            if (keyDataset.typed) {
              dataset.value[keyDataset.value] = valueDataset.value;
            }
          }
        }
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
};
var string = function(message) {
  return {
    kind: "schema",
    type: "string",
    reference: string,
    expects: "string",
    async: false,
    message,
    _run(dataset, config2) {
      if (typeof dataset.value === "string") {
        dataset.typed = true;
      } else {
        _addIssue(this, "type", dataset, config2);
      }
      return dataset;
    }
  };
};
var _subIssues = function(datasets) {
  let issues;
  if (datasets) {
    for (const dataset of datasets) {
      if (issues) {
        issues.push(...dataset.issues);
      } else {
        issues = dataset.issues;
      }
    }
  }
  return issues;
};
var union = function(options, message) {
  return {
    kind: "schema",
    type: "union",
    reference: union,
    expects: [...new Set(options.map((option) => option.expects))].join(" | ") || "never",
    async: false,
    options,
    message,
    _run(dataset, config2) {
      let validDataset;
      let typedDatasets;
      let untypedDatasets;
      for (const schema of this.options) {
        const optionDataset = schema._run({ typed: false, value: dataset.value }, config2);
        if (optionDataset.typed) {
          if (optionDataset.issues) {
            if (typedDatasets) {
              typedDatasets.push(optionDataset);
            } else {
              typedDatasets = [optionDataset];
            }
          } else {
            validDataset = optionDataset;
            break;
          }
        } else {
          if (untypedDatasets) {
            untypedDatasets.push(optionDataset);
          } else {
            untypedDatasets = [optionDataset];
          }
        }
      }
      if (validDataset) {
        return validDataset;
      }
      if (typedDatasets) {
        if (typedDatasets.length === 1) {
          return typedDatasets[0];
        }
        _addIssue(this, "type", dataset, config2, {
          issues: _subIssues(typedDatasets)
        });
        dataset.typed = true;
      } else if (untypedDatasets?.length === 1) {
        return untypedDatasets[0];
      } else {
        _addIssue(this, "type", dataset, config2, {
          issues: _subIssues(untypedDatasets)
        });
      }
      return dataset;
    }
  };
};
var parse = function(schema, input, config2) {
  const dataset = schema._run({ typed: false, value: input }, getGlobalConfig(config2));
  if (dataset.issues) {
    throw new ValiError(dataset.issues);
  }
  return dataset.value;
};
var pipe = function(...pipe2) {
  return {
    ...pipe2[0],
    pipe: pipe2,
    _run(dataset, config2) {
      for (let index = 0;index < pipe2.length; index++) {
        if (dataset.issues && (pipe2[index].kind === "schema" || pipe2[index].kind === "transformation")) {
          dataset.typed = false;
          break;
        }
        if (!dataset.issues || !config2.abortEarly && !config2.abortPipeEarly) {
          dataset = pipe2[index]._run(dataset, config2);
        }
      }
      return dataset;
    }
  };
};
var safeParse = function(schema, input, config2) {
  const dataset = schema._run({ typed: false, value: input }, getGlobalConfig(config2));
  return {
    typed: dataset.typed,
    success: !dataset.issues,
    output: dataset.value,
    issues: dataset.issues
  };
};
var HEX_COLOR_REGEX = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/iu;
var store;
var store2;
var store3;
var store4;
var ValiError = class extends Error {
  issues;
  constructor(issues) {
    super(issues[0].message);
    this.name = "ValiError";
    this.issues = issues;
  }
};

// /Users/hacker/Dev/projects/Jarvis/packages/api/node_modules/tauri-api-adapter/dist/permissions.js
var checkPermission = function(requiredPermissions, userPermissions) {
  return (fn) => {
    return (...args) => {
      if (requiredPermissions.length > 0 && !requiredPermissions.some((permission) => userPermissions.includes(permission))) {
        throw new Error(`Permission denied for API "${fn.name}". Require one of these: [${requiredPermissions.join(", ")}]`);
      }
      return fn(...args);
    };
  };
};
var ClipboardPermissionSchema = union([
  literal("clipboard:read-all"),
  literal("clipboard:write-all"),
  literal("clipboard:read-text"),
  literal("clipboard:write-text"),
  literal("clipboard:read-image"),
  literal("clipboard:write-image"),
  literal("clipboard:read-files"),
  literal("clipboard:write-files")
]);
var DialogPermissionSchema = literal("dialog:all");
var NotificationPermissionSchema = literal("notification:all");
var FsPermissionSchema = union([literal("fs:read"), literal("fs:write"), literal("fs:exists")]);
var OsPermissionSchema = literal("os:all");
var ShellPermissionSchema = union([literal("shell:open"), literal("shell:execute")]);
var FetchPermissionSchema = literal("fetch:all");
var SystemInfoPermissionSchema = union([
  literal("system-info:all"),
  literal("system-info:memory"),
  literal("system-info:cpu"),
  literal("system-info:os"),
  literal("system-info:disk"),
  literal("system-info:network"),
  literal("system-info:battery"),
  literal("system-info:process"),
  literal("system-info:components")
]);
var NetworkPermissionSchema = union([literal("network:interface"), literal("network:port")]);
var UpdownloadPermissionSchema = union([literal("updownload:download"), literal("updownload:upload")]);
var AllPermissionSchema = union([
  ClipboardPermissionSchema,
  DialogPermissionSchema,
  NotificationPermissionSchema,
  FsPermissionSchema,
  OsPermissionSchema,
  ShellPermissionSchema,
  FetchPermissionSchema,
  SystemInfoPermissionSchema,
  NetworkPermissionSchema,
  UpdownloadPermissionSchema
]);

// /Users/hacker/Dev/projects/Jarvis/extensions/hacker-news/node_modules/jarvis-api/dist/models/index.js
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var list_exports = {};
__export(list_exports, {
  Dropdown: () => Dropdown,
  DropdownItem: () => DropdownItem,
  DropdownSection: () => DropdownSection,
  EmptyView: () => EmptyView,
  Item: () => Item,
  ItemAccessory: () => ItemAccessory,
  ItemDetail: () => ItemDetail,
  ItemDetailMetadata: () => ItemDetailMetadata,
  ItemDetailMetadataLabel: () => ItemDetailMetadataLabel,
  ItemDetailMetadataLink: () => ItemDetailMetadataLink,
  ItemDetailMetadataSeparator: () => ItemDetailMetadataSeparator,
  ItemDetailMetadataTagList: () => ItemDetailMetadataTagList,
  ItemDetailMetadataTagListItem: () => ItemDetailMetadataTagListItem,
  List: () => List,
  Section: () => Section
});
var Color = pipe(string(), hexColor());
var NodeNameEnum = ((NodeNameEnum5) => {
  NodeNameEnum5["List"] = "List";
  NodeNameEnum5["ListItem"] = "ListItem";
  NodeNameEnum5["ListItemDetail"] = "ListItemDetail";
  NodeNameEnum5["ListItemAccessory"] = "ListItemAccessory";
  NodeNameEnum5["ListSection"] = "ListSection";
  NodeNameEnum5["ListItemDetailMetadata"] = "ListItemDetailMetadata";
  NodeNameEnum5["ListItemDetailMetadataLabel"] = "ListItemDetailMetadataLabel";
  NodeNameEnum5["ListItemDetailMetadataLink"] = "ListItemDetailMetadataLink";
  NodeNameEnum5["ListItemDetailMetadataTagList"] = "ListItemDetailMetadataTagList";
  NodeNameEnum5["ListItemDetailMetadataTagListItem"] = "ListItemDetailMetadataTagListItem";
  NodeNameEnum5["ListItemDetailMetadataSeparator"] = "ListItemDetailMetadataSeparator";
  NodeNameEnum5["Icon"] = "Icon";
  NodeNameEnum5["EmptyView"] = "EmptyView";
  NodeNameEnum5["Dropdown"] = "Dropdown";
  NodeNameEnum5["DropdownSection"] = "DropdownSection";
  NodeNameEnum5["DropdownItem"] = "DropdownItem";
  NodeNameEnum5["ActionPanel"] = "ActionPanel";
  NodeNameEnum5["Action"] = "Action";
  NodeNameEnum5["ActionPanelSection"] = "ActionPanelSection";
  NodeNameEnum5["ActionPanelSubmenu"] = "ActionPanelSubmenu";
  return NodeNameEnum5;
})(NodeNameEnum || {});
var NodeName = enum_(NodeNameEnum);
var IconEnum = ((IconEnum2) => {
  IconEnum2["Iconify"] = "iconify";
  IconEnum2["RemoteUrl"] = "remote-url";
  IconEnum2["Svg"] = "svg";
  IconEnum2["Base64PNG"] = "base64-png";
  IconEnum2["Text"] = "text";
  return IconEnum2;
})(IconEnum || {});
var IconType = enum_(IconEnum);
var Icon = object({
  type: IconType,
  value: string()
});
var IconNode = object({
  nodeName: NodeName,
  ...Icon.entries
});
var action_exports = {};
__export(action_exports, {
  Action: () => Action,
  ActionPanel: () => ActionPanel
});
var Action = object({
  nodeName: NodeName,
  icon: optional(Icon),
  title: string(),
  value: optional(string())
});
var ActionPanel = object({
  nodeName: NodeName,
  title: optional(string()),
  items: array(union([
    Action
  ]))
});
var EmptyView = object({
  nodeName: NodeName,
  title: optional(string()),
  description: optional(string()),
  icon: optional(Icon)
});
var DropdownItem = object({
  nodeName: NodeName,
  title: string(),
  value: string(),
  icon: optional(Icon),
  keywords: optional(array(string()))
});
var DropdownSection = object({
  nodeName: NodeName,
  title: string(),
  items: array(DropdownItem)
});
var Dropdown = object({
  nodeName: NodeName,
  tooltip: string(),
  sections: array(DropdownSection),
  defaultValue: string()
});
var ItemAccessory = object({
  nodeName: NodeName,
  tag: optional(union([
    string(),
    object({
      color: Color,
      text: string()
    })
  ])),
  text: optional(union([string(), object({ color: Color, text: string() })])),
  date: optional(union([date(), object({ color: Color, text: date() })])),
  icon: optional(Icon),
  tooltip: optional(string())
});
var ItemDetailMetadataLabel = object({
  nodeName: NodeName,
  title: string(),
  icon: optional(Icon),
  text: optional(union([
    string(),
    object({
      color: Color,
      text: string()
    })
  ]))
});
var ItemDetailMetadataLink = object({
  nodeName: NodeName,
  title: string(),
  text: string(),
  url: string()
});
var ItemDetailMetadataTagListItem = object({
  nodeName: NodeName,
  text: optional(string()),
  color: optional(Color),
  icon: optional(Icon)
});
var ItemDetailMetadataTagList = object({
  nodeName: NodeName,
  title: string(),
  tags: array(ItemDetailMetadataTagListItem)
});
var ItemDetailMetadataSeparator = object({
  nodeName: NodeName
});
var ItemDetailMetadata = object({
  nodeName: NodeName,
  items: array(union([
    ItemDetailMetadataLabel,
    ItemDetailMetadataLink,
    ItemDetailMetadataTagList,
    ItemDetailMetadataSeparator
  ]))
});
var ItemDetail = object({
  nodeName: NodeName,
  markdown: optional(string()),
  metadata: optional(ItemDetailMetadata)
});
var Item = object({
  nodeName: NodeName,
  title: string(),
  subTitle: optional(string()),
  accessories: optional(array(ItemAccessory)),
  value: string(),
  defaultAction: optional(string()),
  actions: optional(ActionPanel),
  detail: optional(ItemDetail),
  icon: optional(Icon),
  keywords: optional(array(string()))
});
var Section = object({
  nodeName: NodeName,
  title: optional(string()),
  subtitle: optional(string()),
  items: array(Item)
});
var List = object({
  nodeName: NodeName,
  sections: optional(array(Section)),
  items: optional(array(Item))
});
var AppInfo = object({
  name: string(),
  icon_path: nullable(string()),
  app_path_exe: nullable(string()),
  app_desktop_path: string()
});
var ExtensionLabelMap = record(string("Window label"), object({
  path: string("Path to the extension")
}));
var Ext = object({
  extId: number(),
  identifier: string(),
  version: string(),
  enabled: boolean(),
  installed_at: string()
});
var CmdTypeEnum = ((CmdTypeEnum2) => {
  CmdTypeEnum2["Iframe"] = "iframe";
  CmdTypeEnum2["Worker"] = "worker";
  CmdTypeEnum2["QuickLink"] = "quick_link";
  CmdTypeEnum2["Remote"] = "remote";
  return CmdTypeEnum2;
})(CmdTypeEnum || {});
var CmdType = enum_(CmdTypeEnum);
var ExtCmd = object({
  cmdId: number(),
  extId: number(),
  name: string(),
  type: CmdType,
  data: string(),
  alias: optional(string()),
  hotkey: optional(string()),
  enabled: boolean()
});
var ExtData = object({
  dataId: number(),
  extId: number(),
  dataType: string(),
  data: optional(string()),
  searchText: optional(string()),
  createdAt: date(),
  updatedAt: date()
});
var SysCommand = object({
  name: string(),
  value: string(),
  icon: nullable(Icon),
  keywords: nullable(array(string())),
  function: function_(),
  confirmRequired: boolean()
});
var SQLSortOrderEnum = ((SQLSortOrderEnum2) => {
  SQLSortOrderEnum2["Asc"] = "ASC";
  SQLSortOrderEnum2["Desc"] = "DESC";
  return SQLSortOrderEnum2;
})(SQLSortOrderEnum || {});
var SQLSortOrder = enum_(SQLSortOrderEnum);
var SystemPermissionSchema = union([
  literal("system:volumn"),
  literal("system:boot"),
  literal("system:disk"),
  literal("system:apps"),
  literal("system:fs"),
  literal("system:ui")
]);
var AllJarvisPermission = union([
  AllPermissionSchema,
  SystemPermissionSchema
]);

// /Users/hacker/Dev/projects/Jarvis/vendors/tauri-api-adapter/packages/tauri-api-adapter/node_modules/@huakunshen/comlink/dist/esm/comlink.mjs
var isAllowedOrigin = function(allowedOrigins, origin) {
  for (const allowedOrigin of allowedOrigins) {
    if (origin === allowedOrigin || allowedOrigin === "*") {
      return true;
    }
    if (allowedOrigin instanceof RegExp && allowedOrigin.test(origin)) {
      return true;
    }
  }
  return false;
};
var expose = function(obj, ep = globalThis, allowedOrigins = ["*"]) {
  ep.addEventListener("message", function callback(ev) {
    if (!ev || !ev.data) {
      return;
    }
    if (!isAllowedOrigin(allowedOrigins, ev.origin)) {
      console.warn(`Invalid origin '${ev.origin}' for comlink proxy`);
      return;
    }
    const { id, type, path } = Object.assign({ path: [] }, ev.data);
    const argumentList = (ev.data.argumentList || []).map(fromWireValue);
    let returnValue;
    try {
      const parent = path.slice(0, -1).reduce((obj2, prop) => obj2[prop], obj);
      const rawValue = path.reduce((obj2, prop) => obj2[prop], obj);
      switch (type) {
        case "GET":
          {
            returnValue = rawValue;
          }
          break;
        case "SET":
          {
            parent[path.slice(-1)[0]] = fromWireValue(ev.data.value);
            returnValue = true;
          }
          break;
        case "APPLY":
          {
            returnValue = rawValue.apply(parent, argumentList);
          }
          break;
        case "CONSTRUCT":
          {
            const value = new rawValue(...argumentList);
            returnValue = proxy(value);
          }
          break;
        case "ENDPOINT":
          {
            const { port1, port2 } = new MessageChannel;
            expose(obj, port2);
            returnValue = transfer(port1, [port1]);
          }
          break;
        case "RELEASE":
          {
            returnValue = undefined;
          }
          break;
        default:
          return;
      }
    } catch (value) {
      returnValue = { value, [throwMarker]: 0 };
    }
    Promise.resolve(returnValue).catch((value) => {
      return { value, [throwMarker]: 0 };
    }).then((returnValue2) => {
      const [wireValue, transferables] = toWireValue(returnValue2);
      ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
      if (type === "RELEASE") {
        ep.removeEventListener("message", callback);
        closeEndPoint(ep);
        if (finalizer in obj && typeof obj[finalizer] === "function") {
          obj[finalizer]();
        }
      }
    }).catch((error) => {
      const [wireValue, transferables] = toWireValue({
        value: new TypeError("Unserializable return value"),
        [throwMarker]: 0
      });
      ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
    });
  });
  if (ep.start) {
    ep.start();
  }
};
var isMessagePort = function(endpoint) {
  return endpoint.constructor.name === "MessagePort";
};
var closeEndPoint = function(endpoint) {
  if (isMessagePort(endpoint))
    endpoint.close();
};
var wrap = function(ep, target) {
  return createProxy(ep, [], target);
};
var throwIfProxyReleased = function(isReleased) {
  if (isReleased) {
    throw new Error("Proxy has been released and is not useable");
  }
};
var releaseEndpoint = function(ep) {
  return requestResponseMessage(ep, {
    type: "RELEASE"
  }).then(() => {
    closeEndPoint(ep);
  });
};
var registerProxy = function(proxy, ep) {
  const newCount = (proxyCounter.get(ep) || 0) + 1;
  proxyCounter.set(ep, newCount);
  if (proxyFinalizers) {
    proxyFinalizers.register(proxy, ep, proxy);
  }
};
var unregisterProxy = function(proxy) {
  if (proxyFinalizers) {
    proxyFinalizers.unregister(proxy);
  }
};
var createProxy = function(ep, path = [], target = function() {
}) {
  let isProxyReleased = false;
  const proxy = new Proxy(target, {
    get(_target, prop) {
      throwIfProxyReleased(isProxyReleased);
      if (prop === releaseProxy) {
        return () => {
          unregisterProxy(proxy);
          releaseEndpoint(ep);
          isProxyReleased = true;
        };
      }
      if (prop === "then") {
        if (path.length === 0) {
          return { then: () => proxy };
        }
        const r = requestResponseMessage(ep, {
          type: "GET",
          path: path.map((p) => p.toString())
        }).then(fromWireValue);
        return r.then.bind(r);
      }
      return createProxy(ep, [...path, prop]);
    },
    set(_target, prop, rawValue) {
      throwIfProxyReleased(isProxyReleased);
      const [value, transferables] = toWireValue(rawValue);
      return requestResponseMessage(ep, {
        type: "SET",
        path: [...path, prop].map((p) => p.toString()),
        value
      }, transferables).then(fromWireValue);
    },
    apply(_target, _thisArg, rawArgumentList) {
      throwIfProxyReleased(isProxyReleased);
      const last = path[path.length - 1];
      if (last === createEndpoint) {
        return requestResponseMessage(ep, {
          type: "ENDPOINT"
        }).then(fromWireValue);
      }
      if (last === "bind") {
        return createProxy(ep, path.slice(0, -1));
      }
      const [argumentList, transferables] = processArguments(rawArgumentList);
      return requestResponseMessage(ep, {
        type: "APPLY",
        path: path.map((p) => p.toString()),
        argumentList
      }, transferables).then(fromWireValue);
    },
    construct(_target, rawArgumentList) {
      throwIfProxyReleased(isProxyReleased);
      const [argumentList, transferables] = processArguments(rawArgumentList);
      return requestResponseMessage(ep, {
        type: "CONSTRUCT",
        path: path.map((p) => p.toString()),
        argumentList
      }, transferables).then(fromWireValue);
    }
  });
  registerProxy(proxy, ep);
  return proxy;
};
var myFlat = function(arr) {
  return Array.prototype.concat.apply([], arr);
};
var processArguments = function(argumentList) {
  const processed = argumentList.map(toWireValue);
  return [processed.map((v) => v[0]), myFlat(processed.map((v) => v[1]))];
};
var transfer = function(obj, transfers) {
  transferCache.set(obj, transfers);
  return obj;
};
var proxy = function(obj) {
  return Object.assign(obj, { [proxyMarker]: true });
};
var windowEndpoint = function(w, context = globalThis, targetOrigin = "*") {
  return {
    postMessage: (msg, transferables) => w.postMessage(msg, targetOrigin, transferables),
    addEventListener: context.addEventListener.bind(context),
    removeEventListener: context.removeEventListener.bind(context)
  };
};
var toWireValue = function(value) {
  for (const [name, handler] of transferHandlers) {
    if (handler.canHandle(value)) {
      const [serializedValue, transferables] = handler.serialize(value);
      return [
        {
          type: "HANDLER",
          name,
          value: serializedValue
        },
        transferables
      ];
    }
  }
  return [
    {
      type: "RAW",
      value
    },
    transferCache.get(value) || []
  ];
};
var fromWireValue = function(value) {
  switch (value.type) {
    case "HANDLER":
      return transferHandlers.get(value.name).deserialize(value.value);
    case "RAW":
      return value.value;
  }
};
var requestResponseMessage = function(ep, msg, transfers) {
  return new Promise((resolve) => {
    const id = generateUUID();
    ep.addEventListener("message", function l(ev) {
      if (!ev.data || !ev.data.id || ev.data.id !== id) {
        return;
      }
      ep.removeEventListener("message", l);
      resolve(ev.data);
    });
    if (ep.start) {
      ep.start();
    }
    ep.postMessage(Object.assign({ id }, msg), transfers);
  });
};
var generateUUID = function() {
  return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
};
var proxyMarker = Symbol("Comlink.proxy");
var createEndpoint = Symbol("Comlink.endpoint");
var releaseProxy = Symbol("Comlink.releaseProxy");
var finalizer = Symbol("Comlink.finalizer");
var throwMarker = Symbol("Comlink.thrown");
var isObject = (val) => typeof val === "object" && val !== null || typeof val === "function";
var proxyTransferHandler = {
  canHandle: (val) => isObject(val) && val[proxyMarker],
  serialize(obj) {
    const { port1, port2 } = new MessageChannel;
    expose(obj, port1);
    return [port2, [port2]];
  },
  deserialize(port) {
    port.start();
    return wrap(port);
  }
};
var throwTransferHandler = {
  canHandle: (value) => isObject(value) && (throwMarker in value),
  serialize({ value }) {
    let serialized;
    if (value instanceof Error) {
      serialized = {
        isError: true,
        value: {
          message: value.message,
          name: value.name,
          stack: value.stack
        }
      };
    } else {
      serialized = { isError: false, value };
    }
    return [serialized, []];
  },
  deserialize(serialized) {
    if (serialized.isError) {
      throw Object.assign(new Error(serialized.value.message), serialized.value);
    }
    throw serialized.value;
  }
};
var transferHandlers = new Map([
  ["proxy", proxyTransferHandler],
  ["throw", throwTransferHandler]
]);
var proxyCounter = new WeakMap;
var proxyFinalizers = "FinalizationRegistry" in globalThis && new FinalizationRegistry((ep) => {
  const newCount = (proxyCounter.get(ep) || 0) - 1;
  proxyCounter.set(ep, newCount);
  if (newCount === 0) {
    releaseEndpoint(ep);
  }
});
var transferCache = new WeakMap;

// /Users/hacker/Dev/projects/Jarvis/node_modules/.pnpm/tauri-plugin-clipboard-api@2.1.3/node_modules/@tauri-apps/api/core.js
var transformCallback = function(callback, once = false) {
  return window.__TAURI_INTERNALS__.transformCallback(callback, once);
};
async function invoke(cmd, args = {}, options) {
  return window.__TAURI_INTERNALS__.invoke(cmd, args, options);
}
var _Channel_onmessage;
var _Channel_nextMessageId;
var _Channel_pendingMessages;
var _Resource_rid;
_Channel_onmessage = new WeakMap, _Channel_nextMessageId = new WeakMap, _Channel_pendingMessages = new WeakMap;
_Resource_rid = new WeakMap;

// /Users/hacker/Dev/projects/Jarvis/node_modules/.pnpm/tauri-plugin-clipboard-api@2.1.3/node_modules/@tauri-apps/api/event.js
async function _unlisten(event, eventId) {
  await invoke("plugin:event|unlisten", {
    event,
    eventId
  });
}
async function listen(event, handler, options) {
  var _a;
  const target = typeof (options === null || options === undefined ? undefined : options.target) === "string" ? { kind: "AnyLabel", label: options.target } : (_a = options === null || options === undefined ? undefined : options.target) !== null && _a !== undefined ? _a : { kind: "Any" };
  return invoke("plugin:event|listen", {
    event,
    target,
    handler: transformCallback(handler)
  }).then((eventId) => {
    return async () => _unlisten(event, eventId);
  });
}
async function emit(event, payload) {
  await invoke("plugin:event|emit", {
    event,
    payload
  });
}
var TauriEvent;
(function(TauriEvent2) {
  TauriEvent2["WINDOW_RESIZED"] = "tauri://resize";
  TauriEvent2["WINDOW_MOVED"] = "tauri://move";
  TauriEvent2["WINDOW_CLOSE_REQUESTED"] = "tauri://close-requested";
  TauriEvent2["WINDOW_DESTROYED"] = "tauri://destroyed";
  TauriEvent2["WINDOW_FOCUS"] = "tauri://focus";
  TauriEvent2["WINDOW_BLUR"] = "tauri://blur";
  TauriEvent2["WINDOW_SCALE_FACTOR_CHANGED"] = "tauri://scale-change";
  TauriEvent2["WINDOW_THEME_CHANGED"] = "tauri://theme-changed";
  TauriEvent2["WINDOW_CREATED"] = "tauri://window-created";
  TauriEvent2["WEBVIEW_CREATED"] = "tauri://webview-created";
  TauriEvent2["DRAG"] = "tauri://drag";
  TauriEvent2["DROP"] = "tauri://drop";
  TauriEvent2["DROP_OVER"] = "tauri://drop-over";
  TauriEvent2["DROP_CANCELLED"] = "tauri://drag-cancelled";
})(TauriEvent || (TauriEvent = {}));

// /Users/hacker/Dev/projects/Jarvis/vendors/tauri-api-adapter/packages/tauri-api-adapter/node_modules/tauri-plugin-clipboard-api/dist-js/index.js
var hasText = function() {
  return invoke(HAS_TEXT_COMMAND);
};
var hasHTML = function() {
  return invoke(HAS_HTML_COMMAND);
};
var hasRTF = function() {
  return invoke(HAS_RTF_COMMAND);
};
var hasImage = function() {
  return invoke(HAS_IMAGE_COMMAND);
};
var hasFiles = function() {
  return invoke(HAS_FILES_COMMAND);
};
var writeText = function(text) {
  return invoke(WRITE_TEXT_COMMAND, { text });
};
var writeHtml = function(html) {
  return invoke(WRITE_HTML_COMMAND, { html });
};
var writeHtmlAndText = function(html, text) {
  return invoke(WRITE_HTML_AND_TEXT_COMMAND, { html, text });
};
var writeRtf = function(rtf) {
  return invoke(WRITE_RTF_COMMAND, { rtf });
};
var writeFilesURIs = function(filesUris) {
  return invoke(WRITE_FILES_URIS_COMMAND, { filesUris });
};
var writeFiles = function(filesPaths) {
  return invoke(WRITE_FILES_COMMAND, { filesPaths });
};
var clear = function() {
  return invoke(CLEAR_COMMAND);
};
var readText = function() {
  return invoke(READ_TEXT_COMMAND);
};
var readHtml = function() {
  return invoke(READ_HTML_COMMAND);
};
var readRtf = function() {
  return invoke(READ_RTF_COMMAND);
};
var readFiles = function() {
  return invoke(READ_FILES_COMMAND);
};
var readFilesURIs = function() {
  return invoke(READ_FILES_URIS_COMMAND);
};
var readImageBase64 = function() {
  return invoke(READ_IMAGE_BASE64_COMMAND);
};
var readImageBinary = function(format) {
  return invoke(READ_IMAGE_BINARY_COMMAND).then((img_arr) => {
    switch (format) {
      case "int_array":
        return img_arr;
      case "Uint8Array":
        return new Uint8Array(img_arr);
      case "Blob":
        return new Blob([new Uint8Array(img_arr)]);
      default:
        return img_arr;
    }
  });
};
var convertIntArrToUint8Array = function(intArr) {
  return new Uint8Array(intArr);
};
var convertUint8ArrayToBlob = function(uintArr) {
  return new Blob([uintArr]);
};
var readImageObjectURL = function() {
  return readImageBinary("Blob").then((blob) => {
    return URL.createObjectURL(blob);
  });
};
var writeImageBase64 = function(base64) {
  return invoke(WRITE_IMAGE_BASE64_COMMAND, { base64Image: base64 });
};
var writeImageBinary = function(bytes) {
  return invoke(WRITE_IMAGE_BINARY_COMMAND, { bytes });
};
var startBruteForceTextMonitor = function(delay = 500) {
  let prevText = "";
  let active = true;
  setTimeout(async function x() {
    try {
      const text = await readText();
      if (prevText !== text) {
        await emit(TEXT_CHANGED, { value: text });
      }
      prevText = text;
    } catch (error) {
    }
    if (active)
      setTimeout(x, delay);
  }, delay);
  return function() {
    active = false;
  };
};
var startBruteForceImageMonitor = function(delay = 1000) {
  let prevImg = "";
  let active = true;
  setTimeout(async function x() {
    try {
      const img = await readImageBase64();
      if (prevImg !== img) {
        await emit(IMAGE_CHANGED, { value: img });
      }
      prevImg = img;
    } catch (error) {
    }
    if (active)
      setTimeout(x, delay);
  }, delay);
  return function() {
    active = false;
  };
};
var getAvailableTypes = function() {
  return invoke(AVAILABLE_TYPES_COMMAND);
};
var listenToClipboard = function(listenTypes = {
  text: true,
  html: true,
  rtf: true,
  image: true,
  imageBinary: false,
  files: true
}) {
  return listen(MONITOR_UPDATE_EVENT, async (e) => {
    if (e.payload === "clipboard update") {
      const hasData = await Promise.all([
        hasFiles(),
        hasImage(),
        hasHTML(),
        hasRTF(),
        hasText()
      ]);
      const flags = {
        files: hasData[0],
        image: hasData[1],
        imageBinary: hasData[1],
        html: hasData[2],
        rtf: hasData[3],
        text: hasData[4]
      };
      await emit(SOMETHING_CHANGED, flags);
      if (listenTypes.files && flags.files) {
        const files = await readFiles();
        if (files && files.length > 0) {
          await emit(FILES_CHANGED, { value: files });
        }
        return;
      }
      if (listenTypes.image && flags.image) {
        const img = await readImageBase64();
        if (img)
          await emit(IMAGE_CHANGED, { value: img });
      }
      if (listenTypes.imageBinary && flags.imageBinary) {
        const img = await readImageBinary("int_array");
        if (img)
          await emit(IMAGE_BINARY_CHANGED, { value: img });
      }
      if (listenTypes.html && flags.html) {
        await emit(HTML_CHANGED, { value: await readHtml() });
      }
      if (listenTypes.rtf && flags.rtf) {
        await emit(RTF_CHANGED, { value: await readRtf() });
      }
      if (listenTypes.text && flags.text) {
        await emit(TEXT_CHANGED, { value: await readText() });
      }
    }
  });
};
var onClipboardUpdate = function(cb) {
  return listen(MONITOR_UPDATE_EVENT, cb);
};
async function onTextUpdate(cb) {
  return await listen(TEXT_CHANGED, (event2) => {
    const text = parse(ClipboardChangedPayloadSchema, event2.payload).value;
    cb(text);
  });
}
var onSomethingUpdate = function(cb) {
  return listen(SOMETHING_CHANGED, (event2) => {
    cb(event2.payload);
  });
};
var onHTMLUpdate = function(cb) {
  return listen(HTML_CHANGED, (event2) => {
    const text = parse(ClipboardChangedPayloadSchema, event2.payload).value;
    cb(text);
  });
};
var onRTFUpdate = function(cb) {
  return listen(RTF_CHANGED, (event2) => {
    const text = parse(ClipboardChangedPayloadSchema, event2.payload).value;
    cb(text);
  });
};
var onFilesUpdate = function(cb) {
  return listen(FILES_CHANGED, (event2) => {
    const files = parse(ClipboardChangedFilesPayloadSchema, event2.payload).value;
    cb(files);
  });
};
var onImageUpdate = function(cb) {
  return listen(IMAGE_CHANGED, (event2) => {
    const base64ImageStr = parse(ClipboardChangedPayloadSchema, event2.payload).value;
    cb(base64ImageStr);
  });
};
var onImageBinaryUpdate = function(cb) {
  return listen(IMAGE_BINARY_CHANGED, (event2) => {
    cb(parse(ClipboardBinaryChangedPayloadSchema, event2.payload).value);
  });
};
var isMonitorRunning = function() {
  return invoke(IS_MONITOR_RUNNING_COMMAND).then((res) => parse(boolean(), res));
};
var startMonitor = function() {
  return invoke(START_MONITOR_COMMAND);
};
var stopMonitor = function() {
  return invoke(STOP_MONITOR_COMMAND);
};
async function listenToMonitorStatusUpdate(cb) {
  return await listen(CLIPBOARD_MONITOR_STATUS_UPDATE_EVENT, (event2) => {
    const newStatus = parse(boolean(), event2.payload);
    cb(newStatus);
  });
}
var startListening = function(listenTypes = {
  text: true,
  html: true,
  rtf: true,
  image: true,
  imageBinary: false,
  files: true
}) {
  return startMonitor().then(() => listenToClipboard(listenTypes)).then((unlistenClipboard) => {
    return async () => {
      unlistenClipboard();
      await stopMonitor();
    };
  });
};
var START_MONITOR_COMMAND = "plugin:clipboard|start_monitor";
var STOP_MONITOR_COMMAND = "plugin:clipboard|stop_monitor";
var SOMETHING_CHANGED = "plugin:clipboard://something-changed";
var TEXT_CHANGED = "plugin:clipboard://text-changed";
var HTML_CHANGED = "plugin:clipboard://html-changed";
var RTF_CHANGED = "plugin:clipboard://rtf-changed";
var FILES_CHANGED = "plugin:clipboard://files-changed";
var IMAGE_CHANGED = "plugin:clipboard://image-changed";
var IMAGE_BINARY_CHANGED = "plugin:clipboard://image-changed-binary";
var IS_MONITOR_RUNNING_COMMAND = "plugin:clipboard|is_monitor_running";
var HAS_TEXT_COMMAND = "plugin:clipboard|has_text";
var HAS_IMAGE_COMMAND = "plugin:clipboard|has_image";
var HAS_HTML_COMMAND = "plugin:clipboard|has_html";
var HAS_RTF_COMMAND = "plugin:clipboard|has_rtf";
var HAS_FILES_COMMAND = "plugin:clipboard|has_files";
var AVAILABLE_TYPES_COMMAND = "plugin:clipboard|available_types";
var WRITE_TEXT_COMMAND = "plugin:clipboard|write_text";
var WRITE_HTML_COMMAND = "plugin:clipboard|write_html";
var WRITE_HTML_AND_TEXT_COMMAND = "plugin:clipboard|write_html_and_text";
var WRITE_RTF_COMMAND = "plugin:clipboard|write_rtf";
var WRITE_FILES_URIS_COMMAND = "plugin:clipboard|write_files_uris";
var WRITE_FILES_COMMAND = "plugin:clipboard|write_files";
var CLEAR_COMMAND = "plugin:clipboard|clear";
var READ_TEXT_COMMAND = "plugin:clipboard|read_text";
var READ_HTML_COMMAND = "plugin:clipboard|read_html";
var READ_RTF_COMMAND = "plugin:clipboard|read_rtf";
var READ_FILES_COMMAND = "plugin:clipboard|read_files";
var READ_FILES_URIS_COMMAND = "plugin:clipboard|read_files_uris";
var READ_IMAGE_BINARY_COMMAND = "plugin:clipboard|read_image_binary";
var READ_IMAGE_BASE64_COMMAND = "plugin:clipboard|read_image_base64";
var WRITE_IMAGE_BINARY_COMMAND = "plugin:clipboard|write_image_binary";
var WRITE_IMAGE_BASE64_COMMAND = "plugin:clipboard|write_image_base64";
var CLIPBOARD_MONITOR_STATUS_UPDATE_EVENT = "plugin:clipboard://clipboard-monitor/status";
var MONITOR_UPDATE_EVENT = "plugin:clipboard://clipboard-monitor/update";
var ClipboardChangedPayloadSchema = object({ value: string() });
var ClipboardBinaryChangedPayloadSchema = object({
  value: array(number())
});
var ClipboardChangedFilesPayloadSchema = object({
  value: array(string())
});
var api = Object.freeze({
  __proto__: null,
  AVAILABLE_TYPES_COMMAND,
  CLEAR_COMMAND,
  CLIPBOARD_MONITOR_STATUS_UPDATE_EVENT,
  ClipboardBinaryChangedPayloadSchema,
  ClipboardChangedFilesPayloadSchema,
  ClipboardChangedPayloadSchema,
  FILES_CHANGED,
  HAS_FILES_COMMAND,
  HAS_HTML_COMMAND,
  HAS_IMAGE_COMMAND,
  HAS_RTF_COMMAND,
  HAS_TEXT_COMMAND,
  HTML_CHANGED,
  IMAGE_BINARY_CHANGED,
  IMAGE_CHANGED,
  IS_MONITOR_RUNNING_COMMAND,
  MONITOR_UPDATE_EVENT,
  READ_FILES_COMMAND,
  READ_FILES_URIS_COMMAND,
  READ_HTML_COMMAND,
  READ_IMAGE_BASE64_COMMAND,
  READ_IMAGE_BINARY_COMMAND,
  READ_RTF_COMMAND,
  READ_TEXT_COMMAND,
  RTF_CHANGED,
  SOMETHING_CHANGED,
  START_MONITOR_COMMAND,
  STOP_MONITOR_COMMAND,
  TEXT_CHANGED,
  WRITE_FILES_COMMAND,
  WRITE_FILES_URIS_COMMAND,
  WRITE_HTML_AND_TEXT_COMMAND,
  WRITE_HTML_COMMAND,
  WRITE_IMAGE_BASE64_COMMAND,
  WRITE_IMAGE_BINARY_COMMAND,
  WRITE_RTF_COMMAND,
  WRITE_TEXT_COMMAND,
  clear,
  convertIntArrToUint8Array,
  convertUint8ArrayToBlob,
  getAvailableTypes,
  hasFiles,
  hasHTML,
  hasImage,
  hasRTF,
  hasText,
  isMonitorRunning,
  listenToClipboard,
  listenToMonitorStatusUpdate,
  onClipboardUpdate,
  onFilesUpdate,
  onHTMLUpdate,
  onImageBinaryUpdate,
  onImageUpdate,
  onRTFUpdate,
  onSomethingUpdate,
  onTextUpdate,
  readFiles,
  readFilesURIs,
  readHtml,
  readImageBase64,
  readImageBinary,
  readImageObjectURL,
  readRtf,
  readText,
  startBruteForceImageMonitor,
  startBruteForceTextMonitor,
  startListening,
  startMonitor,
  stopMonitor,
  writeFiles,
  writeFilesURIs,
  writeHtml,
  writeHtmlAndText,
  writeImageBase64,
  writeImageBinary,
  writeRtf,
  writeText
});

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/dist/comlink.js
var getWindowApiClient = function(targetWindow) {
  return wrap(windowEndpoint(targetWindow));
};
var getWorkerApiClient = function() {
  return wrap(self);
};

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/dist/client.js
var hasWindow = () => typeof window !== "undefined";
var isInWorker = () => !hasWindow();
var isInIframe = () => hasWindow() && window !== window.parent;
var isMain = () => !isInWorker() && !isInIframe() && window === window.parent;
var getDefaultClientAPI = () => isInIframe() ? getWindowApiClient(window.parent) : getWorkerApiClient();

// ../../node_modules/.pnpm/@tauri-apps+api@2.0.0-beta.15/node_modules/@tauri-apps/api/external/tslib/tslib.es6.js
var __classPrivateFieldGet2 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet2 = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};

// /Users/hacker/Dev/projects/Jarvis/node_modules/.pnpm/@tauri-apps+plugin-os@2.0.0-beta.7/node_modules/@tauri-apps/api/core.js
var transformCallback2 = function(callback, once = false) {
  return window.__TAURI_INTERNALS__.transformCallback(callback, once);
};
async function addPluginListener(plugin, event2, cb) {
  const handler = new Channel;
  handler.onmessage = cb;
  return invoke2(`plugin:${plugin}|register_listener`, { event: event2, handler }).then(() => new PluginListener(plugin, event2, handler.id));
}
async function invoke2(cmd, args = {}, options) {
  return window.__TAURI_INTERNALS__.invoke(cmd, args, options);
}
var _Channel_onmessage2;
var _Channel_nextMessageId2;
var _Channel_pendingMessages2;
var _Resource_rid2;

class Channel {
  constructor() {
    this.__TAURI_CHANNEL_MARKER__ = true;
    _Channel_onmessage2.set(this, () => {
    });
    _Channel_nextMessageId2.set(this, 0);
    _Channel_pendingMessages2.set(this, {});
    this.id = transformCallback2(({ message, id }) => {
      if (id === __classPrivateFieldGet2(this, _Channel_nextMessageId2, "f")) {
        __classPrivateFieldSet2(this, _Channel_nextMessageId2, id + 1, "f");
        __classPrivateFieldGet2(this, _Channel_onmessage2, "f").call(this, message);
        const pendingMessageIds = Object.keys(__classPrivateFieldGet2(this, _Channel_pendingMessages2, "f"));
        if (pendingMessageIds.length > 0) {
          let nextId = id + 1;
          for (const pendingId of pendingMessageIds.sort()) {
            if (parseInt(pendingId) === nextId) {
              const message2 = __classPrivateFieldGet2(this, _Channel_pendingMessages2, "f")[pendingId];
              delete __classPrivateFieldGet2(this, _Channel_pendingMessages2, "f")[pendingId];
              __classPrivateFieldGet2(this, _Channel_onmessage2, "f").call(this, message2);
              nextId += 1;
            } else {
              break;
            }
          }
          __classPrivateFieldSet2(this, _Channel_nextMessageId2, nextId, "f");
        }
      } else {
        __classPrivateFieldGet2(this, _Channel_pendingMessages2, "f")[id.toString()] = message;
      }
    });
  }
  set onmessage(handler) {
    __classPrivateFieldSet2(this, _Channel_onmessage2, handler, "f");
  }
  get onmessage() {
    return __classPrivateFieldGet2(this, _Channel_onmessage2, "f");
  }
  toJSON() {
    return `__CHANNEL__:${this.id}`;
  }
}
_Channel_onmessage2 = new WeakMap, _Channel_nextMessageId2 = new WeakMap, _Channel_pendingMessages2 = new WeakMap;

class PluginListener {
  constructor(plugin, event2, channelId) {
    this.plugin = plugin;
    this.event = event2;
    this.channelId = channelId;
  }
  async unregister() {
    return invoke2(`plugin:${this.plugin}|remove_listener`, {
      event: this.event,
      channelId: this.channelId
    });
  }
}

class Resource {
  get rid() {
    return __classPrivateFieldGet2(this, _Resource_rid2, "f");
  }
  constructor(rid) {
    _Resource_rid2.set(this, undefined);
    __classPrivateFieldSet2(this, _Resource_rid2, rid, "f");
  }
  async close() {
    return invoke2("plugin:resources|close", {
      rid: this.rid
    });
  }
}
_Resource_rid2 = new WeakMap;

// /Users/hacker/Dev/projects/Jarvis/vendors/tauri-api-adapter/packages/tauri-api-adapter/node_modules/@tauri-apps/api/path.js
async function appConfigDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.AppConfig
  });
}
async function appDataDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.AppData
  });
}
async function appLocalDataDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.AppLocalData
  });
}
async function appCacheDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.AppCache
  });
}
async function audioDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Audio
  });
}
async function cacheDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Cache
  });
}
async function configDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Config
  });
}
async function dataDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Data
  });
}
async function desktopDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Desktop
  });
}
async function documentDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Document
  });
}
async function downloadDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Download
  });
}
async function executableDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Executable
  });
}
async function fontDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Font
  });
}
async function homeDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Home
  });
}
async function localDataDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.LocalData
  });
}
async function pictureDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Picture
  });
}
async function publicDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Public
  });
}
async function resourceDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Resource
  });
}
async function resolveResource(resourcePath) {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Resource,
    path: resourcePath
  });
}
async function runtimeDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Runtime
  });
}
async function templateDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Template
  });
}
async function videoDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Video
  });
}
async function appLogDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.AppLog
  });
}
async function tempDir() {
  return invoke2("plugin:path|resolve_directory", {
    directory: BaseDirectory.Temp
  });
}
var sep = function() {
  return window.__TAURI_INTERNALS__.plugins.path.sep;
};
var delimiter = function() {
  return window.__TAURI_INTERNALS__.plugins.path.delimiter;
};
async function resolve(...paths) {
  return invoke2("plugin:path|resolve", { paths });
}
async function normalize(path) {
  return invoke2("plugin:path|normalize", { path });
}
async function join(...paths) {
  return invoke2("plugin:path|join", { paths });
}
async function dirname(path) {
  return invoke2("plugin:path|dirname", { path });
}
async function extname(path) {
  return invoke2("plugin:path|extname", { path });
}
async function basename(path, ext) {
  return invoke2("plugin:path|basename", { path, ext });
}
async function isAbsolute(path) {
  return invoke2("plugin:path|isAbsolute", { path });
}
var BaseDirectory;
(function(BaseDirectory2) {
  BaseDirectory2[BaseDirectory2["Audio"] = 1] = "Audio";
  BaseDirectory2[BaseDirectory2["Cache"] = 2] = "Cache";
  BaseDirectory2[BaseDirectory2["Config"] = 3] = "Config";
  BaseDirectory2[BaseDirectory2["Data"] = 4] = "Data";
  BaseDirectory2[BaseDirectory2["LocalData"] = 5] = "LocalData";
  BaseDirectory2[BaseDirectory2["Document"] = 6] = "Document";
  BaseDirectory2[BaseDirectory2["Download"] = 7] = "Download";
  BaseDirectory2[BaseDirectory2["Picture"] = 8] = "Picture";
  BaseDirectory2[BaseDirectory2["Public"] = 9] = "Public";
  BaseDirectory2[BaseDirectory2["Video"] = 10] = "Video";
  BaseDirectory2[BaseDirectory2["Resource"] = 11] = "Resource";
  BaseDirectory2[BaseDirectory2["Temp"] = 12] = "Temp";
  BaseDirectory2[BaseDirectory2["AppConfig"] = 13] = "AppConfig";
  BaseDirectory2[BaseDirectory2["AppData"] = 14] = "AppData";
  BaseDirectory2[BaseDirectory2["AppLocalData"] = 15] = "AppLocalData";
  BaseDirectory2[BaseDirectory2["AppCache"] = 16] = "AppCache";
  BaseDirectory2[BaseDirectory2["AppLog"] = 17] = "AppLog";
  BaseDirectory2[BaseDirectory2["Desktop"] = 18] = "Desktop";
  BaseDirectory2[BaseDirectory2["Executable"] = 19] = "Executable";
  BaseDirectory2[BaseDirectory2["Font"] = 20] = "Font";
  BaseDirectory2[BaseDirectory2["Home"] = 21] = "Home";
  BaseDirectory2[BaseDirectory2["Runtime"] = 22] = "Runtime";
  BaseDirectory2[BaseDirectory2["Template"] = 23] = "Template";
})(BaseDirectory || (BaseDirectory = {}));

// /Users/hacker/Dev/projects/Jarvis/vendors/tauri-api-adapter/packages/tauri-api-adapter/node_modules/@tauri-apps/api/event.js
async function _unlisten2(event2, eventId) {
  await invoke2("plugin:event|unlisten", {
    event: event2,
    eventId
  });
}
async function listen2(event2, handler, options) {
  var _a;
  const target = typeof (options === null || options === undefined ? undefined : options.target) === "string" ? { kind: "AnyLabel", label: options.target } : (_a = options === null || options === undefined ? undefined : options.target) !== null && _a !== undefined ? _a : { kind: "Any" };
  return invoke2("plugin:event|listen", {
    event: event2,
    target,
    handler: transformCallback2(handler)
  }).then((eventId) => {
    return async () => _unlisten2(event2, eventId);
  });
}
async function once(event2, handler, options) {
  return listen2(event2, (eventData) => {
    _unlisten2(event2, eventData.id);
    handler(eventData);
  }, options);
}
async function emit2(event2, payload) {
  await invoke2("plugin:event|emit", {
    event: event2,
    payload
  });
}
async function emitTo(target, event2, payload) {
  const eventTarget = typeof target === "string" ? { kind: "AnyLabel", label: target } : target;
  await invoke2("plugin:event|emit_to", {
    target: eventTarget,
    event: event2,
    payload
  });
}
var TauriEvent2;
(function(TauriEvent3) {
  TauriEvent3["WINDOW_RESIZED"] = "tauri://resize";
  TauriEvent3["WINDOW_MOVED"] = "tauri://move";
  TauriEvent3["WINDOW_CLOSE_REQUESTED"] = "tauri://close-requested";
  TauriEvent3["WINDOW_DESTROYED"] = "tauri://destroyed";
  TauriEvent3["WINDOW_FOCUS"] = "tauri://focus";
  TauriEvent3["WINDOW_BLUR"] = "tauri://blur";
  TauriEvent3["WINDOW_SCALE_FACTOR_CHANGED"] = "tauri://scale-change";
  TauriEvent3["WINDOW_THEME_CHANGED"] = "tauri://theme-changed";
  TauriEvent3["WINDOW_CREATED"] = "tauri://window-created";
  TauriEvent3["WEBVIEW_CREATED"] = "tauri://webview-created";
  TauriEvent3["DRAG_ENTER"] = "tauri://drag-enter";
  TauriEvent3["DRAG_OVER"] = "tauri://drag-over";
  TauriEvent3["DRAG_DROP"] = "tauri://drag-drop";
  TauriEvent3["DRAG_LEAVE"] = "tauri://drag-leave";
})(TauriEvent2 || (TauriEvent2 = {}));

// /Users/hacker/Dev/projects/Jarvis/vendors/tauri-api-adapter/packages/tauri-api-adapter/node_modules/@tauri-apps/plugin-log/dist-js/index.js
async function log(level, message, options) {
  const traces = new Error().stack?.split("\n").map((line2) => line2.split("@"));
  const filtered = traces?.filter(([name, location2]) => {
    return name.length > 0 && location2 !== "[native code]";
  });
  const { file, line, keyValues } = options ?? {};
  let location = filtered?.[0]?.filter((v) => v.length > 0).join("@");
  if (location === "Error") {
    location = "webview::unknown";
  }
  await invoke2("plugin:log|log", {
    level,
    message,
    location,
    file,
    line,
    keyValues
  });
}
async function error(message, options) {
  await log(LogLevel.Error, message, options);
}
async function warn(message, options) {
  await log(LogLevel.Warn, message, options);
}
async function info(message, options) {
  await log(LogLevel.Info, message, options);
}
async function debug(message, options) {
  await log(LogLevel.Debug, message, options);
}
async function trace(message, options) {
  await log(LogLevel.Trace, message, options);
}
var LogLevel;
(function(LogLevel2) {
  LogLevel2[LogLevel2["Trace"] = 1] = "Trace";
  LogLevel2[LogLevel2["Debug"] = 2] = "Debug";
  LogLevel2[LogLevel2["Info"] = 3] = "Info";
  LogLevel2[LogLevel2["Warn"] = 4] = "Warn";
  LogLevel2[LogLevel2["Error"] = 5] = "Error";
})(LogLevel || (LogLevel = {}));

// /Users/hacker/Dev/projects/Jarvis/packages/api/node_modules/@tauri-apps/plugin-os/dist-js/index.js
var eol = function() {
  return window.__TAURI_OS_PLUGIN_INTERNALS__.eol;
};
var platform = function() {
  return window.__TAURI_OS_PLUGIN_INTERNALS__.platform;
};
var version = function() {
  return window.__TAURI_OS_PLUGIN_INTERNALS__.version;
};
var family = function() {
  return window.__TAURI_OS_PLUGIN_INTERNALS__.family;
};
var arch = function() {
  return window.__TAURI_OS_PLUGIN_INTERNALS__.arch;
};
var exeExtension = function() {
  return window.__TAURI_OS_PLUGIN_INTERNALS__.exe_extension;
};
async function locale() {
  return await invoke2("plugin:os|locale");
}
async function hostname() {
  return await invoke2("plugin:os|hostname");
}

// /Users/hacker/Dev/projects/Jarvis/vendors/tauri-api-adapter/packages/tauri-api-adapter/node_modules/@tauri-apps/plugin-upload/dist-js/index.js
async function upload(url, filePath, progressHandler, headers) {
  const ids = new Uint32Array(1);
  window.crypto.getRandomValues(ids);
  const id = ids[0];
  const onProgress = new Channel;
  if (progressHandler) {
    onProgress.onmessage = progressHandler;
  }
  return await invoke2("plugin:upload|upload", {
    id,
    url,
    filePath,
    headers: headers ?? {},
    onProgress
  });
}
async function download(url, filePath, progressHandler, headers) {
  const ids = new Uint32Array(1);
  window.crypto.getRandomValues(ids);
  const id = ids[0];
  const onProgress = new Channel;
  if (progressHandler) {
    onProgress.onmessage = progressHandler;
  }
  await invoke2("plugin:upload|download", {
    id,
    url,
    filePath,
    headers: headers ?? {},
    onProgress
  });
}

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/dist/api/clipboard.js
var constructAPI = function(api2) {
  return {
    readText: api2.clipboardReadText,
    writeText: api2.clipboardWriteText,
    readImageBase64: api2.clipboardReadImageBase64,
    readImageBinary: api2.clipboardReadImageBinary,
    writeImageBase64: api2.clipboardWriteImageBase64,
    writeImageBinary: api2.clipboardWriteImageBinary,
    readFiles: api2.clipboardReadFiles,
    writeFiles: api2.clipboardWriteFiles,
    readRtf: api2.clipboardReadRtf,
    writeRtf: api2.clipboardWriteRtf,
    readHtml: api2.clipboardReadHtml,
    writeHtml: api2.clipboardWriteHtml,
    writeHtmlAndText: api2.clipboardWriteHtmlAndText,
    hasText: api2.clipboardHasText,
    hasRTF: api2.clipboardHasRTF,
    hasHTML: api2.clipboardHasHTML,
    hasImage: api2.clipboardHasImage,
    hasFiles: api2.clipboardHasFiles
  };
};
var defaultClientAPI = getDefaultClientAPI();
var comlinkClipboard = constructAPI(defaultClientAPI);
var nativeClipboard = {
  readText,
  writeText,
  readImageBase64,
  readImageBinary,
  writeImageBase64,
  writeImageBinary,
  readFiles,
  writeFiles,
  readRtf,
  writeRtf,
  readHtml,
  writeHtml,
  writeHtmlAndText,
  hasText,
  hasRTF,
  hasHTML,
  hasImage,
  hasFiles
};
var clipboard = isMain() ? nativeClipboard : comlinkClipboard;
// /Users/hacker/Dev/projects/Jarvis/vendors/tauri-api-adapter/packages/tauri-api-adapter/node_modules/@tauri-apps/plugin-dialog/dist-js/index.js
async function open(options = {}) {
  if (typeof options === "object") {
    Object.freeze(options);
  }
  return await invoke2("plugin:dialog|open", { options });
}
async function save(options = {}) {
  if (typeof options === "object") {
    Object.freeze(options);
  }
  return await invoke2("plugin:dialog|save", { options });
}
async function message(message2, options) {
  const opts = typeof options === "string" ? { title: options } : options;
  await invoke2("plugin:dialog|message", {
    message: message2.toString(),
    title: opts?.title?.toString(),
    kind: opts?.kind,
    okButtonLabel: opts?.okLabel?.toString()
  });
}
async function ask(message2, options) {
  const opts = typeof options === "string" ? { title: options } : options;
  return await invoke2("plugin:dialog|ask", {
    message: message2.toString(),
    title: opts?.title?.toString(),
    kind: opts?.kind,
    okButtonLabel: opts?.okLabel?.toString() ?? "Yes",
    cancelButtonLabel: opts?.cancelLabel?.toString() ?? "No"
  });
}
async function confirm(message2, options) {
  const opts = typeof options === "string" ? { title: options } : options;
  return await invoke2("plugin:dialog|confirm", {
    message: message2.toString(),
    title: opts?.title?.toString(),
    kind: opts?.kind,
    okButtonLabel: opts?.okLabel?.toString() ?? "Ok",
    cancelButtonLabel: opts?.cancelLabel?.toString() ?? "Cancel"
  });
}

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/dist/api/dialog.js
var constructAPI2 = function(api2) {
  return {
    ask: api2.dialogAsk,
    confirm: api2.dialogConfirm,
    message: api2.dialogMessage,
    open: api2.dialogOpen,
    save: api2.dialogSave
  };
};
var defaultClientAPI2 = getDefaultClientAPI();
var comlinkDialog = constructAPI2(defaultClientAPI2);
var nativeDialog = {
  ask,
  confirm,
  message,
  open,
  save
};
var dialog = isMain() ? nativeDialog : comlinkDialog;
// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/dist/api/event.js
var constructAPI3 = function(api2) {
  return {
    rawListen: (event4, target, handler) => api2.eventRawListen(event4, target, proxy(handler)),
    rawUnlisten: (event4, eventId) => api2.eventRawUnlisten(event4, eventId),
    emit: (event4, payload) => api2.eventEmit(event4, payload),
    emitTo: (target, event4, payload) => api2.eventEmitTo(target, event4, payload),
    once: (event4, handler, options) => api2.eventOnce(event4, handler, options)
  };
};
var defaultClientAPI3 = getDefaultClientAPI();
var _event = constructAPI3(defaultClientAPI3);
var listen3 = async function listen4(eventName, handler, options) {
  const target = typeof options?.target === "string" ? { kind: "AnyLabel", label: options.target } : options?.target ?? { kind: "Any" };
  return _event.rawListen(eventName, target, handler).then((eventId) => {
    return async () => {
      _event.rawUnlisten(eventName, eventId);
    };
  });
};
var comlinkEvent = {
  emit: _event.emit,
  emitTo: _event.emitTo,
  once: _event.once,
  listen: listen3
};
// /Users/hacker/Dev/projects/Jarvis/vendors/tauri-api-adapter/packages/tauri-api-adapter/node_modules/@tauri-apps/plugin-fs/dist-js/index.js
var parseFileInfo = function(r) {
  return {
    isFile: r.isFile,
    isDirectory: r.isDirectory,
    isSymlink: r.isSymlink,
    size: r.size,
    mtime: r.mtime !== null ? new Date(r.mtime) : null,
    atime: r.atime !== null ? new Date(r.atime) : null,
    birthtime: r.birthtime !== null ? new Date(r.birthtime) : null,
    readonly: r.readonly,
    fileAttributes: r.fileAttributes,
    dev: r.dev,
    ino: r.ino,
    mode: r.mode,
    nlink: r.nlink,
    uid: r.uid,
    gid: r.gid,
    rdev: r.rdev,
    blksize: r.blksize,
    blocks: r.blocks
  };
};
async function create(path4, options) {
  if (path4 instanceof URL && path4.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  const rid = await invoke2("plugin:fs|create", {
    path: path4 instanceof URL ? path4.toString() : path4,
    options
  });
  return new FileHandle(rid);
}
async function copyFile(fromPath, toPath, options) {
  if (fromPath instanceof URL && fromPath.protocol !== "file:" || toPath instanceof URL && toPath.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  await invoke2("plugin:fs|copy_file", {
    fromPath: fromPath instanceof URL ? fromPath.toString() : fromPath,
    toPath: toPath instanceof URL ? toPath.toString() : toPath,
    options
  });
}
async function mkdir(path4, options) {
  if (path4 instanceof URL && path4.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  await invoke2("plugin:fs|mkdir", {
    path: path4 instanceof URL ? path4.toString() : path4,
    options
  });
}
async function readDir(path4, options) {
  if (path4 instanceof URL && path4.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return await invoke2("plugin:fs|read_dir", {
    path: path4 instanceof URL ? path4.toString() : path4,
    options
  });
}
async function readFile(path4, options) {
  if (path4 instanceof URL && path4.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  const arr = await invoke2("plugin:fs|read_file", {
    path: path4 instanceof URL ? path4.toString() : path4,
    options
  });
  return arr instanceof ArrayBuffer ? new Uint8Array(arr) : Uint8Array.from(arr);
}
async function readTextFile(path4, options) {
  if (path4 instanceof URL && path4.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return await invoke2("plugin:fs|read_text_file", {
    path: path4 instanceof URL ? path4.toString() : path4,
    options
  });
}
async function remove(path4, options) {
  if (path4 instanceof URL && path4.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  await invoke2("plugin:fs|remove", {
    path: path4 instanceof URL ? path4.toString() : path4,
    options
  });
}
async function rename(oldPath, newPath, options) {
  if (oldPath instanceof URL && oldPath.protocol !== "file:" || newPath instanceof URL && newPath.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  await invoke2("plugin:fs|rename", {
    oldPath: oldPath instanceof URL ? oldPath.toString() : oldPath,
    newPath: newPath instanceof URL ? newPath.toString() : newPath,
    options
  });
}
async function stat(path4, options) {
  const res = await invoke2("plugin:fs|stat", {
    path: path4 instanceof URL ? path4.toString() : path4,
    options
  });
  return parseFileInfo(res);
}
async function lstat(path4, options) {
  const res = await invoke2("plugin:fs|lstat", {
    path: path4 instanceof URL ? path4.toString() : path4,
    options
  });
  return parseFileInfo(res);
}
async function truncate(path4, len, options) {
  if (path4 instanceof URL && path4.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  await invoke2("plugin:fs|truncate", {
    path: path4 instanceof URL ? path4.toString() : path4,
    len,
    options
  });
}
async function writeFile(path4, data, options) {
  if (path4 instanceof URL && path4.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  await invoke2("plugin:fs|write_file", data, {
    headers: {
      path: path4 instanceof URL ? path4.toString() : path4,
      options: JSON.stringify(options)
    }
  });
}
async function writeTextFile(path4, data, options) {
  if (path4 instanceof URL && path4.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  await invoke2("plugin:fs|write_text_file", {
    path: path4 instanceof URL ? path4.toString() : path4,
    data,
    options
  });
}
async function exists(path4, options) {
  if (path4 instanceof URL && path4.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return await invoke2("plugin:fs|exists", {
    path: path4 instanceof URL ? path4.toString() : path4,
    options
  });
}
var SeekMode;
(function(SeekMode2) {
  SeekMode2[SeekMode2["Start"] = 0] = "Start";
  SeekMode2[SeekMode2["Current"] = 1] = "Current";
  SeekMode2[SeekMode2["End"] = 2] = "End";
})(SeekMode || (SeekMode = {}));

class FileHandle extends Resource {
  async read(buffer) {
    if (buffer.byteLength === 0) {
      return 0;
    }
    const [data, nread] = await invoke2("plugin:fs|read", {
      rid: this.rid,
      len: buffer.byteLength
    });
    buffer.set(data);
    return nread === 0 ? null : nread;
  }
  async seek(offset, whence) {
    return await invoke2("plugin:fs|seek", {
      rid: this.rid,
      offset,
      whence
    });
  }
  async stat() {
    const res = await invoke2("plugin:fs|fstat", {
      rid: this.rid
    });
    return parseFileInfo(res);
  }
  async truncate(len) {
    await invoke2("plugin:fs|ftruncate", {
      rid: this.rid,
      len
    });
  }
  async write(data) {
    return await invoke2("plugin:fs|write", {
      rid: this.rid,
      data: Array.from(data)
    });
  }
}

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/dist/api/fs.js
var constructAPI4 = function(api2) {
  return {
    readDir: api2.fsReadDir,
    readFile: api2.fsReadFile,
    readTextFile: api2.fsReadTextFile,
    stat: api2.fsStat,
    lstat: api2.fsLstat,
    exists: api2.fsExists,
    mkdir: api2.fsMkdir,
    create: api2.fsCreate,
    copyFile: api2.fsCopyFile,
    remove: api2.fsRemove,
    rename: api2.fsRename,
    truncate: api2.fsTruncate,
    writeFile: api2.fsWriteFile,
    writeTextFile: api2.fsWriteTextFile
  };
};
var defaultClientAPI4 = getDefaultClientAPI();
var comlinkFs = constructAPI4(defaultClientAPI4);
var nativeFs = {
  readDir,
  readFile,
  readTextFile,
  stat,
  lstat,
  exists,
  mkdir,
  create,
  copyFile,
  remove,
  rename,
  truncate,
  writeFile,
  writeTextFile
};
var fs = isMain() ? nativeFs : comlinkFs;
// ../../node_modules/.pnpm/@tauri-apps+api@2.0.0-beta.13/node_modules/@tauri-apps/api/external/tslib/tslib.es6.js
var __classPrivateFieldGet3 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet3 = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};

// /Users/hacker/Dev/projects/Jarvis/packages/api/node_modules/@tauri-apps/api/core.js
var transformCallback3 = function(callback, once2 = false) {
  return window.__TAURI_INTERNALS__.transformCallback(callback, once2);
};
async function invoke3(cmd, args = {}, options) {
  return window.__TAURI_INTERNALS__.invoke(cmd, args, options);
}
var _Channel_onmessage3;
var _Channel_nextMessageId3;
var _Channel_pendingMessages3;
var _Resource_rid3;

class Channel2 {
  constructor() {
    this.__TAURI_CHANNEL_MARKER__ = true;
    _Channel_onmessage3.set(this, () => {
    });
    _Channel_nextMessageId3.set(this, 0);
    _Channel_pendingMessages3.set(this, {});
    this.id = transformCallback3(({ message: message2, id }) => {
      if (id === __classPrivateFieldGet3(this, _Channel_nextMessageId3, "f")) {
        __classPrivateFieldSet3(this, _Channel_nextMessageId3, id + 1, "f");
        __classPrivateFieldGet3(this, _Channel_onmessage3, "f").call(this, message2);
        const pendingMessageIds = Object.keys(__classPrivateFieldGet3(this, _Channel_pendingMessages3, "f"));
        if (pendingMessageIds.length > 0) {
          let nextId = id + 1;
          for (const pendingId of pendingMessageIds.sort()) {
            if (parseInt(pendingId) === nextId) {
              const message3 = __classPrivateFieldGet3(this, _Channel_pendingMessages3, "f")[pendingId];
              delete __classPrivateFieldGet3(this, _Channel_pendingMessages3, "f")[pendingId];
              __classPrivateFieldGet3(this, _Channel_onmessage3, "f").call(this, message3);
              nextId += 1;
            } else {
              break;
            }
          }
          __classPrivateFieldSet3(this, _Channel_nextMessageId3, nextId, "f");
        }
      } else {
        __classPrivateFieldGet3(this, _Channel_pendingMessages3, "f")[id.toString()] = message2;
      }
    });
  }
  set onmessage(handler) {
    __classPrivateFieldSet3(this, _Channel_onmessage3, handler, "f");
  }
  get onmessage() {
    return __classPrivateFieldGet3(this, _Channel_onmessage3, "f");
  }
  toJSON() {
    return `__CHANNEL__:${this.id}`;
  }
}
_Channel_onmessage3 = new WeakMap, _Channel_nextMessageId3 = new WeakMap, _Channel_pendingMessages3 = new WeakMap;
_Resource_rid3 = new WeakMap;

// /Users/hacker/Dev/projects/Jarvis/vendors/tauri-api-adapter/packages/tauri-api-adapter/node_modules/tauri-plugin-network-api/dist-js/index.js
var getInterfaces = function() {
  return invoke3("plugin:network|get_interfaces");
};
var getNonEmptyInterfaces = function() {
  return invoke3("plugin:network|get_non_empty_interfaces");
};
var findAvailablePort = function() {
  return invoke3("plugin:network|find_available_port");
};
var isPortTaken = function(port) {
  return invoke3("plugin:network|is_port_taken", { port });
};
var isHttpPortOpen = function(ip, options) {
  return invoke3("plugin:network|is_http_port_open", { ip, ...options });
};
var V6IfAddr = object({
  ip: string(),
  ip_octets: array(number()),
  broadcast: nullable(string()),
  broadcast_octets: nullable(array(number())),
  netmask: nullable(string()),
  netmask_octets: nullable(array(number())),
  prefix: nullable(number()),
  network: nullable(string())
});
var V4IfAddr = V6IfAddr;
var Addr = record(string(), union([V4IfAddr, V6IfAddr]));
var NetworkInterface = object({
  name: string(),
  v4_addrs: array(V4IfAddr),
  v6_addrs: array(V6IfAddr),
  mac_addr: nullable(string()),
  index: number()
});
var IpPortPair = object({
  ip: string(),
  port: number()
});
var HttpScanOptions = object({
  port: number(),
  keyword: optional(string()),
  route: optional(string()),
  protocol: optional(union([literal("http"), literal("https")])),
  statusCode: optional(number())
});
var Ipv4Network = object({
  addr: string(),
  prefix: number()
});

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/dist/api/network.js
var constructAPI5 = function(api2) {
  return {
    getInterfaces: api2.networkGetInterfaces,
    getNonEmptyInterfaces: api2.networkGetNonEmptyInterfaces,
    findAvailablePort: api2.networkFindAvailablePort,
    isPortTaken: api2.networkIsPortTaken,
    isHttpPortOpen: api2.networkIsHttpPortOpen
  };
};
var defaultClientAPI5 = getDefaultClientAPI();
var comlinkNetwork = constructAPI5(defaultClientAPI5);
var nativeNetwork = {
  getInterfaces,
  getNonEmptyInterfaces,
  findAvailablePort,
  isPortTaken,
  isHttpPortOpen
};
var network = isMain() ? nativeNetwork : comlinkNetwork;
// /Users/hacker/Dev/projects/Jarvis/vendors/tauri-api-adapter/packages/tauri-api-adapter/node_modules/@tauri-apps/plugin-notification/dist-js/index.js
async function isPermissionGranted() {
  if (window.Notification.permission !== "default") {
    return await Promise.resolve(window.Notification.permission === "granted");
  }
  return await invoke2("plugin:notification|is_permission_granted");
}
async function requestPermission() {
  return await window.Notification.requestPermission();
}
var sendNotification = function(options) {
  if (typeof options === "string") {
    new window.Notification(options);
  } else {
    new window.Notification(options.title, options);
  }
};
async function registerActionTypes(types) {
  await invoke2("plugin:notification|register_action_types", { types });
}
async function pending() {
  return await invoke2("plugin:notification|get_pending");
}
async function cancel(notifications) {
  await invoke2("plugin:notification|cancel", { notifications });
}
async function cancelAll() {
  await invoke2("plugin:notification|cancel");
}
async function active() {
  return await invoke2("plugin:notification|get_active");
}
async function removeActive(notifications) {
  await invoke2("plugin:notification|remove_active", { notifications });
}
async function removeAllActive() {
  await invoke2("plugin:notification|remove_active");
}
async function createChannel(channel) {
  await invoke2("plugin:notification|create_channel", { ...channel });
}
async function removeChannel(id) {
  await invoke2("plugin:notification|delete_channel", { id });
}
async function channels() {
  return await invoke2("plugin:notification|listChannels");
}
async function onNotificationReceived(cb) {
  return await addPluginListener("notification", "notification", cb);
}
async function onAction(cb) {
  return await addPluginListener("notification", "actionPerformed", cb);
}
var ScheduleEvery;
(function(ScheduleEvery2) {
  ScheduleEvery2["Year"] = "year";
  ScheduleEvery2["Month"] = "month";
  ScheduleEvery2["TwoWeeks"] = "twoWeeks";
  ScheduleEvery2["Week"] = "week";
  ScheduleEvery2["Day"] = "day";
  ScheduleEvery2["Hour"] = "hour";
  ScheduleEvery2["Minute"] = "minute";
  ScheduleEvery2["Second"] = "second";
})(ScheduleEvery || (ScheduleEvery = {}));
var Importance;
(function(Importance2) {
  Importance2[Importance2["None"] = 0] = "None";
  Importance2[Importance2["Min"] = 1] = "Min";
  Importance2[Importance2["Low"] = 2] = "Low";
  Importance2[Importance2["Default"] = 3] = "Default";
  Importance2[Importance2["High"] = 4] = "High";
})(Importance || (Importance = {}));
var Visibility;
(function(Visibility2) {
  Visibility2[Visibility2["Secret"] = -1] = "Secret";
  Visibility2[Visibility2["Private"] = 0] = "Private";
  Visibility2[Visibility2["Public"] = 1] = "Public";
})(Visibility || (Visibility = {}));

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/dist/api/notification.js
var constructAPI6 = function(api2) {
  return {
    sendNotification: api2.notificationSendNotification,
    requestPermission: api2.notificationRequestPermission,
    isPermissionGranted: api2.notificationIsPermissionGranted,
    registerActionTypes: api2.notificationRegisterActionTypes,
    pending: api2.notificationPending,
    cancel: api2.notificationCancel,
    cancelAll: api2.notificationCancelAll,
    active: api2.notificationActive,
    removeActive: api2.notificationRemoveActive,
    removeAllActive: api2.notificationRemoveAllActive,
    createChannel: api2.notificationCreateChannel,
    removeChannel: api2.notificationRemoveChannel,
    channels: api2.notificationChannels,
    onNotificationReceived: (cb) => {
      return api2.notificationOnNotificationReceived(proxy(cb));
    },
    onAction: (cb) => {
      return api2.notificationOnAction(proxy(cb));
    }
  };
};
var defaultClientAPI6 = getDefaultClientAPI();
var comlinkNotification = constructAPI6(defaultClientAPI6);
var nativeNotification = {
  sendNotification,
  requestPermission,
  isPermissionGranted,
  registerActionTypes,
  pending,
  cancel,
  cancelAll,
  active,
  removeActive,
  removeAllActive,
  createChannel,
  removeChannel,
  channels,
  onNotificationReceived,
  onAction
};
var notification = isMain() ? nativeNotification : comlinkNotification;
// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/dist/api/os.js
var constructAPI7 = function(api2) {
  return {
    platform: api2.osPlatform,
    arch: api2.osArch,
    exeExtension: api2.osExeExtension,
    family: api2.osFamily,
    hostname: api2.osHostname,
    eol: api2.osEol,
    version: api2.osVersion,
    locale: api2.osLocale
  };
};
var defaultClientAPI7 = getDefaultClientAPI();
var comlinkOs = constructAPI7(defaultClientAPI7);
var nativeOs = {
  platform: () => Promise.resolve(platform()),
  arch: () => Promise.resolve(arch()),
  exeExtension: () => Promise.resolve(exeExtension()),
  family: () => Promise.resolve(family()),
  hostname,
  eol: () => Promise.resolve(eol()),
  version: () => Promise.resolve(version()),
  locale
};
var os = isMain() ? nativeOs : comlinkOs;
// /Users/hacker/Dev/projects/Jarvis/vendors/tauri-api-adapter/packages/tauri-api-adapter/node_modules/tauri-plugin-shellx-api/dist-js/index.js
var makeBashScript = function(script) {
  return Command.create("bash", ["-c", script]);
};
var makePowershellScript = function(script) {
  return Command.create("powershell", ["-Command", script]);
};
var makeAppleScript = function(script) {
  return Command.create("osascript", ["-e", script]);
};
var makePythonScript = function(script) {
  return Command.create("python", ["-c", script]);
};
var makeZshScript = function(script) {
  return Command.create("zsh", ["-c", script]);
};
var makeNodeScript = function(script) {
  return Command.create("node", ["-e", script]);
};
async function executeBashScript(script) {
  return makeBashScript(script).execute();
}
async function executePowershellScript(script) {
  return makePowershellScript(script).execute();
}
async function executeAppleScript(script) {
  return makeAppleScript(script).execute();
}
async function executePythonScript(script) {
  return makePythonScript(script).execute();
}
async function executeZshScript(script) {
  return makeZshScript(script).execute();
}
async function executeNodeScript(script) {
  return makeNodeScript(script).execute();
}
var likelyOnWindows = function() {
  return Command.create("powershell.exe", ["-Command", "echo $env:OS"]).execute().then((out) => out.code === 0 && out.stdout.toLowerCase().includes("windows")).catch(() => false);
};
async function hasCommand(command) {
  const targetCmd = command.split(" ")[0];
  const isOnWindows = await likelyOnWindows();
  const whereCmd = isOnWindows ? "where" : "which";
  const cmd = Command.create(whereCmd, [targetCmd]);
  const out = await cmd.execute();
  return out.code === 0;
}
var open2 = function(path8, openWith) {
  return invoke3("plugin:shellx|open", {
    path: path8,
    with: openWith
  });
};
class Child {
  constructor(pid) {
    this.pid = pid;
  }
  async write(data) {
    await invoke3("plugin:shellx|stdin_write", {
      pid: this.pid,
      buffer: typeof data === "string" ? data : Array.from(data)
    });
  }
  async kill() {
    await invoke3("plugin:shellx|kill", {
      cmd: "killChild",
      pid: this.pid
    });
  }
}

class EventEmitter {
  constructor() {
    this.eventListeners = Object.create(null);
  }
  addListener(eventName, listener) {
    return this.on(eventName, listener);
  }
  removeListener(eventName, listener) {
    return this.off(eventName, listener);
  }
  on(eventName, listener) {
    if (eventName in this.eventListeners) {
      this.eventListeners[eventName].push(listener);
    } else {
      this.eventListeners[eventName] = [listener];
    }
    return this;
  }
  once(eventName, listener) {
    const wrapper = (arg) => {
      this.removeListener(eventName, wrapper);
      listener(arg);
    };
    return this.addListener(eventName, wrapper);
  }
  off(eventName, listener) {
    if (eventName in this.eventListeners) {
      this.eventListeners[eventName] = this.eventListeners[eventName].filter((l) => l !== listener);
    }
    return this;
  }
  removeAllListeners(event4) {
    if (event4) {
      delete this.eventListeners[event4];
    } else {
      this.eventListeners = Object.create(null);
    }
    return this;
  }
  emit(eventName, arg) {
    if (eventName in this.eventListeners) {
      const listeners = this.eventListeners[eventName];
      for (const listener of listeners)
        listener(arg);
      return true;
    }
    return false;
  }
  listenerCount(eventName) {
    if (eventName in this.eventListeners)
      return this.eventListeners[eventName].length;
    return 0;
  }
  prependListener(eventName, listener) {
    if (eventName in this.eventListeners) {
      this.eventListeners[eventName].unshift(listener);
    } else {
      this.eventListeners[eventName] = [listener];
    }
    return this;
  }
  prependOnceListener(eventName, listener) {
    const wrapper = (arg) => {
      this.removeListener(eventName, wrapper);
      listener(arg);
    };
    return this.prependListener(eventName, wrapper);
  }
}

class Command extends EventEmitter {
  constructor(program, args = [], options) {
    super();
    this.stdout = new EventEmitter;
    this.stderr = new EventEmitter;
    this.program = program;
    this.args = typeof args === "string" ? [args] : args;
    this.options = options ?? {};
  }
  static create(program, args = [], options) {
    return new Command(program, args, options);
  }
  static sidecar(program, args = [], options) {
    const instance = new Command(program, args, options);
    instance.options.sidecar = true;
    return instance;
  }
  async spawn() {
    const program = this.program;
    const args = this.args;
    const options = this.options;
    if (typeof args === "object") {
      Object.freeze(args);
    }
    const onEvent = new Channel2;
    onEvent.onmessage = (event4) => {
      switch (event4.event) {
        case "Error":
          this.emit("error", event4.payload);
          break;
        case "Terminated":
          this.emit("close", event4.payload);
          break;
        case "Stdout":
          this.stdout.emit("data", event4.payload);
          break;
        case "Stderr":
          this.stderr.emit("data", event4.payload);
          break;
      }
    };
    return await invoke3("plugin:shellx|spawn", {
      program,
      args,
      options,
      onEvent
    }).then((pid) => new Child(pid));
  }
  async execute() {
    const program = this.program;
    const args = this.args;
    const options = this.options;
    if (typeof args === "object") {
      Object.freeze(args);
    }
    return invoke3("plugin:shellx|execute", {
      program,
      args,
      options
    });
  }
}

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/dist/api/shell.js
var constructAPI8 = function(api2) {
  return {
    execute: api2.shellExecute,
    kill: api2.shellKill,
    stdinWrite: api2.shellStdinWrite,
    open: api2.shellOpen,
    rawSpawn: api2.shellRawSpawn,
    makeBashScript: makeBashScript2,
    makePowershellScript: makePowershellScript2,
    makeAppleScript: makeAppleScript2,
    makePythonScript: makePythonScript2,
    makeZshScript: makeZshScript2,
    makeNodeScript: makeNodeScript2,
    executeBashScript: api2.shellExecuteBashScript,
    executePowershellScript: api2.shellExecutePowershellScript,
    executeAppleScript: api2.shellExecuteAppleScript,
    executePythonScript: api2.shellExecutePythonScript,
    executeZshScript: api2.shellExecuteZshScript,
    executeNodeScript: api2.shellExecuteNodeScript,
    hasCommand: api2.shellHasCommand,
    likelyOnWindows: api2.shellLikelyOnWindows
  };
};
var makeBashScript2 = function(script) {
  return Command2.create("bash", ["-c", script]);
};
var makePowershellScript2 = function(script) {
  return Command2.create("powershell", ["-Command", script]);
};
var makeAppleScript2 = function(script) {
  return Command2.create("osascript", ["-e", script]);
};
var makePythonScript2 = function(script) {
  return Command2.create("python", ["-c", script]);
};
var makeZshScript2 = function(script) {
  return Command2.create("zsh", ["-c", script]);
};
var makeNodeScript2 = function(script) {
  return Command2.create("node", ["-e", script]);
};
var defaultClientAPI8 = getDefaultClientAPI();
var _comlinkShell = constructAPI8(defaultClientAPI8);

class Child2 extends Child {
  write(data) {
    return _comlinkShell.stdinWrite(typeof data === "string" ? data : Array.from(data), this.pid);
  }
  kill() {
    return _comlinkShell.kill(this.pid);
  }
}

class Command2 extends Command {
  static create(program, args = [], options) {
    return new Command2(program, args, options);
  }
  async spawn() {
    const args = this.args;
    if (typeof args === "object") {
      Object.freeze(args);
    }
    return _comlinkShell.rawSpawn(this.program, args, this.options, proxy((evt) => {
      switch (evt.event) {
        case "Error":
          this.emit("error", evt.payload);
          break;
        case "Terminated":
          this.emit("close", evt.payload);
          break;
        case "Stdout":
          this.stdout.emit("data", evt.payload);
          break;
        case "Stderr":
          this.stderr.emit("data", evt.payload);
          break;
      }
    })).then((pid) => new Child2(pid));
  }
  async execute() {
    const program = this.program;
    const args = this.args;
    const options = this.options;
    if (typeof args === "object") {
      Object.freeze(args);
    }
    return _comlinkShell.execute(program, args, options);
  }
}
_comlinkShell.open;
var comlinkShell = {
  ..._comlinkShell,
  Command: Command2,
  Child: Child2
};
var nativeShell = {
  open: open2,
  makeBashScript,
  makePowershellScript,
  makeAppleScript,
  makePythonScript,
  makeZshScript,
  makeNodeScript,
  executeBashScript,
  executePowershellScript,
  executeAppleScript,
  executePythonScript,
  executeZshScript,
  executeNodeScript,
  hasCommand,
  likelyOnWindows,
  Command,
  Child
};
var shell = isMain() ? nativeShell : comlinkShell;
// /Users/hacker/Dev/projects/Jarvis/vendors/tauri-api-adapter/packages/tauri-api-adapter/node_modules/tauri-plugin-system-info-api/dist-js/index.js
var allSysInfo = function() {
  return invoke3("plugin:system-info|all_sys_info");
};
var totalMemory = function() {
  return invoke3("plugin:system-info|total_memory");
};
var usedMemory = function() {
  return invoke3("plugin:system-info|used_memory");
};
var totalSwap = function() {
  return invoke3("plugin:system-info|total_swap");
};
var usedSwap = function() {
  return invoke3("plugin:system-info|used_swap");
};
var memoryInfo = function() {
  return invoke3("plugin:system-info|memory_info");
};
var hostname2 = function() {
  return invoke3("plugin:system-info|hostname");
};
var name = function() {
  return invoke3("plugin:system-info|name");
};
var kernelVersion = function() {
  return invoke3("plugin:system-info|kernel_version");
};
var osVersion = function() {
  return invoke3("plugin:system-info|os_version");
};
var staticInfo = function() {
  return invoke3("plugin:system-info|static_info");
};
var components = function() {
  return invoke3("plugin:system-info|components");
};
var cpus = function() {
  return invoke3("plugin:system-info|cpus");
};
var cpuCount = function() {
  return invoke3("plugin:system-info|cpu_count");
};
var cpuInfo = function() {
  return invoke3("plugin:system-info|cpu_info");
};
var disks = function() {
  return invoke3("plugin:system-info|disks");
};
var networks = function() {
  return invoke3("plugin:system-info|networks");
};
var processes = function() {
  return invoke3("plugin:system-info|processes");
};
var refreshAll = function() {
  return invoke3("plugin:system-info|refresh_all");
};
var refreshMemory = function() {
  return invoke3("plugin:system-info|refresh_memory");
};
var refreshCpu = function() {
  return invoke3("plugin:system-info|refresh_cpu");
};
var refreshProcesses = function() {
  return invoke3("plugin:system-info|refresh_processes");
};
var batteries = function() {
  return invoke3("plugin:system-info|batteries");
};
var BatteryStateEnum;
(function(BatteryStateEnum2) {
  BatteryStateEnum2["Unknown"] = "Unknown";
  BatteryStateEnum2["Charging"] = "Charging";
  BatteryStateEnum2["Discharging"] = "Discharging";
  BatteryStateEnum2["Empty"] = "Empty";
  BatteryStateEnum2["Full"] = "Full";
})(BatteryStateEnum || (BatteryStateEnum = {}));
var BatteryState = enum_(BatteryStateEnum);
var BatteryTechnologyEnum;
(function(BatteryTechnologyEnum2) {
  BatteryTechnologyEnum2["Unknown"] = "Unknown";
  BatteryTechnologyEnum2["LithiumIon"] = "LithiumIon";
  BatteryTechnologyEnum2["LeadAcid"] = "LeadAcid";
  BatteryTechnologyEnum2["LithiumPolymer"] = "LithiumPolymer";
  BatteryTechnologyEnum2["NickelMetalHydride"] = "NickelMetalHydride";
  BatteryTechnologyEnum2["NickelCadmium"] = "NickelCadmium";
  BatteryTechnologyEnum2["NickelZinc"] = "NickelZinc";
  BatteryTechnologyEnum2["LithiumIronPhosphate"] = "LithiumIronPhosphate";
  BatteryTechnologyEnum2["RechargeableAlkalineManganese"] = "RechargeableAlkalineManganese";
})(BatteryTechnologyEnum || (BatteryTechnologyEnum = {}));
var BatteryTechnology = enum_(BatteryTechnologyEnum);
var Battery = object({
  state_of_charge: number(),
  energy: number(),
  energy_full: number(),
  energy_full_design: number(),
  energy_rate: number(),
  voltage: number(),
  state_of_health: number(),
  state: BatteryState,
  technology: BatteryTechnology,
  temperature_kelin: nullable(number()),
  temperature_celsius: nullable(number()),
  temperature_fahrenheit: nullable(number()),
  cycle_count: nullable(number()),
  vendor: nullable(string()),
  model: nullable(string()),
  serial_number: nullable(string()),
  time_to_full: nullable(number()),
  time_to_empty: nullable(number())
});
var Batteries = array(Battery);
var DiskKind = union([
  literal("HDD"),
  literal("SSD"),
  object({
    Unknown: number()
  })
]);
var MacAddress = pipe(array(number()), length(6));
var ProcessStatus = union([
  literal("Idle"),
  literal("Run"),
  literal("Sleep"),
  literal("Stop"),
  literal("Zombie"),
  literal("Tracing"),
  literal("Dead"),
  literal("Wakekill"),
  literal("Waking"),
  literal("Parked"),
  literal("LockBlocked"),
  literal("UninterruptibleDiskSleep"),
  object({
    Unknown: number()
  })
]);
var DiskUsage = object({
  total_written_bytes: number(),
  written_bytes: number(),
  total_read_bytes: number(),
  read_bytes: number()
});
var Cpu = object({
  name: string(),
  frequency: number(),
  cpu_usage: number(),
  vendor_id: string(),
  brand: string()
});
var Disk = object({
  kind: DiskKind,
  name: string(),
  file_system: string(),
  mount_point: string(),
  total_space: number(),
  available_space: number(),
  is_removable: boolean()
});
var Network = object({
  interface_name: string(),
  received: number(),
  total_received: number(),
  transmitted: number(),
  total_transmitted: number(),
  packets_received: number(),
  total_packets_received: number(),
  packets_transmitted: number(),
  total_packets_transmitted: number(),
  errors_on_received: number(),
  total_errors_on_received: number(),
  errors_on_transmitted: number(),
  total_errors_on_transmitted: number(),
  mac_address: array(number()),
  mac_address_str: string()
});
var Component = object({
  temperature: number(),
  max: number(),
  critical: nullable(number()),
  label: string()
});
var Process = object({
  name: string(),
  cmd: array(string()),
  exe: nullable(string()),
  pid: number(),
  environ: array(string()),
  cwd: nullable(string()),
  root: nullable(string()),
  memory: number(),
  virtual_memory: number(),
  parent: nullable(number()),
  status: ProcessStatus,
  start_time: number(),
  run_time: number(),
  cpu_usage: number(),
  disk_usage: DiskUsage,
  user_id: nullable(string()),
  effective_user_id: nullable(string()),
  group_id: nullable(string()),
  effective_group_id: nullable(string()),
  session_id: nullable(number())
});
var StaticInfo = object({
  hostname: nullable(string()),
  kernel_version: nullable(string()),
  os_version: nullable(string()),
  name: nullable(string())
});
var MemoryInfo = object({
  total_memory: number(),
  used_memory: number(),
  total_swap: number(),
  used_swap: number()
});
var CpuInfo = object({
  cpus: array(Cpu),
  cpu_count: number()
});
var AllSystemInfo = object({
  hostname: nullable(string()),
  kernel_version: nullable(string()),
  os_version: nullable(string()),
  name: nullable(string()),
  total_memory: number(),
  used_memory: number(),
  total_swap: number(),
  used_swap: number(),
  cpus: array(Cpu),
  cpu_count: number(),
  disks: array(Disk),
  networks: array(Network),
  components: array(Component),
  processes: array(Process),
  batteries: Batteries
});

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/dist/api/system-info.js
var constructAPI9 = function(api2) {
  return {
    allSysInfo: api2.sysInfoAllSysInfo,
    totalMemory: api2.sysInfoTotalMemory,
    usedMemory: api2.sysInfoUsedMemory,
    totalSwap: api2.sysInfoTotalSwap,
    usedSwap: api2.sysInfoUsedSwap,
    memoryInfo: api2.sysInfoMemoryInfo,
    hostname: api2.sysInfoHostname,
    name: api2.sysInfoName,
    kernelVersion: api2.sysInfoKernelVersion,
    osVersion: api2.sysInfoOsVersion,
    staticInfo: api2.sysInfoStaticInfo,
    components: api2.sysInfoComponents,
    cpus: api2.sysInfoCpus,
    cpuCount: api2.sysInfoCpuCount,
    cpuInfo: api2.sysInfoCpuInfo,
    disks: api2.sysInfoDisks,
    networks: api2.sysInfoNetworks,
    processes: api2.sysInfoProcesses,
    refreshAll: api2.sysInfoRefreshAll,
    refreshMemory: api2.sysInfoRefreshMemory,
    refreshCpu: api2.sysInfoRefreshCpu,
    refreshProcesses: api2.sysInfoRefreshProcesses,
    batteries: api2.sysInfoBatteries
  };
};
var defaultClientAPI9 = getDefaultClientAPI();
var comlinkSysInfo = constructAPI9(defaultClientAPI9);
var nativeSysInfo = {
  allSysInfo,
  totalMemory,
  usedMemory,
  totalSwap,
  usedSwap,
  memoryInfo,
  hostname: hostname2,
  name,
  kernelVersion,
  osVersion,
  staticInfo,
  components,
  cpus,
  cpuCount,
  cpuInfo,
  disks,
  networks,
  processes,
  refreshAll,
  refreshMemory,
  refreshCpu,
  refreshProcesses,
  batteries
};
var sysInfo = isMain() ? nativeSysInfo : comlinkSysInfo;
// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/dist/api/path.js
var constructAPI10 = function(api2) {
  return {
    appCacheDir: api2.pathAppCacheDir,
    appConfigDir: api2.pathAppConfigDir,
    appDataDir: api2.pathAppDataDir,
    appLocalDataDir: api2.pathAppLocalDataDir,
    appLogDir: api2.pathAppLogDir,
    audioDir: api2.pathAudioDir,
    BaseDirectory,
    basename: api2.pathBasename,
    cacheDir: api2.pathCacheDir,
    configDir: api2.pathConfigDir,
    dataDir: api2.pathDataDir,
    delimiter: api2.pathDelimiter,
    desktopDir: api2.pathDesktopDir,
    dirname: api2.pathDirname,
    documentDir: api2.pathDocumentDir,
    downloadDir: api2.pathDownloadDir,
    executableDir: api2.pathExecutableDir,
    extname: api2.pathExtname,
    fontDir: api2.pathFontDir,
    homeDir: api2.pathHomeDir,
    isAbsolute: api2.pathIsAbsolute,
    join: api2.pathJoin,
    localDataDir: api2.pathLocalDataDir,
    normalize: api2.pathNormalize,
    pictureDir: api2.pathPictureDir,
    publicDir: api2.pathPublicDir,
    resolve: api2.pathResolve,
    resolveResource: api2.pathResolveResource,
    resourceDir: api2.pathResourceDir,
    runtimeDir: api2.pathRuntimeDir,
    sep: api2.pathSep,
    tempDir: api2.pathTempDir,
    templateDir: api2.pathTemplateDir,
    videoDir: api2.pathVideoDir
  };
};
var defaultClientAPI10 = getDefaultClientAPI();
var comlinkPath = constructAPI10(defaultClientAPI10);
var nativePath = {
  appCacheDir,
  appConfigDir,
  appDataDir,
  appLocalDataDir,
  appLogDir,
  audioDir,
  BaseDirectory,
  basename,
  cacheDir,
  configDir,
  dataDir,
  delimiter: () => Promise.resolve(delimiter()),
  desktopDir,
  dirname,
  documentDir,
  downloadDir,
  executableDir,
  extname,
  fontDir,
  homeDir,
  isAbsolute,
  join,
  localDataDir,
  normalize,
  pictureDir,
  publicDir,
  resolve,
  resolveResource,
  resourceDir,
  runtimeDir,
  sep: () => Promise.resolve(sep()),
  tempDir,
  templateDir,
  videoDir
};
var path10 = isMain() ? nativePath : comlinkPath;
// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/dist/api/log.js
var constructAPI11 = function(api2) {
  return {
    debug: api2.loggerDebug,
    error: api2.loggerError,
    info: api2.loggerInfo,
    trace: api2.loggerTrace,
    warn: api2.loggerWarn
  };
};
var defaultClientAPI11 = getDefaultClientAPI();
var comlinkLog = constructAPI11(defaultClientAPI11);
var nativeLog = {
  debug,
  error,
  info,
  trace,
  warn
};
var log2 = isMain() ? nativeLog : comlinkLog;
// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/dist/api/updownload.js
var constructAPI12 = function(api2) {
  return {
    upload: (url, filePath, progressHandler, headers) => api2.upload(url, filePath, progressHandler ? proxy(progressHandler) : undefined, headers),
    download: (url, filePath, progressHandler, headers) => api2.download(url, filePath, progressHandler ? proxy(progressHandler) : undefined, headers)
  };
};
var defaultClientAPI12 = getDefaultClientAPI();
var comlinkUpdownload = constructAPI12(defaultClientAPI12);
var nativeUpdownload = {
  upload,
  download
};
var updownload = isMain() ? nativeUpdownload : comlinkUpdownload;
// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/dist/api/fetch/request.js
var defaultClientAPI13 = getDefaultClientAPI();
var webFetch = {
  rawFetch: defaultClientAPI13.fetchRawFetch,
  fetchCancel: defaultClientAPI13.fetchFetchCancel,
  fetchSend: defaultClientAPI13.fetchFetchSend,
  fetchReadBody: defaultClientAPI13.fetchFetchReadBody
};
// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/dist/server.js
var constructUpdownloadApi = function(permissions3) {
  return {
    upload: checkPermission(["updownload:upload"], permissions3)(upload),
    download: checkPermission(["updownload:download"], permissions3)(download)
  };
};
var constructClipboardApi = function(permissions3) {
  return {
    clipboardReadText: checkPermission(["clipboard:read-text", "clipboard:read-all"], permissions3)(api.readText),
    clipboardWriteText: checkPermission(["clipboard:write-text", "clipboard:write-all"], permissions3)(api.writeText),
    clipboardReadImageBase64: checkPermission(["clipboard:read-all", "clipboard:read-image"], permissions3)(api.readImageBase64),
    clipboardReadImageBinary: checkPermission(["clipboard:read-all", "clipboard:read-image"], permissions3)(api.readImageBinary),
    clipboardWriteImageBase64: checkPermission(["clipboard:write-all", "clipboard:write-image"], permissions3)(api.writeImageBase64),
    clipboardWriteImageBinary: checkPermission(["clipboard:write-all", "clipboard:write-image"], permissions3)(api.writeImageBinary),
    clipboardReadFiles: checkPermission(["clipboard:read-all", "clipboard:read-files"], permissions3)(api.readFiles),
    clipboardWriteFiles: checkPermission(["clipboard:write-all", "clipboard:write-files"], permissions3)(api.writeFiles),
    clipboardReadRtf: checkPermission(["clipboard:read-all", "clipboard:read-text"], permissions3)(api.readRtf),
    clipboardWriteRtf: checkPermission(["clipboard:write-all", "clipboard:write-text"], permissions3)(api.writeRtf),
    clipboardReadHtml: checkPermission(["clipboard:read-all", "clipboard:read-text"], permissions3)(api.readHtml),
    clipboardWriteHtml: checkPermission(["clipboard:write-all", "clipboard:write-text"], permissions3)(api.writeHtml),
    clipboardWriteHtmlAndText: checkPermission(["clipboard:write-all", "clipboard:write-text"], permissions3)(api.writeHtmlAndText),
    clipboardHasText: checkPermission([], permissions3)(api.hasText),
    clipboardHasRTF: checkPermission([], permissions3)(api.hasRTF),
    clipboardHasHTML: checkPermission([], permissions3)(api.hasHTML),
    clipboardHasImage: checkPermission([], permissions3)(api.hasImage),
    clipboardHasFiles: checkPermission([], permissions3)(api.hasFiles)
  };
};
var constructDialogApi = function(permissions3) {
  return {
    dialogAsk: checkPermission(["dialog:all"], permissions3)(ask),
    dialogConfirm: checkPermission(["dialog:all"], permissions3)(confirm),
    dialogMessage: checkPermission(["dialog:all"], permissions3)(message),
    dialogOpen: checkPermission(["dialog:all"], permissions3)(open),
    dialogSave: checkPermission(["dialog:all"], permissions3)(save)
  };
};
var constructNotificationApi = function(permissions3) {
  return {
    notificationIsPermissionGranted: checkPermission(["notification:all"], permissions3)(isPermissionGranted),
    notificationRequestPermission: checkPermission(["notification:all"], permissions3)(requestPermission),
    notificationSendNotification: checkPermission(["notification:all"], permissions3)(sendNotification),
    notificationRegisterActionTypes: checkPermission(["notification:all"], permissions3)(registerActionTypes),
    notificationPending: checkPermission(["notification:all"], permissions3)(pending),
    notificationCancel: checkPermission(["notification:all"], permissions3)(cancel),
    notificationCancelAll: checkPermission(["notification:all"], permissions3)(cancelAll),
    notificationActive: checkPermission(["notification:all"], permissions3)(active),
    notificationRemoveActive: checkPermission(["notification:all"], permissions3)(removeActive),
    notificationRemoveAllActive: checkPermission(["notification:all"], permissions3)(removeAllActive),
    notificationCreateChannel: checkPermission(["notification:all"], permissions3)(createChannel),
    notificationRemoveChannel: checkPermission(["notification:all"], permissions3)(removeChannel),
    notificationChannels: checkPermission(["notification:all"], permissions3)(channels),
    notificationOnNotificationReceived: checkPermission(["notification:all"], permissions3)(onNotificationReceived),
    notificationOnAction: checkPermission(["notification:all"], permissions3)(onAction)
  };
};
var constructFsApi = function(permissions3) {
  return {
    fsReadDir: checkPermission(["fs:read"], permissions3)(readDir),
    fsReadFile: checkPermission(["fs:read"], permissions3)(readFile),
    fsReadTextFile: checkPermission(["fs:read"], permissions3)(readTextFile),
    fsStat: checkPermission(["fs:read"], permissions3)(stat),
    fsLstat: checkPermission(["fs:read"], permissions3)(lstat),
    fsExists: checkPermission(["fs:read", "fs:exists"], permissions3)(exists),
    fsMkdir: checkPermission(["fs:write"], permissions3)(mkdir),
    fsCreate: checkPermission(["fs:write"], permissions3)(create),
    fsCopyFile: checkPermission(["fs:write"], permissions3)(copyFile),
    fsRemove: checkPermission(["fs:write"], permissions3)(remove),
    fsRename: checkPermission(["fs:write"], permissions3)(rename),
    fsTruncate: checkPermission(["fs:write"], permissions3)(truncate),
    fsWriteFile: checkPermission(["fs:write"], permissions3)(writeFile),
    fsWriteTextFile: checkPermission(["fs:write"], permissions3)(writeTextFile)
  };
};
var constructOsApi = function(permissions3) {
  return {
    osPlatform: checkPermission(["os:all"], permissions3)(() => Promise.resolve(platform())),
    osArch: checkPermission(["os:all"], permissions3)(() => Promise.resolve(arch())),
    osExeExtension: checkPermission(["os:all"], permissions3)(() => Promise.resolve(exeExtension())),
    osFamily: checkPermission(["os:all"], permissions3)(() => Promise.resolve(family())),
    osHostname: checkPermission(["os:all"], permissions3)(hostname),
    osEol: checkPermission(["os:all"], permissions3)(() => Promise.resolve(eol())),
    osVersion: checkPermission(["os:all"], permissions3)(() => Promise.resolve(version())),
    osLocale: checkPermission(["os:all"], permissions3)(locale)
  };
};
var constructShellApi = function(permissions3) {
  return {
    shellExecute: checkPermission(["shell:execute"], permissions3)((program, args, options) => invoke2("plugin:shellx|execute", {
      program,
      args,
      options
    })),
    shellKill: checkPermission(["shell:execute"], permissions3)((pid) => invoke2("plugin:shellx|kill", {
      cmd: "killChild",
      pid
    })),
    shellStdinWrite: checkPermission(["shell:execute"], permissions3)((buffer, pid) => invoke2("plugin:shellx|stdin_write", {
      buffer,
      pid
    })),
    shellOpen: checkPermission(["shell:open"], permissions3)(open2),
    shellRawSpawn: checkPermission(["shell:execute"], permissions3)((program, args, options, cb) => {
      const onEvent = new Channel;
      onEvent.onmessage = cb;
      return invoke2("plugin:shellx|spawn", {
        program,
        args,
        options,
        onEvent
      });
    }),
    shellExecuteBashScript: checkPermission(["shell:execute"], permissions3)(executeBashScript),
    shellExecutePowershellScript: checkPermission(["shell:execute"], permissions3)(executePowershellScript),
    shellExecuteAppleScript: checkPermission(["shell:execute"], permissions3)(executeAppleScript),
    shellExecutePythonScript: checkPermission(["shell:execute"], permissions3)(executePythonScript),
    shellExecuteZshScript: checkPermission(["shell:execute"], permissions3)(executeZshScript),
    shellExecuteNodeScript: checkPermission(["shell:execute"], permissions3)(executeNodeScript),
    shellHasCommand: checkPermission(["shell:execute"], permissions3)(hasCommand),
    shellLikelyOnWindows: checkPermission(["shell:execute"], permissions3)(likelyOnWindows)
  };
};
var constructFetchApi = function(permissions3) {
  return {
    fetchRawFetch: checkPermission(["fetch:all"], permissions3)((options) => invoke2("plugin:http|fetch", options)),
    fetchFetchCancel: checkPermission(["fetch:all"], permissions3)((rid) => invoke2("plugin:http|fetch_cancel", { rid })),
    fetchFetchSend: checkPermission(["fetch:all"], permissions3)((rid) => invoke2("plugin:http|fetch_send", { rid })),
    fetchFetchReadBody: checkPermission(["fetch:all"], permissions3)((rid) => invoke2("plugin:http|fetch_read_body", { rid }))
  };
};
var constructSystemInfoApi = function(permissions3) {
  return {
    sysInfoAllSysInfo: checkPermission(["system-info:all"], permissions3)(allSysInfo),
    sysInfoTotalMemory: checkPermission(["system-info:all", "system-info:memory"], permissions3)(totalMemory),
    sysInfoUsedMemory: checkPermission(["system-info:all", "system-info:memory"], permissions3)(usedMemory),
    sysInfoTotalSwap: checkPermission(["system-info:all", "system-info:memory"], permissions3)(totalSwap),
    sysInfoUsedSwap: checkPermission(["system-info:all", "system-info:memory"], permissions3)(usedSwap),
    sysInfoMemoryInfo: checkPermission(["system-info:all", "system-info:memory"], permissions3)(memoryInfo),
    sysInfoHostname: checkPermission(["system-info:all", "system-info:network"], permissions3)(hostname2),
    sysInfoName: checkPermission(["system-info:all", "system-info:os"], permissions3)(name),
    sysInfoKernelVersion: checkPermission(["system-info:all", "system-info:os"], permissions3)(kernelVersion),
    sysInfoOsVersion: checkPermission(["system-info:all", "system-info:os"], permissions3)(osVersion),
    sysInfoStaticInfo: checkPermission(["system-info:all", "system-info:os"], permissions3)(staticInfo),
    sysInfoComponents: checkPermission(["system-info:all", "system-info:components"], permissions3)(components),
    sysInfoCpus: checkPermission(["system-info:all", "system-info:cpu"], permissions3)(cpus),
    sysInfoCpuCount: checkPermission(["system-info:all", "system-info:cpu"], permissions3)(cpuCount),
    sysInfoCpuInfo: checkPermission(["system-info:all", "system-info:cpu"], permissions3)(cpuInfo),
    sysInfoDisks: checkPermission(["system-info:all", "system-info:disk"], permissions3)(disks),
    sysInfoNetworks: checkPermission(["system-info:all", "system-info:network"], permissions3)(networks),
    sysInfoProcesses: checkPermission(["system-info:all", "system-info:process"], permissions3)(processes),
    sysInfoRefreshAll: checkPermission(["system-info:all"], permissions3)(refreshAll),
    sysInfoRefreshMemory: checkPermission(["system-info:memory"], permissions3)(refreshMemory),
    sysInfoRefreshCpu: checkPermission(["system-info:all", "system-info:cpu"], permissions3)(refreshCpu),
    sysInfoRefreshProcesses: checkPermission(["system-info:process"], permissions3)(refreshProcesses),
    sysInfoBatteries: checkPermission(["system-info:all", "system-info:battery"], permissions3)(batteries)
  };
};
var constructNetworkApi = function(permissions3) {
  return {
    networkGetInterfaces: checkPermission(["network:interface"], permissions3)(getInterfaces),
    networkGetNonEmptyInterfaces: checkPermission(["network:interface"], permissions3)(getNonEmptyInterfaces),
    networkFindAvailablePort: checkPermission(["network:port"], permissions3)(findAvailablePort),
    networkIsPortTaken: checkPermission(["network:port"], permissions3)(isPortTaken),
    networkIsHttpPortOpen: checkPermission(["network:port"], permissions3)(isHttpPortOpen)
  };
};
var defaultUpdownloadApi = constructUpdownloadApi(["updownload:upload", "updownload:download"]);
var loggerApi = {
  loggerDebug: debug,
  loggerError: error,
  loggerInfo: info,
  loggerTrace: trace,
  loggerWarn: warn
};
var pathApi = {
  pathAppCacheDir: appCacheDir,
  pathAppConfigDir: appConfigDir,
  pathAppDataDir: appDataDir,
  pathAppLocalDataDir: appLocalDataDir,
  pathAppLogDir: appLogDir,
  pathAudioDir: audioDir,
  pathBasename: basename,
  pathCacheDir: cacheDir,
  pathConfigDir: configDir,
  pathDataDir: dataDir,
  pathDelimiter: () => Promise.resolve(delimiter()),
  pathDesktopDir: desktopDir,
  pathDirname: dirname,
  pathDocumentDir: documentDir,
  pathDownloadDir: downloadDir,
  pathExecutableDir: executableDir,
  pathExtname: extname,
  pathFontDir: fontDir,
  pathHomeDir: homeDir,
  pathIsAbsolute: isAbsolute,
  pathJoin: join,
  pathLocalDataDir: localDataDir,
  pathNormalize: normalize,
  pathPictureDir: pictureDir,
  pathPublicDir: publicDir,
  pathResolve: resolve,
  pathResolveResource: resolveResource,
  pathResourceDir: resourceDir,
  pathRuntimeDir: runtimeDir,
  pathSep: () => Promise.resolve(sep()),
  pathTempDir: tempDir,
  pathTemplateDir: templateDir,
  pathVideoDir: videoDir
};
var eventApi = {
  eventRawListen(event5, target, handler) {
    return invoke2("plugin:event|listen", {
      event: event5,
      target,
      handler: transformCallback2(handler)
    });
  },
  eventRawUnlisten: (event5, eventId) => invoke2("plugin:event|unlisten", {
    event: event5,
    eventId
  }),
  eventEmit: emit2,
  eventEmitTo: emitTo,
  eventOnce: once
};
var defaultClipboardApi = constructClipboardApi(["clipboard:read-all", "clipboard:write-all"]);
var defaultDialogApi = constructDialogApi(["dialog:all"]);
var defaultNotificationApi = constructNotificationApi(["notification:all"]);
var defaultFsApi = constructFsApi(["fs:read", "fs:write"]);
var defaultOsApi = constructOsApi(["os:all"]);
var defaultShellApi = constructShellApi(["shell:open", "shell:execute"]);
var defaultFetchApi = constructFetchApi(["fetch:all"]);
var defaultSystemInfoApi = constructSystemInfoApi(["system-info:all"]);
var defaultNetworkApi = constructNetworkApi(["network:interface", "network:port"]);
var defaultServerAPI = {
  ...defaultClipboardApi,
  ...defaultDialogApi,
  ...defaultNotificationApi,
  ...defaultFsApi,
  ...defaultOsApi,
  ...defaultShellApi,
  ...defaultFetchApi,
  ...defaultSystemInfoApi,
  ...defaultNetworkApi,
  ...eventApi,
  ...pathApi,
  ...loggerApi,
  ...defaultUpdownloadApi
};
// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/dist/constants.js
var EventType;
(function(EventType2) {
  EventType2["HttpRequestInited"] = "HttpRequestInited";
  EventType2["HttpRequestResult"] = "HttpRequestResult";
  EventType2["HttpRawFetch"] = "HttpRawFetch";
  EventType2["HttpFetchCancel"] = "HttpFetchCancel";
  EventType2["HttpFetchSend"] = "HttpFetchSend";
  EventType2["HttpFetchReadBody"] = "HttpFetchReadBody";
  EventType2["ClipboardHasText"] = "ClipboardHasText";
  EventType2["ClipboardHasImage"] = "ClipboardHasImage";
  EventType2["ClipboardHasHtml"] = "ClipboardHasHtml";
  EventType2["ClipboardHasRtf"] = "ClipboardHasRtf";
  EventType2["ClipboardHasFiles"] = "ClipboardHasFiles";
  EventType2["ClipboardWriteText"] = "ClipboardWriteText";
  EventType2["ClipboardWriteHtml"] = "ClipboardWriteHtml";
  EventType2["ClipboardWriteHtmlAndText"] = "ClipboardWriteHtmlAndText";
  EventType2["ClipboardWriteRtf"] = "ClipboardWriteRtf";
  EventType2["ClipboardWriteFilesUris"] = "ClipboardWriteFilesUris";
  EventType2["ClipboardWriteFiles"] = "ClipboardWriteFiles";
  EventType2["ClipboardClear"] = "ClipboardClear";
  EventType2["ClipboardReadText"] = "ClipboardReadText";
  EventType2["ClipboardReadHtml"] = "ClipboardReadHtml";
  EventType2["ClipboardReadRtf"] = "ClipboardReadRtf";
  EventType2["ClipboardReadFiles"] = "ClipboardReadFiles";
  EventType2["ClipboardReadFilesUris"] = "ClipboardReadFilesUris";
  EventType2["ClipboardReadImageBinary"] = "ClipboardReadImageBinary";
  EventType2["ClipboardReadImageBase64"] = "ClipboardReadImageBase64";
  EventType2["ClipboardWriteImageBinary"] = "ClipboardWriteImageBinary";
  EventType2["ClipboardWriteImageBase64"] = "ClipboardWriteImageBase64";
  EventType2["DialogAsk"] = "DialogAsk";
  EventType2["DialogConfirm"] = "DialogConfirm";
  EventType2["DialogMessage"] = "DialogMessage";
  EventType2["DialogOpen"] = "DialogOpen";
  EventType2["DialogSave"] = "DialogSave";
  EventType2["FsReadDir"] = "FsReadDir";
  EventType2["FsReadFile"] = "FsReadFile";
  EventType2["FsReadTextFile"] = "FsReadTextFile";
  EventType2["FsStat"] = "FsStat";
  EventType2["FsLstat"] = "FsLstat";
  EventType2["FsExists"] = "FsExists";
  EventType2["FsMkdir"] = "FsMkdir";
  EventType2["FsCreate"] = "FsCreate";
  EventType2["FsCopyFile"] = "FsCopyFile";
  EventType2["FsRemove"] = "FsRemove";
  EventType2["FsRename"] = "FsRename";
  EventType2["FsTruncate"] = "FsTruncate";
  EventType2["FsWriteFile"] = "FsWriteFile";
  EventType2["FsWriteTextFile"] = "FsWriteTextFile";
  EventType2["ShellxExecute"] = "ShellxExecute";
  EventType2["ShellxKill"] = "ShellxKill";
  EventType2["ShellxStdinWrite"] = "ShellxStdinWrite";
  EventType2["ShellxOpen"] = "ShellxOpen";
  EventType2["ShellxSpawn"] = "ShellxSpawn";
  EventType2["NotificationSendNotification"] = "NotificationSendNotification";
  EventType2["NotificationRequestPermission"] = "NotificationRequestPermission";
  EventType2["NotificationIsPermissionGranted"] = "NotificationIsPermissionGranted";
  EventType2["OsPlatform"] = "OsPlatform";
  EventType2["OsArch"] = "OsArch";
  EventType2["OsExeExtension"] = "OsExeExtension";
  EventType2["OsFamily"] = "OsFamily";
  EventType2["OsHostname"] = "OsHostname";
  EventType2["OsEol"] = "OsEol";
  EventType2["OsVersion"] = "OsVersion";
  EventType2["OsLocale"] = "OsLocale";
})(EventType || (EventType = {}));
// /Users/hacker/Dev/projects/Jarvis/extensions/hacker-news/node_modules/jarvis-api/dist/ui/worker/index.js
var generateJarvisPluginCommand = function(command) {
  return `${JarvisPluginCommandPrefix}|${command}`;
};
var openTrash = function() {
  return invoke3(generateJarvisPluginCommand("open_trash"));
};
var emptyTrash = function() {
  return invoke3(generateJarvisPluginCommand("empty_trash"));
};
var shutdown = function() {
  return invoke3(generateJarvisPluginCommand("shutdown"));
};
var reboot = function() {
  return invoke3(generateJarvisPluginCommand("reboot"));
};
var sleep = function() {
  return invoke3(generateJarvisPluginCommand("sleep"));
};
var toggleSystemAppearance = function() {
  return invoke3(generateJarvisPluginCommand("toggle_system_appearance"));
};
var showDesktop = function() {
  return invoke3(generateJarvisPluginCommand("show_desktop"));
};
var quitAllApps = function() {
  return invoke3(generateJarvisPluginCommand("quit_app_apps"));
};
var sleepDisplays = function() {
  return invoke3(generateJarvisPluginCommand("sleep_displays"));
};
var setVolume = function(percentage) {
  return invoke3(generateJarvisPluginCommand("set_volume"), { percentage });
};
var setVolumeTo0 = function() {
  return setVolume(0);
};
var setVolumeTo25 = function() {
  return setVolume(25);
};
var setVolumeTo50 = function() {
  return setVolume(50);
};
var setVolumeTo75 = function() {
  return setVolume(75);
};
var setVolumeTo100 = function() {
  return setVolume(100);
};
var turnVolumeUp = function() {
  return invoke3(generateJarvisPluginCommand("turn_volume_up"));
};
var turnVolumeDown = function() {
  return invoke3(generateJarvisPluginCommand("turn_volume_down"));
};
var toggleStageManager = function() {
  return invoke3(generateJarvisPluginCommand("toggle_stage_manager"));
};
var toggleBluetooth = function() {
  return invoke3(generateJarvisPluginCommand("toggle_bluetooth"));
};
var toggleHiddenFiles = function() {
  return invoke3(generateJarvisPluginCommand("toggle_hidden_files"));
};
var ejectAllDisks = function() {
  return invoke3(generateJarvisPluginCommand("eject_all_disks"));
};
var logoutUser = function() {
  return invoke3(generateJarvisPluginCommand("logout_user"));
};
var toggleMute = function() {
  return invoke3(generateJarvisPluginCommand("toggle_mute"));
};
var mute = function() {
  return invoke3(generateJarvisPluginCommand("mute"));
};
var unmute = function() {
  return invoke3(generateJarvisPluginCommand("unmute"));
};
var getFrontmostApp = function() {
  return invoke3(generateJarvisPluginCommand("get_frontmost_app")).then((app) => parse(AppInfo2, app));
};
var hideAllAppsExceptFrontmost = function() {
  return invoke3(generateJarvisPluginCommand("hide_all_apps_except_frontmost"));
};
var getSelectedFilesInFileExplorer = function() {
  return invoke3(generateJarvisPluginCommand("get_selected_files_in_file_explorer"));
};
var isAllowedOrigin2 = function(allowedOrigins, origin) {
  for (const allowedOrigin of allowedOrigins) {
    if (origin === allowedOrigin || allowedOrigin === "*") {
      return true;
    }
    if (allowedOrigin instanceof RegExp && allowedOrigin.test(origin)) {
      return true;
    }
  }
  return false;
};
var expose2 = function(obj, ep = globalThis, allowedOrigins = ["*"]) {
  ep.addEventListener("message", function callback(ev) {
    if (!ev || !ev.data) {
      return;
    }
    if (!isAllowedOrigin2(allowedOrigins, ev.origin)) {
      console.warn(`Invalid origin '${ev.origin}' for comlink proxy`);
      return;
    }
    const { id, type, path: path22 } = Object.assign({ path: [] }, ev.data);
    const argumentList = (ev.data.argumentList || []).map(fromWireValue2);
    let returnValue;
    try {
      const parent = path22.slice(0, -1).reduce((obj2, prop) => obj2[prop], obj);
      const rawValue = path22.reduce((obj2, prop) => obj2[prop], obj);
      switch (type) {
        case "GET":
          {
            returnValue = rawValue;
          }
          break;
        case "SET":
          {
            parent[path22.slice(-1)[0]] = fromWireValue2(ev.data.value);
            returnValue = true;
          }
          break;
        case "APPLY":
          {
            returnValue = rawValue.apply(parent, argumentList);
          }
          break;
        case "CONSTRUCT":
          {
            const value = new rawValue(...argumentList);
            returnValue = proxy2(value);
          }
          break;
        case "ENDPOINT":
          {
            const { port1, port2 } = new MessageChannel;
            expose2(obj, port2);
            returnValue = transfer2(port1, [port1]);
          }
          break;
        case "RELEASE":
          {
            returnValue = undefined;
          }
          break;
        default:
          return;
      }
    } catch (value) {
      returnValue = { value, [throwMarker2]: 0 };
    }
    Promise.resolve(returnValue).catch((value) => {
      return { value, [throwMarker2]: 0 };
    }).then((returnValue2) => {
      const [wireValue, transferables] = toWireValue2(returnValue2);
      ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
      if (type === "RELEASE") {
        ep.removeEventListener("message", callback);
        closeEndPoint2(ep);
        if (finalizer2 in obj && typeof obj[finalizer2] === "function") {
          obj[finalizer2]();
        }
      }
    }).catch((error2) => {
      const [wireValue, transferables] = toWireValue2({
        value: new TypeError("Unserializable return value"),
        [throwMarker2]: 0
      });
      ep.postMessage(Object.assign(Object.assign({}, wireValue), { id }), transferables);
    });
  });
  if (ep.start) {
    ep.start();
  }
};
var isMessagePort2 = function(endpoint) {
  return endpoint.constructor.name === "MessagePort";
};
var closeEndPoint2 = function(endpoint) {
  if (isMessagePort2(endpoint))
    endpoint.close();
};
var wrap2 = function(ep, target) {
  return createProxy2(ep, [], target);
};
var throwIfProxyReleased2 = function(isReleased) {
  if (isReleased) {
    throw new Error("Proxy has been released and is not useable");
  }
};
var releaseEndpoint2 = function(ep) {
  return requestResponseMessage2(ep, {
    type: "RELEASE"
  }).then(() => {
    closeEndPoint2(ep);
  });
};
var registerProxy2 = function(proxy2, ep) {
  const newCount = (proxyCounter2.get(ep) || 0) + 1;
  proxyCounter2.set(ep, newCount);
  if (proxyFinalizers2) {
    proxyFinalizers2.register(proxy2, ep, proxy2);
  }
};
var unregisterProxy2 = function(proxy2) {
  if (proxyFinalizers2) {
    proxyFinalizers2.unregister(proxy2);
  }
};
var createProxy2 = function(ep, path22 = [], target = function() {
}) {
  let isProxyReleased = false;
  const proxy2 = new Proxy(target, {
    get(_target, prop) {
      throwIfProxyReleased2(isProxyReleased);
      if (prop === releaseProxy2) {
        return () => {
          unregisterProxy2(proxy2);
          releaseEndpoint2(ep);
          isProxyReleased = true;
        };
      }
      if (prop === "then") {
        if (path22.length === 0) {
          return { then: () => proxy2 };
        }
        const r = requestResponseMessage2(ep, {
          type: "GET",
          path: path22.map((p) => p.toString())
        }).then(fromWireValue2);
        return r.then.bind(r);
      }
      return createProxy2(ep, [...path22, prop]);
    },
    set(_target, prop, rawValue) {
      throwIfProxyReleased2(isProxyReleased);
      const [value, transferables] = toWireValue2(rawValue);
      return requestResponseMessage2(ep, {
        type: "SET",
        path: [...path22, prop].map((p) => p.toString()),
        value
      }, transferables).then(fromWireValue2);
    },
    apply(_target, _thisArg, rawArgumentList) {
      throwIfProxyReleased2(isProxyReleased);
      const last = path22[path22.length - 1];
      if (last === createEndpoint2) {
        return requestResponseMessage2(ep, {
          type: "ENDPOINT"
        }).then(fromWireValue2);
      }
      if (last === "bind") {
        return createProxy2(ep, path22.slice(0, -1));
      }
      const [argumentList, transferables] = processArguments2(rawArgumentList);
      return requestResponseMessage2(ep, {
        type: "APPLY",
        path: path22.map((p) => p.toString()),
        argumentList
      }, transferables).then(fromWireValue2);
    },
    construct(_target, rawArgumentList) {
      throwIfProxyReleased2(isProxyReleased);
      const [argumentList, transferables] = processArguments2(rawArgumentList);
      return requestResponseMessage2(ep, {
        type: "CONSTRUCT",
        path: path22.map((p) => p.toString()),
        argumentList
      }, transferables).then(fromWireValue2);
    }
  });
  registerProxy2(proxy2, ep);
  return proxy2;
};
var myFlat2 = function(arr) {
  return Array.prototype.concat.apply([], arr);
};
var processArguments2 = function(argumentList) {
  const processed = argumentList.map(toWireValue2);
  return [processed.map((v) => v[0]), myFlat2(processed.map((v) => v[1]))];
};
var transfer2 = function(obj, transfers) {
  transferCache2.set(obj, transfers);
  return obj;
};
var proxy2 = function(obj) {
  return Object.assign(obj, { [proxyMarker2]: true });
};
var toWireValue2 = function(value) {
  for (const [name2, handler] of transferHandlers2) {
    if (handler.canHandle(value)) {
      const [serializedValue, transferables] = handler.serialize(value);
      return [
        {
          type: "HANDLER",
          name: name2,
          value: serializedValue
        },
        transferables
      ];
    }
  }
  return [
    {
      type: "RAW",
      value
    },
    transferCache2.get(value) || []
  ];
};
var fromWireValue2 = function(value) {
  switch (value.type) {
    case "HANDLER":
      return transferHandlers2.get(value.name).deserialize(value.value);
    case "RAW":
      return value.value;
  }
};
var requestResponseMessage2 = function(ep, msg, transfers) {
  return new Promise((resolve2) => {
    const id = generateUUID2();
    ep.addEventListener("message", function l(ev) {
      if (!ev.data || !ev.data.id || ev.data.id !== id) {
        return;
      }
      ep.removeEventListener("message", l);
      resolve2(ev.data);
    });
    if (ep.start) {
      ep.start();
    }
    ep.postMessage(Object.assign({ id }, msg), transfers);
  });
};
var generateUUID2 = function() {
  return new Array(4).fill(0).map(() => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)).join("-");
};
var constructSystemApi = function(permissions4) {
  return {
    systemOpenTrash: checkPermission([], permissions4)(openTrash),
    systemEmptyTrash: checkPermission(["system:fs"], permissions4)(emptyTrash),
    systemShutdown: checkPermission(["system:boot"], permissions4)(shutdown),
    systemReboot: checkPermission(["system:boot"], permissions4)(reboot),
    systemSleep: checkPermission(["system:boot"], permissions4)(sleep),
    systemToggleSystemAppearance: checkPermission(["system:ui"], permissions4)(toggleSystemAppearance),
    systemShowDesktop: checkPermission(["system:ui"], permissions4)(showDesktop),
    systemQuitAllApps: checkPermission(["system:apps"], permissions4)(quitAllApps),
    systemSleepDisplays: checkPermission(["system:boot"], permissions4)(sleepDisplays),
    systemSetVolume: checkPermission(["system:volumn"], permissions4)(setVolume),
    systemSetVolumeTo0: checkPermission(["system:volumn"], permissions4)(setVolumeTo0),
    systemSetVolumeTo25: checkPermission(["system:volumn"], permissions4)(setVolumeTo25),
    systemSetVolumeTo50: checkPermission(["system:volumn"], permissions4)(setVolumeTo50),
    systemSetVolumeTo75: checkPermission(["system:volumn"], permissions4)(setVolumeTo75),
    systemSetVolumeTo100: checkPermission(["system:volumn"], permissions4)(setVolumeTo100),
    systemTurnVolumeUp: checkPermission(["system:volumn"], permissions4)(turnVolumeUp),
    systemTurnVolumeDown: checkPermission(["system:volumn"], permissions4)(turnVolumeDown),
    systemToggleStageManager: checkPermission(["system:ui"], permissions4)(toggleStageManager),
    systemToggleBluetooth: checkPermission([], permissions4)(toggleBluetooth),
    systemToggleHiddenFiles: checkPermission(["system:ui"], permissions4)(toggleHiddenFiles),
    systemEjectAllDisks: checkPermission(["system:disk"], permissions4)(ejectAllDisks),
    systemLogoutUser: checkPermission(["system:boot"], permissions4)(logoutUser),
    systemToggleMute: checkPermission(["system:volumn"], permissions4)(toggleMute),
    systemMute: checkPermission(["system:volumn"], permissions4)(mute),
    systemUnmute: checkPermission(["system:volumn"], permissions4)(unmute),
    systemGetFrontmostApp: checkPermission(["system:apps"], permissions4)(getFrontmostApp),
    systemHideAllAppsExceptFrontmost: checkPermission(["system:apps"], permissions4)(hideAllAppsExceptFrontmost),
    systemGetSelectedFilesInFileExplorer: checkPermission(["system:fs"], permissions4)(getSelectedFilesInFileExplorer)
  };
};
var __defProp2 = Object.defineProperty;
var __export2 = (target, all) => {
  for (var name2 in all)
    __defProp2(target, name2, { get: all[name2], enumerable: true });
};
var list_exports2 = {};
__export2(list_exports2, {
  Dropdown: () => Dropdown2,
  DropdownItem: () => DropdownItem2,
  DropdownSection: () => DropdownSection2,
  EmptyView: () => EmptyView2,
  Item: () => Item2,
  ItemAccessory: () => ItemAccessory2,
  ItemDetail: () => ItemDetail2,
  ItemDetailMetadata: () => ItemDetailMetadata2,
  ItemDetailMetadataLabel: () => ItemDetailMetadataLabel2,
  ItemDetailMetadataLink: () => ItemDetailMetadataLink2,
  ItemDetailMetadataSeparator: () => ItemDetailMetadataSeparator2,
  ItemDetailMetadataTagList: () => ItemDetailMetadataTagList2,
  ItemDetailMetadataTagListItem: () => ItemDetailMetadataTagListItem2,
  List: () => List2,
  Section: () => Section2
});
var Color2 = pipe(string(), hexColor());
var NodeNameEnum2 = ((NodeNameEnum5) => {
  NodeNameEnum5["List"] = "List";
  NodeNameEnum5["ListItem"] = "ListItem";
  NodeNameEnum5["ListItemDetail"] = "ListItemDetail";
  NodeNameEnum5["ListItemAccessory"] = "ListItemAccessory";
  NodeNameEnum5["ListSection"] = "ListSection";
  NodeNameEnum5["ListItemDetailMetadata"] = "ListItemDetailMetadata";
  NodeNameEnum5["ListItemDetailMetadataLabel"] = "ListItemDetailMetadataLabel";
  NodeNameEnum5["ListItemDetailMetadataLink"] = "ListItemDetailMetadataLink";
  NodeNameEnum5["ListItemDetailMetadataTagList"] = "ListItemDetailMetadataTagList";
  NodeNameEnum5["ListItemDetailMetadataTagListItem"] = "ListItemDetailMetadataTagListItem";
  NodeNameEnum5["ListItemDetailMetadataSeparator"] = "ListItemDetailMetadataSeparator";
  NodeNameEnum5["Icon"] = "Icon";
  NodeNameEnum5["EmptyView"] = "EmptyView";
  NodeNameEnum5["Dropdown"] = "Dropdown";
  NodeNameEnum5["DropdownSection"] = "DropdownSection";
  NodeNameEnum5["DropdownItem"] = "DropdownItem";
  NodeNameEnum5["ActionPanel"] = "ActionPanel";
  NodeNameEnum5["Action"] = "Action";
  NodeNameEnum5["ActionPanelSection"] = "ActionPanelSection";
  NodeNameEnum5["ActionPanelSubmenu"] = "ActionPanelSubmenu";
  return NodeNameEnum5;
})(NodeNameEnum2 || {});
var NodeName2 = enum_(NodeNameEnum2);
var IconEnum2 = ((IconEnum22) => {
  IconEnum22["Iconify"] = "iconify";
  IconEnum22["RemoteUrl"] = "remote-url";
  IconEnum22["Svg"] = "svg";
  IconEnum22["Base64PNG"] = "base64-png";
  IconEnum22["Text"] = "text";
  return IconEnum22;
})(IconEnum2 || {});
var IconType2 = enum_(IconEnum2);
var Icon2 = object({
  type: IconType2,
  value: string()
});
var IconNode2 = object({
  nodeName: NodeName2,
  ...Icon2.entries
});
var Action2 = object({
  nodeName: NodeName2,
  icon: optional(Icon2),
  title: string(),
  value: optional(string())
});
var ActionPanel2 = object({
  nodeName: NodeName2,
  title: optional(string()),
  items: array(union([
    Action2
  ]))
});
var EmptyView2 = object({
  nodeName: NodeName2,
  title: optional(string()),
  description: optional(string()),
  icon: optional(Icon2)
});
var DropdownItem2 = object({
  nodeName: NodeName2,
  title: string(),
  value: string(),
  icon: optional(Icon2),
  keywords: optional(array(string()))
});
var DropdownSection2 = object({
  nodeName: NodeName2,
  title: string(),
  items: array(DropdownItem2)
});
var Dropdown2 = object({
  nodeName: NodeName2,
  tooltip: string(),
  sections: array(DropdownSection2),
  defaultValue: string()
});
var ItemAccessory2 = object({
  nodeName: NodeName2,
  tag: optional(union([
    string(),
    object({
      color: Color2,
      text: string()
    })
  ])),
  text: optional(union([string(), object({ color: Color2, text: string() })])),
  date: optional(union([date(), object({ color: Color2, text: date() })])),
  icon: optional(Icon2),
  tooltip: optional(string())
});
var ItemDetailMetadataLabel2 = object({
  nodeName: NodeName2,
  title: string(),
  icon: optional(Icon2),
  text: optional(union([
    string(),
    object({
      color: Color2,
      text: string()
    })
  ]))
});
var ItemDetailMetadataLink2 = object({
  nodeName: NodeName2,
  title: string(),
  text: string(),
  url: string()
});
var ItemDetailMetadataTagListItem2 = object({
  nodeName: NodeName2,
  text: optional(string()),
  color: optional(Color2),
  icon: optional(Icon2)
});
var ItemDetailMetadataTagList2 = object({
  nodeName: NodeName2,
  title: string(),
  tags: array(ItemDetailMetadataTagListItem2)
});
var ItemDetailMetadataSeparator2 = object({
  nodeName: NodeName2
});
var ItemDetailMetadata2 = object({
  nodeName: NodeName2,
  items: array(union([
    ItemDetailMetadataLabel2,
    ItemDetailMetadataLink2,
    ItemDetailMetadataTagList2,
    ItemDetailMetadataSeparator2
  ]))
});
var ItemDetail2 = object({
  nodeName: NodeName2,
  markdown: optional(string()),
  metadata: optional(ItemDetailMetadata2)
});
var Item2 = object({
  nodeName: NodeName2,
  title: string(),
  subTitle: optional(string()),
  accessories: optional(array(ItemAccessory2)),
  value: string(),
  defaultAction: optional(string()),
  actions: optional(ActionPanel2),
  detail: optional(ItemDetail2),
  icon: optional(Icon2),
  keywords: optional(array(string()))
});
var Section2 = object({
  nodeName: NodeName2,
  title: optional(string()),
  subtitle: optional(string()),
  items: array(Item2)
});
var List2 = object({
  nodeName: NodeName2,
  sections: optional(array(Section2)),
  items: optional(array(Item2))
});
var AppInfo2 = object({
  name: string(),
  icon_path: nullable(string()),
  app_path_exe: nullable(string()),
  app_desktop_path: string()
});
var ExtensionLabelMap2 = record(string("Window label"), object({
  path: string("Path to the extension")
}));
var Ext2 = object({
  extId: number(),
  identifier: string(),
  version: string(),
  enabled: boolean(),
  installed_at: string()
});
var CmdTypeEnum2 = ((CmdTypeEnum22) => {
  CmdTypeEnum22["Iframe"] = "iframe";
  CmdTypeEnum22["Worker"] = "worker";
  CmdTypeEnum22["QuickLink"] = "quick_link";
  CmdTypeEnum22["Remote"] = "remote";
  return CmdTypeEnum22;
})(CmdTypeEnum2 || {});
var CmdType2 = enum_(CmdTypeEnum2);
var ExtCmd2 = object({
  cmdId: number(),
  extId: number(),
  name: string(),
  type: CmdType2,
  data: string(),
  alias: optional(string()),
  hotkey: optional(string()),
  enabled: boolean()
});
var ExtData2 = object({
  dataId: number(),
  extId: number(),
  dataType: string(),
  data: optional(string()),
  searchText: optional(string()),
  createdAt: date(),
  updatedAt: date()
});
var SysCommand2 = object({
  name: string(),
  value: string(),
  icon: nullable(Icon2),
  keywords: nullable(array(string())),
  function: function_(),
  confirmRequired: boolean()
});
var SQLSortOrderEnum2 = ((SQLSortOrderEnum22) => {
  SQLSortOrderEnum22["Asc"] = "ASC";
  SQLSortOrderEnum22["Desc"] = "DESC";
  return SQLSortOrderEnum22;
})(SQLSortOrderEnum2 || {});
var SQLSortOrder2 = enum_(SQLSortOrderEnum2);
var SystemPermissionSchema2 = union([
  literal("system:volumn"),
  literal("system:boot"),
  literal("system:disk"),
  literal("system:apps"),
  literal("system:fs"),
  literal("system:ui")
]);
var AllJarvisPermission2 = union([
  AllPermissionSchema,
  SystemPermissionSchema2
]);
var JarvisPluginCommandPrefix = "plugin:jarvis";
var ExtDataField = union([literal("data"), literal("search_text")]);
var defaultClientAPI14 = getDefaultClientAPI();
var comlinkSystem = {
  openTrash: defaultClientAPI14.systemOpenTrash,
  emptyTrash: defaultClientAPI14.systemEmptyTrash,
  shutdown: defaultClientAPI14.systemShutdown,
  reboot: defaultClientAPI14.systemReboot,
  sleep: defaultClientAPI14.systemSleep,
  toggleSystemAppearance: defaultClientAPI14.systemToggleSystemAppearance,
  showDesktop: defaultClientAPI14.systemShowDesktop,
  quitAllApps: defaultClientAPI14.systemQuitAllApps,
  sleepDisplays: defaultClientAPI14.systemSleepDisplays,
  setVolume: defaultClientAPI14.systemSetVolume,
  setVolumeTo0: defaultClientAPI14.systemSetVolumeTo0,
  setVolumeTo25: defaultClientAPI14.systemSetVolumeTo25,
  setVolumeTo50: defaultClientAPI14.systemSetVolumeTo50,
  setVolumeTo75: defaultClientAPI14.systemSetVolumeTo75,
  setVolumeTo100: defaultClientAPI14.systemSetVolumeTo100,
  turnVolumeUp: defaultClientAPI14.systemTurnVolumeUp,
  turnVolumeDown: defaultClientAPI14.systemTurnVolumeDown,
  toggleStageManager: defaultClientAPI14.systemToggleStageManager,
  toggleBluetooth: defaultClientAPI14.systemToggleBluetooth,
  toggleHiddenFiles: defaultClientAPI14.systemToggleHiddenFiles,
  ejectAllDisks: defaultClientAPI14.systemEjectAllDisks,
  logoutUser: defaultClientAPI14.systemLogoutUser,
  toggleMute: defaultClientAPI14.systemToggleMute,
  mute: defaultClientAPI14.systemMute,
  unmute: defaultClientAPI14.systemUnmute,
  getFrontmostApp: defaultClientAPI14.systemGetFrontmostApp,
  hideAllAppsExceptFrontmost: defaultClientAPI14.systemHideAllAppsExceptFrontmost,
  getSelectedFilesInFileExplorer: defaultClientAPI14.systemGetSelectedFilesInFileExplorer
};
var nativeSystem = {
  ejectAllDisks,
  emptyTrash,
  getFrontmostApp,
  getSelectedFilesInFileExplorer,
  hideAllAppsExceptFrontmost,
  logoutUser,
  mute,
  openTrash,
  quitAllApps,
  reboot,
  setVolume,
  setVolumeTo0,
  setVolumeTo25,
  setVolumeTo50,
  setVolumeTo75,
  setVolumeTo100,
  showDesktop,
  shutdown,
  sleep,
  sleepDisplays,
  toggleBluetooth,
  toggleHiddenFiles,
  toggleMute,
  toggleStageManager,
  toggleSystemAppearance,
  turnVolumeDown,
  turnVolumeUp,
  unmute
};
var system = isMain() ? nativeSystem : comlinkSystem;
var comlinkUI = getDefaultClientAPI();
var defaultClientAPI22 = getDefaultClientAPI();
var toast2 = {
  message: defaultClientAPI22.toastMessage,
  info: defaultClientAPI22.toastInfo,
  success: defaultClientAPI22.toastSuccess,
  warning: defaultClientAPI22.toastWarning,
  error: defaultClientAPI22.toastError
};
var defaultClientAPI32 = getDefaultClientAPI();
var comlinkDb = {
  add: defaultClientAPI32.dbAdd,
  delete: defaultClientAPI32.dbDelete,
  search: defaultClientAPI32.dbSearch,
  retrieveAll: defaultClientAPI32.dbRetrieveAll,
  retrieveAllByType: defaultClientAPI32.dbRetrieveAllByType,
  deleteAll: defaultClientAPI32.dbDeleteAll,
  update: defaultClientAPI32.dbUpdate
};
var proxyMarker2 = Symbol("Comlink.proxy");
var createEndpoint2 = Symbol("Comlink.endpoint");
var releaseProxy2 = Symbol("Comlink.releaseProxy");
var finalizer2 = Symbol("Comlink.finalizer");
var throwMarker2 = Symbol("Comlink.thrown");
var isObject2 = (val) => typeof val === "object" && val !== null || typeof val === "function";
var proxyTransferHandler2 = {
  canHandle: (val) => isObject2(val) && val[proxyMarker2],
  serialize(obj) {
    const { port1, port2 } = new MessageChannel;
    expose2(obj, port1);
    return [port2, [port2]];
  },
  deserialize(port) {
    port.start();
    return wrap2(port);
  }
};
var throwTransferHandler2 = {
  canHandle: (value) => isObject2(value) && (throwMarker2 in value),
  serialize({ value }) {
    let serialized;
    if (value instanceof Error) {
      serialized = {
        isError: true,
        value: {
          message: value.message,
          name: value.name,
          stack: value.stack
        }
      };
    } else {
      serialized = { isError: false, value };
    }
    return [serialized, []];
  },
  deserialize(serialized) {
    if (serialized.isError) {
      throw Object.assign(new Error(serialized.value.message), serialized.value);
    }
    throw serialized.value;
  }
};
var transferHandlers2 = new Map([
  ["proxy", proxyTransferHandler2],
  ["throw", throwTransferHandler2]
]);
var proxyCounter2 = new WeakMap;
var proxyFinalizers2 = "FinalizationRegistry" in globalThis && new FinalizationRegistry((ep) => {
  const newCount = (proxyCounter2.get(ep) || 0) - 1;
  proxyCounter2.set(ep, newCount);
  if (newCount === 0) {
    releaseEndpoint2(ep);
  }
});
var transferCache2 = new WeakMap;
var defaultSystemApi = constructSystemApi([
  "system:volumn",
  "system:boot",
  "system:disk",
  "system:apps",
  "system:fs"
]);
var Icon22 = class {
  constructor(model) {
    this.nodeName = "Icon";
    this.type = model.type;
    this.value = model.value;
  }
  toModel() {
    return {
      nodeName: this.nodeName,
      type: this.type,
      value: this.value
    };
  }
};
var list_view_exports = {};
__export2(list_view_exports, {
  Dropdown: () => Dropdown22,
  DropdownItem: () => DropdownItem22,
  DropdownSection: () => DropdownSection22,
  EmptyView: () => EmptyView22,
  Item: () => Item22,
  ItemAccessory: () => ItemAccessory22,
  ItemDetail: () => ItemDetail22,
  ItemDetailMetadata: () => ItemDetailMetadata22,
  ItemDetailMetadataLabel: () => ItemDetailMetadataLabel22,
  ItemDetailMetadataLink: () => ItemDetailMetadataLink22,
  ItemDetailMetadataSeparator: () => ItemDetailMetadataSeparator22,
  ItemDetailMetadataTagList: () => ItemDetailMetadataTagList22,
  ItemDetailMetadataTagListItem: () => ItemDetailMetadataTagListItem22,
  List: () => List22,
  Section: () => Section22
});
var action_exports2 = {};
__export2(action_exports2, {
  Action: () => Action22,
  ActionPanel: () => ActionPanel22
});
var Action22 = class {
  constructor(model) {
    this.nodeName = "Action";
    this.icon = model.icon;
    this.title = model.title;
    this.value = model.value;
  }
  toModel() {
    return {
      nodeName: this.nodeName,
      title: this.title,
      icon: this.icon
    };
  }
};
var ActionPanel22 = class {
  constructor(model) {
    this.nodeName = "ActionPanel";
    this.title = model.title;
    this.items = model.items;
  }
  toModel() {
    return {
      nodeName: this.nodeName,
      title: this.title,
      items: this.items.map((item) => item.toModel())
    };
  }
};
var EmptyView22 = class {
  constructor(model) {
    this.nodeName = "EmptyView";
    this.title = model.title;
    this.description = model.description;
    this.icon = model.icon;
  }
  toModel() {
    return {
      nodeName: this.nodeName,
      title: this.title,
      description: this.description,
      icon: this.icon?.toModel()
    };
  }
};
var DropdownItem22 = class {
  constructor(model) {
    this.nodeName = "DropdownItem";
    this.title = model.title;
    this.value = model.value;
    this.icon = model.icon;
    this.keywords = model.keywords;
  }
  toModel() {
    return {
      nodeName: this.nodeName,
      title: this.title,
      value: this.value,
      icon: this.icon?.toModel(),
      keywords: this.keywords
    };
  }
};
var DropdownSection22 = class {
  constructor(model) {
    this.nodeName = "DropdownSection";
    this.title = model.title;
    this.items = model.items;
  }
  toModel() {
    return {
      nodeName: this.nodeName,
      title: this.title,
      items: this.items.map((item) => item.toModel())
    };
  }
};
var Dropdown22 = class {
  constructor(model) {
    this.nodeName = "Dropdown";
    this.tooltip = model.tooltip;
    this.sections = model.sections;
    this.defaultValue = model.defaultValue;
  }
  toModel() {
    return {
      nodeName: this.nodeName,
      tooltip: this.tooltip,
      sections: this.sections.map((section) => section.toModel()),
      defaultValue: this.defaultValue
    };
  }
};
var ItemAccessory22 = class {
  constructor(model) {
    this.nodeName = "ListItemAccessory";
    this.tag = model.tag;
    this.text = model.text;
    this.date = model.date;
    this.icon = model.icon;
    this.tooltip = model.tooltip;
  }
  toModel() {
    return {
      nodeName: this.nodeName,
      tag: this.tag,
      text: this.text,
      date: this.date,
      icon: this.icon?.toModel(),
      tooltip: this.tooltip
    };
  }
};
var ItemDetailMetadataLabel22 = class {
  constructor(model) {
    this.nodeName = "ListItemDetailMetadataLabel";
    this.title = model.title;
    this.icon = model.icon;
    this.text = model.text;
  }
  toModel() {
    return {
      nodeName: this.nodeName,
      title: this.title,
      icon: this.icon?.toModel(),
      text: this.text
    };
  }
};
var ItemDetailMetadataLink22 = class {
  constructor(model) {
    this.nodeName = "ListItemDetailMetadataLink";
    this.title = model.title;
    this.text = model.text;
    this.url = model.url;
  }
  toModel() {
    return {
      nodeName: this.nodeName,
      title: this.title,
      text: this.text,
      url: this.url
    };
  }
};
var ItemDetailMetadataTagListItem22 = class {
  constructor(model) {
    this.nodeName = "ListItemDetailMetadataTagListItem";
    this.text = model.text;
    this.color = model.color;
    this.icon = model.icon;
  }
  toModel() {
    return {
      nodeName: this.nodeName,
      text: this.text,
      color: this.color,
      icon: this.icon?.toModel()
    };
  }
};
var ItemDetailMetadataTagList22 = class {
  constructor(model) {
    this.nodeName = "ListItemDetailMetadataTagList";
    this.title = model.title;
    this.tags = model.tags;
  }
  toModel() {
    return {
      nodeName: this.nodeName,
      title: this.title,
      tags: this.tags.map((tag) => tag.toModel())
    };
  }
};
var ItemDetailMetadataSeparator22 = class {
  constructor() {
    this.nodeName = "ListItemDetailMetadataSeparator";
  }
  toModel() {
    return {
      nodeName: this.nodeName
    };
  }
};
var ItemDetailMetadata22 = class {
  constructor(items) {
    this.nodeName = "ListItemDetailMetadata";
    this.items = items;
  }
  toModel() {
    return {
      nodeName: this.nodeName,
      items: this.items.map((item) => item.toModel())
    };
  }
};
var ItemDetail22 = class {
  constructor(model) {
    this.nodeName = "ListItemDetail";
    this.markdown = model.markdown;
    this.metadata = model.metadata;
  }
  toModel() {
    return {
      nodeName: this.nodeName,
      metadata: this.metadata?.toModel()
    };
  }
};
var Item22 = class {
  constructor(model) {
    this.nodeName = "ListItem";
    this.title = model.title;
    this.value = model.value;
    this.actions = model.actions;
    this.defaultAction = model.defaultAction;
    this.subTitle = model.subTitle;
    this.accessories = model.accessories;
    this.detail = model.detail;
    this.icon = model.icon;
    this.keywords = model.keywords;
  }
  toModel() {
    return {
      nodeName: this.nodeName,
      title: this.title,
      value: this.value,
      defaultAction: this.defaultAction,
      actions: this.actions?.toModel(),
      subTitle: this.subTitle,
      accessories: this.accessories?.map((accessory) => accessory.toModel()),
      detail: this.detail?.toModel(),
      icon: this.icon?.toModel(),
      keywords: this.keywords
    };
  }
};
var Section22 = class {
  constructor(model) {
    this.nodeName = "ListSection";
    this.title = model.title;
    this.subtitle = model.subtitle;
    this.items = model.items;
  }
  toModel() {
    return {
      nodeName: this.nodeName,
      title: this.title,
      subtitle: this.subtitle,
      items: this.items.map((item) => item.toModel())
    };
  }
};
var List22 = class {
  constructor(model) {
    this.nodeName = "List";
    this.sections = model.sections;
    this.items = model.items;
  }
  toModel() {
    return {
      nodeName: this.nodeName,
      sections: this.sections?.map((section) => section.toModel()),
      items: this.items?.map((item) => item.toModel())
    };
  }
};
var schema_exports = {};
__export2(schema_exports, {
  Icon: () => Icon2,
  IconEnum: () => IconEnum2,
  IconNode: () => IconNode2,
  IconType: () => IconType2
});
/*! Bundled license information:

@huakunshen/comlink/dist/esm/comlink.mjs:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: Apache-2.0
   *)
*/

// index.ts
var hackerNewsItemToListItem = function(item, idx) {
  return new list_view_exports.Item({
    title: item.title,
    value: item.title,
    subTitle: `${item.by}`,
    icon: new Icon22({ type: IconEnum.Text, value: (idx + 1).toString() }),
    keywords: [item.by],
    accessories: [
      new list_view_exports.ItemAccessory({
        icon: new Icon22({ type: IconEnum.Iconify, value: "fa6-regular:circle-up" }),
        text: `${item.score}`
      })
    ],
    defaultAction: "Open",
    actions: new action_exports2.ActionPanel({
      items: [
        new action_exports2.Action({
          title: "Open",
          icon: new Icon22({ type: IconEnum.Iconify, value: "ion:open-outline" })
        })
      ]
    })
  });
};
var HackerNewsItem = object({
  by: string(),
  title: string(),
  url: optional(string()),
  score: number()
});

class HackerNews {
  items;
  listitems;
  storyIds;
  value;
  constructor() {
    this.items = [];
    this.listitems = [];
    this.storyIds = [];
  }
  onActionSelected(actionValue) {
    switch (actionValue) {
      case "Open":
        const target = this.items.find((item) => item.title === this.value);
        if (target) {
          if (target.url) {
            return comlinkShell.open(target.url);
          }
        }
        toast2.error("Item not found");
        break;
      default:
        break;
    }
    return Promise.resolve();
  }
  onHighlightedItemChanged(value) {
    this.value = value;
    return Promise.resolve();
  }
  async onScrolledToBottom() {
    await comlinkUI.setScrollLoading(true);
    return Promise.all(this.storyIds.slice(this.items.length, this.items.length + 20).map((id) => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((res) => res.json()))).then((stories) => {
      const parsed = safeParse(array(HackerNewsItem), stories);
      if (parsed.issues) {
        for (const issue of parsed.issues) {
          toast2.error(issue.message);
        }
        return;
      }
      this.items = this.items.concat(parsed.output);
      this.listitems = this.items.map(hackerNewsItemToListItem);
      return comlinkUI.render(new list_view_exports.List({ items: this.listitems }));
    }).then(() => comlinkUI.setScrollLoading(false));
  }
  async load() {
    return fetch("https://hacker-news.firebaseio.com/v0/topstories.json").then((res) => res.json()).then((data) => {
      const storyIds = parse(array(number()), data);
      this.storyIds = storyIds;
      return Promise.all(this.storyIds.slice(0, 20).map((id) => fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((res) => res.json())));
    }).then((stories) => {
      const parsed = safeParse(array(HackerNewsItem), stories);
      if (parsed.issues) {
        for (const issue of parsed.issues) {
          toast2.error(issue.message);
        }
        return;
      }
      this.items = parsed.output;
      this.listitems = this.items.map(hackerNewsItemToListItem);
      return comlinkUI.render(new list_view_exports.List({ items: this.listitems }));
    }).catch((err) => {
      console.error(err);
    });
  }
  onSearchTermChange(term) {
    const filtered = this.items.filter((item) => item.title.toLowerCase().includes(term.toLowerCase()));
    this.listitems = filtered.map(hackerNewsItemToListItem);
    return Promise.resolve();
  }
  onItemSelected(value) {
    const target = this.items.find((item) => item.title === value);
    if (target) {
      if (target.url) {
        return comlinkShell.open(target.url);
      }
    }
    toast2.error("Item not found");
    return Promise.resolve();
  }
}
expose2(new HackerNews);
