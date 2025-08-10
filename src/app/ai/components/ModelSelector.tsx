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
    <div className="max-w-3xl mx-auto mb-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <select
            value={selectedModel.id}
            onChange={(e) => {
              const model = MODEL_OPTIONS.find(
                (m) => m.id === e.target.value
              );
              if (model) setSelectedModel(model);
            }}
            className="w-full bg-gray-900/50 text-gray-200 px-4 py-3 rounded-xl appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700/50
            hover:border-blue-500/50 transition-colors"
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
            <ChevronDown className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition-colors"
          >
            {activeMode?.icon}
            <span>{activeMode?.label}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
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
                className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-10"
                ref={dropdownRef}
              >
                {modes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMode(m.id as "ask" | "debug" | "code");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
                  >
                    {m.icon}
                    <span>{m.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleClearMessages}
          className="p-2 rounded-xl text-sm font-medium bg-red-600/20 text-red-400 border border-red-700/50 hover:bg-red-600/30 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}