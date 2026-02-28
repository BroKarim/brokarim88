// @ts-nocheck
import * as __fd_glob_12 from "../content/work/zonapetik.mdx?collection=main"
import * as __fd_glob_11 from "../content/work/ogtable.mdx?collection=main"
import * as __fd_glob_10 from "../content/work/github.mdx?collection=main"
import * as __fd_glob_9 from "../content/work/21oss.mdx?collection=main"
import * as __fd_glob_8 from "../content/articles/hand-signature.mdx?collection=main"
import * as __fd_glob_7 from "../content/articles/blurry-placeholders.mdx?collection=main"
import * as __fd_glob_6 from "../content/main.mdx?collection=main"
import * as __fd_glob_5 from "../content/work/zonapetik.mdx?collection=work"
import * as __fd_glob_4 from "../content/work/ogtable.mdx?collection=work"
import * as __fd_glob_3 from "../content/work/github.mdx?collection=work"
import * as __fd_glob_2 from "../content/work/21oss.mdx?collection=work"
import * as __fd_glob_1 from "../content/articles/hand-signature.mdx?collection=articles"
import * as __fd_glob_0 from "../content/articles/blurry-placeholders.mdx?collection=articles"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const articles = await create.docs("articles", "content/articles", {}, {"blurry-placeholders.mdx": __fd_glob_0, "hand-signature.mdx": __fd_glob_1, });

export const main = await create.docs("main", "content", {}, {"main.mdx": __fd_glob_6, "articles/blurry-placeholders.mdx": __fd_glob_7, "articles/hand-signature.mdx": __fd_glob_8, "work/21oss.mdx": __fd_glob_9, "work/github.mdx": __fd_glob_10, "work/ogtable.mdx": __fd_glob_11, "work/zonapetik.mdx": __fd_glob_12, });

export const work = await create.docs("work", "content/work", {}, {"21oss.mdx": __fd_glob_2, "github.mdx": __fd_glob_3, "ogtable.mdx": __fd_glob_4, "zonapetik.mdx": __fd_glob_5, });