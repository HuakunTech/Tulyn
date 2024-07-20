import path from "path"
import fs from "fs-extra"
import { rootDir } from "../src/constants"
import { cleanExtension } from "../src/patch"

const distPath = path.join(rootDir, "dist")
/* -------------------------------------------------------------------------- */
/*                              Worker Extension                              */
/* -------------------------------------------------------------------------- */
cleanExtension(path.join(distPath, "templates", "template-ext-worker"))
cleanExtension(path.join(distPath, "templates", "template-ext-react"))
