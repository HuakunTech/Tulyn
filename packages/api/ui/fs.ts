import { invoke } from "@tauri-apps/api/core";
// import * as _fsApis from "@tauri-apps/plugin-fs";

export { rename, rename as mv, writeFile } from "@tauri-apps/plugin-fs";

/**
 * This command is built into Jarvis App
 * Used to decompress a tarball file
 * @param path
 * @param destinationFolder
 * @param options
 * @returns
 */
export function decompressTarball(
  path: string,
  destinationFolder: string,
  options?: {
    overwrite?: boolean;
  },
): Promise<string> {
  return invoke("decompress_tarball", {
    path,
    destinationFolder,
    overwrite: options?.overwrite ?? false,
  });
}

/**
 * Compress a given directory into a tarball file
 * @param srcDir Directory to compress
 * @param destFile destination file, should end with .tar.gz or .tgz
 * @param options 
 * @returns 
 */
export function compressTarball(
  srcDir: string,
  destFile: string,
  options?: {
    overwrite?: boolean;
  },
): Promise<string> {
  return invoke("compress_tarball", {
    srcDir,
    destFile,
    overwrite: options?.overwrite ?? false,
  });
}
