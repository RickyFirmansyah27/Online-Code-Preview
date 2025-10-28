import { MODES, CONTROL_STYLES, ChatMode } from "../constants/controlConstants";

interface ModeSelectionProps {
  currentMode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  onClose: () => void;
}

export function ModeSelection({
  currentMode,
  onModeChange,
  onClose
}: ModeSelectionProps) {
  const handleModeSelect = (mode: ChatMode) => {
    onModeChange(mode);
    onClose();
  };

  return (
    <div className="p-3 lg:p-4 border-b border-gray-700/60">
      <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-3 lg:mb-4">Chat Mode</label>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-2 lg:gap-3">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => handleModeSelect(mode.id)}
            className={`${CONTROL_STYLES.modeButton} ${
              currentMode === mode.id
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/50"
                : "bg-gray-800/50 text-gray-300 border border-gray-700/60 hover:bg-gray-800/70"
            }`}
          >
            <div className="w-4 h-4 lg:w-5 lg:h-5">{mode.icon}</div>
            <span className="font-medium text-xs lg:text-sm">{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}