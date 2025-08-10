"use client";

import { useState, useRef } from "react";
import "katex/dist/katex.min.css";
import { BookOpen } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import NavigationHeader from "../(root)/_components/Header";
import {
  useCodingAssistant,
  useCodeAnalyzer,
  useConversationAi,
} from "@/service/ai-service";
import { MODEL_OPTIONS, ModelOption } from "@/service/model-types";
import { MessageList } from "./components/MessageList";
import { InputForm } from "./components/InputForm";
import { ModelSelector } from "./components/ModelSelector";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function AiPlayground() {
  // State
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(
    MODEL_OPTIONS[0]
  );

  // Use the AI mutation hook
  const [mode, setMode] = useState<"ask" | "debug" | "code">("ask");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const coding = useCodingAssistant(selectedModel.model);
  const conversation = useConversationAi(selectedModel.model);
  const analyzer = useCodeAnalyzer(selectedModel.model);

  const getHookByMode = () => {
    switch (mode) {
      case "ask":
        return conversation;
      case "debug":
        return analyzer;
      case "code":
        return coding;
    }
  };

  const { mutateAsync: sendMessage, status } = getHookByMode();
  const isLoading = status === "pending";

  // Event Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMessages: Message[] = [
      ...messages,
      { role: "user" as const, content: input },
    ];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await sendMessage(input);
      const data = response.data;

      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Unexpected API response format");
      }

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.choices[0].message.content,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    }
  };

  const handleClearMessages = () => {
    setMessages([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      <div className="relative max-w-7xl mx-auto px-4 py-12">
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
        <ModelSelector
          selectedModel={selectedModel}
          mode={mode}
          isDropdownOpen={isDropdownOpen}
          dropdownRef={dropdownRef}
          setSelectedModel={setSelectedModel}
          setMode={setMode}
          setIsDropdownOpen={setIsDropdownOpen}
          handleClearMessages={handleClearMessages}
        />
        <InputForm
          input={input}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          handleInputChange={handleInputChange}
        />
        <MessageList messages={messages} />
      </div>
    </div>
  );
}

export default AiPlayground;
