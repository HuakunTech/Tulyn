import * as v from "valibot";

export const JarvisSchema = v.object({
  ui: v.optional(v.nullable(v.string())),
  identifier: v.string(),
  files: v.array(v.string()), // files to be included in the extension production build
});
export type JarvisSchema = v.Input<typeof JarvisSchema>;

export const ManifestSchema = v.object({
  name: v.string(),
  version: v.string(),
  jarvis: JarvisSchema,
});
export type ManifestSchema = v.Input<typeof Manifest.schema>;

export class Manifest {
  name: string;
  version: string;
  ui: string | null | undefined;
  identifier: string;
  files: string[];

  constructor(payload: ManifestSchema) {
    this.name = payload.name;
    this.version = payload.version;
    this.ui = payload.jarvis.ui;
    this.identifier = payload.jarvis.identifier;
    this.files = payload.jarvis.files;
  }

  public static schema = ManifestSchema;

  public static parse(obj: any | string): Manifest {
    if (typeof obj === "string") {
      obj = JSON.parse(obj);
    }
    return new Manifest(v.parse(this.schema, obj));
  }
}
