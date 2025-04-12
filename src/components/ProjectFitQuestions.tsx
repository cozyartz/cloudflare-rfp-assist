import { useState } from 'react';

interface ProjectFitQuestionsProps {
  onComplete: (input: {
    oldQuestion: string[];
    answers: string[];
  }) => void;
}

export default function ProjectFitQuestions({ onComplete }: ProjectFitQuestionsProps) {
  const questions = [
    'To what extent do we have relevant experience?',
    'Can we demonstrate past results with clients in this domain?',
    'Do we have the staff to deliver this type of work?',
    'Are there pricing references for similar contracts?',
    'What is our target timeline and who would lead?',
    'Any key risks that would stop us from submitting?'
  ];

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const currentQuery = questions[index];

  const handleAnswer = (e: any) => {
    e.preventDefault();
    const text = e.target.value;
    setAnswers(prev => [...prev, text]);

    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      onComplete({ oldQuestion: questions, answers });
    }
  };

  return (
    <div className="mb-6 p-4">
      <h3 className="font-medium font-semibold text-white">
        RFP Fit Evaluation
      </h3>
      <p className="text-gray-300 text-sm mb-4">
        Help gauge fit worthiness with guided questions.
      </p>
      {currentQuery && (
        <div className="my-4 flex flex-col space-y-2">
          <span className="text-white">{currentQuery}</span>
          <input
            type="text"
            className="bg-gray-100 text-black flex-1 px-3 p-1 rounded"
            id="answer"
            onKeyDown={(e) => e.key === 'Enter' && handleAnswer(e)}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
