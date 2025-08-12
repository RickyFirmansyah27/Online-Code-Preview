"use client";

import "katex/dist/katex.min.css";
import { useChatState } from "./hooks/useChatState";
import { ChatLayout } from "./components/ChatLayout";

function AiPlayground() {
  const {
    input,
    uploadedImage,
    messages,
    selectedModel,
    mode,
    isDropdownOpen,
    dropdownRef,
    isLoading,
    setSelectedModel,
    setMode,
    setIsDropdownOpen,
    handleSubmit,
    handleImageUpload,
    handleClearMessages,
    handleInputChange,
  } = useChatState();

  return (
    <ChatLayout
      selectedModel={selectedModel}
      mode={mode}
      isDropdownOpen={isDropdownOpen}
      dropdownRef={dropdownRef}
      setSelectedModel={setSelectedModel}
      setMode={setMode}
      setIsDropdownOpen={setIsDropdownOpen}
      handleClearMessages={handleClearMessages}
      input={input}
      isLoading={isLoading}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      onImageUpload={handleImageUpload}
      previewImage={uploadedImage}
      messages={messages}
    />
  );
}

export default AiPlayground;
