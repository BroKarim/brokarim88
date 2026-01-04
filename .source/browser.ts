// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  main: create.doc("main", {"main.mdx": () => import("../content/main.mdx?collection=main"), "work/21oss.mdx": () => import("../content/work/21oss.mdx?collection=main"), "work/konten2.mdx": () => import("../content/work/konten2.mdx?collection=main"), "work/side-school.mdx": () => import("../content/work/side-school.mdx?collection=main"), }),
  work: create.doc("work", {"21oss.mdx": () => import("../content/work/21oss.mdx?collection=work"), "konten2.mdx": () => import("../content/work/konten2.mdx?collection=work"), "side-school.mdx": () => import("../content/work/side-school.mdx?collection=work"), }),
};
export default browserCollections;