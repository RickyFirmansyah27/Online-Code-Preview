"use client";

import NavigationHeader from "../../../(root)/_components/Header";
import { MessageList } from "../message/MessageList";
import { InputForm } from "../input/InputForm";
import { UnifiedControl } from "../input/UnifiedControl";

import { Message, ChatMode } from "../../hooks/useChatState";
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
        {/* Main chat area - takes up most space */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
            <div className="max-w-6xl mx-auto h-full flex flex-col">
              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-4 sm:pb-5 lg:pb-6 relative z-0">
                <MessageList messages={messages} />
              </div>
            </div>
          </div>
        </div>

        {/* Input area - fixed at bottom */}
        <div className="flex-shrink-0 bg-[#0a0a0f] border-t border-gray-800/50 overflow-visible relative z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
            <div className="max-w-6xl mx-auto">
              {/* Image Preview - separated to prevent layout shift */}
              {previewImage && (
                <div className="mb-4 flex justify-center lg:justify-start">
                  <div className="relative inline-block max-w-full lg:max-w-md">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-w-full h-32 sm:h-40 object-contain rounded-lg border border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => onImageUpload(null)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                <div className="flex-shrink-0 w-full lg:w-auto">
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
                    previewImage={null} // Pass null to prevent duplicate preview
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