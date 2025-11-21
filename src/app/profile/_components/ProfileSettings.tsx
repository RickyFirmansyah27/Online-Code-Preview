"use client";

import { motion } from "framer-motion";
import { Settings, Shield, Palette } from "lucide-react";

const settingSections = [
  {
    title: "Account Settings",
    icon: Settings,
    items: [
      { label: "Profile Information", description: "Update your name and bio" },
      { label: "Email & Password", description: "Manage your login credentials" },
      { label: "Connected Accounts", description: "Link social media accounts" },
    ],
  },
  {
    title: "Preferences",
    icon: Palette,
    items: [
      { label: "Theme", description: "Choose your preferred theme" },
      { label: "Language", description: "Select your language" },
      { label: "Notifications", description: "Configure notification settings" },
    ],
  },
  {
    title: "Privacy & Security",
    icon: Shield,
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
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      {settingSections.map((section, sectionIndex) => {
        const Icon = section.icon;

        return (
          <div
            key={section.title}
            className="bg-[#1a1a22] rounded-xl border border-gray-800/50 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-200">{section.title}</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                  className="flex items-center justify-between p-4 rounded-lg bg-[#0f0f15] hover:bg-gray-800/50 transition-colors cursor-pointer group"
                >
                  <div>
                    <h4 className="text-gray-200 font-medium group-hover:text-white transition-colors">
                      {item.label}
                    </h4>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>

                  <div className="text-gray-500 group-hover:text-gray-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Quick Actions */}
      <div className="bg-[#1a1a22] rounded-xl border border-gray-800/50 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 transition-colors text-left">
            <div>
              <span className="text-red-400 font-medium">Delete Account</span>
              <p className="text-red-300/70 text-sm">Permanently delete your account</p>
            </div>
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}