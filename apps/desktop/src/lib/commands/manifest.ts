import { invoke } from "@tauri-apps/api/core";
import { JarvisExtJson, JarvisExtJsonExtra } from "@jarvis/api";

export function loadManifest(manifestPath: string): Promise<JarvisExtJsonExtra> {
  return invoke("load_manifest", { manifest_path: manifestPath });
}

export function loadAllExtensions(extensionsFolder: string): Promise<JarvisExtJsonExtra[]> {
  return invoke("load_all_extensions", { extensionsFolder }).then((res: any) =>
    res.map((x: unknown) => JarvisExtJsonExtra.parse(x)),
  );
}
