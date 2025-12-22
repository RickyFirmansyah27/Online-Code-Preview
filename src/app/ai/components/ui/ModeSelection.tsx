import { motion } from "framer-motion";
import { MODES, ChatMode } from "../constants/controlConstants";
import { Check } from "lucide-react";

interface ModeSelectionProps {
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  onClose: () => void;
}

export function ModeSelection({
  currentMode,
  onModeChange,
  onClose
}: ModeSelectionProps) {
  const handleModeSelect = (mode: ChatMode) => {
    onModeChange(mode);
    onClose();
  };

  const getModeColor = (modeId: ChatMode) => {
    const colors = {
      code: "border-blue-500/50 bg-blue-500/10 text-blue-300",
      debug: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
      ask: "border-amber-500/50 bg-amber-500/10 text-amber-300"
    };
    return colors[modeId];
  };

  return (
    <div className="p-4 border-b border-gray-700/40">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-300">Chat Mode</label>
        <span className="text-xs text-gray-500">
          {MODES.find(m => m.id === currentMode)?.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {MODES.map((mode) => {
          const isActive = currentMode === mode.id;

          return (
            <motion.button
              key={mode.id}
              onClick={() => handleModeSelect(mode.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative flex flex-col items-center gap-2 p-3
                rounded-lg border transition-all duration-200
                ${isActive
                  ? getModeColor(mode.id)
                  : "border-gray-700/50 bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300"
                }
              `}
            >
              {/* Check indicator */}
              {isActive && (
                <div className="absolute top-1.5 right-1.5">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </div>
              )}

              {/* Icon */}
              <div className={isActive ? "" : "opacity-70"}>
                {mode.icon}
              </div>

              {/* Label */}
              <span className="font-medium text-xs">{mode.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}