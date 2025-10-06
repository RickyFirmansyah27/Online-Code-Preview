"use client";

import { 
  Code2, 
  Bug, 
  MessageCircleQuestion, 
  ChevronDown, 
  Trash2 
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { MODEL_OPTIONS, ModelOption } from "@/service/model-types";

interface ModelSelectorProps {
  selectedModel: ModelOption;
  mode: "ask" | "debug" | "code";
  isDropdownOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement>;
  setSelectedModel: (model: ModelOption) => void;
  setMode: (mode: "ask" | "debug" | "code") => void;
  setIsDropdownOpen: (open: boolean) => void;
  handleClearMessages: () => void;
}

export function ModelSelector({
  selectedModel,
  mode,
  isDropdownOpen,
  dropdownRef,
  setSelectedModel,
  setMode,
  setIsDropdownOpen,
  handleClearMessages
}: ModelSelectorProps) {
  const groupedModels = MODEL_OPTIONS.reduce(
    (acc, model) => {
      if (!acc[model.category]) acc[model.category] = [];
      acc[model.category].push(model);
      return acc;
    },
    {} as Record<string, ModelOption[]>
  );

  const modes = [
    {
      id: "code",
      label: "Code",
      icon: <Code2 className="w-4 h-4" />,
    },
    {
      id: "debug",
      label: "Debug",
      icon: <Bug className="w-4 h-4" />,
    },
    {
      id: "ask",
      label: "Ask",
      icon: <MessageCircleQuestion className="w-4 h-4" />,
    },
  ];

  const activeMode = modes.find((m) => m.id === mode);

  return (
    <div className="flex items-center gap-3">
      {/* AI Model Selector */}
      <div className="relative">
        <select
          value={selectedModel.id}
          onChange={(e) => {
            const model = MODEL_OPTIONS.find(
              (m) => m.id === e.target.value
            );
            if (model) setSelectedModel(model);
          }}
          className="bg-gray-900/80 text-gray-100 px-4 py-3 pr-10 rounded-xl appearance-none cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-700/60
          hover:border-blue-500/50 hover:bg-gray-800/80 transition-all duration-200 min-w-[180px] text-sm font-medium backdrop-blur-sm"
        >
          {Object.entries(groupedModels).map(([category, models]) => (
            <optgroup key={`group-${category}`} label={category} className="bg-gray-900 text-gray-200">
              {models.map((model) => (
                <option key={model.id} value={model.id} className="bg-gray-800 text-white">
                  {model.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-blue-400" />
        </div>
      </div>

      {/* Chat Mode Selector */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-gray-800/80 text-gray-200 border border-gray-700/60 hover:bg-gray-700/80 hover:border-gray-600/70 transition-all duration-200 backdrop-blur-sm"
        >
          {activeMode?.icon}
          <span className="hidden sm:inline">{activeMode?.label}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-xl z-20"
              ref={dropdownRef}
            >
              {modes.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id as "ask" | "debug" | "code");
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-700/70 transition-colors first:rounded-t-xl last:rounded-b-xl"
                >
                  {m.icon}
                  <span>{m.label}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Clear Messages Button */}
      <button
        onClick={handleClearMessages}
        className="p-2.5 rounded-xl text-sm font-medium bg-red-600/20 text-red-400 border border-red-700/50 hover:bg-red-600/30 hover:border-red-600/70 transition-all duration-200 backdrop-blur-sm"
        title="Clear messages"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}