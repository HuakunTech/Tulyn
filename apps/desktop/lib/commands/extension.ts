import { invoke } from "@tauri-apps/api/tauri";
import { ExtInfo } from "@/lib/model";

export function getExtensions(): Promise<ExtInfo[]> {
  return invoke("get_extensions_info").then((exts) => {
    if (!exts) {
      return [];
    }
    // check if exts is iterable
    if (!Array.isArray(exts)) {
      return [];
    }

    return exts.map((e) => {
      const parse = ExtInfo.safeParse(e);
      if (!parse.success) {
        console.error(parse.error);
        throw new Error(`Failed to parse extension info`, parse.error);
      }
      return ExtInfo.parse(e);
    });
  });
}
