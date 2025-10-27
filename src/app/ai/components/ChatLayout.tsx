"use client";

import NavigationHeader from "../../(root)/_components/Header";
import { MessageList } from "./MessageList";
import { InputForm } from "./InputForm";
import { UnifiedControl } from "./UnifiedControl";

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
    <div className="h-screen bg-[#0a0a0f] flex flex-col">
      <NavigationHeader />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header section */}
       
        {/* Main chat area - takes up most space */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="max-w-6xl mx-auto h-full flex flex-col">
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-4 sm:pb-6 relative z-0">
                <MessageList messages={messages} />
              </div>
            </div>
          </div>
        </div>

        {/* Input area - fixed at bottom */}
        <div className="flex-shrink-0 bg-[#0a0a0f] border-t border-gray-800/50 overflow-visible relative z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-6 lg:gap-8">
                <div className="flex-shrink-0 w-full sm:w-auto">
                  <UnifiedControl
                    selectedModel={selectedModel}
                    mode={mode}
                    isDropdownOpen={isDropdownOpen}
                    dropdownRef={dropdownRef}
                    setSelectedModel={setSelectedModel}
                    setMode={setMode}
                    setIsDropdownOpen={setIsDropdownOpen}
                    handleClearMessages={handleClearMessages}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <InputForm
                    input={input}
                    isLoading={isLoading}
                    handleSubmit={handleSubmit}
                    handleInputChange={handleInputChange}
                    onImageUpload={onImageUpload}
                    previewImage={previewImage}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}