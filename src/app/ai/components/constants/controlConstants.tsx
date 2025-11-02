import { 
  Code2, 
  Bug, 
  MessageCircleQuestion 
} from "lucide-react";
import { ReactNode } from "react";

export interface ModeConfig {
  id: "code" | "debug" | "ask";
  label: string;
  icon: ReactNode;
  description: string;
}

export const MODES: ModeConfig[] = [
  {
    id: "code",
    label: "Code",
    icon: <Code2 className="w-5 h-5" />,
    description: "Refactor code"
  },
  {
    id: "debug",
    label: "Debug",
    icon: <Bug className="w-5 h-5" />,
    description: "Analyze code"
  },
  {
    id: "ask",
    label: "Ask",
    icon: <MessageCircleQuestion className="w-5 h-5" />,
    description: "General conversation"
  },
];

export type ChatMode = "ask" | "debug" | "code";

export const CONTROL_STYLES = {
  button: "flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-3 lg:py-3.5 rounded-xl bg-gray-900/80 border border-gray-700/60 hover:bg-gray-800/80 hover:border-blue-500/50 transition-all duration-200 backdrop-blur-sm text-sm font-medium text-gray-200 group min-h-[48px] lg:min-h-[52px] w-full lg:w-64",
  dropdown: "fixed inset-0 lg:fixed lg:inset-auto lg:bottom-20 lg:w-80 lg:max-w-[calc(100vw-2rem)] bg-gray-900/95 backdrop-blur-sm border border-gray-700/60 rounded-none lg:rounded-2xl shadow-xl z-[70] mb-12",
  select: "w-full bg-gray-800/60 text-gray-100 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 border border-gray-700/60 hover:border-blue-500/50 transition-all duration-200 text-xs lg:text-sm min-h-[44px] lg:min-h-[48px]",
  modeButton: "w-full flex flex-col items-center gap-2 p-3 lg:p-3.5 rounded-lg text-xs lg:text-sm transition-all duration-200 min-h-[48px] lg:min-h-[72px]",
  clearButton: "w-full flex items-center justify-center gap-2 lg:gap-3 px-3 lg:px-4 py-3 lg:py-3.5 rounded-lg text-xs lg:text-sm font-medium bg-red-600/20 text-red-400 border border-red-700/50 hover:bg-red-600/30 hover:border-red-600/70 transition-all duration-200 min-h-[44px] lg:min-h-[48px]"
} as const;