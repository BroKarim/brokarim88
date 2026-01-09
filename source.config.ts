import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";

export const main = defineDocs({
  dir: "content",
  docs: {
    schema: frontmatterSchema.extend({
      tag: z.string().optional(),
      author: z.string().optional(),
      media: z.string().optional(),
      published: z.boolean().optional().default(true),
    }),
  },
});

export const work = defineDocs({
  dir: "content/work",
  docs: {
    schema: frontmatterSchema.extend({
      tag: z.string().optional(),
      author: z.string().optional(),
      media: z.string().optional(),
      published: z.boolean().optional().default(true),
    }),
  },
});
export const articles = defineDocs({
  dir: "content/articles",
  docs: {
    schema: frontmatterSchema.extend({
      tag: z.string().optional(),
      author: z.string().optional(),
      media: z.string().optional(),
      published: z.boolean().optional().default(true),
    }),
  },
});

export default defineConfig();
