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
        className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-3 lg:py-3.5 rounded-xl bg-gray-900/80 border border-gray-700/60
                   hover:bg-gray-800/80 hover:border-blue-500/50 transition-all duration-200
                   backdrop-blur-sm text-sm font-medium text-gray-200 group min-h-[48px] lg:min-h-[52px] w-full lg:w-64"
      >
        <div className="flex items-center gap-2 lg:gap-3">
          <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400 flex-shrink-0" />
          <div className="text-left min-w-0 flex-1">
            <div className="text-xs text-gray-400 leading-none mb-0.5 lg:mb-1">Model & Mode</div>
            <div className="flex items-center gap-1 lg:gap-2 text-gray-200">
              <span className="font-semibold truncate text-sm lg:text-base">{selectedModel.name}</span>
              <span className="text-gray-500">•</span>
              <span className="font-medium text-sm lg:text-base">{activeMode?.label}</span>
            </div>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-200 flex-shrink-0 ${
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
            className="fixed inset-0 lg:fixed lg:inset-auto lg:left-4 lg:bottom-20 lg:w-80 lg:max-w-[calc(100vw-2rem)] bg-gray-900/95 backdrop-blur-sm border border-gray-700/60 rounded-none lg:rounded-2xl shadow-xl z-[70]"
            ref={dropdownRef}
            style={{ zIndex: 70 }}
          >
            {/* Header */}
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="flex items-center justify-between p-3 lg:p-4 border-b border-gray-700/60">
                <h3 className="text-sm lg:text-base font-semibold text-gray-200">Chat Settings</h3>
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="p-1.5 lg:p-2 rounded-lg hover:bg-gray-800/60 transition-colors min-h-[40px] min-w-[40px] lg:min-h-[44px] lg:min-w-[44px] flex items-center justify-center"
                >
                  <X className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                </button>
              </div>

            {/* Model Selection */}
            <div className="p-3 lg:p-4 border-b border-gray-700/60">
              <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-2 lg:mb-3">AI Model</label>
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
                className="w-full bg-gray-800/60 text-gray-100 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg appearance-none cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-700/60
                         hover:border-blue-500/50 transition-all duration-200 text-xs lg:text-sm min-h-[44px] lg:min-h-[48px]"
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
            <div className="p-3 lg:p-4 border-b border-gray-700/60">
              <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-3 lg:mb-4">Chat Mode</label>
              <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2 lg:gap-3">
                {modes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMode(m.id as "ask" | "debug" | "code");
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex flex-col items-center gap-2 p-3 lg:p-3.5 rounded-lg text-xs lg:text-sm transition-all duration-200 min-h-[48px] lg:min-h-[72px] ${
                      mode === m.id
                        ? "bg-blue-600/20 text-blue-400 border border-blue-500/50"
                        : "bg-gray-800/50 text-gray-300 border border-gray-700/60 hover:bg-gray-800/70"
                    }`}
                  >
                    <div className="w-4 h-4 lg:w-5 lg:h-5">{m.icon}</div>
                    <span className="font-medium text-xs lg:text-sm">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Messages */}
            <div className="p-3 lg:p-4">
              <button
                onClick={() => {
                  handleClearMessages();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 lg:gap-3 px-3 lg:px-4 py-3 lg:py-3.5 rounded-lg text-xs lg:text-sm font-medium
                         bg-red-600/20 text-red-400 border border-red-700/50 hover:bg-red-600/30
                         hover:border-red-600/70 transition-all duration-200 min-h-[44px] lg:min-h-[48px]"
              >
                <Trash2 className="w-4 h-4 lg:w-5 lg:h-5" />
                <span className="text-xs lg:text-sm font-medium">Clear Messages</span>
              </button>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}