import path from "path"
import fs from "fs-extra"
import { rootDir } from "../src/constants"
import { cleanWorkerExtension } from "../src/patch"

const distPath = path.join(rootDir, "dist")
/* -------------------------------------------------------------------------- */
/*                              Worker Extension                              */
/* -------------------------------------------------------------------------- */
cleanWorkerExtension(path.join(distPath, "templates", "template-ext-worker"))
