import { toast } from "vue-sonner";
import { getDevExtensionFolder } from "@/lib/commands/server";
import { tempDir, join as pathJoin, downloadDir } from "@tauri-apps/api/path";
import { v4 as uuidv4 } from "uuid";
import * as fs from "@tauri-apps/plugin-fs";
import { decompressTarball } from "@jarvis/api-ui/src/fs";

/**
 *
 * @param tarballPath path to .tar.gz file
 */
export async function installTarball(tarballPath: string) {
  const extDir = await getDevExtensionFolder();
  const tempDirPath = await tempDir();

  if (!extDir) {
    return toast.error("Extension Folder Not Set");
  }
  const extInstallPath = await pathJoin(extDir, uuidv4());
  // await rename(tarballPath, "/Users/hacker/Downloads/qrcode.tar.gz");
  const decompressDest = await decompressTarball(tarballPath, tempDirPath, { overwrite: true });
  await fs.rename(decompressDest, extInstallPath);
}
