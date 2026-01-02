// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  work: create.doc("work", {"konten2.mdx": () => import("../content/work/konten2.mdx?collection=work"), "side-school.mdx": () => import("../content/work/side-school.mdx?collection=work"), }),
};
export default browserCollections;