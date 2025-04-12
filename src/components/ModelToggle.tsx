import { useState, useEffect } from 'react';

const MODELS = ['cloudflare', 'openai'] as const;
export type ModelProvider = typeof MODELS[number];

export default function ModelToggle({
  onChange,
  value,
}: {
  onChange: (v: ModelProvider) => void;
  value: ModelProvider;
}) {
  return (
    <div className="absolute top-4 right-4 text-sm text-white z-50">
      <label className="mr-2">AI Model:</label>
      <select
        className="bg-gray-800 text-white px-2 py-1 rounded"
        value={value}
        onChange={(e) => onChange(e.target.value as ModelProvider)}
      >
        <option value="cloudflare">Cloudflare (LLaMA)</option>
        <option value="openai">OpenAI (GPT)</option>
      </select>
    </div>
  );
}
