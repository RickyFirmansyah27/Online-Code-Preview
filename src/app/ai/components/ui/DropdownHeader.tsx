import { X, Settings } from "lucide-react";

interface DropdownHeaderProps {
  onClose: () => void;
}

export function DropdownHeader({ onClose }: DropdownHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700/40 bg-gray-800/50">
      <div className="flex items-center gap-2">
        <Settings className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-medium text-gray-200">Chat Settings</h3>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors duration-150"
      >
        <X className="w-4 h-4 text-gray-400 hover:text-gray-300" />
      </button>
    </div>
  );
}