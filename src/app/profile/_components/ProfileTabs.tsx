"use client";

import { User, Activity, Settings } from "lucide-react";

interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="border-b border-gray-800/50">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                isActive
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              <Icon className={`mr-2 h-4 w-4 group-hover:scale-110 transition-transform ${isActive ? "text-blue-400" : "text-gray-500"}`} />
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}