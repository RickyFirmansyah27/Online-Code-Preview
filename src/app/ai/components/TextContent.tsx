"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { CodeBlock } from "./CodeBlock";

interface TextContentProps {
  content: string;
}

export function TextContent({ content }: TextContentProps) {
  return (
    <div className="whitespace-pre-wrap">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code: CodeBlock,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}