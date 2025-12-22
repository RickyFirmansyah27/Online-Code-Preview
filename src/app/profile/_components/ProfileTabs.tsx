"use client";

import { motion } from "framer-motion";
import { User, Activity, Settings, Layout, Sparkles } from "lucide-react";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs = [
    { id: "overview", label: "Overview", icon: Layout },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="relative">
      {/* Background container */}
      <div className="bg-gradient-to-br from-[#1a1a22] to-[#0f0f15] rounded-xl border border-gray-800/50 p-1.5">
        <nav className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative group flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-300 ${isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20"
                    : "text-gray-400 hover:text-gray-200 hover:bg-[#252530]"
                  }`}
              >
                {/* Active indicator glow */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`h-4 w-4 transition-all duration-300 ${isActive ? "text-white" : "text-gray-500 group-hover:text-blue-400"}`} />
                  {tab.label}
                  {isActive && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-1"
                    >
                      <Sparkles className="w-3 h-3 text-blue-200" />
                    </motion.span>
                  )}
                </span>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}