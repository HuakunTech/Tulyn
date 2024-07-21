import path from "path"
import fs from "fs-extra"
import { getRootDir } from "../src/constants"
import { cleanExtension } from "../src/patch"

const distPath = path.join(getRootDir(), "dist")
/* -------------------------------------------------------------------------- */
/*                              Worker Extension                              */
/* -------------------------------------------------------------------------- */
cleanExtension(path.join(distPath, "templates", "template-ext-worker"))
cleanExtension(path.join(distPath, "templates", "template-ext-react"))
