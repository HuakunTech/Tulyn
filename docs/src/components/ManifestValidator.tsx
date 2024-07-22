import { ExtPackageJson } from "@kunkunsh/schema"
import Editor, { type Monaco, type OnChange, type OnMount } from "@monaco-editor/react"
import { useEffect, useMemo, useRef, useState } from "react"
import { safeParse } from "valibot"

const defaultJson = `{
  "$schema": "../../packages/schema/manifest-json-schema.json",
  "version": "0.0.1",
  "name": "hacker-news",
  "module": "index.ts",
  "type": "module",
  "kunkun": {
    "name": "Hacker News",
    "identifier": "sh.kunkun.hacker-news",
    "shortDescription": "List latest top hacker news",
    "icon": {
      "type": "iconify",
      "value": "fa:hacker-news"
    },
    "longDescription": "",
    "demoImages": [],
    "permissions": [
      "shell:open"
    ],
    "templateUiCmds": [
      {
        "name": "Hacker News",
        "main": "dist/index.js",
        "description": "Read the latest Hacker News stories",
        "cmds": []
      }
    ],
    "customUiCmds": []
  },
  "scripts": {
    "dev": "rollup -c --watch",
    "build": "rimraf dist && rollup -c"
  },
  "dependencies": {
    "@kunkunsh/api": "workspace:*",
    "valibot": "^0.36.0"
  },
  "devDependencies": {
    "@rollup/plugin-commonjs": "^26.0.1",
    "@rollup/plugin-node-resolve": "^15.2.3",
    "@rollup/plugin-terser": "^0.4.4",
    "@rollup/plugin-typescript": "^11.1.6",
    "rimraf": "^6.0.1",
    "rollup": "^4.18.1",
    "rollup-plugin-typescript2": "^0.36.0",
    "rollup-plugin-visualizer": "^5.12.0"
  },
  "peerDependencies": {
    "typescript": "^5.0.0"
  },
  "files": [
    "dist"
  ]
}`

export default function SchemaValidatorEditor() {
  const [packagejson, setPackagejson] = useState("")
  const monacoRef = useRef<null | Monaco>(null)
  const [errMsg, setErrMsg] = useState<string>("")
  const isValid = useMemo(() => {
    return errMsg.length === 0 && packagejson.length > 0
  }, [packagejson, errMsg])
  function parse(manifestStr: string) {
    if (manifestStr.length === 0) return
    try {
      const parsedRes = safeParse(ExtPackageJson, JSON.parse(manifestStr))
      if (parsedRes.issues) {
        setErrMsg(JSON.stringify(parsedRes.issues, null, 2))
        console.error(parsedRes.issues)
      } else {
        setErrMsg("")
      }
    } catch (error: unknown) {
      setErrMsg(`{ "message": "Parse Error" }`)
    }
  }

  const handleEditorChange: OnChange = (value, event) => {
    // here is the current value
    if (value) {
      setPackagejson(value)
      parse(value)
    }
  }

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    console.log("editorDidMount", editor, monaco)

    monacoRef.current = monaco
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      enableSchemaRequest: true,
      validate: true,
      schemas: [
        // TODO: this schema is not working, I have to use $schema in the json file
        { uri: "https://schema.kunkun.sh" }
      ]
    })
  }

  useEffect(() => {
    setPackagejson(defaultJson)
    parse(defaultJson)
  }, [])

  return (
    <>
      <div className="text-xl">
        <strong>Is Valid: </strong>
        <span className="font-extrabold text-blue-700 dark:text-yellow-400">
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
  )
}
