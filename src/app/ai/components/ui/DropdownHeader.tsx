import { X, Settings } from "lucide-react";

interface DropdownHeaderProps {
  onClose: () => void;
}

export function DropdownHeader({ onClose }: DropdownHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-700/60 bg-gray-800 rounded-t-xl">
      <div className="flex items-center gap-2">
        <Settings className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-medium text-gray-200">Chat Settings</h3>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 rounded hover:bg-gray-700/60 transition-colors duration-150 min-h-[32px] min-w-[32px] flex items-center justify-center"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}