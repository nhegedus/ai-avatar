"use client";

import { MODELS, type ModelId } from "@/lib/models";

interface Props {
  value: ModelId;
  onChange: (model: ModelId) => void;
}

const modelIds = Object.keys(MODELS) as ModelId[];

export default function ModelSelector({ value, onChange }: Props) {
  return (
    <div className="model-selector-section">
      <div className="style-prompt-card">
        <div className="style-prompt-header">
          <div className="style-prompt-num">3</div>
          <span className="style-prompt-title">AI MODEL</span>
        </div>
        <div className="style-prompt-body">
          <select
            className="model-select"
            value={value}
            onChange={(e) => onChange(e.target.value as ModelId)}
          >
            {modelIds.map((id) => (
              <option key={id} value={id}>
                {MODELS[id].label} — {MODELS[id].description}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
