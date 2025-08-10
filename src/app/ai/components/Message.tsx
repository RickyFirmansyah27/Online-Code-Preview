"use client";

import { useState } from "react";
import { BlockMath } from "react-katex";
import { BookOpen, Code, Copy, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface MessageProps {
  role: "user" | "assistant";
  content: string;
  isLast: boolean;
}

export function Message({ role, content, isLast }: MessageProps) {
  const [copiedCode, setCopiedCode] = useState<number | null>(null);

  const formatMessageContent = (content: string) => {
    // Remove <tool_call>... think> content
    const cleanContent = content
      .replace(/<tool_call>[\s\S]*?<\/think>/g, "")
      .trim();

    // Split content by code block markers
    const parts = cleanContent.split(/(```[\s\S]*?```|\\\[[\s\S]*?\\\])/);

    return parts.map((part, index) => {
      // Check if this part is a code block
      if (part.startsWith("```")) {
        // Extract language and code
        const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
        if (match) {
          // Destructure while ignoring the full match
          const [, language = "", code = ""] = match;
          const handleCopy = async () => {
            try {
              await navigator.clipboard.writeText(code.trim());
              setCopiedCode(index);
              setTimeout(() => setCopiedCode(null), 2000);
            } catch (err) {
              console.error("Failed to copy code:", err);
            }
          };

          return (
            <pre key={index} className="relative mt-2 mb-2">
              <div className="absolute top-0 right-0 flex items-center gap-2">
                {language && (
                  <div className="px-2 py-1 text-xs text-gray-400 bg-gray-800/50">
                    {language}
                  </div>
                )}
                <button
                  onClick={handleCopy}
                  className="p-1 hover:bg-gray-700/50 rounded transition-colors"
                  title="Copy code"
                >
                  {copiedCode === index ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              <code
                className={`block p-4 bg-gray-800/50 rounded-lg overflow-x-auto font-mono text-sm custom-scrollbar ${
                  language ? `language-${language}` : ""
                }`}
              >
                {code.trim()}
              </code>
            </pre>
          );
        }
      }
      if (part.startsWith("\\[")) {
        const math = part.substring(2, part.length - 2);
        return <BlockMath key={index}>{math}</BlockMath>;
      }
      // Regular text
      return <span key={index}>{part}</span>;
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