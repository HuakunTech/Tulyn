import { invoke } from "@tauri-apps/api/core";
import { ElMessage } from "element-plus";
import { ExtPackageJsonExtra } from "jarvis-api";

export function loadManifest(manifestPath: string): Promise<ExtPackageJsonExtra> {
  return invoke("load_manifest", { manifestPath }).then((res) => ExtPackageJsonExtra.parse(res));
}

export function loadAllExtensions(extensionsFolder: string): Promise<ExtPackageJsonExtra[]> {
  return invoke("load_all_extensions", { extensionsFolder }).then(
    (res: any) =>
      res
        .map((x: unknown) => {
          const parse = ExtPackageJsonExtra.safeParse(x);
          if (parse.error) {
            return null;
          } else {
            return parse.data;
          }
        })
        .filter((x: ExtPackageJsonExtra | null) => x !== null) as ExtPackageJsonExtra[],
  );
}
