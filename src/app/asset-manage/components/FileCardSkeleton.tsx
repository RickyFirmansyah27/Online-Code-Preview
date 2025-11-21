"use client";

import { motion } from "framer-motion";

const FileCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-[#1a1a22] rounded-lg border border-gray-700 flex justify-between items-center animate-pulse"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-8 h-8 bg-gray-700 rounded"></div>
        <div className="flex-1 min-w-0">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="flex gap-2 shrink-0 ml-2">
        <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
        <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
      </div>
    </motion.div>
  );
};

export default FileCardSkeleton;