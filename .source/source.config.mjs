// source.config.ts
import { defineDocs, defineConfig, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";
import rehypeShiki from "@shikijs/rehype/core";

// utils/shiki/highlight.ts
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import {
  createHighlighterCore
} from "shiki/core";
import lightTheme from "@shikijs/themes/one-light";
import darkTheme from "@shikijs/themes/one-dark-pro";
import html from "@shikijs/langs/html";
import js from "@shikijs/langs/js";
import ts from "@shikijs/langs/ts";
import tsx from "@shikijs/langs/tsx";
import css from "@shikijs/langs/css";
import json from "@shikijs/langs/json";
import bash from "@shikijs/langs/bash";
import markdown from "@shikijs/langs/mdx";
var jsEngine = null;
var highlighter = null;
var getJsEngine = () => {
  jsEngine ??= createJavaScriptRegexEngine();
  return jsEngine;
};
var highlight = async () => {
  highlighter ??= createHighlighterCore({
    themes: [lightTheme, darkTheme],
    langs: [bash, js, ts, tsx, css, markdown, html, json],
    engine: getJsEngine()
  });
  return highlighter;
};

// utils/rehype.ts
var rehypeShikiOptions = {
  themes: {
    light: "one-light",
    dark: "one-dark-pro"
  }
};

// source.config.ts
var main = defineDocs({
  dir: "content",
  docs: {
    schema: frontmatterSchema.extend({
      tag: z.string().optional(),
      author: z.string().optional(),
      media: z.string().optional(),
      published: z.boolean().optional().default(true)
    })
  }
});
var work = defineDocs({
  dir: "content/work",
  docs: {
    schema: frontmatterSchema.extend({
      tag: z.string().optional(),
      author: z.string().optional(),
      media: z.string().optional(),
      published: z.boolean().optional().default(true)
    })
  }
});
var articles = defineDocs({
  dir: "content/articles",
  docs: {
    schema: frontmatterSchema.extend({
      tag: z.string().optional(),
      author: z.string().optional(),
      media: z.string().optional(),
      published: z.boolean().optional().default(true)
    })
  }
});
var source_config_default = defineConfig({
  mdxOptions: async () => {
    const highlighter2 = await highlight();
    return {
      rehypePlugins: [[rehypeShiki, highlighter2, rehypeShikiOptions]]
    };
  }
});
export {
  articles,
  source_config_default as default,
  main,
  work
};
