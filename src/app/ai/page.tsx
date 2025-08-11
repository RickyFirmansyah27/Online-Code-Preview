"use client";

import { useState, useRef } from "react";
import "katex/dist/katex.min.css";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";
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
import { apiPost } from "@/service/axios-client";

interface MessageContent {
  type: "text" | "image";
  content: string; // For text: the message text, for image: base64 data
}

interface Message {
  role: "user" | "assistant";
  content: MessageContent[];
}

function AiPlayground() {
  // State
  const [input, setInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
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
    if (!input.trim() && !uploadedImage) return;

    // Prepare message content
    const messageContent: MessageContent[] = [];
    
    if (input.trim()) {
      messageContent.push({ type: "text" as const, content: input });
    }
    
    if (uploadedImage) {
      messageContent.push({ type: "image" as const, content: uploadedImage });
    }

    const newMessages: Message[] = [
      ...messages,
      { 
        role: "user" as const, 
        content: messageContent
      },
    ];
    setMessages(newMessages);
    setInput("");
    setUploadedImage(null);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await sendMessage(messageContent as any);
      const data = response.data;

      // Check if response is successful
      if (!data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Unexpected API response format");
      }

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: [{ type: "text" as const, content: data.choices[0].message.content }],
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      
      // Check if there's an image in the conversation and implement fallback
      const hasImageInConversation = messageContent.some(item => item.type === "image");
      
      if (hasImageInConversation) {
        console.log("Attempting fallback with Llama 4 Maverick model...");
        
        try {
          // Get the fallback model
          const fallbackModel = MODEL_OPTIONS.find(model => model.model === "meta-llama/llama-4-maverick-17b-128e-instruct");
          
          if (fallbackModel) {
            // Try again with the fallback model using direct API call
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fallbackResponse = await makeApiRequest(fallbackModel.model, messageContent as any);
            const fallbackData = fallbackResponse.data;
            
            if (fallbackData.choices && fallbackData.choices[0]?.message?.content) {
              setMessages([
                ...newMessages,
                {
                  role: "assistant",
                  content: [{ type: "text" as const, content: fallbackData.choices[0].message.content }],
                },
              ]);
              return; // Success with fallback, exit the function
            }
          }
        } catch (fallbackError) {
          console.error("Fallback error:", fallbackError);
        }
      }
      
      // If we reach here, both original and fallback failed
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: [{ type: "text" as const, content: "Sorry, something went wrong. Please try again." }],
        },
      ]);
    }
  };

  // Helper function to create API request for a specific model
  const makeApiRequest = async (model: string, content: MessageContent[]) => {
    // Convert message content for API - similar to what's done in ai-service.ts
    const apiMessages = [
      {
        role: "system" as const,
        content: "You are an expert ai assistant. Always provide accurate and helpful responses."
      }
    ];

    // Handle content formatting for multimodal
    const textContent = content
      .filter(item => item.type === 'text')
      .map(item => item.content)
      .join(' ');
    
    const imageContent = content
      .filter(item => item.type === 'image')
      .map(item => item.content);
    
    if (imageContent.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiContent: any[] = [];
      
      if (textContent.trim()) {
        apiContent.push({
          type: "text",
          text: textContent
        });
      }
      
      imageContent.forEach(img => {
        apiContent.push({
          type: "image_url",
          image_url: {
            url: img
          }
        });
      });
      
      apiMessages.push({
        role: "user" as const,
        content: apiContent
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    } else {
      apiMessages.push({
        role: "user" as const,
        content: textContent
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    }

    const payload = {
      model: model,
      messages: apiMessages,
      temperature: 0.1,
      max_tokens: 2000,
      top_p: 0.9,
      stream: false,
    };

    try {
      const response = await apiPost("/v1/chat/completions", payload, {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
        "Content-Type": "application/json",
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleImageUpload = (imageData: string | null) => {
    setUploadedImage(imageData);
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
          onImageUpload={handleImageUpload}
          previewImage={uploadedImage}
        />
        <MessageList messages={messages} />
      </div>
    </div>
  );
}

export default AiPlayground;
