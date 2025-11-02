"use client";

import {
  Code2,
  Bug,
  MessageCircleQuestion,
  ChevronDown,
  Trash2,
  Sparkles
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
      icon: <Code2 className="w-5 h-5" />,
      color: "from-blue-500 to-purple-600"
    },
    {
      id: "debug",
      label: "Debug",
      icon: <Bug className="w-5 h-5" />,
      color: "from-green-500 to-emerald-600"
    },
    {
      id: "ask",
      label: "Ask",
      icon: <MessageCircleQuestion className="w-5 h-5" />,
      color: "from-orange-500 to-red-600"
    },
  ];

  const activeMode = modes.find((m) => m.id === mode);

  return (
    <div className="flex items-center gap-4">
      {/* Premium AI Model Selector */}
      <div className="relative flex-1 max-w-xs">
        <motion.div
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-lg blur-sm group-hover:blur-md transition-all duration-500 opacity-0 group-hover:opacity-100" />
          <select
            value={selectedModel.id}
            onChange={(e) => {
              const model = MODEL_OPTIONS.find(
                (m) => m.id === e.target.value
              );
              if (model) setSelectedModel(model);
            }}
            className="relative w-full bg-gradient-to-r from-gray-800/90 to-gray-900/90 text-gray-100 px-4 py-3 pr-12 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/70 border border-gray-600/50 hover:border-blue-400/70 hover:from-gray-700/90 hover:to-gray-800/90 transition-all duration-300 text-sm font-semibold backdrop-blur-sm min-h-[52px] shadow-lg shadow-black/20"
          >
            {Object.entries(groupedModels).map(([category, models]) => (
              <optgroup key={`group-${category}`} label={category} className="bg-gray-900 text-gray-200">
                {models.map((model) => (
                  <option key={model.id} value={model.id} className="bg-gray-800 text-white py-3 font-medium">
                    {model.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="w-5 h-5 text-blue-400 drop-shadow-lg" />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Premium Chat Mode Selector */}
      <div className="relative">
        <motion.button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-semibold text-gray-200 border-2 transition-all duration-400 backdrop-blur-sm min-h-[52px] group overflow-hidden ${
            activeMode ?
            `bg-gradient-to-r ${activeMode.color}/30 border-${activeMode.color.split('-')[1]}-400/60 shadow-lg shadow-${activeMode.color.split('-')[1]}-500/20` :
            "bg-gradient-to-r from-gray-800/90 to-gray-900/90 border-gray-600/50 shadow-lg shadow-black/20"
          } hover:shadow-xl hover:scale-105`}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Sparkles Effect */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="relative z-10"
          >
            <Sparkles className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
          </motion.div>
          
          {/* Mode Icon */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative z-10"
          >
            {activeMode?.icon}
          </motion.div>
          
          <span className="hidden sm:inline font-bold relative z-10 text-shadow">
            {activeMode?.label}
          </span>
          
          <motion.div
            animate={{ rotate: isDropdownOpen ? 180 : 0, y: isDropdownOpen ? 2 : 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className="relative z-10"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.button>
        
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.9 }}
              className="absolute top-full right-0 mt-3 w-64 bg-gradient-to-b from-gray-900/98 to-gray-950/98 backdrop-blur-xl border-2 border-gray-600/30 rounded-xl shadow-2xl shadow-black/40 z-20 overflow-hidden"
              ref={dropdownRef}
            >
              {/* Dropdown Header */}
              <div className="p-4 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
                <h3 className="font-bold text-gray-200 text-sm uppercase tracking-wider">Chat Mode</h3>
                <p className="text-xs text-gray-400 mt-1">Select your conversation style</p>
              </div>
              
              {modes.map((m, index) => (
                <motion.button
                  key={m.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08, type: "spring", stiffness: 200 }}
                  onClick={() => {
                    setMode(m.id as "ask" | "debug" | "code");
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-all duration-300 group/item relative overflow-hidden ${
                    mode === m.id
                      ? `bg-gradient-to-r ${m.color}/40 text-white shadow-inner`
                      : "text-gray-300 hover:bg-gray-800/60 hover:text-white"
                  }`}
                >
                  {/* Active Indicator */}
                  {mode === m.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-white to-transparent"
                    />
                  )}
                  
                  <div className={`p-2 rounded-lg ${mode === m.id ? 'bg-white/30 shadow-lg' : 'bg-gray-700/40 group-hover/item:bg-gray-600/50'} transition-all duration-300`}>
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      className="w-6 h-6"
                    >
                      {m.icon}
                    </motion.div>
                  </div>
                  
                  <div className="flex-1">
                    <span className="font-bold block text-sm">{m.label}</span>
                    <span className="text-xs text-gray-400 group-hover/item:text-gray-300 transition-colors">
                      {m.id === "code" && "Generate and refactor code"}
                      {m.id === "debug" && "Debug and analyze code"}
                      {m.id === "ask" && "General questions and conversation"}
                    </span>
                  </div>
                  
                  {mode === m.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Premium Clear Messages Button */}
      <motion.button
        onClick={handleClearMessages}
        whileHover={{ scale: 1.1, y: -1 }}
        whileTap={{ scale: 0.9 }}
        className="relative p-4 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600/40 to-red-700/40 text-red-200 border-2 border-red-500/50 hover:from-red-600/50 hover:to-red-700/50 hover:border-red-400/70 hover:text-white transition-all duration-300 backdrop-blur-sm shadow-lg shadow-red-500/20 group overflow-hidden"
        title="Clear conversation"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <motion.div
          whileHover={{ rotate: 15 }}
          className="relative z-10"
        >
          <Trash2 className="w-5 h-5 drop-shadow-lg" />
        </motion.div>
      </motion.button>
    </div>
  );
}