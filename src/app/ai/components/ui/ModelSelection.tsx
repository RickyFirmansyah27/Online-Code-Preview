import { MODEL_OPTIONS } from "@/service/model-types";
import { CONTROL_STYLES } from "../constants/controlConstants";

interface ModelSelectionProps {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
  onClose: () => void;
}

export function ModelSelection({
  selectedModelId,
  onModelChange,
  onClose
}: ModelSelectionProps) {
  const groupedModels = MODEL_OPTIONS.reduce(
    (acc, model) => {
      if (!acc[model.category]) acc[model.category] = [];
      acc[model.category].push(model);
      return acc;
    },
    {} as Record<string, typeof MODEL_OPTIONS>
  );

  const handleModelSelect = (modelId: string) => {
    onModelChange(modelId);
    onClose();
  };

  return (
    <div className="p-3 lg:p-4 border-b border-gray-700/60">
      <label className="block text-xs lg:text-sm font-medium text-gray-300 mb-2 lg:mb-3">AI Model</label>
      <select
        value={selectedModelId}
        onChange={(e) => handleModelSelect(e.target.value)}
        className={CONTROL_STYLES.select}
      >
        {Object.entries(groupedModels).map(([category, models]) => (
          <optgroup key={`group-${category}`} label={category} className="bg-gray-900 text-gray-200">
            {models.map((model) => (
              <option key={model.id} value={model.id} className="bg-gray-900 text-white">
                {model.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}