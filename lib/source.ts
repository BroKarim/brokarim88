import { work } from "fumadocs-mdx:collections/server";
import { loader } from "fumadocs-core/source";

export const workSource = loader({
  baseUrl: "/work",
  source: work.toFumadocsSource(),
});

// export const ideasSource = loader({
//   baseUrl: "/ideas",
//   source: ideas.toFumadocsSource(),
// });
