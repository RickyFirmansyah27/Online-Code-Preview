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
    <div className="p-4 border-t border-gray-700/60">
      <motion.button
        onClick={handleClear}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative w-full flex items-center justify-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-red-300 border border-red-500/50 transition-all duration-200 min-h-[44px] bg-gradient-to-r from-red-600/20 to-red-700/20 hover:from-red-600/30 hover:to-red-700/30 hover:border-red-400/70 hover:text-red-200 group"
      >
        {/* Warning Icon */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative"
        >
          <AlertTriangle className="w-4 h-4" />
        </motion.div>
        
        {/* Text */}
        <span className="font-semibold">Clear Conversation</span>
        
        {/* Trash Icon */}
        <motion.div
          whileHover={{ rotate: 15 }}
          className="relative"
        >
          <Trash2 className="w-4 h-4" />
        </motion.div>
      </motion.button>
      
      {/* Warning Text */}
      <p className="text-xs text-gray-400 text-center mt-2">
        This action cannot be undone
      </p>
    </div>
  );
}