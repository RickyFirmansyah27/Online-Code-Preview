import { useState, useRef } from "react";
import { MODEL_OPTIONS, ModelOption } from "@/service/model-types";
import { useCodingAssistant, useCodeAnalyzer, useConversationAi } from "@/service/ai-service";

export interface MessageContent {
  type: "text" | "image";
  content: string;
}

export interface Message {
  role: "user" | "assistant";
  content: MessageContent[];
}

export type ChatMode = "ask" | "debug" | "code";

export function useChatState() {
  // State
  const [input, setInput] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelOption>(MODEL_OPTIONS[0]);
  const [mode, setMode] = useState<ChatMode>("ask");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // AI hooks
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
      default:
        return conversation;
    }
  };

  const { mutateAsync: sendMessage, status } = getHookByMode();
  const isLoading = status === "pending";

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
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: [{ type: "text" as const, content: "Sorry, something went wrong. Please try again." }],
        },
      ]);
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

  return {
    // State
    input,
    uploadedImage,
    messages,
    selectedModel,
    mode,
    isDropdownOpen,
    dropdownRef,
    isLoading,
    
    // Actions
    setInput,
    setSelectedModel,
    setMode,
    setIsDropdownOpen,
    handleSubmit,
    handleImageUpload,
    handleClearMessages,
    handleInputChange,
  };
}