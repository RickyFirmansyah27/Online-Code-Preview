"use client";

import NavigationHeader from "../../(root)/_components/Header";
import { MessageList } from "./MessageList";
import { InputForm } from "./InputForm";
import { ModelSelector } from "./ModelSelector";
import { ChatHeader } from "./ChatHeader";

import { Message, ChatMode } from "../hooks/useChatState";
import { ModelOption } from "@/service/model-types";

interface ChatLayoutProps {
  selectedModel: ModelOption;
  mode: ChatMode;
  isDropdownOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement>;
  setSelectedModel: (model: ModelOption) => void;
  setMode: (mode: ChatMode) => void;
  setIsDropdownOpen: (open: boolean) => void;
  handleClearMessages: () => void;
  input: string;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onImageUpload: (imageData: string | null) => void;
  previewImage: string | null;
  messages: Message[];
}

export function ChatLayout({
  selectedModel,
  mode,
  isDropdownOpen,
  dropdownRef,
  setSelectedModel,
  setMode,
  setIsDropdownOpen,
  handleClearMessages,
  input,
  isLoading,
  handleSubmit,
  handleInputChange,
  onImageUpload,
  previewImage,
  messages,
}: ChatLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <NavigationHeader />
      <div className="flex-1 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 py-4 h-full flex flex-col">
          <ChatHeader />
          <div className="sticky top-0 bg-[#0a0a0f] z-10 pb-4">
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
              onImageUpload={onImageUpload}
              previewImage={previewImage}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <MessageList messages={messages} />
          </div>
        </div>
      </div>
    </div>
  );
}