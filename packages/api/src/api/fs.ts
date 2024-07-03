import { type IFs } from "../api/client-types"
import { defaultClientAPI, isMain } from "../client"
import { type Remote } from "@huakunshen/comlink"
import {
  copyFile,
  create,
  exists,
  lstat,
  mkdir,
  readDir,
  readFile,
  readTextFile,
  remove,
  rename,
  stat,
  truncate,
  writeFile,
  writeTextFile
} from "@tauri-apps/plugin-fs"
import { type IFsServer } from "./server-types"

export function constructAPI(api: Remote<IFsServer>): IFs {
  return {
    readDir: api.fsReadDir,
    readFile: api.fsReadFile,
    readTextFile: api.fsReadTextFile,
    stat: api.fsStat,
    lstat: api.fsLstat,
    exists: api.fsExists,
    mkdir: api.fsMkdir,
    create: api.fsCreate,
    copyFile: api.fsCopyFile,
    remove: api.fsRemove,
    rename: api.fsRename,
    truncate: api.fsTruncate,
    writeFile: api.fsWriteFile,
    writeTextFile: api.fsWriteTextFile
  }
}
export const comlinkFs: IFs = constructAPI(defaultClientAPI)

export const nativeFs: IFs = {
  readDir: readDir,
  readFile: readFile,
  readTextFile: readTextFile,
  stat: stat,
  lstat: lstat,
  exists: exists,
  mkdir: mkdir,
  create: create,
  copyFile: copyFile,
  remove: remove,
  rename: rename,
  truncate: truncate,
  writeFile: writeFile,
  writeTextFile: writeTextFile
}

export const fs = isMain ? nativeFs : comlinkFs
