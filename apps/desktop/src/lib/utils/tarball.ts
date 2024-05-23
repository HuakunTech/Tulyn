import { getDevExtensionFolder } from "@/lib/commands/server";
import { tempDir, join as pathJoin, downloadDir } from "@tauri-apps/api/path";
import { v4 as uuidv4 } from "uuid";
import { fs } from "@jarvis/api/ui";

/**
 *
 * @param tarballPath path to .tar.gz file
 */
export async function installTarball(tarballPath: string) {
  const extDir = await getDevExtensionFolder();
  const tempDirPath = await tempDir();

  if (!extDir) {
    return Promise.reject("Extension Folder Not Set");
  }
  const extInstallPath = await pathJoin(extDir, uuidv4());
  // await rename(tarballPath, "/Users/hacker/Downloads/qrcode.tar.gz");
  const decompressDest = await fs.decompressTarball(tarballPath, tempDirPath, { overwrite: true });
  await fs.rename(decompressDest, extInstallPath);
}
