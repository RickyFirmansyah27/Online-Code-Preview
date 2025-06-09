"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Code, Send, Loader, ChevronDown } from "lucide-react";
import NavigationHeader from "@/components/NavigationHeader";
import { useConservationAi } from "@/service/ai-service";
import { MODEL_OPTIONS, ModelOption } from "@/service/model-types";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function AiPlayground() {
  // State
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(MODEL_OPTIONS[0]);
  
  // Use the AI mutation hook
  const { mutateAsync: sendMessage, status } = useConservationAi(selectedModel.model);
  const isLoading = status === "pending";

  // Tambahkan useRef untuk auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Event Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages: Message[] = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await sendMessage(input);
      const data = response.data;
      
      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Unexpected API response format");
      }

      setMessages([...newMessages, { 
        role: "assistant", 
        content: data.choices[0].message.content 
      }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { 
        role: "assistant", 
        content: "Sorry, something went wrong. Please try again." 
      }]);
    }
  };

  // UI Components
  const renderHeader = () => (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-sm text-gray-400 mb-6"
      >
        <BookOpen className="w-4 h-4" />
        AI Chat Interface
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text mb-6"
      >
        Chat with AI Assistant
      </motion.h1>
    </div>
  );

  const renderMessages = () => {
    const formatMessageContent = (content: string) => {
      // Split content by code block markers
      const parts = content.split(/(```[\s\S]*?```)/);
      
      return parts.map((part, index) => {
        // Check if this part is a code block
        if (part.startsWith('```')) {
          // Extract language and code
          const match = part.match(/```(\w+)?\n?([\s\S]*?)```/);
          if (match) {
            const [_, language = '', code = ''] = match;
            return (
              <pre key={index} className="relative mt-2 mb-2">
                {language && (
                  <div className="absolute top-0 right-0 px-2 py-1 text-xs text-gray-400 bg-gray-800/50 rounded-bl">
                    {language}
                  </div>
                )}
                <code className={`block p-4 bg-gray-800/50 rounded-lg overflow-x-auto font-mono text-sm ${
                  language ? `language-${language}` : ''
                }`}>
                  {code.trim()}
                </code>
              </pre>
            );
          }
        }
        // Regular text
        return <span key={index}>{part}</span>;
      });
    };

    return (
      <div className="max-w-3xl mx-auto bg-gray-900/50 rounded-xl p-6 mb-4 h-[500px] overflow-y-auto">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 mb-6 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Code className="w-4 h-4 text-purple-300" />
                </div>
              )}
              <div
                className={`p-4 rounded-lg max-w-[80%] ${
                  message.role === "user" 
                    ? "bg-blue-500/20 text-blue-50" 
                    : "bg-purple-500/20 text-purple-50"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {formatMessageContent(message.content)}
                </p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-300" />
                </div>
              )}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>
    );
  };

  const renderInputForm = () => (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="relative bg-gray-900/50 rounded-xl p-1 focus-within:ring-2 focus-within:ring-blue-500 mb-5">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          className="w-full bg-transparent px-4 py-3 text-gray-200 focus:outline-none resize-none overflow-hidden font-mono"
          placeholder="Type your message..."
          disabled={isLoading}
          style={{
            minHeight: '44px',
            maxHeight: '200px'
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 bottom-2 p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          {isLoading ? (
            <Loader className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Send className="w-5 h-5 text-gray-400" />
          )}
        </button>
      </div>
    </form>
  );

  const renderModelSelector = () => {
    // Group models by category
    const groupedModels = MODEL_OPTIONS.reduce((acc, model) => {
      if (!acc[model.category]) {
        acc[model.category] = [];
      }
      acc[model.category].push(model);
      return acc;
    }, {} as Record<string, ModelOption[]>);

    return (
      <div className="max-w-3xl mx-auto mb-6">
        <div className="relative">
          <select
            value={selectedModel.id}
            onChange={(e) => {
              const model = MODEL_OPTIONS.find(m => m.id === e.target.value);
              if (model) setSelectedModel(model);
            }}
            className="w-full bg-gray-900/50 text-gray-200 px-4 py-3 rounded-xl appearance-none cursor-pointer 
              focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700/50
              hover:border-blue-500/50 transition-colors"
          >
            {Object.entries(groupedModels).map(([category, models]) => (
              <optgroup 
                key={`group-${category}`}
                label={category}
                className="bg-gray-900 text-gray-200"
              >
                {models.map((model) => (
                  <option 
                    key={model.id}
                    value={model.id}
                    className="bg-gray-800 text-gray-200 hover:bg-gray-700"
                  >
                    {model.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none
            bg-gradient-to-l from-gray-900/50 via-gray-900/50 to-transparent pl-6">
            <ChevronDown className="w-5 h-5 text-blue-400" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {renderHeader()}
        {renderModelSelector()}
        {renderInputForm()}
        {renderMessages()}
      </div>
    </div>
  );
}

export default AiPlayground;