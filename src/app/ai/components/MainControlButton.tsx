import { ChevronDown, Settings } from "lucide-react";
import { ModelOption } from "@/service/model-types";
import { MODES, CONTROL_STYLES } from "./constants/controlConstants";

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
      <div className="flex items-center gap-2 lg:gap-3">
        <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400 flex-shrink-0" />
        <div className="text-left min-w-0 flex-1">
          <div className="text-xs text-gray-400 leading-none mb-0.5 lg:mb-1">Model & Mode</div>
          <div className="flex items-center gap-1 lg:gap-2 text-gray-200">
            <span className="font-semibold truncate text-sm lg:text-base">{selectedModel.name}</span>
            <span className="text-gray-500">•</span>
            <span className="font-medium text-sm lg:text-base">{activeMode?.label}</span>
          </div>
        </div>
      </div>
      <ChevronDown
        className={`w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-200 flex-shrink-0 ${
          isDropdownOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}