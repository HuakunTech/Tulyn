// /Users/hacker/Dev/projects/Jarvis/node_modules/.pnpm/tauri-plugin-clipboard-api@2.1.1/node_modules/zod/lib/index.mjs
var setErrorMap = function(map) {
  overrideErrorMap = map;
};
var getErrorMap = function() {
  return overrideErrorMap;
};
var addIssueToContext = function(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      ctx.schemaErrorMap,
      overrideMap,
      overrideMap === errorMap ? undefined : errorMap
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
};
var __classPrivateFieldGet = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var processCreateParams = function(params) {
  if (!params)
    return {};
  const { errorMap, invalid_type_error, required_error, description } = params;
  if (errorMap && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap)
    return { errorMap, description };
  const customMap = (iss, ctx) => {
    var _a, _b;
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message !== null && message !== undefined ? message : ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: (_a = message !== null && message !== undefined ? message : required_error) !== null && _a !== undefined ? _a : ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: (_b = message !== null && message !== undefined ? message : invalid_type_error) !== null && _b !== undefined ? _b : ctx.defaultError };
  };
  return { errorMap: customMap, description };
};
var timeRegexSource = function(args) {
  let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
  if (args.precision) {
    regex = `${regex}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    regex = `${regex}(\\.\\d+)?`;
  }
  return regex;
};
var timeRegex = function(args) {
  return new RegExp(`^${timeRegexSource(args)}\$`);
};
var datetimeRegex = function(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}\$`);
};
var isValidIP = function(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
};
var floatSafeRemainder = function(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / Math.pow(10, decCount);
};
var deepPartialify = function(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
};
var mergeValues = function(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0;index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
};
var createZodEnum = function(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
};
var custom = function(check, params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      var _a, _b;
      if (!check(data)) {
        const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
        const _fatal = (_b = (_a = p.fatal) !== null && _a !== undefined ? _a : fatal) !== null && _b !== undefined ? _b : true;
        const p2 = typeof p === "string" ? { message: p } : p;
        ctx.addIssue({ code: "custom", ...p2, fatal: _fatal });
      }
    });
  return ZodAny.create();
};
var util;
(function(util2) {
  util2.assertEqual = (val) => val;
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error;
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};

class ZodError extends Error {
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  get errors() {
    return this.issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
}
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var overrideErrorMap = errorMap;
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== undefined) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];

class ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
}
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === undefined ? undefined : message.message;
})(errorUtil || (errorUtil = {}));
var _ZodEnum_cache;
var _ZodNativeEnum_cache;

class ParseInputLazyPath {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (this._key instanceof Array) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
}
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};

class ZodType {
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
  }
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus,
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    var _a;
    const ctx = {
      common: {
        issues: [],
        async: (_a = params === null || params === undefined ? undefined : params.async) !== null && _a !== undefined ? _a : false,
        contextualErrorMap: params === null || params === undefined ? undefined : params.errorMap
      },
      path: (params === null || params === undefined ? undefined : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params === null || params === undefined ? undefined : params.errorMap,
        async: true
      },
      path: (params === null || params === undefined ? undefined : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this, this._def);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(undefined).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+\$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv6Regex = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}\$`);

class ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus;
    let ctx = undefined;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch (_a) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    var _a, _b;
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof (options === null || options === undefined ? undefined : options.precision) === "undefined" ? null : options === null || options === undefined ? undefined : options.precision,
      offset: (_a = options === null || options === undefined ? undefined : options.offset) !== null && _a !== undefined ? _a : false,
      local: (_b = options === null || options === undefined ? undefined : options.local) !== null && _b !== undefined ? _b : false,
      ...errorUtil.errToObj(options === null || options === undefined ? undefined : options.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof (options === null || options === undefined ? undefined : options.precision) === "undefined" ? null : options === null || options === undefined ? undefined : options.precision,
      ...errorUtil.errToObj(options === null || options === undefined ? undefined : options.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options === null || options === undefined ? undefined : options.position,
      ...errorUtil.errToObj(options === null || options === undefined ? undefined : options.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodString.create = (params) => {
  var _a;
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (_a = params === null || params === undefined ? undefined : params.coerce) !== null && _a !== undefined ? _a : false,
    ...processCreateParams(params)
  });
};

class ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = undefined;
    const status = new ParseStatus;
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null, min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
}
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params === null || params === undefined ? undefined : params.coerce) || false,
    ...processCreateParams(params)
  });
};

class ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = BigInt(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.bigint,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = undefined;
    const status = new ParseStatus;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodBigInt.create = (params) => {
  var _a;
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (_a = params === null || params === undefined ? undefined : params.coerce) !== null && _a !== undefined ? _a : false,
    ...processCreateParams(params)
  });
};

class ZodBoolean extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params === null || params === undefined ? undefined : params.coerce) || false,
    ...processCreateParams(params)
  });
};

class ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus;
    let ctx = undefined;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
}
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: (params === null || params === undefined ? undefined : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};

class ZodSymbol extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};

class ZodUndefined extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};

class ZodNull extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};

class ZodAny extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};

class ZodUnknown extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};

class ZodNever extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
}
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};

class ZodVoid extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};

class ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : undefined,
          maximum: tooBig ? def.exactLength.value : undefined,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};

class ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    return this._cached = { shape, keys };
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip")
        ;
      else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== undefined ? {
        errorMap: (issue, ctx) => {
          var _a, _b, _c, _d;
          const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === undefined ? undefined : _b.call(_a, issue, ctx).message) !== null && _c !== undefined ? _c : ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: (_d = errorUtil.errToObj(message).message) !== null && _d !== undefined ? _d : defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  extend(augmentation) {
    return new ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  merge(merging) {
    const merged = new ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  catchall(index) {
    return new ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    util.objectKeys(mask).forEach((key) => {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
}
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};

class ZodUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = undefined;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
}
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [undefined];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [undefined, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};

class ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  static create(discriminator, options, params) {
    const optionsMap = new Map;
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
}

class ZodIntersection extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
}
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};

class ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new ZodTuple({
      ...this._def,
      rest
    });
  }
}
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};

class ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
}

class ZodMap extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = new Map;
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = new Map;
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
}
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};

class ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = new Set;
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};

class ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
}

class ZodLazy extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
}
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};

class ZodLiteral extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
}
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};

class ZodEnum extends ZodType {
  constructor() {
    super(...arguments);
    _ZodEnum_cache.set(this, undefined);
  }
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f").has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
}
_ZodEnum_cache = new WeakMap;
ZodEnum.create = createZodEnum;

class ZodNativeEnum extends ZodType {
  constructor() {
    super(...arguments);
    _ZodNativeEnum_cache.set(this, undefined);
  }
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util.getValidEnumValues(this._def.values)), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f").has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
}
_ZodNativeEnum_cache = new WeakMap;
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};

class ZodPromise extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
}
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};

class ZodEffects extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return base;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return base;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
        });
      }
    }
    util.assertNever(effect);
  }
}
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};

class ZodOptional extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(undefined);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};

class ZodNullable extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};

class ZodDefault extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};

class ZodCatch extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};

class ZodNaN extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
}
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");

class ZodBranded extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
}

class ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
}

class ZodReadonly extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true })
};
var NEVER = INVALID;
var z = Object.freeze({
  __proto__: null,
  defaultErrorMap: errorMap,
  setErrorMap,
  getErrorMap,
  makeIssue,
  EMPTY_PATH,
  addIssueToContext,
  ParseStatus,
  INVALID,
  DIRTY,
  OK,
  isAborted,
  isDirty,
  isValid,
  isAsync,
  get util() {
    return util;
  },
  get objectUtil() {
    return objectUtil;
  },
  ZodParsedType,
  getParsedType,
  ZodType,
  datetimeRegex,
  ZodString,
  ZodNumber,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodSymbol,
  ZodUndefined,
  ZodNull,
  ZodAny,
  ZodUnknown,
  ZodNever,
  ZodVoid,
  ZodArray,
  ZodObject,
  ZodUnion,
  ZodDiscriminatedUnion,
  ZodIntersection,
  ZodTuple,
  ZodRecord,
  ZodMap,
  ZodSet,
  ZodFunction,
  ZodLazy,
  ZodLiteral,
  ZodEnum,
  ZodNativeEnum,
  ZodPromise,
  ZodEffects,
  ZodTransformer: ZodEffects,
  ZodOptional,
  ZodNullable,
  ZodDefault,
  ZodCatch,
  ZodNaN,
  BRAND,
  ZodBranded,
  ZodPipeline,
  ZodReadonly,
  custom,
  Schema: ZodType,
  ZodSchema: ZodType,
  late,
  get ZodFirstPartyTypeKind() {
    return ZodFirstPartyTypeKind;
  },
  coerce,
  any: anyType,
  array: arrayType,
  bigint: bigIntType,
  boolean: booleanType,
  date: dateType,
  discriminatedUnion: discriminatedUnionType,
  effect: effectsType,
  enum: enumType,
  function: functionType,
  instanceof: instanceOfType,
  intersection: intersectionType,
  lazy: lazyType,
  literal: literalType,
  map: mapType,
  nan: nanType,
  nativeEnum: nativeEnumType,
  never: neverType,
  null: nullType,
  nullable: nullableType,
  number: numberType,
  object: objectType,
  oboolean,
  onumber,
  optional: optionalType,
  ostring,
  pipeline: pipelineType,
  preprocess: preprocessType,
  promise: promiseType,
  record: recordType,
  set: setType,
  strictObject: strictObjectType,
  string: stringType,
  symbol: symbolType,
  transformer: effectsType,
  tuple: tupleType,
  undefined: undefinedType,
  union: unionType,
  unknown: unknownType,
  void: voidType,
  NEVER,
  ZodIssueCode,
  quotelessJson,
  ZodError
});

// ../../node_modules/.pnpm/@tauri-apps+api@2.0.0-beta.11/node_modules/@tauri-apps/api/external/tslib/tslib.es6.js
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

// /Users/hacker/Dev/projects/Jarvis/node_modules/.pnpm/tauri-plugin-clipboard-api@2.1.1/node_modules/@tauri-apps/api/core.js
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

class Channel {
  constructor() {
    this.__TAURI_CHANNEL_MARKER__ = true;
    _Channel_onmessage.set(this, () => {
    });
    _Channel_nextMessageId.set(this, 0);
    _Channel_pendingMessages.set(this, {});
    this.id = transformCallback(({ message, id }) => {
      if (id === __classPrivateFieldGet2(this, _Channel_nextMessageId, "f")) {
        __classPrivateFieldSet2(this, _Channel_nextMessageId, id + 1, "f");
        __classPrivateFieldGet2(this, _Channel_onmessage, "f").call(this, message);
        const pendingMessageIds = Object.keys(__classPrivateFieldGet2(this, _Channel_pendingMessages, "f"));
        if (pendingMessageIds.length > 0) {
          let nextId = id + 1;
          for (const pendingId of pendingMessageIds.sort()) {
            if (parseInt(pendingId) === nextId) {
              const message2 = __classPrivateFieldGet2(this, _Channel_pendingMessages, "f")[pendingId];
              delete __classPrivateFieldGet2(this, _Channel_pendingMessages, "f")[pendingId];
              __classPrivateFieldGet2(this, _Channel_onmessage, "f").call(this, message2);
              nextId += 1;
            } else {
              break;
            }
          }
          __classPrivateFieldSet2(this, _Channel_nextMessageId, nextId, "f");
        }
      } else {
        __classPrivateFieldGet2(this, _Channel_pendingMessages, "f")[id.toString()] = message;
      }
    });
  }
  set onmessage(handler) {
    __classPrivateFieldSet2(this, _Channel_onmessage, handler, "f");
  }
  get onmessage() {
    return __classPrivateFieldGet2(this, _Channel_onmessage, "f");
  }
  toJSON() {
    return `__CHANNEL__:${this.id}`;
  }
}
_Channel_onmessage = new WeakMap, _Channel_nextMessageId = new WeakMap, _Channel_pendingMessages = new WeakMap;
_Resource_rid = new WeakMap;

// /Users/hacker/Dev/projects/Jarvis/node_modules/.pnpm/tauri-plugin-clipboard-api@2.1.1/node_modules/@tauri-apps/api/event.js
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
    const text = ClipboardChangedPayloadSchema.parse(event2.payload).value;
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
    const text = ClipboardChangedPayloadSchema.parse(event2.payload).value;
    cb(text);
  });
};
var onRTFUpdate = function(cb) {
  return listen(RTF_CHANGED, (event2) => {
    const text = ClipboardChangedPayloadSchema.parse(event2.payload).value;
    cb(text);
  });
};
var onFilesUpdate = function(cb) {
  return listen(FILES_CHANGED, (event2) => {
    const files = ClipboardChangedFilesPayloadSchema.parse(event2.payload).value;
    cb(files);
  });
};
var onImageUpdate = function(cb) {
  return listen(IMAGE_CHANGED, (event2) => {
    const base64ImageStr = ClipboardChangedPayloadSchema.parse(event2.payload).value;
    cb(base64ImageStr);
  });
};
var onImageBinaryUpdate = function(cb) {
  return listen(IMAGE_BINARY_CHANGED, (event2) => {
    cb(ClipboardBinaryChangedPayloadSchema.parse(event2.payload).value);
  });
};
var isMonitorRunning = function() {
  return invoke(IS_MONITOR_RUNNING_COMMAND).then((res) => z.boolean().parse(res));
};
var startMonitor = function() {
  return invoke(START_MONITOR_COMMAND);
};
var stopMonitor = function() {
  return invoke(STOP_MONITOR_COMMAND);
};
async function listenToMonitorStatusUpdate(cb) {
  return await listen(CLIPBOARD_MONITOR_STATUS_UPDATE_EVENT, (event2) => {
    const newStatus = z.boolean().parse(event2.payload);
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
var ClipboardChangedPayloadSchema = z.object({ value: z.string() });
var ClipboardBinaryChangedPayloadSchema = z.object({
  value: z.number().array()
});
var ClipboardChangedFilesPayloadSchema = z.object({
  value: z.string().array()
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

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/src/comlink.ts
function getWindowApiClient(targetWindow) {
  return wrap(windowEndpoint(targetWindow));
}
function getWorkerApiClient() {
  return wrap(self);
}

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/src/client.ts
var hasWindow = () => typeof window !== "undefined";
var isInWorker = () => !hasWindow();
var isInIframe = () => hasWindow() && window !== window.parent;
var isMain = () => !isInWorker() && !isInIframe() && window === window.parent;
var getWorkerApi = () => getWorkerApiClient();
var getIframeApi = () => getWindowApiClient(window.parent);
var defaultClientAPI = isInIframe() ? getIframeApi() : getWorkerApi();

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/src/api/clipboard.ts
function constructAPI(api2) {
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
}
var getWorkerApi2 = () => getWorkerApiClient();
var getIframeApi2 = () => getWindowApiClient(window.parent);
var clientAPI = isInIframe() ? getIframeApi2() : getWorkerApi2();
var comlinkClipboard = constructAPI(clientAPI);
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

// /Users/hacker/Dev/projects/Jarvis/node_modules/.pnpm/@tauri-apps+plugin-fs@2.0.0-beta.5/node_modules/@tauri-apps/api/core.js
var transformCallback2 = function(callback, once = false) {
  return window.__TAURI_INTERNALS__.transformCallback(callback, once);
};
async function addPluginListener(plugin, event2, cb) {
  const handler = new Channel2;
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

class Channel2 {
  constructor() {
    this.__TAURI_CHANNEL_MARKER__ = true;
    _Channel_onmessage2.set(this, () => {
    });
    _Channel_nextMessageId2.set(this, 0);
    _Channel_pendingMessages2.set(this, {});
    this.id = transformCallback2(({ message, id }) => {
      if (id === __classPrivateFieldGet3(this, _Channel_nextMessageId2, "f")) {
        __classPrivateFieldSet3(this, _Channel_nextMessageId2, id + 1, "f");
        __classPrivateFieldGet3(this, _Channel_onmessage2, "f").call(this, message);
        const pendingMessageIds = Object.keys(__classPrivateFieldGet3(this, _Channel_pendingMessages2, "f"));
        if (pendingMessageIds.length > 0) {
          let nextId = id + 1;
          for (const pendingId of pendingMessageIds.sort()) {
            if (parseInt(pendingId) === nextId) {
              const message2 = __classPrivateFieldGet3(this, _Channel_pendingMessages2, "f")[pendingId];
              delete __classPrivateFieldGet3(this, _Channel_pendingMessages2, "f")[pendingId];
              __classPrivateFieldGet3(this, _Channel_onmessage2, "f").call(this, message2);
              nextId += 1;
            } else {
              break;
            }
          }
          __classPrivateFieldSet3(this, _Channel_nextMessageId2, nextId, "f");
        }
      } else {
        __classPrivateFieldGet3(this, _Channel_pendingMessages2, "f")[id.toString()] = message;
      }
    });
  }
  set onmessage(handler) {
    __classPrivateFieldSet3(this, _Channel_onmessage2, handler, "f");
  }
  get onmessage() {
    return __classPrivateFieldGet3(this, _Channel_onmessage2, "f");
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
    return __classPrivateFieldGet3(this, _Resource_rid2, "f");
  }
  constructor(rid) {
    _Resource_rid2.set(this, undefined);
    __classPrivateFieldSet3(this, _Resource_rid2, rid, "f");
  }
  async close() {
    return invoke2("plugin:resources|close", {
      rid: this.rid
    });
  }
}
_Resource_rid2 = new WeakMap;

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

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/src/api/dialog.ts
function constructAPI2(api2) {
  return {
    ask: api2.dialogAsk,
    confirm: api2.dialogConfirm,
    message: api2.dialogMessage,
    open: api2.dialogOpen,
    save: api2.dialogSave
  };
}
var comlinkDialog = constructAPI2(defaultClientAPI);
var nativeDialog = {
  ask,
  confirm,
  message,
  open,
  save
};
var dialog = isMain() ? nativeDialog : comlinkDialog;
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
    handler(eventData);
    _unlisten2(event2, eventData.id).catch(() => {
    });
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
  TauriEvent3["DRAG"] = "tauri://drag";
  TauriEvent3["DROP"] = "tauri://drop";
  TauriEvent3["DROP_OVER"] = "tauri://drop-over";
  TauriEvent3["DROP_CANCELLED"] = "tauri://drag-cancelled";
})(TauriEvent2 || (TauriEvent2 = {}));

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/src/api/event.ts
function constructAPI3(api2) {
  return {
    rawListen: (event3, target, handler) => api2.eventRawListen(event3, target, proxy(handler)),
    rawUnlisten: (event3, eventId) => api2.eventRawUnlisten(event3, eventId),
    emit: (event3, payload) => api2.eventEmit(event3, payload),
    emitTo: (target, event3, payload) => api2.eventEmitTo(target, event3, payload),
    once: (event3, handler, options) => api2.eventOnce(event3, handler, options)
  };
}
var _event = constructAPI3(defaultClientAPI);
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
var nativeEvent = {
  emit: emit2,
  emitTo,
  once,
  listen: listen3
};
var event3 = isMain() ? nativeEvent : comlinkEvent;
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
async function create(path, options) {
  if (path instanceof URL && path.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  const rid = await invoke2("plugin:fs|create", {
    path: path instanceof URL ? path.toString() : path,
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
async function mkdir(path, options) {
  if (path instanceof URL && path.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  await invoke2("plugin:fs|mkdir", {
    path: path instanceof URL ? path.toString() : path,
    options
  });
}
async function readDir(path, options) {
  if (path instanceof URL && path.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return await invoke2("plugin:fs|read_dir", {
    path: path instanceof URL ? path.toString() : path,
    options
  });
}
async function readFile(path, options) {
  if (path instanceof URL && path.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  const arr = await invoke2("plugin:fs|read_file", {
    path: path instanceof URL ? path.toString() : path,
    options
  });
  return arr instanceof ArrayBuffer ? new Uint8Array(arr) : Uint8Array.from(arr);
}
async function readTextFile(path, options) {
  if (path instanceof URL && path.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return await invoke2("plugin:fs|read_text_file", {
    path: path instanceof URL ? path.toString() : path,
    options
  });
}
async function remove(path, options) {
  if (path instanceof URL && path.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  await invoke2("plugin:fs|remove", {
    path: path instanceof URL ? path.toString() : path,
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
async function stat(path, options) {
  const res = await invoke2("plugin:fs|stat", {
    path: path instanceof URL ? path.toString() : path,
    options
  });
  return parseFileInfo(res);
}
async function lstat(path, options) {
  const res = await invoke2("plugin:fs|lstat", {
    path: path instanceof URL ? path.toString() : path,
    options
  });
  return parseFileInfo(res);
}
async function truncate(path, len, options) {
  if (path instanceof URL && path.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  await invoke2("plugin:fs|truncate", {
    path: path instanceof URL ? path.toString() : path,
    len,
    options
  });
}
async function writeFile(path, data, options) {
  if (path instanceof URL && path.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  await invoke2("plugin:fs|write_file", data, {
    headers: {
      path: path instanceof URL ? path.toString() : path,
      options: JSON.stringify(options)
    }
  });
}
async function writeTextFile(path, data, options) {
  if (path instanceof URL && path.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  await invoke2("plugin:fs|write_text_file", {
    path: path instanceof URL ? path.toString() : path,
    data,
    options
  });
}
async function exists(path, options) {
  if (path instanceof URL && path.protocol !== "file:") {
    throw new TypeError("Must be a file URL.");
  }
  return await invoke2("plugin:fs|exists", {
    path: path instanceof URL ? path.toString() : path,
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

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/src/api/fs.ts
function constructAPI4(api2) {
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
}
var comlinkFs = constructAPI4(defaultClientAPI);
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
// /Users/hacker/Dev/projects/Jarvis/vendors/tauri-api-adapter/packages/tauri-api-adapter/node_modules/tauri-plugin-network-api/dist-js/index.js
var getInterfaces = function() {
  return invoke2("plugin:network|get_interfaces");
};
var getNonEmptyInterfaces = function() {
  return invoke2("plugin:network|get_non_empty_interfaces");
};
var findAvailablePort = function() {
  return invoke2("plugin:network|find_available_port");
};
var isPortTaken = function(port) {
  return invoke2("plugin:network|is_port_taken", { port });
};
var isHttpPortOpen = function(ip, port, keyword) {
  return invoke2("plugin:network|is_http_port_open", { ip, port, keyword });
};
var V6IfAddr = z.object({
  ip: z.string(),
  ip_octets: z.number().array(),
  broadcast: z.string().nullable(),
  broadcast_octets: z.array(z.number()).nullable(),
  netmask: z.string().nullable(),
  netmask_octets: z.number().array().nullable(),
  prefix: z.number().nullable(),
  network: z.string().nullable()
});
var V4IfAddr = V6IfAddr;
var Addr = z.record(z.string(), z.union([V4IfAddr, V6IfAddr]));
var NetworkInterface = z.object({
  name: z.string(),
  v4_addrs: V4IfAddr.array(),
  v6_addrs: V6IfAddr.array(),
  mac_addr: z.string().nullable(),
  index: z.number()
});
var IpPortPair = z.object({
  ip: z.string(),
  port: z.number()
});

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/src/api/network.ts
function constructAPI5(api2) {
  return {
    getInterfaces: api2.networkGetInterfaces,
    getNonEmptyInterfaces: api2.networkGetNonEmptyInterfaces,
    findAvailablePort: api2.networkFindAvailablePort,
    isPortTaken: api2.networkIsPortTaken,
    isHttpPortOpen: api2.networkIsHttpPortOpen
  };
}
var comlinkNetwork = constructAPI5(defaultClientAPI);
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

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/src/api/notification.ts
function constructAPI6(api2) {
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
}
var comlinkNotification = constructAPI6(defaultClientAPI);
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
// /Users/hacker/Dev/projects/Jarvis/vendors/tauri-api-adapter/packages/tauri-api-adapter/node_modules/@tauri-apps/plugin-os/dist-js/index.js
var eol = function() {
  return window.__TAURI_OS_PLUGIN_INTERNALS__.eol;
};
async function platform() {
  return await invoke2("plugin:os|platform");
}
async function version() {
  return await invoke2("plugin:os|version");
}
async function family() {
  return await invoke2("plugin:os|family");
}
async function arch() {
  return await invoke2("plugin:os|arch");
}
async function locale() {
  return await invoke2("plugin:os|locale");
}
async function exeExtension() {
  return await invoke2("plugin:os|exe_extension");
}
async function hostname() {
  return await invoke2("plugin:os|hostname");
}

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/src/api/os.ts
function constructAPI7(api2) {
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
}
var comlinkOs = constructAPI7(defaultClientAPI);
var nativeOs = {
  platform,
  arch,
  exeExtension,
  family,
  hostname,
  eol: () => Promise.resolve(eol()),
  version,
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
var open2 = function(path, openWith) {
  return invoke("plugin:shellx|open", {
    path,
    with: openWith
  });
};
class Child {
  constructor(pid) {
    this.pid = pid;
  }
  async write(data) {
    await invoke("plugin:shellx|stdin_write", {
      pid: this.pid,
      buffer: typeof data === "string" ? data : Array.from(data)
    });
  }
  async kill() {
    await invoke("plugin:shellx|kill", {
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
    const onEvent = new Channel;
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
    return await invoke("plugin:shellx|spawn", {
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
    return invoke("plugin:shellx|execute", {
      program,
      args,
      options
    });
  }
}

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/src/api/shell.ts
function constructAPI8(api2) {
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
}
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
var _comlinkShell = constructAPI8(defaultClientAPI);

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
var shellOpen = _comlinkShell.open;
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
  return invoke2("plugin:system-info|all_sys_info");
};
var totalMemory = function() {
  return invoke2("plugin:system-info|total_memory");
};
var usedMemory = function() {
  return invoke2("plugin:system-info|used_memory");
};
var totalSwap = function() {
  return invoke2("plugin:system-info|total_swap");
};
var usedSwap = function() {
  return invoke2("plugin:system-info|used_swap");
};
var memoryInfo = function() {
  return invoke2("plugin:system-info|memory_info");
};
var hostname2 = function() {
  return invoke2("plugin:system-info|hostname");
};
var name = function() {
  return invoke2("plugin:system-info|name");
};
var kernelVersion = function() {
  return invoke2("plugin:system-info|kernel_version");
};
var osVersion = function() {
  return invoke2("plugin:system-info|os_version");
};
var staticInfo = function() {
  return invoke2("plugin:system-info|static_info");
};
var components = function() {
  return invoke2("plugin:system-info|components");
};
var cpus = function() {
  return invoke2("plugin:system-info|cpus");
};
var cpuCount = function() {
  return invoke2("plugin:system-info|cpu_count");
};
var cpuInfo = function() {
  return invoke2("plugin:system-info|cpu_info");
};
var disks = function() {
  return invoke2("plugin:system-info|disks");
};
var networks = function() {
  return invoke2("plugin:system-info|networks");
};
var processes = function() {
  return invoke2("plugin:system-info|processes");
};
var refreshAll = function() {
  return invoke2("plugin:system-info|refresh_all");
};
var refreshMemory = function() {
  return invoke2("plugin:system-info|refresh_memory");
};
var refreshCpu = function() {
  return invoke2("plugin:system-info|refresh_cpu");
};
var refreshProcesses = function() {
  return invoke2("plugin:system-info|refresh_processes");
};
var batteries = function() {
  return invoke2("plugin:system-info|batteries");
};
var BatteryState = z.enum([
  "Unknown",
  "Charging",
  "Discharging",
  "Empty",
  "Full"
]);
var BatteryTechnology = z.enum([
  "Unknown",
  "LithiumIon",
  "LeadAcid",
  "LithiumPolymer",
  "NickelMetalHydride",
  "NickelCadmium",
  "NickelZinc",
  "LithiumIronPhosphate",
  "RechargeableAlkalineManganese"
]);
var Battery = z.object({
  state_of_charge: z.number(),
  energy: z.number(),
  energy_full: z.number(),
  energy_full_design: z.number(),
  energy_rate: z.number().describe("Amount of energy being drained from the battery."),
  voltage: z.number(),
  state_of_health: z.number(),
  state: BatteryState,
  technology: BatteryTechnology,
  temperature_kelin: z.number().nullable(),
  temperature_celsius: z.number().nullable(),
  temperature_fahrenheit: z.number().nullable(),
  cycle_count: z.number().nullable(),
  vendor: z.string().nullable(),
  model: z.string().nullable(),
  serial_number: z.string().nullable(),
  time_to_full: z.number().nullable(),
  time_to_empty: z.number().nullable()
});
var Batteries = Battery.array();
var DiskKind = z.union([
  z.literal("HDD"),
  z.literal("SSD"),
  z.object({
    Unknown: z.number()
  })
]);
var MacAddress = z.number().array().length(6);
var ProcessStatus = z.union([
  z.literal("Idle"),
  z.literal("Run"),
  z.literal("Sleep"),
  z.literal("Stop"),
  z.literal("Zombie"),
  z.literal("Tracing"),
  z.literal("Dead"),
  z.literal("Wakekill"),
  z.literal("Waking"),
  z.literal("Parked"),
  z.literal("LockBlocked"),
  z.literal("UninterruptibleDiskSleep"),
  z.object({
    Unknown: z.number()
  })
]);
var DiskUsage = z.object({
  total_written_bytes: z.number(),
  written_bytes: z.number(),
  total_read_bytes: z.number(),
  read_bytes: z.number()
});
var Cpu = z.object({
  name: z.string(),
  frequency: z.number(),
  cpu_usage: z.number(),
  vendor_id: z.string(),
  brand: z.string()
});
var Disk = z.object({
  kind: DiskKind,
  name: z.string(),
  file_system: z.string(),
  mount_point: z.string(),
  total_space: z.number(),
  available_space: z.number(),
  is_removable: z.boolean()
});
var Network = z.object({
  interface_name: z.string(),
  received: z.number(),
  total_received: z.number(),
  transmitted: z.number(),
  total_transmitted: z.number(),
  packets_received: z.number(),
  total_packets_received: z.number(),
  packets_transmitted: z.number(),
  total_packets_transmitted: z.number(),
  errors_on_received: z.number(),
  total_errors_on_received: z.number(),
  errors_on_transmitted: z.number(),
  total_errors_on_transmitted: z.number(),
  mac_address: z.number().array(),
  mac_address_str: z.string()
});
var Component = z.object({
  temperature: z.number(),
  max: z.number(),
  critical: z.number().nullable(),
  label: z.string()
});
var Process = z.object({
  name: z.string(),
  cmd: z.string().array(),
  exe: z.string().nullable(),
  pid: z.number(),
  environ: z.string().array(),
  cwd: z.string().nullable(),
  root: z.string().nullable(),
  memory: z.number(),
  virtual_memory: z.number(),
  parent: z.number().nullable(),
  status: ProcessStatus,
  start_time: z.number(),
  run_time: z.number(),
  cpu_usage: z.number(),
  disk_usage: DiskUsage,
  user_id: z.string().nullable(),
  effective_user_id: z.string().nullable(),
  group_id: z.string().nullable(),
  effective_group_id: z.string().nullable(),
  session_id: z.number().nullable()
});
var StaticInfo = z.object({
  hostname: z.string().nullable(),
  kernel_version: z.string().nullable(),
  os_version: z.string().nullable(),
  name: z.string().nullable()
});
var MemoryInfo = z.object({
  total_memory: z.number(),
  used_memory: z.number(),
  total_swap: z.number(),
  used_swap: z.number()
});
var CpuInfo = z.object({
  cpus: Cpu.array(),
  cpu_count: z.number()
});
var AllSystemInfo = z.object({
  hostname: z.string().nullable(),
  kernel_version: z.string().nullable(),
  os_version: z.string().nullable(),
  name: z.string().nullable(),
  total_memory: z.number(),
  used_memory: z.number(),
  total_swap: z.number(),
  used_swap: z.number(),
  cpus: Cpu.array(),
  cpu_count: z.number(),
  disks: Disk.array(),
  networks: Network.array(),
  components: Component.array(),
  processes: Process.array(),
  batteries: Batteries
});

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/src/api/system-info.ts
function constructAPI9(api2) {
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
}
var comlinkSysInfo = constructAPI9(defaultClientAPI);
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
// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/src/api/path.ts
function constructAPI10(api2) {
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
}
var comlinkPath = constructAPI10(defaultClientAPI);
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
var path2 = isMain() ? nativePath : comlinkPath;
// ../../node_modules/.pnpm/@tauri-apps+api@2.0.0-beta.14/node_modules/@tauri-apps/api/external/tslib/tslib.es6.js
var __classPrivateFieldGet4 = function(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet4 = function(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};

// /Users/hacker/Dev/projects/Jarvis/node_modules/.pnpm/@tauri-apps+plugin-upload@2.0.0-beta.7/node_modules/@tauri-apps/api/core.js
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

class Channel3 {
  constructor() {
    this.__TAURI_CHANNEL_MARKER__ = true;
    _Channel_onmessage3.set(this, () => {
    });
    _Channel_nextMessageId3.set(this, 0);
    _Channel_pendingMessages3.set(this, {});
    this.id = transformCallback3(({ message: message2, id }) => {
      if (id === __classPrivateFieldGet4(this, _Channel_nextMessageId3, "f")) {
        __classPrivateFieldSet4(this, _Channel_nextMessageId3, id + 1, "f");
        __classPrivateFieldGet4(this, _Channel_onmessage3, "f").call(this, message2);
        const pendingMessageIds = Object.keys(__classPrivateFieldGet4(this, _Channel_pendingMessages3, "f"));
        if (pendingMessageIds.length > 0) {
          let nextId = id + 1;
          for (const pendingId of pendingMessageIds.sort()) {
            if (parseInt(pendingId) === nextId) {
              const message3 = __classPrivateFieldGet4(this, _Channel_pendingMessages3, "f")[pendingId];
              delete __classPrivateFieldGet4(this, _Channel_pendingMessages3, "f")[pendingId];
              __classPrivateFieldGet4(this, _Channel_onmessage3, "f").call(this, message3);
              nextId += 1;
            } else {
              break;
            }
          }
          __classPrivateFieldSet4(this, _Channel_nextMessageId3, nextId, "f");
        }
      } else {
        __classPrivateFieldGet4(this, _Channel_pendingMessages3, "f")[id.toString()] = message2;
      }
    });
  }
  set onmessage(handler) {
    __classPrivateFieldSet4(this, _Channel_onmessage3, handler, "f");
  }
  get onmessage() {
    return __classPrivateFieldGet4(this, _Channel_onmessage3, "f");
  }
  toJSON() {
    return `__CHANNEL__:${this.id}`;
  }
}
_Channel_onmessage3 = new WeakMap, _Channel_nextMessageId3 = new WeakMap, _Channel_pendingMessages3 = new WeakMap;
_Resource_rid3 = new WeakMap;

// /Users/hacker/Dev/projects/Jarvis/node_modules/.pnpm/@tauri-apps+plugin-log@2.0.0-beta.7/node_modules/@tauri-apps/api/event.js
var TauriEvent3;
(function(TauriEvent4) {
  TauriEvent4["WINDOW_RESIZED"] = "tauri://resize";
  TauriEvent4["WINDOW_MOVED"] = "tauri://move";
  TauriEvent4["WINDOW_CLOSE_REQUESTED"] = "tauri://close-requested";
  TauriEvent4["WINDOW_DESTROYED"] = "tauri://destroyed";
  TauriEvent4["WINDOW_FOCUS"] = "tauri://focus";
  TauriEvent4["WINDOW_BLUR"] = "tauri://blur";
  TauriEvent4["WINDOW_SCALE_FACTOR_CHANGED"] = "tauri://scale-change";
  TauriEvent4["WINDOW_THEME_CHANGED"] = "tauri://theme-changed";
  TauriEvent4["WINDOW_CREATED"] = "tauri://window-created";
  TauriEvent4["WEBVIEW_CREATED"] = "tauri://webview-created";
  TauriEvent4["DRAG"] = "tauri://drag";
  TauriEvent4["DROP"] = "tauri://drop";
  TauriEvent4["DROP_OVER"] = "tauri://drop-over";
  TauriEvent4["DROP_CANCELLED"] = "tauri://drag-cancelled";
})(TauriEvent3 || (TauriEvent3 = {}));

// /Users/hacker/Dev/projects/Jarvis/vendors/tauri-api-adapter/packages/tauri-api-adapter/node_modules/@tauri-apps/plugin-log/dist-js/index.js
async function log(level, message2, options) {
  const traces = new Error().stack?.split("\n").map((line2) => line2.split("@"));
  const filtered = traces?.filter(([name2, location2]) => {
    return name2.length > 0 && location2 !== "[native code]";
  });
  const { file, line, keyValues } = options ?? {};
  let location = filtered?.[0]?.filter((v) => v.length > 0).join("@");
  if (location === "Error") {
    location = "webview::unknown";
  }
  await invoke3("plugin:log|log", {
    level,
    message: message2,
    location,
    file,
    line,
    keyValues
  });
}
async function error(message2, options) {
  await log(LogLevel.Error, message2, options);
}
async function warn(message2, options) {
  await log(LogLevel.Warn, message2, options);
}
async function info(message2, options) {
  await log(LogLevel.Info, message2, options);
}
async function debug(message2, options) {
  await log(LogLevel.Debug, message2, options);
}
async function trace(message2, options) {
  await log(LogLevel.Trace, message2, options);
}
var LogLevel;
(function(LogLevel2) {
  LogLevel2[LogLevel2["Trace"] = 1] = "Trace";
  LogLevel2[LogLevel2["Debug"] = 2] = "Debug";
  LogLevel2[LogLevel2["Info"] = 3] = "Info";
  LogLevel2[LogLevel2["Warn"] = 4] = "Warn";
  LogLevel2[LogLevel2["Error"] = 5] = "Error";
})(LogLevel || (LogLevel = {}));

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/src/api/log.ts
function constructAPI11(api2) {
  return {
    debug: api2.loggerDebug,
    error: api2.loggerError,
    info: api2.loggerInfo,
    trace: api2.loggerTrace,
    warn: api2.loggerWarn
  };
}
var comlinkLog = constructAPI11(defaultClientAPI);
var nativeLog = {
  debug,
  error,
  info,
  trace,
  warn
};
var log2 = isMain() ? nativeLog : comlinkLog;
// /Users/hacker/Dev/projects/Jarvis/vendors/tauri-api-adapter/packages/tauri-api-adapter/node_modules/@tauri-apps/plugin-upload/dist-js/index.js
async function upload(url, filePath, progressHandler, headers) {
  const ids = new Uint32Array(1);
  window.crypto.getRandomValues(ids);
  const id = ids[0];
  const onProgress = new Channel3;
  if (progressHandler) {
    onProgress.onmessage = progressHandler;
  }
  return await invoke3("plugin:upload|upload", {
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
  const onProgress = new Channel3;
  if (progressHandler) {
    onProgress.onmessage = progressHandler;
  }
  await invoke3("plugin:upload|download", {
    id,
    url,
    filePath,
    headers: headers ?? {},
    onProgress
  });
}

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/src/api/updownload.ts
function constructAPI12(api2) {
  return {
    upload: (url, filePath, progressHandler, headers) => api2.upload(url, filePath, progressHandler ? proxy(progressHandler) : undefined, headers),
    download: (url, filePath, progressHandler, headers) => api2.download(url, filePath, progressHandler ? proxy(progressHandler) : undefined, headers)
  };
}
var comlinkUpdownload = constructAPI12(defaultClientAPI);
var nativeUpdownload = {
  upload,
  download
};
var updownload = isMain() ? nativeUpdownload : comlinkUpdownload;
// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/src/api/fetch/request.ts
var webFetch = {
  rawFetch: defaultClientAPI.fetchRawFetch,
  fetchCancel: defaultClientAPI.fetchFetchCancel,
  fetchSend: defaultClientAPI.fetchFetchSend,
  fetchReadBody: defaultClientAPI.fetchFetchReadBody
};
// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/src/permissions.ts
function checkPermission(requiredPermissions, userPermissions) {
  return (fn) => {
    return (...args) => {
      if (requiredPermissions.length > 0 && !requiredPermissions.some((permission) => userPermissions.includes(permission))) {
        throw new Error(`Permission denied for API "${fn.name}". Require one of these: [${requiredPermissions.join(", ")}]`);
      }
      return fn(...args);
    };
  };
}
var PermissionCategory = z.enum([
  "clipboard",
  "dialog",
  "notification",
  "fs",
  "os",
  "shell",
  "fetch",
  "system-info",
  "network",
  "updownload"
]);

// ../../vendors/tauri-api-adapter/packages/tauri-api-adapter/src/server.ts
function constructUpdownloadApi(permissions2) {
  return {
    upload: checkPermission(["updownload:upload"], permissions2)(upload),
    download: checkPermission(["updownload:download"], permissions2)(download)
  };
}
function constructClipboardApi(permissions2) {
  return {
    clipboardReadText: checkPermission(["clipboard:read-text", "clipboard:read-all"], permissions2)(api.readText),
    clipboardWriteText: checkPermission(["clipboard:write-text", "clipboard:write-all"], permissions2)(api.writeText),
    clipboardReadImageBase64: checkPermission(["clipboard:read-all", "clipboard:read-image"], permissions2)(api.readImageBase64),
    clipboardReadImageBinary: checkPermission(["clipboard:read-all", "clipboard:read-image"], permissions2)(api.readImageBinary),
    clipboardWriteImageBase64: checkPermission(["clipboard:write-all", "clipboard:write-image"], permissions2)(api.writeImageBase64),
    clipboardWriteImageBinary: checkPermission(["clipboard:write-all", "clipboard:write-image"], permissions2)(api.writeImageBinary),
    clipboardReadFiles: checkPermission(["clipboard:read-all", "clipboard:read-files"], permissions2)(api.readFiles),
    clipboardWriteFiles: checkPermission(["clipboard:write-all", "clipboard:write-files"], permissions2)(api.writeFiles),
    clipboardReadRtf: checkPermission(["clipboard:read-all", "clipboard:read-text"], permissions2)(api.readRtf),
    clipboardWriteRtf: checkPermission(["clipboard:write-all", "clipboard:write-text"], permissions2)(api.writeRtf),
    clipboardReadHtml: checkPermission(["clipboard:read-all", "clipboard:read-text"], permissions2)(api.readHtml),
    clipboardWriteHtml: checkPermission(["clipboard:write-all", "clipboard:write-text"], permissions2)(api.writeHtml),
    clipboardWriteHtmlAndText: checkPermission(["clipboard:write-all", "clipboard:write-text"], permissions2)(api.writeHtmlAndText),
    clipboardHasText: checkPermission([], permissions2)(api.hasText),
    clipboardHasRTF: checkPermission([], permissions2)(api.hasRTF),
    clipboardHasHTML: checkPermission([], permissions2)(api.hasHTML),
    clipboardHasImage: checkPermission([], permissions2)(api.hasImage),
    clipboardHasFiles: checkPermission([], permissions2)(api.hasFiles)
  };
}
function constructDialogApi(permissions2) {
  return {
    dialogAsk: checkPermission(["dialog:all"], permissions2)(ask),
    dialogConfirm: checkPermission(["dialog:all"], permissions2)(confirm),
    dialogMessage: checkPermission(["dialog:all"], permissions2)(message),
    dialogOpen: checkPermission(["dialog:all"], permissions2)(open),
    dialogSave: checkPermission(["dialog:all"], permissions2)(save)
  };
}
function constructNotificationApi(permissions2) {
  return {
    notificationIsPermissionGranted: checkPermission(["notification:all"], permissions2)(isPermissionGranted),
    notificationRequestPermission: checkPermission(["notification:all"], permissions2)(requestPermission),
    notificationSendNotification: checkPermission(["notification:all"], permissions2)(sendNotification),
    notificationRegisterActionTypes: checkPermission(["notification:all"], permissions2)(registerActionTypes),
    notificationPending: checkPermission(["notification:all"], permissions2)(pending),
    notificationCancel: checkPermission(["notification:all"], permissions2)(cancel),
    notificationCancelAll: checkPermission(["notification:all"], permissions2)(cancelAll),
    notificationActive: checkPermission(["notification:all"], permissions2)(active),
    notificationRemoveActive: checkPermission(["notification:all"], permissions2)(removeActive),
    notificationRemoveAllActive: checkPermission(["notification:all"], permissions2)(removeAllActive),
    notificationCreateChannel: checkPermission(["notification:all"], permissions2)(createChannel),
    notificationRemoveChannel: checkPermission(["notification:all"], permissions2)(removeChannel),
    notificationChannels: checkPermission(["notification:all"], permissions2)(channels),
    notificationOnNotificationReceived: checkPermission(["notification:all"], permissions2)(onNotificationReceived),
    notificationOnAction: checkPermission(["notification:all"], permissions2)(onAction)
  };
}
function constructFsApi(permissions2) {
  return {
    fsReadDir: checkPermission(["fs:read"], permissions2)(readDir),
    fsReadFile: checkPermission(["fs:read"], permissions2)(readFile),
    fsReadTextFile: checkPermission(["fs:read"], permissions2)(readTextFile),
    fsStat: checkPermission(["fs:read"], permissions2)(stat),
    fsLstat: checkPermission(["fs:read"], permissions2)(lstat),
    fsExists: checkPermission(["fs:read", "fs:exists"], permissions2)(exists),
    fsMkdir: checkPermission(["fs:write"], permissions2)(mkdir),
    fsCreate: checkPermission(["fs:write"], permissions2)(create),
    fsCopyFile: checkPermission(["fs:write"], permissions2)(copyFile),
    fsRemove: checkPermission(["fs:write"], permissions2)(remove),
    fsRename: checkPermission(["fs:write"], permissions2)(rename),
    fsTruncate: checkPermission(["fs:write"], permissions2)(truncate),
    fsWriteFile: checkPermission(["fs:write"], permissions2)(writeFile),
    fsWriteTextFile: checkPermission(["fs:write"], permissions2)(writeTextFile)
  };
}
function constructOsApi(permissions2) {
  return {
    osPlatform: checkPermission(["os:all"], permissions2)(platform),
    osArch: checkPermission(["os:all"], permissions2)(arch),
    osExeExtension: checkPermission(["os:all"], permissions2)(exeExtension),
    osFamily: checkPermission(["os:all"], permissions2)(family),
    osHostname: checkPermission(["os:all"], permissions2)(hostname),
    osEol: checkPermission(["os:all"], permissions2)(() => Promise.resolve(eol())),
    osVersion: checkPermission(["os:all"], permissions2)(version),
    osLocale: checkPermission(["os:all"], permissions2)(locale)
  };
}
function constructShellApi(permissions2) {
  return {
    shellExecute: checkPermission(["shell:execute"], permissions2)((program, args, options) => invoke2("plugin:shellx|execute", {
      program,
      args,
      options
    })),
    shellKill: checkPermission(["shell:execute"], permissions2)((pid) => invoke2("plugin:shellx|kill", {
      cmd: "killChild",
      pid
    })),
    shellStdinWrite: checkPermission(["shell:execute"], permissions2)((buffer, pid) => invoke2("plugin:shellx|stdin_write", {
      buffer,
      pid
    })),
    shellOpen: checkPermission(["shell:open"], permissions2)(open2),
    shellRawSpawn: checkPermission(["shell:execute"], permissions2)((program, args, options, cb) => {
      const onEvent = new Channel2;
      onEvent.onmessage = cb;
      return invoke2("plugin:shellx|spawn", {
        program,
        args,
        options,
        onEvent
      });
    }),
    shellExecuteBashScript: checkPermission(["shell:execute"], permissions2)(executeBashScript),
    shellExecutePowershellScript: checkPermission(["shell:execute"], permissions2)(executePowershellScript),
    shellExecuteAppleScript: checkPermission(["shell:execute"], permissions2)(executeAppleScript),
    shellExecutePythonScript: checkPermission(["shell:execute"], permissions2)(executePythonScript),
    shellExecuteZshScript: checkPermission(["shell:execute"], permissions2)(executeZshScript),
    shellExecuteNodeScript: checkPermission(["shell:execute"], permissions2)(executeNodeScript),
    shellHasCommand: checkPermission(["shell:execute"], permissions2)(hasCommand),
    shellLikelyOnWindows: checkPermission(["shell:execute"], permissions2)(likelyOnWindows)
  };
}
function constructFetchApi(permissions2) {
  return {
    fetchRawFetch: checkPermission(["fetch:all"], permissions2)((options) => invoke2("plugin:http|fetch", options)),
    fetchFetchCancel: checkPermission(["fetch:all"], permissions2)((rid) => invoke2("plugin:http|fetch_cancel", { rid })),
    fetchFetchSend: checkPermission(["fetch:all"], permissions2)((rid) => invoke2("plugin:http|fetch_send", { rid })),
    fetchFetchReadBody: checkPermission(["fetch:all"], permissions2)((rid) => invoke2("plugin:http|fetch_read_body", { rid }))
  };
}
function constructSystemInfoApi(permissions2) {
  return {
    sysInfoAllSysInfo: checkPermission(["system-info:all"], permissions2)(allSysInfo),
    sysInfoTotalMemory: checkPermission(["system-info:all", "system-info:memory"], permissions2)(totalMemory),
    sysInfoUsedMemory: checkPermission(["system-info:all", "system-info:memory"], permissions2)(usedMemory),
    sysInfoTotalSwap: checkPermission(["system-info:all", "system-info:memory"], permissions2)(totalSwap),
    sysInfoUsedSwap: checkPermission(["system-info:all", "system-info:memory"], permissions2)(usedSwap),
    sysInfoMemoryInfo: checkPermission(["system-info:all", "system-info:memory"], permissions2)(memoryInfo),
    sysInfoHostname: checkPermission(["system-info:all", "system-info:network"], permissions2)(hostname2),
    sysInfoName: checkPermission(["system-info:all", "system-info:os"], permissions2)(name),
    sysInfoKernelVersion: checkPermission(["system-info:all", "system-info:os"], permissions2)(kernelVersion),
    sysInfoOsVersion: checkPermission(["system-info:all", "system-info:os"], permissions2)(osVersion),
    sysInfoStaticInfo: checkPermission(["system-info:all", "system-info:os"], permissions2)(staticInfo),
    sysInfoComponents: checkPermission(["system-info:all", "system-info:components"], permissions2)(components),
    sysInfoCpus: checkPermission(["system-info:all", "system-info:cpu"], permissions2)(cpus),
    sysInfoCpuCount: checkPermission(["system-info:all", "system-info:cpu"], permissions2)(cpuCount),
    sysInfoCpuInfo: checkPermission(["system-info:all", "system-info:cpu"], permissions2)(cpuInfo),
    sysInfoDisks: checkPermission(["system-info:all", "system-info:disk"], permissions2)(disks),
    sysInfoNetworks: checkPermission(["system-info:all", "system-info:network"], permissions2)(networks),
    sysInfoProcesses: checkPermission(["system-info:all", "system-info:process"], permissions2)(processes),
    sysInfoRefreshAll: checkPermission(["system-info:all"], permissions2)(refreshAll),
    sysInfoRefreshMemory: checkPermission(["system-info:memory"], permissions2)(refreshMemory),
    sysInfoRefreshCpu: checkPermission(["system-info:all", "system-info:cpu"], permissions2)(refreshCpu),
    sysInfoRefreshProcesses: checkPermission(["system-info:process"], permissions2)(refreshProcesses),
    sysInfoBatteries: checkPermission(["system-info:all", "system-info:battery"], permissions2)(batteries)
  };
}
function constructNetworkApi(permissions2) {
  return {
    networkGetInterfaces: checkPermission(["network:interface"], permissions2)(getInterfaces),
    networkGetNonEmptyInterfaces: checkPermission(["network:interface"], permissions2)(getNonEmptyInterfaces),
    networkFindAvailablePort: checkPermission(["network:port"], permissions2)(findAvailablePort),
    networkIsPortTaken: checkPermission(["network:port"], permissions2)(isPortTaken),
    networkIsHttpPortOpen: checkPermission(["network:port"], permissions2)(isHttpPortOpen)
  };
}
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
  eventRawListen(event6, target, handler) {
    return invoke2("plugin:event|listen", {
      event: event6,
      target,
      handler: transformCallback2(handler)
    });
  },
  eventRawUnlisten: (event6, eventId) => invoke2("plugin:event|unlisten", {
    event: event6,
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
// /Users/hacker/Dev/projects/Jarvis/packages/tauri-plugin-jarvis/node_modules/@tauri-apps/plugin-log/dist-js/index.js
var LogLevel2;
(function(LogLevel3) {
  LogLevel3[LogLevel3["Trace"] = 1] = "Trace";
  LogLevel3[LogLevel3["Debug"] = 2] = "Debug";
  LogLevel3[LogLevel3["Info"] = 3] = "Info";
  LogLevel3[LogLevel3["Warn"] = 4] = "Warn";
  LogLevel3[LogLevel3["Error"] = 5] = "Error";
})(LogLevel2 || (LogLevel2 = {}));

// ../../packages/tauri-plugin-jarvis/guest-js/models/common.ts
var IconType = z.enum(["iconify", "asset", "remote-url"]);

// ../../packages/tauri-plugin-jarvis/guest-js/models/manifest.ts
var OSPlatform = z.enum([
  "linux",
  "macos",
  "windows"
]);
var allPlatforms = [OSPlatform.Enum.linux, OSPlatform.Enum.macos, OSPlatform.Enum.windows];
var PermissionsEnum = z.enum([
  "clipboard-read",
  "clipboard-write",
  "fs-home",
  "fs-basic",
  "shell"
]);
var TriggerCmd = z.object({
  type: z.union([z.literal("text"), z.literal("regex")]),
  value: z.string()
});
var TitleBarStyle = z.enum(["visible", "transparent", "overlay"]);
var WindowConfig = z.object({
  center: z.boolean().nullable().optional(),
  x: z.number().nullable().optional(),
  y: z.number().nullable().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  minWidth: z.number().nullable().optional(),
  minHeight: z.number().nullable().optional(),
  maxWidth: z.number().nullable().optional(),
  maxHeight: z.number().nullable().optional(),
  resizable: z.boolean().nullable().optional(),
  title: z.string().optional().nullable(),
  fullscreen: z.boolean().nullable().optional(),
  focus: z.boolean().nullable().optional(),
  transparent: z.boolean().nullable().optional(),
  maximized: z.boolean().nullable().optional(),
  visible: z.boolean().nullable().optional(),
  decorations: z.boolean().nullable().optional(),
  alwaysOnTop: z.boolean().nullable().optional(),
  alwaysOnBottom: z.boolean().nullable().optional(),
  contentProtected: z.boolean().nullable().optional(),
  skipTaskbar: z.boolean().nullable().optional(),
  shadow: z.boolean().nullable().optional(),
  theme: z.union([z.literal("light"), z.literal("dark")]).nullable().optional(),
  titleBarStyle: TitleBarStyle.nullable().optional(),
  hiddenTitle: z.boolean().nullable().optional(),
  tabbingIdentifier: z.string().optional().nullable(),
  maximizable: z.boolean().nullable().optional(),
  minimizable: z.boolean().nullable().optional(),
  closable: z.boolean().nullable().optional(),
  parent: z.string().nullable().optional(),
  visibleOnAllWorkspaces: z.boolean().nullable().optional()
});
var UiCmd = z.object({
  main: z.string().describe("HTML file to load, e.g. dist/index.html"),
  description: z.string().nullable().default("").describe("Description of the Command"),
  devMain: z.string().describe("URL to load in development to support live reload, e.g. http://localhost:5173/"),
  name: z.string().describe("Name of the command"),
  window: WindowConfig.nullable().optional(),
  cmds: TriggerCmd.array().describe("Commands to trigger the UI"),
  platforms: OSPlatform.array().nullable().default(allPlatforms).describe("Platforms available on. Leave empty for all platforms.")
});
var InlineCmd = z.object({
  main: z.string(),
  name: z.string(),
  description: z.string().nullable().default("").describe("Description of the Command"),
  cmds: TriggerCmd.array(),
  platforms: OSPlatform.array().nullable().default(allPlatforms).describe("Platforms available on. Leave empty for all platforms.")
});
var Icon = z.object({
  type: IconType,
  value: z.string()
});
var JarvisExtManifest = z.object({
  name: z.string().describe("Name of the extension (Human Readable)"),
  shortDescription: z.string().describe("Description of the extension (Will be displayed in store)"),
  longDescription: z.string().describe("Long description of the extension (Will be displayed in store)"),
  identifier: z.string().describe("Unique identifier for the extension"),
  icon: Icon.describe("Icon for the extension"),
  permissions: PermissionsEnum.array().optional().nullable().default([]).describe("Permissions Declared by the extension. e.g. clipboard-all. Not declared APIs will be blocked."),
  demoImages: z.array(z.string()).describe("Demo images for the extension"),
  uiCmds: UiCmd.array().optional().default([]).describe("UI Commands"),
  inlineCmds: InlineCmd.array().optional().default([]).describe("Inline Commands")
});
var ExtPackageJson = z.object({
  name: z.string().describe("Package name for the extension (just a regular npm package name)"),
  version: z.string().describe("Version of the extension"),
  jarvis: JarvisExtManifest.describe("Jarvis extension manifest"),
  files: z.string().array().describe("Files to include in the extension. e.g. ['dist']")
});
var ExtPackageJsonExtra = ExtPackageJson.merge(z.object({
  extPath: z.string(),
  extFolderName: z.string()
}));
// ../../packages/tauri-plugin-jarvis/guest-js/models/apps.ts
var AppInfo = z.object({
  name: z.string(),
  icon_path: z.string().nullable(),
  app_path_exe: z.string().nullable(),
  app_desktop_path: z.string()
});
// ../../packages/tauri-plugin-jarvis/guest-js/models/command.ts
var CommandType = z.enum(["system", "ui-cmd", "inline-cmd", "app"]);
var TCommand = z.object({
  name: z.string(),
  value: z.string(),
  icon: z.string().nullable(),
  keywords: z.array(z.string()).nullable(),
  commandType: CommandType,
  function: z.function(),
  confirmRequired: z.boolean()
});
// ../../packages/tauri-plugin-jarvis/guest-js/models/list.ts
var ListItemType = z.enum([
  "Remote Command",
  "Command",
  "UI Command",
  "Inline Command",
  "System Command",
  "Application",
  "Built-In Command"
]);
var IconSchema = z.object({
  value: z.string(),
  type: IconType
});
var TListItem = z.object({
  title: z.string(),
  value: z.string(),
  description: z.string(),
  type: ListItemType,
  flags: z.object({
    isDev: z.boolean().optional().default(false),
    isRemovable: z.boolean().optional().default(false)
  }).optional().default({}),
  icon: IconSchema.nullable(),
  keywords: z.array(z.string()).optional().default([]),
  identityFilter: z.boolean().optional().default(false)
});
var TListGroup = z.object({
  title: z.string(),
  type: z.string(),
  identifier: z.string(),
  icon: IconSchema.optional(),
  items: z.array(TListItem),
  flags: z.object({
    isDev: z.boolean().optional().default(false),
    isRemovable: z.boolean().optional().default(false)
  })
});
// ../../packages/tauri-plugin-jarvis/guest-js/models/extension.ts
var ExtensionLabelMap = z.record(z.string().describe("Window label"), z.object({
  path: z.string().describe("Path to the extension")
}));
// ../../packages/tauri-plugin-jarvis/guest-js/commands/system.ts
function openTrash() {
  return invoke("plugin:jarvis|open_trash");
}
function emptyTrash() {
  return invoke("plugin:jarvis|empty_trash");
}
function shutdown() {
  return invoke("plugin:jarvis|shutdown");
}
function reboot() {
  return invoke("plugin:jarvis|reboot");
}
function sleep() {
  return invoke("plugin:jarvis|sleep");
}
function toggleSystemAppearance() {
  return invoke("plugin:jarvis|toggle_system_appearance");
}
function showDesktop() {
  return invoke("plugin:jarvis|show_desktop");
}
function quitAllApps() {
  return invoke("plugin:jarvis|quit_app_apps");
}
function sleepDisplays() {
  return invoke("plugin:jarvis|sleep_displays");
}
function setVolume(percentage) {
  return invoke("plugin:jarvis|set_volume", { percentage });
}
function setVolumeTo0() {
  return setVolume(0);
}
function setVolumeTo25() {
  return setVolume(25);
}
function setVolumeTo50() {
  return setVolume(50);
}
function setVolumeTo75() {
  return setVolume(75);
}
function setVolumeTo100() {
  return setVolume(100);
}
function turnVolumeUp() {
  return invoke("plugin:jarvis|turn_volume_up");
}
function turnVolumeDown() {
  return invoke("plugin:jarvis|turn_volume_down");
}
function toggleStageManager() {
  return invoke("plugin:jarvis|toggle_stage_manager");
}
function toggleBluetooth() {
  return invoke("plugin:jarvis|toggle_bluetooth");
}
function toggleHiddenFiles() {
  return invoke("plugin:jarvis|toggle_hidden_files");
}
function ejectAllDisks() {
  return invoke("plugin:jarvis|eject_all_disks");
}
function logoutUser() {
  return invoke("plugin:jarvis|logout_user");
}
function toggleMute() {
  return invoke("plugin:jarvis|toggle_mute");
}
function mute() {
  return invoke("plugin:jarvis|mute");
}
function unmute() {
  return invoke("plugin:jarvis|unmute");
}
function getFrontmostApp() {
  return invoke("plugin:jarvis|get_frontmost_app").then((app) => AppInfo.parse(app));
}
function hideAllAppsExceptFrontmost() {
  return invoke("plugin:jarvis|hide_all_apps_except_frontmost");
}
function getSelectedFilesInFileExplorer() {
  return invoke("plugin:jarvis|get_selected_files_in_file_explorer");
}
// ../../packages/api/ui/client.ts
var getWorkerApi3 = () => getWorkerApiClient();
var getIframeApi3 = () => getWindowApiClient(window.parent);
var defaultClientAPI2 = isInIframe() ? getIframeApi3() : getWorkerApi3();

// ../../packages/api/ui/api/system.ts
var comlinkSystem = {
  openTrash: defaultClientAPI2.systemOpenTrash,
  emptyTrash: defaultClientAPI2.systemEmptyTrash,
  shutdown: defaultClientAPI2.systemShutdown,
  reboot: defaultClientAPI2.systemReboot,
  sleep: defaultClientAPI2.systemSleep,
  toggleSystemAppearance: defaultClientAPI2.systemToggleSystemAppearance,
  showDesktop: defaultClientAPI2.systemShowDesktop,
  quitAllApps: defaultClientAPI2.systemQuitAllApps,
  sleepDisplays: defaultClientAPI2.systemSleepDisplays,
  setVolume: defaultClientAPI2.systemSetVolume,
  setVolumeTo0: defaultClientAPI2.systemSetVolumeTo0,
  setVolumeTo25: defaultClientAPI2.systemSetVolumeTo25,
  setVolumeTo50: defaultClientAPI2.systemSetVolumeTo50,
  setVolumeTo75: defaultClientAPI2.systemSetVolumeTo75,
  setVolumeTo100: defaultClientAPI2.systemSetVolumeTo100,
  turnVolumeUp: defaultClientAPI2.systemTurnVolumeUp,
  turnVolumeDown: defaultClientAPI2.systemTurnVolumeDown,
  toggleStageManager: defaultClientAPI2.systemToggleStageManager,
  toggleBluetooth: defaultClientAPI2.systemToggleBluetooth,
  toggleHiddenFiles: defaultClientAPI2.systemToggleHiddenFiles,
  ejectAllDisks: defaultClientAPI2.systemEjectAllDisks,
  logoutUser: defaultClientAPI2.systemLogoutUser,
  toggleMute: defaultClientAPI2.systemToggleMute,
  mute: defaultClientAPI2.systemMute,
  unmute: defaultClientAPI2.systemUnmute,
  getFrontmostApp: defaultClientAPI2.systemGetFrontmostApp,
  hideAllAppsExceptFrontmost: defaultClientAPI2.systemHideAllAppsExceptFrontmost,
  getSelectedFilesInFileExplorer: defaultClientAPI2.systemGetSelectedFilesInFileExplorer
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
var system2 = isMain() ? nativeSystem : comlinkSystem;

// /Users/hacker/Dev/projects/Jarvis/extensions/hacker-news/node_modules/jarvis-api/ui/worker.ts
var testAPI = () => {
  console.log("testAPI");
};

// index.ts
(async () => {
  const text = await comlinkClipboard.readText();
  console.log("test-worker", text);
})();
testAPI();
