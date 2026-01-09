// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  articles: create.doc("articles", {"blurry-placeholders.mdx": () => import("../content/articles/blurry-placeholders.mdx?collection=articles"), }),
  main: create.doc("main", {"main.mdx": () => import("../content/main.mdx?collection=main"), "articles/blurry-placeholders.mdx": () => import("../content/articles/blurry-placeholders.mdx?collection=main"), "work/21oss.mdx": () => import("../content/work/21oss.mdx?collection=main"), "work/ogtable.mdx": () => import("../content/work/ogtable.mdx?collection=main"), "work/zonapetik.mdx": () => import("../content/work/zonapetik.mdx?collection=main"), }),
  work: create.doc("work", {"21oss.mdx": () => import("../content/work/21oss.mdx?collection=work"), "ogtable.mdx": () => import("../content/work/ogtable.mdx?collection=work"), "zonapetik.mdx": () => import("../content/work/zonapetik.mdx?collection=work"), }),
};
export default browserCollections;