"use client";

import { motion } from "framer-motion";
import { Settings, Shield, Palette, ChevronRight, Trash2, AlertTriangle } from "lucide-react";

const settingSections = [
  {
    title: "Account Settings",
    description: "Manage your account preferences",
    icon: Settings,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-500/10 to-cyan-500/10",
    items: [
      { label: "Profile Information", description: "Update your name and bio" },
      { label: "Email & Password", description: "Manage your login credentials" },
      { label: "Connected Accounts", description: "Link social media accounts" },
    ],
  },
  {
    title: "Preferences",
    description: "Customize your experience",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-500/10 to-pink-500/10",
    items: [
      { label: "Theme", description: "Choose your preferred theme" },
      { label: "Language", description: "Select your language" },
      { label: "Notifications", description: "Configure notification settings" },
    ],
  },
  {
    title: "Privacy & Security",
    description: "Keep your account secure",
    icon: Shield,
    color: "from-emerald-500 to-green-500",
    bgColor: "from-emerald-500/10 to-green-500/10",
    items: [
      { label: "Privacy Settings", description: "Control your data visibility" },
      { label: "Security", description: "Two-factor authentication" },
      { label: "Data Export", description: "Download your data" },
    ],
  },
];

export default function ProfileSettings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {settingSections.map((section, sectionIndex) => {
        const Icon = section.icon;

        return (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="bg-gradient-to-br from-[#1e1e28] via-[#1a1a22] to-[#0f0f15] rounded-2xl border border-gray-800/50 overflow-hidden group"
          >
            {/* Section Header */}
            <div className={`p-6 border-b border-gray-800/50 bg-gradient-to-r ${section.bgColor}`}>
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className={`p-3 rounded-xl bg-gradient-to-br ${section.color} shadow-lg`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                  <p className="text-gray-400 text-sm">{section.description}</p>
                </div>
              </div>
            </div>

            {/* Settings Items */}
            <div className="p-4 space-y-2">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#0f0f15]/50 hover:bg-[#0f0f15] border border-transparent hover:border-gray-700/50 transition-all duration-300 cursor-pointer group/item"
                >
                  <div>
                    <h4 className="text-gray-200 font-medium group-hover/item:text-white transition-colors">
                      {item.label}
                    </h4>
                    <p className="text-gray-500 text-sm mt-0.5 group-hover/item:text-gray-400 transition-colors">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover/item:text-gray-400 group-hover/item:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-red-950/30 via-[#1a1a22] to-[#0f0f15] rounded-2xl border border-red-500/20 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-red-500/10 bg-gradient-to-r from-red-500/5 to-orange-500/5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/20">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-400">Danger Zone</h3>
              <p className="text-gray-400 text-sm">Irreversible and destructive actions</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                <Trash2 className="w-4 h-4 text-red-400" />
              </div>
              <div>
                <span className="text-red-400 font-medium block">Delete Account</span>
                <p className="text-red-300/60 text-sm">Permanently delete your account and all data</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400/50 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}