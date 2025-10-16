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

function isLikelyCode(text: string): boolean {
  const trimmed = text.trim();
  
  // Check if it starts with a language identifier comment
  const languageComments = [
    /^\/\/\s*(javascript|js|typescript|ts|python|py|java|cpp|c\+\+|c#|cs|go|rust|ruby|rb|php|swift|kotlin|scala|haskell|hs)/i,
    /^#\s*(python|py|ruby|rb|perl|pl|bash|sh|shell)/i,
    /^\/\*\s*(javascript|js|typescript|ts|java|cpp|c\+\+|c#|cs|go|rust)/i
  ];
  
  if (languageComments.some(regex => regex.test(trimmed))) {
    return true;
  }
  
  // Check for common code keywords and patterns
  const codePatterns = [
    /\b(function|def|class|interface|enum|struct|let|const|var|import|export|require|from|public|private|protected|static|final|async|await|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|this|super)\b/,
    /=>\s*{/, // Arrow functions
    /{[\s\S]*?}/, // Curly braces
    /\([\s\S]*?\)/, // Parentheses
    /\[[\s\S]*?\]/, // Square brackets
    /<[\s\S]*?>/, // Angle brackets (for generics/JSX)
    /^\s{2,}.+/m, // Lines starting with 2+ spaces
    /^\t+.+/m, // Lines starting with tabs
    /;\s*$/, // Lines ending with semicolons
    /\/\/.*$/m, // Single line comments
    /\/\*[\s\S]*?\*\//, // Multi-line comments
  ];
  
  const codePatternCount = codePatterns.filter(pattern => pattern.test(text)).length;
  
  // Check for high density of operators
  const operators = text.match(/[=+\-*/%&|\^<>!~?:]/g) || [];
  const operatorDensity = operators.length / Math.max(1, text.length);
  
  // If we have multiple code patterns or high operator density, it's likely code
  return codePatternCount >= 2 || operatorDensity > 0.05;
}

function detectLanguage(text: string): string {
  const trimmed = text.trim();
  
  // Check for explicit language markers
  const languageMarkers = [
    { pattern: /^\/\/\s*(javascript|js)\b/i, lang: 'javascript' },
    { pattern: /^\/\/\s*(typescript|ts)\b/i, lang: 'typescript' },
    { pattern: /^#\s*(python|py)\b/i, lang: 'python' },
    { pattern: /^\/\/\s*(java)\b/i, lang: 'java' },
    { pattern: /^\/\/\s*(cpp|c\+\+)\b/i, lang: 'cpp' },
    { pattern: /^\/\/\s*(c#|cs)\b/i, lang: 'csharp' },
    { pattern: /^\/\/\s*(go)\b/i, lang: 'go' },
    { pattern: /^\/\/\s*(rust)\b/i, lang: 'rust' },
    { pattern: /^#\s*(ruby|rb)\b/i, lang: 'ruby' },
    { pattern: /^\/\/\s*(php)\b/i, lang: 'php' },
    { pattern: /^\/\/\s*(swift)\b/i, lang: 'swift' },
  ];
  
  for (const marker of languageMarkers) {
    if (marker.pattern.test(trimmed)) {
      return marker.lang;
    }
  }
  
  // Fallback: try to infer from content
  if (text.includes('function') || text.includes('=>') || text.includes('const ') || text.includes('let ')) {
    return 'javascript';
  } else if (text.includes('def ') || text.includes('import ') || text.includes('from ')) {
    return 'python';
  } else if (text.includes('public ') || text.includes('class ') || text.includes('interface ')) {
    return 'java';
  }
  
  return 'text'; // Default to text if we can't determine
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
      
      // Filter out <think>...</think> tags
      const filteredText = text.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      
      // Only check if the entire text is valid JSON
      if (isJSON(filteredText)) {
        return {
          ...item,
          content: `\`\`\`json\n${formatJSON(filteredText)}\n\`\`\``,
        };
      }
      
      // For user messages, detect if the content appears to be code
      if (isUser && filteredText.length > 0) {
        if (isLikelyCode(filteredText)) {
          const language = detectLanguage(filteredText);
          return {
            ...item,
            content: `\`\`\`${language}\n${filteredText}\n\`\`\``,
          };
        }
      }
      
      // Return filtered text if not code or not a user message
      return {
        ...item,
        content: filteredText
      };
    }
    return item;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 mb-6 px-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="hidden sm:block">
          <div
            className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}
          >
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        </div>
      )}

      <div
        className={`p-4 rounded-2xl max-w-[85%] sm:max-w-[70%] ${bgColor} ${textColor} shadow-sm`}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          <MessageContent content={processedContent} />
        </div>
      </div>

      {isUser && (
        <div className="hidden sm:block">
          <div
            className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}
          >
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
        </div>
      )}
    </motion.div>
  );
}
