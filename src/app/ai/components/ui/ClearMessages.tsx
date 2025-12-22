import { Trash2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface ClearMessagesProps {
  onClear: () => void;
  onClose: () => void;
}

export function ClearMessages({ onClear, onClose }: ClearMessagesProps) {
  const handleClear = () => {
    onClear();
    onClose();
  };

  return (
    <div className="p-4">
      <motion.button
        onClick={handleClear}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative w-full group overflow-hidden rounded-xl"
      >
        {/* Glow effect on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Button container */}
        <div className="relative flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-br from-red-600/15 via-red-700/10 to-orange-600/15 border border-red-500/40 group-hover:border-red-400/60 transition-all duration-300">
          {/* Shine effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-400/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </div>

          {/* Warning Icon */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </motion.div>

          {/* Text */}
          <span className="relative font-semibold text-sm text-red-300 group-hover:text-red-200 transition-colors duration-200">
            Clear Conversation
          </span>

          {/* Trash Icon */}
          <motion.div
            whileHover={{ rotate: 15 }}
            className="relative"
          >
            <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors duration-200" />
          </motion.div>
        </div>
      </motion.button>

      {/* Warning Text */}
      <p className="text-[10px] text-gray-500 text-center mt-3 flex items-center justify-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-red-500/50" />
        This action cannot be undone
        <span className="w-1 h-1 rounded-full bg-red-500/50" />
      </p>
    </div>
  );
}