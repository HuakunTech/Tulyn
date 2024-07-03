import {
  loadManifest,
  getDevExtensionFolder,
  getExtensionFolder,
} from "tauri-plugin-jarvis-api/commands";
import { tempDir, join as pathJoin, downloadDir } from "@tauri-apps/api/path";
import { v4 as uuidv4 } from "uuid";
import { fs, path, dialog } from "jarvis-api/ui";
import { ZodError } from "zod";
import { download } from "@tauri-apps/plugin-upload";

/**
 *
 * @param tarballPath path to .tar.gz file
 */
export async function installTarball(tarballPath: string, targetDir: string) {
  const tempDirPath = await tempDir();
  if (!targetDir) {
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
      const extInstallPath = await pathJoin(targetDir, manifest.jarvis.identifier);
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
        console.error(err);
        throw new Error("Invalid Manifest or Extension");
      }
      throw new Error(err);
    });
}

export async function installTarballUrl(tarballUrl: string, targetDir: string): Promise<void> {
  const filename = tarballUrl.split("/").pop();
  if (filename) {
    const tempDirPath = await tempDir();
    let tarballPath = await pathJoin(tempDirPath, filename);
    await download(tarballUrl, tarballPath);
    await installTarball(tarballPath, targetDir);
    // sonner.success(`Installed 1 Tarball`);
    await fs.remove(tarballPath);
    // } catch (error: any) {
    //   const { toast } = useToast();
    //   // toast({ title: error, variant: "destructive" });
    // }
  } else {
    return Promise.reject("Invalid Tarball URL. Cannot parse filename");
  }
}
