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
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : undefined;
            
            if (!language) {
              // For inline code, ensure whitespace is preserved
              return <code className={`${className} whitespace-pre-wrap font-mono bg-gray-700/50 px-1 py-0.5 rounded`} {...props}>{children}</code>;
            }
            
            return <CodeBlock className={className} {...props}>{children}</CodeBlock>;
          },
        }}
      >
        {filteredContent}
      </ReactMarkdown>
    </div>
  );
}