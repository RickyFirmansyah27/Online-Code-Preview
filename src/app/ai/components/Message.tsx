"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import { useState } from "react";
import { BookOpen, Code, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

interface MessageProps {
  role: "user" | "assistant";
  content: { type: "text" | "image"; content: string }[];
}

export function Message({ role, content }: MessageProps) {
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const formatMessageContent = (
    contentItems: { type: "text" | "image"; content: string }[]
  ) => {
    return contentItems.map((item, index) => {
      if (item.type === "image") {
        return (
          <div key={index} className="my-2">
            <img
              src={item.content}
              alt="Uploaded image"
              className="max-w-full rounded-lg"
              style={{ maxHeight: "300px" }}
            />
          </div>
        );
      }

      return (
        <div key={index} className="whitespace-pre-wrap">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code(props) {
                const { className, children } = props;
                const match = /language-(\w+)/.exec(className || "");
                const language = match ? match[1] : undefined;
                const codeString = String(children).replace(/\n$/, "");
                const handleCopy = async () => {
                  try {
                    await navigator.clipboard.writeText(codeString);
                    setCopiedCode(index);
                    setTimeout(() => setCopiedCode(null), 2000);
                  } catch (err) {
                    console.error("Failed to copy code:", err);
                  }
                };
                if (!language) {
                  return <code>{children}</code>;
                }
                return (
                  <pre className="relative my-2">
                    {language && (
                      <div className="absolute top-0 right-0 px-2 py-1 text-xs text-gray-400 bg-gray-800/50">
                        {language}
                      </div>
                    )}
                    <button
                      onClick={handleCopy}
                      className="absolute top-0 right-0 p-1 hover:bg-gray-700/50 rounded transition-colors"
                      title="Copy code"
                    >
                      {copiedCode === index ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <code
                      className={`block p-4 bg-gray-800/50 rounded-lg overflow-x-auto font-mono text-sm custom-scrollbar ${
                        language ? `language-${language}` : ""
                      }`}
                    >
                      {codeString}
                    </code>
                  </pre>
                );
              },
            }}
          >
            {item.content}
          </ReactMarkdown>
        </div>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 mb-6 ${
        role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {role === "assistant" && (
        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
          <Code className="w-4 h-4 text-purple-300" />
        </div>
      )}
      <div
        className={`p-4 rounded-lg max-w-[80%] ${
          role === "user"
            ? "bg-blue-500/20 text-blue-50"
            : "bg-purple-500/20 text-purple-50"
        }`}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {formatMessageContent(content)}
        </div>
      </div>
      {role === "user" && (
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-blue-300" />
        </div>
      )}
    </motion.div>
  );
}
