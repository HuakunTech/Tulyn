import { expect, test, describe } from "bun:test";
import { Manifest, type ManifestSchema } from "../manifest";

const samplePackageJson1 = {
  name: "some-extensions",
  version: "1.0.0",
  jarvis: {
    identifier: "video-processing.huakun.tech",
    ui: "index.html",
    files: [],
  },
};

describe("Manifest", () => {
  test("Load Valid", () => {
    const manifest1 = Manifest.parse(JSON.stringify(samplePackageJson1));
    const manifest2 = Manifest.parse(samplePackageJson1);
    const samplePackageJson2: ManifestSchema =
      structuredClone(samplePackageJson1);
    samplePackageJson2.jarvis.ui = null;
    const manifest3 = Manifest.parse(samplePackageJson2); // ui field can be null
    // undefined ui
    const samplePackageJson3: any = structuredClone(samplePackageJson1);
    delete samplePackageJson3.jarvis.ui;
    expect(samplePackageJson3.jarvis.ui).toBeUndefined();
    const manifest4 = Manifest.parse(samplePackageJson3); // ui field can be undefined
  });

  test("Missing Identifier", () => {
    const samplePackageJson2: any = structuredClone(samplePackageJson1);
    delete samplePackageJson2.jarvis.identifier;
    expect(samplePackageJson2.jarvis.identifier).toBeUndefined();
    expect(() => Manifest.parse(samplePackageJson2)).toThrow();
  });
});
