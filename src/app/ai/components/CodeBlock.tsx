"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface CodeBlockProps {
  className?: string;
  children?: React.ReactNode;
}

export function CodeBlock({ className, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : undefined;
  const codeString = String(children).replace(/\n$/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  if (!language) {
    return <code className={className}>{children}</code>;
  }

  return (
    <div className="relative my-2">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800/50 text-gray-400 text-xs">
        <span>{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-gray-200 transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: "0 0 0.5rem 0.5rem",
        }}
        codeTagProps={{ className: "font-mono text-sm" }}
      >
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
}