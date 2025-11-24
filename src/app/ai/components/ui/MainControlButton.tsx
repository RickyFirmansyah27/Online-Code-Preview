import { Settings } from "lucide-react";
import { ModelOption } from "@/service/model-types";
import { MODES, CONTROL_STYLES } from "../constants/controlConstants";

interface MainControlButtonProps {
  selectedModel: ModelOption;
  mode: "ask" | "debug" | "code";
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
}

export function MainControlButton({
  selectedModel,
  mode,
  isDropdownOpen,
  setIsDropdownOpen
}: MainControlButtonProps) {
  const activeMode = MODES.find((m) => m.id === mode);

  return (
    <button
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      className={CONTROL_STYLES.button}
    >
      <div className="flex items-center gap-1.5 lg:gap-2.5">
        <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400 flex-shrink-0 flex items-center justify-center" />
        <div className="text-left min-w-0 flex-1">
          <div className="text-xs text-gray-400 leading-tight mb-0.5 lg:mb-1 truncate">Model & Mode</div>
          <div className="flex items-center gap-1 lg:gap-1.5 text-gray-200 min-w-0">
            <span className="font-semibold truncate text-sm lg:text-base flex-1 min-w-0 pr-1">{selectedModel.name}</span>
            <span className="text-gray-500 flex-shrink-0 px-1">•</span>
            <span className="font-semibold text-sm lg:text-base flex-shrink-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 px-2 py-0.5 rounded-md border border-blue-500/30 whitespace-nowrap">{activeMode?.label}</span>
          </div>
        </div>
      </div>
    </button>
  );
}