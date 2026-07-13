import { FilePath, QUARTZ, joinSegments } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import fs from "fs"
import { glob } from "../../util/glob"
import { dirname } from "path"

// Files placed here are copied to the site root (e.g. host verification
// files like Google Search Console's googleXXXX.html) instead of under /static/
const ROOT_PASSTHROUGH_DIR = "_root"

export const Static: QuartzEmitterPlugin = () => ({
  name: "Static",
  async *emit({ argv, cfg }) {
    const staticPath = joinSegments(QUARTZ, "static")
    const fps = await glob("**", staticPath, cfg.configuration.ignorePatterns)
    const outputStaticPath = joinSegments(argv.output, "static")
    await fs.promises.mkdir(outputStaticPath, { recursive: true })
    for (const fp of fps) {
      const src = joinSegments(staticPath, fp) as FilePath
      const isRootPassthrough = fp.startsWith(`${ROOT_PASSTHROUGH_DIR}/`)
      const dest = isRootPassthrough
        ? (joinSegments(argv.output, fp.slice(ROOT_PASSTHROUGH_DIR.length + 1)) as FilePath)
        : (joinSegments(outputStaticPath, fp) as FilePath)
      await fs.promises.mkdir(dirname(dest), { recursive: true })
      await fs.promises.copyFile(src, dest)
      yield dest
    }
  },
  async *partialEmit() {},
})
