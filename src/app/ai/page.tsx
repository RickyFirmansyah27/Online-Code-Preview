"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Code, Send, Loader } from "lucide-react";
import NavigationHeader from "@/components/NavigationHeader";
import { useConservationAi } from "@/service/ai-service";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function AiPlayground() {
  // State
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Use the AI mutation hook
  const { mutateAsync: sendMessage, status } = useConservationAi();
  const isLoading = status === "pending";

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

  const renderMessages = () => (
    <div className="max-w-3xl mx-auto bg-gray-900/50 rounded-xl p-4 mb-4 h-[400px] overflow-y-auto">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-3 rounded-lg ${
              message.role === "user" ? "bg-blue-500/20 ml-auto" : "bg-purple-500/20"
            } max-w-[80%]`}
          >
            <p className="text-gray-200">{message.content}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  const renderInputForm = () => (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-gray-900/50 rounded-xl px-4 py-3 pr-12 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your message..."
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        {isLoading ? (
          <Loader className="w-6 h-6 text-gray-400 animate-spin" />
        ) : (
          <Send className="w-6 h-6 text-gray-400" />
        )}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {renderHeader()}
        {renderMessages()}
        {renderInputForm()}
      </div>
    </div>
  );
}

export default AiPlayground;