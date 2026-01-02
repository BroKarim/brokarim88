import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";

export const work = defineDocs({
  dir: "content/work",
  docs: {
    schema: frontmatterSchema.extend({
      tag: z.string().optional(),
      author: z.string().optional(),
      published: z.boolean().optional().default(true),
    }),
  },
});

// export const ideas = defineDocs({
//   dir: "content/ideas",
//   docs: {
//     schema: frontmatterSchema.extend({
//       tags: z.array(z.string()).optional(),
//       publishedOn: z.string().optional(),
//     }),
//   },
// });

export default defineConfig();
