import { useEffect, useState } from 'react';

export type ModelProvider = 'openai' | 'cloudflare';

interface Props {
  value: ModelProvider;
  onChange: (val: ModelProvider) => void;
}

export default function ModelToggle({ value, onChange }: Props) {
  const [checked, setChecked] = useState(value === 'cloudflare');

  useEffect(() => {
    onChange(checked ? 'cloudflare' : 'openai');
  }, [checked]);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400">GPT</span>

      <label className="relative inline-block w-[100px] h-[45px]">
        <input
          type="checkbox"
          className="hidden"
          checked={checked}
          onChange={() => setChecked((prev) => !prev)}
        />
        <div
          className={`relative w-full h-full rounded-md border-2 border-black transition-all duration-[400ms] ease-[cubic-bezier(0.99,0.1,0.1,0.99)] ${
            checked
              ? 'bg-black shadow-[inset_-85px_0px_50px_-50px_rgba(1,78,4,0.6)]'
              : 'bg-black shadow-[inset_90px_0px_50px_-50px_rgba(126,4,4,0.56)]'
          }`}
        >
          <div
            className={`absolute top-[2px] bottom-[2px] left-[2px] w-[25px] aspect-[6/4] rounded-[3px] border border-[#2b2b2b] bg-gradient-to-b from-[#333] to-[#242323] flex items-center justify-around transition-transform duration-[400ms] ${
              checked
                ? 'translate-x-[66%] shadow-[0_10px_5px_1px_rgba(0,0,0,0.15),inset_-10px_0px_10px_-5px_rgba(1,112,4,0.1)]'
                : 'shadow-[0_10px_5px_1px_rgba(0,0,0,0.15),inset_10px_0px_10px_-5px_rgba(126,4,4,0.1)]'
            }`}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-[2px] h-[70%] bg-[#202020ea] shadow-[-0.7px_-1.5px_1px_0px_rgba(192,192,192,0.3),0px_2px_3px_rgba(0,0,0,0.3)] transition"
              />
            ))}
            <div
              className={`w-[4px] h-[4px] rounded-full border border-[#222121] transition ${
                checked
                  ? 'bg-green-500 shadow-[0_0_10px_0px_rgb(57,230,14)]'
                  : 'bg-red-600 shadow-[0_0_10px_1px_rgb(241,28,28)]'
              }`}
            />
          </div>
        </div>
      </label>

      <span className="text-sm text-gray-400">LLaMA</span>
    </div>
  );
}
