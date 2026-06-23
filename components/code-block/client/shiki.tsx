"use client";

import { useEffect, useState, useMemo, type ComponentProps } from "react";

import { cn } from "@/lib/utils";
import { highlight, Themes, type Languages } from "@/utils/shiki/highlight";

interface CodeblockClientShikiProps extends ComponentProps<"div"> {
  code: string;
  language?: Languages;
  lineNumbers?: boolean;
}

const CodeblockShiki = ({
  code,
  language = "tsx",
  lineNumbers = false,
  className,
  ...props
}: CodeblockClientShikiProps) => {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

  const transformers = useMemo(
    () =>
      lineNumbers
        ? [
            {
              name: "AddLineNumbers",
              pre(node: any) {
                const shikiStyles = node.properties.class;
                node.properties.class = `${shikiStyles} shiki-line-numbers`;
              },
            },
          ]
        : [],
    [lineNumbers],
  );

  useEffect(() => {
    async function clientHighlight() {
      if (!code) {
        setHighlightedHtml("<pre><code></code></pre>");
        return;
      }
      const highlighter = await highlight();
      const html = highlighter.codeToHtml(code, {
        lang: language,
        theme: Themes.dark,
        transformers,
      });
      setHighlightedHtml(html);
    }
    void clientHighlight();
  }, [code, language, transformers]);

  const classNames = cn("w-full bg-background overflow-x-auto ", className);

  // SSR fallback
  return highlightedHtml ? (
    <div
      className={classNames}
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      {...props}
    />
  ) : (
    <div className={classNames} {...props}>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
};

export { CodeblockShiki };
