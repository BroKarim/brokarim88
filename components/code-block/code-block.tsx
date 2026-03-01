import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";
import { FileIcon } from "@react-symbols/icons/utils";

const CodeBlock = ({
  children,
  className,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "not-prose",
        "flex w-full flex-col overflow-clip rounded-lg shadow-xs",
        "bg-neutral-800/70",
        "border border-neutral-800",
        "text-white",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

type CodeBlockHeaderProps = ComponentProps<"div">;

const CodeBlockHeader = ({
  children,
  className,
  ...props
}: CodeBlockHeaderProps) => {
  return (
    <div
      className={cn(
        "not-prose", // Disable Markdown Styles
        "flex h-9 items-center justify-between px-2 py-1.5",
        "text-sm bg-background text-white",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface CodeBlockIconProps extends ComponentProps<"div"> {
  language?: string;
}

const CodeBlockIcon = ({ language, className }: CodeBlockIconProps) => {
  return (
    <FileIcon
      width={16}
      height={16}
      fileName={`.${language ?? ""}`}
      autoAssign={true}
      className={cn(className)}
    />
  );
};

type CodeBlockGroupProps = ComponentProps<"div">;

const CodeBlockGroup = ({
  children,
  className,
  ...props
}: CodeBlockGroupProps) => {
  return (
    <div
      className={cn(
        "flex items-center space-x-2",
        "text-sm text-neutral-600 dark:text-neutral-400",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

const CodeBlockContent = ({
  className,
  children,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "max-h-96 overflow-y-auto px-1",
        "bg-neutral-900",
        "font-mono text-sm leading-5 whitespace-pre",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockIcon,
  CodeBlockGroup,
  CodeBlockContent,
};
