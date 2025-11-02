import { motion, AnimatePresence } from "framer-motion";
import { MODEL_OPTIONS } from "@/service/model-types";
import { Sparkles, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";

interface ModelSelectionProps {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  onClose: () => void;
}

export function ModelSelection({
  selectedModelId,
  onModelChange,
  onClose
}: ModelSelectionProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const groupedModels = MODEL_OPTIONS.reduce(
    (acc, model) => {
      if (!acc[model.category]) acc[model.category] = [];
      acc[model.category].push(model);
      return acc;
    },
    {} as Record<string, typeof MODEL_OPTIONS>
  );

  const handleModelSelect = (modelId: string) => {
    onModelChange(modelId);
    onClose();
  };

  const selectedModel = MODEL_OPTIONS.find(m => m.id === selectedModelId);

  return (
    <div className="p-4 border-b border-gray-700/60">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-200">AI Model</label>
          <p className="text-xs text-gray-400 mt-0.5">Choose AI assistant</p>
        </div>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-xs font-semibold text-blue-400 bg-blue-500/20 px-2 py-1 rounded-md border border-blue-500/30"
        >
          {selectedModel?.name}
        </motion.span>
      </div>
      
      {/* Compact Dropdown Button */}
      <div className="relative">
        <motion.button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="relative w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-200 border border-blue-400/50 transition-all duration-200 min-h-[44px] bg-gray-800/80 hover:bg-gray-700/80"
        >
          {/* Left Content */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-300" />
            <span>{selectedModel?.name}</span>
          </div>
          
          {/* Chevron */}
          <motion.div
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4 text-blue-300" />
          </motion.div>
        </motion.button>
        
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.98 }}
              className="absolute top-full left-0 mt-1 w-full bg-gray-900 border border-gray-600/50 rounded-lg shadow-lg z-20 overflow-hidden"
              ref={dropdownRef}
            >
              {/* Dropdown Header */}
              <div className="p-3 border-b border-gray-700 bg-gray-800">
                <h3 className="font-semibold text-gray-200 text-xs uppercase tracking-wide">AI Models</h3>
              </div>
              
              {/* Model Categories */}
              <div className="max-h-48 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                {Object.entries(groupedModels).map(([category, models], categoryIndex) => (
                  <div key={category} className="border-b border-gray-700/30 last:border-b-0">
                    {/* Category Header */}
                    <div className="px-3 py-2 bg-gray-800/80">
                      <h4 className="font-medium text-blue-400 text-xs uppercase tracking-wide">{category}</h4>
                    </div>
                    
                    {/* Model Items */}
                    {models.map((model, modelIndex) => (
                      <motion.button
                        key={model.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (categoryIndex * 0.05) + (modelIndex * 0.03) }}
                        onClick={() => handleModelSelect(model.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 group/item ${
                          selectedModelId === model.id
                            ? "bg-blue-600/30 text-white"
                            : "text-gray-300 hover:bg-gray-700/80 hover:text-white"
                        }`}
                      >
                        {/* Active Indicator */}
                        {selectedModelId === model.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-1 h-4 bg-blue-400 rounded-full"
                          />
                        )}
                        
                        {/* Model Icon */}
                        <div className={`p-1 rounded ${
                          selectedModelId === model.id
                            ? 'bg-white/20'
                            : 'bg-gray-600/40 group-hover/item:bg-gray-500/50'
                        } transition-all duration-200`}>
                          <Sparkles className="w-3 h-3" />
                        </div>
                        
                        {/* Model Info */}
                        <div className="flex-1">
                          <span className="font-medium block text-sm">{model.name}</span>
                          <span className="text-xs text-gray-400 group-hover/item:text-gray-300 transition-colors">
                            {model.category}
                          </span>
                        </div>
                        
                        {/* Selection Indicator */}
                        {selectedModelId === model.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-green-400 rounded-full"
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}