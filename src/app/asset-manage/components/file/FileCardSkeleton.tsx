"use client";

import { motion } from "framer-motion";

const FileCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-5 bg-gradient-to-br from-[#1a1a24] to-[#12121a] rounded-xl border border-gray-800/50"
    >
      <div className="flex items-start gap-4">
        {/* Icon skeleton */}
        <div className="flex-shrink-0 p-3 rounded-xl bg-gray-800/50 animate-pulse">
          <div className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title skeleton */}
          <div className="h-4 w-3/4 bg-gray-800/50 rounded animate-pulse mb-3" />

          {/* Meta info skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-5 w-12 bg-gray-800/50 rounded animate-pulse" />
            <div className="h-3 w-20 bg-gray-800/50 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Action buttons skeleton */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800/50">
        <div className="flex-1 h-9 bg-gray-800/50 rounded-lg animate-pulse" />
        <div className="w-9 h-9 bg-gray-800/50 rounded-lg animate-pulse" />
      </div>
    </motion.div>
  );
};

export default FileCardSkeleton;