import { Settings, ChevronDown, Sparkles } from "lucide-react";
import { ModelOption } from "@/service/model-types";
import { MODES } from "../constants/controlConstants";
import { motion } from "framer-motion";

interface MainControlButtonProps {
  selectedModel: ModelOption;
  mode: "ask" | "debug" | "code";
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
}

export function MainControlButton({
  selectedModel,
  mode,
  isDropdownOpen,
  setIsDropdownOpen
}: MainControlButtonProps) {
  const activeMode = MODES.find((m) => m.id === mode);

  const getModeGradient = (modeId: string) => {
    const gradients: Record<string, string> = {
      code: "from-blue-500 to-cyan-500",
      debug: "from-emerald-500 to-green-500",
      ask: "from-amber-500 to-orange-500"
    };
    return gradients[modeId] || gradients.ask;
  };

  return (
    <motion.button
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full lg:w-72 group"
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />

      {/* Gradient border */}
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-cyan-500/40 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Main button content */}
      <div className="relative flex items-center justify-between w-full gap-3 px-3 lg:px-4 py-3 lg:py-3.5 rounded-xl bg-gradient-to-br from-gray-900/95 via-gray-900 to-gray-800/95 backdrop-blur-sm min-h-[52px] lg:min-h-[56px]">
        {/* Inner subtle gradient */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />

        {/* Left: Icon + Model info */}
        <div className="relative flex items-center gap-3 flex-1 min-w-0">
          {/* Animated icon container */}
          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700/80 to-gray-800/80 flex items-center justify-center group-hover:from-gray-600/80 group-hover:to-gray-700/80 transition-all duration-300">
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Settings className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors duration-200" />
            </motion.div>
            {/* Sparkle on hover */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
            </motion.div>
          </div>

          {/* Model info */}
          <div className="min-w-0 flex-1 text-left">
            <div className="text-[10px] lg:text-xs text-gray-500 leading-tight mb-0.5 uppercase tracking-wider font-medium">AI Model</div>
            <div className="font-semibold truncate text-sm lg:text-base text-gray-100 group-hover:text-white transition-colors duration-200">{selectedModel.name}</div>
          </div>
        </div>

        {/* Right: Mode badge + Chevron */}
        <div className="relative flex items-center gap-2 flex-shrink-0">
          {/* Mode badge with gradient */}
          <div className={`relative overflow-hidden rounded-lg px-2.5 py-1.5 border border-gray-600/50 group-hover:border-gray-500/50 transition-all duration-200`}>
            <div className={`absolute inset-0 bg-gradient-to-r ${getModeGradient(mode)} opacity-15 group-hover:opacity-25 transition-opacity duration-200`} />
            <span className="relative font-semibold text-xs lg:text-sm text-gray-200 whitespace-nowrap">
              {activeMode?.label}
            </span>
          </div>

          {/* Chevron */}
          <motion.div
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="text-gray-400 group-hover:text-gray-300 transition-colors duration-200"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.button>
  );
}