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
  // Filter out <think>...</think> tags from the content
  const filteredContent = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
  
  return (
    <div className="prose prose-invert prose-p:m-0 prose-headings:m-0 prose-headings:mb-2 whitespace-pre-wrap overflow-x-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code: CodeBlock,
        }}
      >
        {filteredContent}
      </ReactMarkdown>
    </div>
  );
}