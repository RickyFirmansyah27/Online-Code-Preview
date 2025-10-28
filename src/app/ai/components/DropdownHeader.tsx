import { X } from "lucide-react";

interface DropdownHeaderProps {
  onClose: () => void;
}

export function DropdownHeader({ onClose }: DropdownHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 lg:p-4 border-b border-gray-700/60">
      <h3 className="text-sm lg:text-base font-semibold text-gray-200">Chat Settings</h3>
      <button
        onClick={onClose}
        className="p-1.5 lg:p-2 rounded-lg hover:bg-gray-800/60 transition-colors min-h-[40px] min-w-[40px] lg:min-h-[44px] lg:min-w-[44px] flex items-center justify-center"
      >
        <X className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
      </button>
    </div>
  );
}