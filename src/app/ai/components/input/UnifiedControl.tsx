"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { ModelOption, MODEL_OPTIONS } from "@/service/model-types";
import { MainControlButton } from "../ui/MainControlButton";
import { DropdownHeader } from "../ui/DropdownHeader";
import { ModelSelection } from "../ui/ModelSelection";
import { ModeSelection } from "../ui/ModeSelection";
import { ClearMessages } from "../ui/ClearMessages";
import { CONTROL_STYLES } from "../constants/controlConstants";
import { ChatMode } from "../constants/controlConstants";

interface UnifiedControlProps {
  selectedModel: ModelOption;
  mode: ChatMode;
  isDropdownOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement>;
  setSelectedModel: (model: ModelOption) => void;
  setMode: (mode: ChatMode) => void;
  setIsDropdownOpen: (open: boolean) => void;
  handleClearMessages: () => void;
}

export function UnifiedControl({
  selectedModel,
  mode,
  isDropdownOpen,
  dropdownRef,
  setSelectedModel,
  setMode,
  setIsDropdownOpen,
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
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={CONTROL_STYLES.dropdown}
            ref={dropdownRef}
            style={{ zIndex: 70 }}
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

            {/* Clear Messages */}
            <ClearMessages
              onClear={handleClearMessages}
              onClose={() => setIsDropdownOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}