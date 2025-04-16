import { useState } from 'react';
interface Props {
  onComplete: (result: { oldQuestion: string[]; answers: string[] }) => void;
}

const fitQuestions = [
  'Is this RFP aligned with our services?',
  'Do we meet the eligibility criteria?',
  'Can we fulfill the timeline and scope?',
];

export default function ProjectFitQuestions({ onComplete }: Props) {
  const [answers, setAnswers] = useState<string[]>(Array(fitQuestions.length).fill(''));

  const handleAnswer = (i: number, value: string) => {
    const next = [...answers];
    next[i] = value;
    setAnswers(next);
  };

  const handleSubmit = () => {
    onComplete({ oldQuestion: fitQuestions, answers });
  };

  return (
    <div className="space-y-4">
      {fitQuestions.map((q, i) => (
        <div key={i}>
          <label className="block mb-1 text-sm font-medium text-gray-300">{q}</label>
          <textarea
            className="w-full resize-none text-sm border rounded px-3 py-2 bg-zinc-800 text-white border-zinc-600"
            value={answers[i]}
            rows={3}
            onChange={(e) => handleAnswer(i, e.target.value)}
          />
        </div>
      ))}

      <button
        type="submit"
        className="send-btn mt-2"
        onClick={handleSubmit}
        disabled={answers.some((a) => !a.trim())}
      >
        Submit Answers
      </button>
    </div>
  );
}
