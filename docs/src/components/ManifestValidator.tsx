import Editor, { type OnChange } from "@monaco-editor/react";
import { JarvisExtJson } from "@jarvis/api";
import { useMemo, useState } from "react";

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

  return (
    <>
      <div className="text-xl">
        <strong>Is Valid: </strong>
        <span className="dark:text-yellow-400 text-blue-700 font-extrabold">{isValid ? "true" : "false"}</span>
      </div>
      <Editor
        height="50vh"
        defaultLanguage="json"
        theme="vs-dark"
        defaultValue={`{}`}
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
