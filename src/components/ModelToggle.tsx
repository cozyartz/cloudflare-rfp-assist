import React from 'react';

export type ModelProvider = 'cloudflare' | 'openai';

interface Props {
  value: ModelProvider;
  onChange: (v: ModelProvider) => void;
}

export default function ModelToggle({ value, onChange }: Props) {
  const isCloudflare = value === 'cloudflare';

  return (
    <div className="toggle-container">
      <input
        type="checkbox"
        id="ai-toggle"
        className="toggle-checkbox"
        checked={isCloudflare}
        onChange={() => onChange(isCloudflare ? 'openai' : 'cloudflare')}
      />
      <label htmlFor="ai-toggle" className="toggle-label">
        <span className="toggle-ball" />
        <span className="toggle-labels">
          <span>GPT</span>
          <span>LLaMA</span>
        </span>
      </label>
    </div>
  );
}
