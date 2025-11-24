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
      <div className="flex items-center justify-between w-full gap-3">
        {/* Left: Icon + Model info */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400 flex-shrink-0" />
          <div className="min-w-0 flex-1 text-left">
            <div className="text-xs text-gray-400 leading-tight mb-1 text-left">Model & Mode</div>
            <div className="font-semibold truncate text-sm lg:text-base text-gray-200 text-left">{selectedModel.name}</div>
          </div>
        </div>

        {/* Right corner: Mode label + Chevron */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="font-semibold text-xs lg:text-sm bg-gradient-to-r from-blue-400/20 to-purple-400/20 px-2 py-0.5 rounded-md border border-blue-500/30 whitespace-nowrap">
            {activeMode?.label}
          </span>
        </div>
      </div>
    </button>
  );
}