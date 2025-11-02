import { motion } from "framer-motion";
import { MODEL_OPTIONS } from "@/service/model-types";

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

  return (
    <div className="p-5 lg:p-6 border-b border-gray-700/40">
      {/* Premium Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <label className="block text-lg font-bold text-gray-200 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Model
          </label>
          <p className="text-xs text-gray-400 mt-1">Choose your preferred AI assistant</p>
        </div>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-sm font-bold text-blue-400 bg-blue-500/20 px-3 py-1.5 rounded-full border border-blue-500/30 shadow-lg shadow-blue-500/20"
        >
          {MODEL_OPTIONS.find(m => m.id === selectedModelId)?.name}
        </motion.span>
      </div>
      
      {/* Premium Select Container */}
      <motion.div
        whileHover={{ y: -2 }}
        className="relative group"
      >
        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
        
        <motion.select
          value={selectedModelId}
          onChange={(e) => handleModelSelect(e.target.value)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full bg-gradient-to-r from-gray-800/95 to-gray-900/95 text-gray-100 px-5 py-4 pr-12 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/70 border-2 border-gray-600/40 hover:border-blue-400/70 transition-all duration-300 text-sm font-bold backdrop-blur-xl min-h-[56px] shadow-2xl shadow-black/30"
        >
          {Object.entries(groupedModels).map(([category, models]) => (
            <optgroup key={`group-${category}`} label={category} className="bg-gray-900 text-gray-200 font-semibold">
              {models.map((model) => (
                <option key={model.id} value={model.id} className="bg-gray-800 text-white py-3 font-medium hover:bg-gray-700">
                  {model.name}
                </option>
              ))}
            </optgroup>
          ))}
        </motion.select>
        
        {/* Premium Chevron */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-blue-400 rounded-full blur-sm opacity-50" />
            <svg className="w-6 h-6 text-blue-300 relative drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}