"use client";

import { 
  Code2, 
  Bug, 
  MessageCircleQuestion, 
  ChevronDown, 
  Trash2,
  Settings,
  X
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { MODEL_OPTIONS, ModelOption } from "@/service/model-types";

interface UnifiedControlProps {
  selectedModel: ModelOption;
  mode: "ask" | "debug" | "code";
  isDropdownOpen: boolean;
  dropdownRef: React.RefObject<HTMLDivElement>;
  setSelectedModel: (model: ModelOption) => void;
  setMode: (mode: "ask" | "debug" | "code") => void;
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
      description: "Generate and refactor code"
    },
    {
      id: "debug",
      label: "Debug",
      icon: <Bug className="w-4 h-4" />,
      description: "Debug and analyze code"
    },
    {
      id: "ask",
      label: "Ask",
      icon: <MessageCircleQuestion className="w-4 h-4" />,
      description: "General questions and conversation"
    },
  ];

  const activeMode = modes.find((m) => m.id === mode);

  return (
    <div className="relative">
      {/* Main Control Button */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-700/60
                   hover:bg-gray-800/80 hover:border-blue-500/50 transition-all duration-200
                   backdrop-blur-sm text-sm font-medium text-gray-200 group h-[52px]"
      >
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-400" />
          <div className="text-left">
            <div className="text-xs text-gray-400 leading-none">Model & Mode</div>
            <div className="flex items-center gap-1 text-gray-200">
              <span className="font-medium">{selectedModel.name}</span>
              <span className="text-gray-500">•</span>
              <span>{activeMode?.label}</span>
            </div>
          </div>
        </div>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`} 
        />
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-2 w-80 bg-gray-900/95 backdrop-blur-sm border border-gray-700/60 rounded-xl shadow-xl z-[60]"
            ref={dropdownRef}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/60">
              <h3 className="text-sm font-medium text-gray-200">Chat Settings</h3>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-800/60 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Model Selection */}
            <div className="p-4 border-b border-gray-700/60">
              <label className="block text-xs font-medium text-gray-400 mb-3">AI Model</label>
              <select
                value={selectedModel.id}
                onChange={(e) => {
                  const model = MODEL_OPTIONS.find(
                    (m) => m.id === e.target.value
                  );
                  if (model) {
                    setSelectedModel(model);
                    setIsDropdownOpen(false);
                  }
                }}
                className="w-full bg-gray-800/60 text-gray-100 px-3 py-2 rounded-lg appearance-none cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-700/60
                         hover:border-blue-500/50 transition-all duration-200 text-sm"
              >
                {Object.entries(groupedModels).map(([category, models]) => (
                  <optgroup key={`group-${category}`} label={category} className="bg-gray-900 text-gray-200">
                    {models.map((model) => (
                      <option key={model.id} value={model.id} className="bg-gray-900 text-white">
                        {model.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Mode Selection */}
            <div className="p-4 border-b border-gray-700/60">
              <label className="block text-xs font-medium text-gray-400 mb-3">Chat Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMode(m.id as "ask" | "debug" | "code");
                      setIsDropdownOpen(false);
                    }}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg text-xs transition-all duration-200 ${
                      mode === m.id
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/50"
                        : "bg-gray-800/50 text-gray-300 border border-gray-700/60 hover:bg-gray-800/70"
                    }`}
                  >
                    {m.icon}
                    <span className="font-medium">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Messages */}
            <div className="p-4">
              <button
                onClick={() => {
                  handleClearMessages();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium 
                         bg-red-600/20 text-red-400 border border-red-700/50 hover:bg-red-600/30 
                         hover:border-red-600/70 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" />
                Clear Messages
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}