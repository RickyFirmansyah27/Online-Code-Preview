import { Trash2 } from "lucide-react";
import { CONTROL_STYLES } from "../constants/controlConstants";

interface ClearMessagesProps {
  onClear: () => void;
  onClose: () => void;
}

export function ClearMessages({ onClear, onClose }: ClearMessagesProps) {
  const handleClear = () => {
    onClear();
    onClose();
  };

  return (
    <div className="p-3 lg:p-4">
      <button
        onClick={handleClear}
        className={CONTROL_STYLES.clearButton}
      >
        <Trash2 className="w-4 h-4 lg:w-5 lg:h-5" />
        <span className="text-xs lg:text-sm font-medium">Clear Messages</span>
      </button>
    </div>
  );
}