"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { ModelOption, MODEL_OPTIONS } from "@/service/model-types";
import { MainControlButton } from "../ui/MainControlButton";
import { DropdownHeader } from "../ui/DropdownHeader";
import { ModelSelection } from "../ui/ModelSelection";
import { ModeSelection } from "../ui/ModeSelection";
import { ClearMessages } from "../ui/ClearMessages";
import { MemorySettings } from "../ui/MemorySettings";
import { ChatMode } from "../constants/controlConstants";

interface UnifiedControlProps {
  selectedModel: ModelOption;
  mode: ChatMode;
  isDropdownOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement>;
  memoryLimit: number;
  setSelectedModel: (model: ModelOption) => void;
  setMode: (mode: ChatMode) => void;
  setIsDropdownOpen: (open: boolean) => void;
  setMemoryLimit: (limit: number) => void;
  handleClearMessages: () => void;
}

export function UnifiedControl({
  selectedModel,
  mode,
  isDropdownOpen,
  dropdownRef,
  memoryLimit,
  setSelectedModel,
  setMode,
  setIsDropdownOpen,
  setMemoryLimit,
  handleClearMessages
}: UnifiedControlProps) {
  const handleModelChange = (modelId: string) => {
    const model = MODEL_OPTIONS.find((m) => m.id === modelId);
    if (model) {
      setSelectedModel(model);
    }
  };

  return (
    <div className="relative">
      {/* Main Control Button */}
      <MainControlButton
        selectedModel={selectedModel}
        mode={mode}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
      />

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isDropdownOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[69] lg:hidden"
              onClick={() => setIsDropdownOpen(false)}
            />

            {/* Dropdown content */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              ref={dropdownRef}
              style={{ zIndex: 70 }}
              className="fixed inset-x-4 bottom-20 lg:fixed lg:inset-auto lg:bottom-20 lg:w-80 lg:max-w-[calc(100vw-2rem)] bg-gray-900 border border-gray-700/60 rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <DropdownHeader onClose={() => setIsDropdownOpen(false)} />

              {/* Model Selection */}
              <ModelSelection
                selectedModelId={selectedModel.id}
                onModelChange={handleModelChange}
                onClose={() => setIsDropdownOpen(false)}
              />

              {/* Mode Selection */}
              <ModeSelection
                currentMode={mode}
                onModeChange={setMode}
                onClose={() => setIsDropdownOpen(false)}
              />

              {/* Memory Settings */}
              <MemorySettings
                memoryLimit={memoryLimit}
                onMemoryLimitChange={setMemoryLimit}
              />

              {/* Clear Messages */}
              <ClearMessages
                onClear={handleClearMessages}
                onClose={() => setIsDropdownOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}