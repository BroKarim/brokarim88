// source.config.ts
import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";
var main = defineDocs({
  dir: "content",
  docs: {
    schema: frontmatterSchema
  }
});
var work = defineDocs({
  dir: "content/work",
  docs: {
    schema: frontmatterSchema.extend({
      tag: z.string().optional(),
      author: z.string().optional(),
      media: z.string().optional(),
      published: z.boolean().optional().default(true)
    })
  }
});
var source_config_default = defineConfig();
export {
  source_config_default as default,
  main,
  work
};
