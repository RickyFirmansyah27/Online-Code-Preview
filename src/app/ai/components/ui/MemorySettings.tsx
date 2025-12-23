"use client";

import { motion } from "framer-motion";
import React from "react";

interface MemorySettingsProps {
    memoryLimit: number;
    onMemoryLimitChange: (limit: number) => void;
}

const MIN_MEMORY = 2;
const MAX_MEMORY = 8;
const DEFAULT_MEMORY = 6;

export function MemorySettings({
    memoryLimit,
    onMemoryLimitChange,
}: MemorySettingsProps) {
    return (
        <div className="px-4 py-3 border-t border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">
                    Memory Limit
                </span>
                <span className="text-xs text-gray-500">
                    {memoryLimit}
                </span>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{MIN_MEMORY}</span>
                <div className="relative flex-1">
                    <input
                        type="range"
                        min={MIN_MEMORY}
                        max={MAX_MEMORY}
                        value={memoryLimit}
                        onChange={(e) => onMemoryLimitChange(Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-gradient-to-r
              [&::-webkit-slider-thumb]:from-cyan-400
              [&::-webkit-slider-thumb]:to-blue-500
              [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:shadow-cyan-500/30
              [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110
              [&::-moz-range-thumb]:w-4
              [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-gradient-to-r
              [&::-moz-range-thumb]:from-cyan-400
              [&::-moz-range-thumb]:to-blue-500
              [&::-moz-range-thumb]:border-0"
                    />
                    {/* Progress fill */}
                    <motion.div
                        className="absolute top-1/2 left-0 h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-l-lg pointer-events-none -translate-y-1/2"
                        style={{
                            width: `${((memoryLimit - MIN_MEMORY) / (MAX_MEMORY - MIN_MEMORY)) * 100}%`,
                        }}
                    />
                </div>
                <span className="text-xs text-gray-500">{MAX_MEMORY}</span>
            </div>

            <p className="mt-2 text-xs text-gray-500">
                Context: ~{memoryLimit * 4}k tokens reserved for history
            </p>
        </div>
    );
}

export { MIN_MEMORY, MAX_MEMORY, DEFAULT_MEMORY };
