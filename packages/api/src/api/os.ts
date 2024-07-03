import { type IOs } from "../api/client-types";
import { defaultClientAPI, isMain } from "../client";
import { type Remote } from "@huakunshen/comlink";
import {
  arch,
  eol,
  exeExtension,
  family,
  hostname,
  locale,
  platform,
  version
} from "@tauri-apps/plugin-os";
import { type IOsServer } from "./server-types";

export function constructAPI(api: Remote<IOsServer>): IOs {
  return {
    platform: api.osPlatform,
    arch: api.osArch,
    exeExtension: api.osExeExtension,
    family: api.osFamily,
    hostname: api.osHostname,
    eol: api.osEol,
    version: api.osVersion,
    locale: api.osLocale
  };
}
export const comlinkOs: IOs = constructAPI(defaultClientAPI);

export const nativeOs: IOs = {
  platform: platform,
  arch: arch,
  exeExtension: exeExtension,
  family: family,
  hostname: hostname,
  eol: () => Promise.resolve(eol()),
  version: version,
  locale: locale
};

export const os = isMain ? nativeOs : comlinkOs;
