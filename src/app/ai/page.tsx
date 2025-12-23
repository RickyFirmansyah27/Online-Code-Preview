"use client";

import { useChatState } from "./hooks/useChatState";
import { ChatLayout } from "./components/layout/ChatLayout";

function AiPlayground() {
  const {
    input,
    uploadedImages,
    messages,
    selectedModel,
    mode,
    isDropdownOpen,
    dropdownRef,
    isLoading,
    memoryLimit,
    setSelectedModel,
    setMode,
    setIsDropdownOpen,
    setMemoryLimit,
    handleSubmit,
    handleImageUpload,
    handleClearMessages,
    handleInputChange
  } = useChatState();

  return (
    <ChatLayout
      selectedModel={selectedModel}
      mode={mode}
      isDropdownOpen={isDropdownOpen}
      dropdownRef={dropdownRef}
      memoryLimit={memoryLimit}
      setSelectedModel={setSelectedModel}
      setMode={setMode}
      setIsDropdownOpen={setIsDropdownOpen}
      setMemoryLimit={setMemoryLimit}
      handleClearMessages={handleClearMessages}
      input={input}
      isLoading={isLoading}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
      onImageUpload={handleImageUpload}
      previewImages={uploadedImages}
      messages={messages}
    />
  );
}

export default AiPlayground;
