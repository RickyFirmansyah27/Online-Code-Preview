"use client";

import { motion } from "framer-motion";
import { BookOpen, Code } from "lucide-react";
import { MessageContent } from "./MessageContent";
import { MessageRole } from "../types";

interface MessageProps {
  role: MessageRole;
  content: Array<{
    type: "text" | "image";
    content: string;
  }>;
}

function isJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

function formatJSON(jsonString: string): string {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return jsonString;
  }
}

export function Message({ role, content }: MessageProps) {
  const isUser = role === "user";
  const Icon = isUser ? BookOpen : Code;
  const iconColor = isUser ? "text-blue-300" : "text-purple-300";
  const bgColor = isUser ? "bg-blue-500/20" : "bg-purple-500/20";
  const textColor = isUser ? "text-blue-50" : "text-purple-50";

  // Simplified JSON formatting - only format if entire content is valid JSON
  const processedContent = content.map((item) => {
    if (item.type === "text") {
      const text = item.content.trim();
      
      // Only check if the entire text is valid JSON
      if (isJSON(text)) {
        return {
          ...item,
          content: `\`\`\`json\n${formatJSON(text)}\n\`\`\``,
        };
      }
      
      // Return as-is if not entirely JSON
      return item;
    }
    return item;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 mb-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div
          className={`w-8 h-8 rounded-full ${bgColor} hidden sm:flex items-center justify-center`}
        >
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      )}

      <div
        className={`p-4 rounded-lg sm:max-w-[80%] max-w-full ${bgColor} ${textColor}`}
      >
        <div className="text-sm whitespace-pre-wrap">
          <MessageContent content={processedContent} />
        </div>
      </div>

      {isUser && (
        <div
          className={`w-8 h-8 rounded-full ${bgColor} hidden sm:flex items-center justify-center`}
        >
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      )}
    </motion.div>
  );
}
