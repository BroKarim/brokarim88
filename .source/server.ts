// @ts-nocheck
import * as __fd_glob_1 from "../content/work/side-school.mdx?collection=work"
import * as __fd_glob_0 from "../content/work/konten2.mdx?collection=work"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const work = await create.docs("work", "content/work", {}, {"konten2.mdx": __fd_glob_0, "side-school.mdx": __fd_glob_1, });