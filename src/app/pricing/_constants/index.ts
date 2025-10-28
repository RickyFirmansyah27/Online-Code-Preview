import { Boxes, Code2, Folder, Globe, RefreshCcw, Shield } from "lucide-react";

export const ENTERPRISE_FEATURES = [
  {
    icon: Globe,
    label: "Realtime Execution",
    desc: "Lightning-fast execution across worldwide edge nodes",
  },
  {
    icon: Shield,
    label: "Private Workspace",
    desc: "Bank-grade encryption and security protocols",
  },
  {
    icon: RefreshCcw,
    label: "Real-time AI Conversation",
    desc: "Instant synchronization across all devices",
  },
  {
    icon: Boxes,
    label: "Unlimited Storage",
    desc: "Store unlimited snippets and projects",
  },
  {
    icon: Code2,
    label: "Collaborative Coding",
    desc: "Run and share code instantly with team members in real-time",
  },
  {
    icon: Folder,
    label: "Integrated File Manager",
    desc: "Organize, browse, and edit files seamlessly within your workspace",
  },
];


export const FEATURES = {
  development: [
    "Advanced AI",
    "Custom theme builder",
    "Integrated debugging tools",
    "Multi-language support",
  ],
  collaboration: [
    "Real-time pair programming",
    "Team workspaces",
    "Version control integration",
    "Code review tools",
  ],
  deployment: [
    "One-click deployment",
    "CI/CD integration",
    "Container support",
    "Custom domain mapping",
  ],
};

// Pricing page constants
export const PRICING = {
  AMOUNT: 10,
  CURRENCY: "$",
  PERIOD: "one-time",
  DESCRIPTION: "Unlock the full potential of our suite of tools",
};

export const COLORS = {
  BACKGROUND: "#0a0a0f",
  CARD_BACKGROUND: "#12121a",
  GRADIENT_FROM: "from-blue-500",
  GRADIENT_TO: "to-purple-500",
  TEXT_PRIMARY: "text-white",
  TEXT_SECONDARY: "text-gray-400",
  TEXT_GRADIENT: "from-gray-100 to-gray-300",
};

export const BREAKPOINTS = {
  HERO_TITLE: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
  HERO_SUBTITLE: "text-sm sm:text-base",
  GRID_COLS: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  CARD_PADDING: "p-4 sm:p-6 md:p-8",
  FEATURE_GRID: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
};
