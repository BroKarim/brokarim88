// @ts-nocheck
import * as __fd_glob_6 from "../content/work/side-school.mdx?collection=main"
import * as __fd_glob_5 from "../content/work/konten2.mdx?collection=main"
import * as __fd_glob_4 from "../content/work/21oss.mdx?collection=main"
import * as __fd_glob_3 from "../content/main.mdx?collection=main"
import * as __fd_glob_2 from "../content/work/side-school.mdx?collection=work"
import * as __fd_glob_1 from "../content/work/konten2.mdx?collection=work"
import * as __fd_glob_0 from "../content/work/21oss.mdx?collection=work"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const main = await create.docs("main", "content", {}, {"main.mdx": __fd_glob_3, "work/21oss.mdx": __fd_glob_4, "work/konten2.mdx": __fd_glob_5, "work/side-school.mdx": __fd_glob_6, });

export const work = await create.docs("work", "content/work", {}, {"21oss.mdx": __fd_glob_0, "konten2.mdx": __fd_glob_1, "side-school.mdx": __fd_glob_2, });