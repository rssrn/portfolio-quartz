import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { FullSlug } from "../../util/path"

export const Robots: QuartzEmitterPlugin = () => ({
  name: "Robots",
  async emit(ctx) {
    if (!ctx.cfg.configuration.baseUrl) {
      return []
    }

    const content = `User-agent: *
Allow: /

Sitemap: https://${ctx.cfg.configuration.baseUrl}/sitemap.xml
`

    const path = await write({
      ctx,
      content,
      slug: "robots" as FullSlug,
      ext: ".txt",
    })
    return [path]
  },
  async *partialEmit() {},
})
