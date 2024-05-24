import { getDevExtensionFolder } from "@/lib/commands/server";
import { loadManifest } from "../commands/manifest";
import { tempDir, join as pathJoin, downloadDir } from "@tauri-apps/api/path";
import { v4 as uuidv4 } from "uuid";
import { fs, path, dialog } from "jarvis-api/ui";
import { ZodError } from "zod";

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
  // decompress tarball to tempDir
  const decompressDest = await fs.decompressTarball(
    tarballPath,
    await path.join(tempDirPath, uuidv4()),
    { overwrite: true },
  );
  return loadManifest(decompressDest)
    .then(async (manifest) => {
      // The extension folder name will be the identifier
      const extInstallPath = await pathJoin(extDir, manifest.jarvis.identifier);
      if (await fs.exists(extInstallPath)) {
        const overwrite = await dialog.ask(
          `Extension ${manifest.jarvis.identifier} already exists, do you want to overwrite it?`,
        );
        if (!overwrite) {
          return Promise.reject("Extension Already Exists");
        }
        await fs.remove(extInstallPath, { recursive: true });
      }
      await fs.rename(decompressDest, extInstallPath);
    })
    .catch((err) => {
      if (err instanceof ZodError) {
        throw new Error("Invalid Manifest or Extension");
      }
      throw new Error(err);
    });
}
