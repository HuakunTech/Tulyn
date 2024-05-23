import Editor, { type OnChange, type OnMount, type Monaco } from "@monaco-editor/react";
import { ExtPackageJson } from "jarvis-api";
import { useEffect, useMemo, useRef, useState } from "react";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";

const defaultJson = `{
  "$schema": "https://jarvis-extensions.huakun.tech/jarvis-ext-package-json-schema.json",
  "name": "jarvis-ext-jwt",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "description": "JWT Inspector",
  "jarvis": {
    "identifier": "tech.huakun.jarvis-jwt-inspector",
    "demoImages": [],
    "icon": {
      "type": "iconify",
      "icon": "logos:jwt-icon"
    },
    "uiCmds": [
      {
        "main": "dist/index.html",
        "name": "View Decoded JWT",
        "devMain": "http://localhost:5173",
        "window": {
          "width": 800,
          "height": 500,
          "titleBarStyle": "overlay"
        },
        "cmds": [
          {
            "type": "text",
            "value": "jwt"
          }
        ]
      },
      {
        "main": "dist/search.html",
        "name": "Search Decoded JWT",
        "devMain": "http://localhost:5173/search",
        "window": {
          "width": 800,
          "height": 500,
          "titleBarStyle": "overlay"
        },
        "cmds": [
          {
            "type": "text",
            "value": "search-jwt"
          }
        ]
      }
    ],
    "inlineCmds": []
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-check --tsconfig ./tsconfig.json"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^3.0.2",
    "@tsconfig/svelte": "^5.0.2",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.33",
    "svelte": "^4.2.12",
    "svelte-check": "^3.6.7",
    "tailwindcss": "^3.4.1",
    "tslib": "^2.6.2",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  },
  "dependencies": {
    "jarvis-api": "workspace:*",
    "bits-ui": "^0.21.7",
    "clsx": "^2.1.1",
    "cmdk-sv": "^0.0.17",
    "dayjs": "^1.11.11",
    "jose": "^5.3.0",
    "lucide-svelte": "^0.378.0",
    "mode-watcher": "^0.3.0",
    "paneforge": "^0.0.4",
    "svelte-radix": "^1.1.0",
    "svelte-sonner": "^0.3.24",
    "tailwind-merge": "^2.3.0",
    "tailwind-variants": "^0.2.1",
    "zod": "^3.23.8"
  }
}`;

export default function SchemaValidatorEditor() {
  const [packagejson, setPackagejson] = useState("");
  const monacoRef = useRef<null | Monaco>(null);
  const [errMsg, setErrMsg] = useState<string>("");
  const isValid = useMemo(() => {
    return errMsg.length === 0 && packagejson.length > 0;
  }, [packagejson, errMsg]);
  function parse(manifestStr: string) {
    if (manifestStr.length === 0) return;
    try {
      const parsedRes = ExtPackageJson.safeParse(JSON.parse(manifestStr));
      if (parsedRes.error) {
        setErrMsg(parsedRes.error.message);
        console.error(parsedRes.error);
      } else {
        setErrMsg("");
      }
    } catch (error: unknown) {
      setErrMsg(`{ "message": "Parse Error" }`);
    }
  }

  const handleEditorChange: OnChange = (value, event) => {
    // here is the current value
    if (value) {
      setPackagejson(value);
      parse(value);
    }
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    console.log("editorDidMount", editor, monaco);

    monacoRef.current = monaco;
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      enableSchemaRequest: true,
      validate: true,
      schemas: [ // TODO: this schema is not working, I have to use $schema in the json file
        { uri: "https://jarvis-extensions.huakun.tech/jarvis-ext-package-json-schema.json" },
      ],
    });
  };

  useEffect(() => {
    setPackagejson(defaultJson);
    parse(defaultJson);
  }, []);

  return (
    <>
      <div className="text-xl">
        <strong>Is Valid: </strong>
        <span className="dark:text-yellow-400 text-blue-700 font-extrabold">
          {isValid ? "true" : "false"}
        </span>
      </div>
      <Editor
        height="50vh"
        defaultLanguage="json"
        theme="vs-dark"
        defaultValue={defaultJson}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
      />
      {errMsg && (
        <>
          <strong>Error</strong>
          <Editor
            height="30vh"
            defaultLanguage="json"
            theme="vs-dark"
            value={errMsg}
            onChange={handleEditorChange}
          />
        </>
      )}
    </>
  );
}
