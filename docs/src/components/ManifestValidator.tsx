import Editor, { type OnChange } from "@monaco-editor/react";
import { JarvisExtJson } from "jarvis-api";
import { useEffect, useMemo, useState } from "react";

const defaultJson = `{
  "name": "JWT Inspector",
  "version": "0.0.1",
  "description": "JWT Inspector",
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
}`;

export default function MonacoEditor() {
  const [packagejson, setPackagejson] = useState("");
  const [errMsg, setErrMsg] = useState<string>("");
  const isValid = useMemo(() => {
    return errMsg.length === 0 && packagejson.length > 0;
  }, [packagejson, errMsg]);
  function parse(manifestStr: string) {
    if (manifestStr.length === 0) return;
    try {
      const parsedRes = JarvisExtJson.safeParse(JSON.parse(manifestStr));
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
      />
      {errMsg && (
        <Editor
          height="30vh"
          defaultLanguage="json"
          theme="vs-dark"
          value={errMsg}
          onChange={handleEditorChange}
        />
      )}
    </>
  );
}
