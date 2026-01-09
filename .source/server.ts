// @ts-nocheck
import * as __fd_glob_8 from "../content/work/zonapetik.mdx?collection=main"
import * as __fd_glob_7 from "../content/work/ogtable.mdx?collection=main"
import * as __fd_glob_6 from "../content/work/21oss.mdx?collection=main"
import * as __fd_glob_5 from "../content/articles/blurry-placeholders.mdx?collection=main"
import * as __fd_glob_4 from "../content/main.mdx?collection=main"
import * as __fd_glob_3 from "../content/work/zonapetik.mdx?collection=work"
import * as __fd_glob_2 from "../content/work/ogtable.mdx?collection=work"
import * as __fd_glob_1 from "../content/work/21oss.mdx?collection=work"
import * as __fd_glob_0 from "../content/articles/blurry-placeholders.mdx?collection=articles"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const articles = await create.docs("articles", "content/articles", {}, {"blurry-placeholders.mdx": __fd_glob_0, });

export const main = await create.docs("main", "content", {}, {"main.mdx": __fd_glob_4, "articles/blurry-placeholders.mdx": __fd_glob_5, "work/21oss.mdx": __fd_glob_6, "work/ogtable.mdx": __fd_glob_7, "work/zonapetik.mdx": __fd_glob_8, });

export const work = await create.docs("work", "content/work", {}, {"21oss.mdx": __fd_glob_1, "ogtable.mdx": __fd_glob_2, "zonapetik.mdx": __fd_glob_3, });