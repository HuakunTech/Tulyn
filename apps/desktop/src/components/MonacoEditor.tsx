import Editor, { type OnChange } from "@monaco-editor/react";

export default function MonacoEditor() {
  const handleEditorChange: OnChange = (value, event) => {
    // here is the current value
  };

  return (
    <Editor
      height="90vh"
      defaultLanguage="javascript"
      defaultValue="// some comment"
      onChange={handleEditorChange}
    />
  );
}
