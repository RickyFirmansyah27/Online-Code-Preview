import { motion, AnimatePresence } from "framer-motion";
import { MODES, ChatMode } from "../constants/controlConstants";

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

  const getModeColors = (modeId: ChatMode, isActive: boolean) => {
    const baseColors = {
      code: {
        active: "from-blue-600/30 to-blue-800/30 border-blue-500 text-blue-200 shadow-lg shadow-blue-500/30",
        inactive: "from-gray-800/60 to-gray-900/60 border-gray-600 text-gray-300 hover:from-gray-700/70 hover:to-gray-800/70 hover:border-gray-500"
      },
      debug: {
        active: "from-green-600/30 to-green-800/30 border-green-500 text-green-200 shadow-lg shadow-green-500/30",
        inactive: "from-gray-800/60 to-gray-900/60 border-gray-600 text-gray-300 hover:from-gray-700/70 hover:to-gray-800/70 hover:border-gray-500"
      },
      ask: {
        active: "from-orange-600/30 to-orange-800/30 border-orange-500 text-orange-200 shadow-lg shadow-orange-500/30",
        inactive: "from-gray-800/60 to-gray-900/60 border-gray-600 text-gray-300 hover:from-gray-700/70 hover:to-gray-800/70 hover:border-gray-500"
      }
    };

    const colors = baseColors[modeId];
    return isActive ? colors.active : colors.inactive;
  };

  return (
    <div className="p-4 lg:p-5 border-b border-gray-700/60">
      <div className="flex items-center justify-between mb-4">
        <label className="block text-sm lg:text-base font-semibold text-gray-200">Chat Mode</label>
        <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded-sm">
          {MODES.find(m => m.id === currentMode)?.label}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {MODES.map((mode, index) => (
          <motion.button
            key={mode.id}
            onClick={() => handleModeSelect(mode.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.2 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`
              relative flex flex-col items-center justify-center gap-2 p-3
              border transition-all duration-200 backdrop-blur-sm
              bg-gradient-to-br min-h-[85px] aspect-square
              rounded-lg
              ${getModeColors(mode.id, currentMode === mode.id)}
            `}
          >
            <AnimatePresence mode="wait">
              {currentMode === mode.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-sm"
                />
              )}
            </AnimatePresence>
            
            <div className="relative flex items-center justify-center w-8 h-8">
              <motion.div
                animate={{
                  scale: currentMode === mode.id ? 1.15 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center w-6 h-6"
              >
                {mode.icon}
              </motion.div>
            </div>
            
            <div className="text-center">
              <span className="font-medium text-xs block leading-tight">
                {mode.label}
              </span>
              <motion.span
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: currentMode === mode.id ? 1 : 0, height: currentMode === mode.id ? "auto" : 0 }}
                className="text-[10px] text-gray-400 block mt-1 leading-tight"
              >
                {mode.description}
              </motion.span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}