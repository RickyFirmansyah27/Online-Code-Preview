"use client";

import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import React, { useEffect, useRef, useState } from "react";
import { THEMES } from "../_constants";
import { AnimatePresence, motion } from "framer-motion";
import { Cloud, Github, Laptop, Moon, Sun } from "lucide-react";
import useMounted from "@/hooks/useMounted";

const THEME_ICONS: Record<string, React.ReactNode> = {
  "vs-dark": <Moon className="size-4" />,
  "vs-light": <Sun className="size-4" />,
  "github-dark": <Github className="size-4" />,
  monokai: <Laptop className="size-4" />,
  "solarized-dark": <Cloud className="size-4" />,
};

function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const mounted = useMounted();
  const { theme, setTheme } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentTheme = THEMES.find((t) => t.id === theme);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full sm:w-auto" ref={dropdownRef}>
      {/* Mobile: icon only */}
      <div className="block sm:hidden">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1e1e2e]/80 border border-gray-800/50 hover:border-gray-700"
          aria-label="Select Theme"
        >
          {/* Show theme icon or color indicator */}
          <span className="flex items-center justify-center w-6 h-6">
            {THEME_ICONS[currentTheme?.id as string]
              ? THEME_ICONS[currentTheme?.id as string]
              : <span style={{ background: currentTheme?.color }} className="w-6 h-6 rounded-full block" />}
          </span>
        </motion.button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-40 bg-[#1e1e2e]/95
              backdrop-blur-xl rounded-xl border border-[#313244] shadow-2xl py-2 z-50"
            >
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-[#262637] transition-all duration-200
                    ${theme === t.id ? "bg-blue-500/10 text-blue-400" : "text-gray-300"}`}
                  onClick={() => setTheme(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Desktop: icon + label */}
      <div className="hidden sm:block">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-40 group relative flex items-center gap-2 px-3 py-2 bg-[#1e1e2e]/80 hover:bg-[#262637]
          rounded-lg transition-all duration-200 border border-gray-800/50 hover:border-gray-700"
        >
          {/* Show theme icon or color indicator */}
          <span className="flex items-center justify-center w-6 h-6">
            {THEME_ICONS[currentTheme?.id as string]
              ? THEME_ICONS[currentTheme?.id as string]
              : <span style={{ background: currentTheme?.color }} className="w-6 h-6 rounded-full block" />}
          </span>
          <span className="text-gray-300 min-w-[80px] text-left group-hover:text-white transition-colors">
            {currentTheme?.label}
          </span>
        </motion.button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-full min-w-[160px] bg-[#1e1e2e]/95
              backdrop-blur-xl rounded-xl border border-[#313244] shadow-2xl py-2 z-50"
            >
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-[#262637] transition-all duration-200
                    ${theme === t.id ? "bg-blue-500/10 text-blue-400" : "text-gray-300"}`}
                  onClick={() => setTheme(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
export default ThemeSelector;
