'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardTitle, CardContent, Button, AnswerFeedback, StepIcon } from '@/components/common';
import { StackedProblem } from '@/components/math';
import { generateAdditionProblem, generateSubtractionProblem } from '@/lib/problemGenerators';
import { padNumber } from '@/lib/mathUtils';
import { useAudio } from '@/hooks/useAudio';
import type { Difficulty } from '@/types';

type Operation = 'addition' | 'subtraction';

// Helper to create initial problem state
function createInitialProblem(operation: Operation, difficulty: Difficulty) {
  const newProblem =
    operation === 'addition'
      ? generateAdditionProblem(difficulty)
      : generateSubtractionProblem(difficulty);

  const answerLength = Math.max(
    newProblem.num1.toString().length,
    newProblem.num2.toString().length,
    newProblem.answer.toString().length
  );

  return {
    problem: newProblem,
    answer: Array(answerLength).fill('') as string[],
    digitStates: Array(answerLength).fill('default') as ('default' | 'correct' | 'incorrect')[],
  };
}

// Audio narrations
const OPERATION_NARRATIONS: Record<Operation, string> = {
  addition: 'Addition! Put them together!',
  subtraction: 'Subtraction! Take away!',
};

const DIFFICULTY_NARRATIONS: Record<Difficulty, string> = {
  easy: 'Easy mode!',
  medium: 'Medium mode!',
  hard: 'Hard mode! Big numbers!',
};

export function StackedMathSection() {
  const { speak, playSound, clickSound } = useAudio();
  const [operation, setOperation] = useState<Operation>('addition');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [problemState, setProblemState] = useState(() => createInitialProblem('addition', 'easy'));
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [activeColumn, setActiveColumn] = useState<number | null>(null);

  const { problem, answer, digitStates } = problemState;

  // Narrate when new problem appears
  useEffect(() => {
    if (problem && isCorrect === null && answer.every((d) => d === '')) {
      const opWord = operation === 'addition' ? 'add' : 'subtract';
      speak(`${problem.num1} ${opWord} ${problem.num2}`);
    }
  }, [problem, operation, isCorrect, answer, speak]);

  const generateNewProblem = useCallback(() => {
    clickSound();
    setProblemState(createInitialProblem(operation, difficulty));
    setIsCorrect(null);
    setActiveColumn(null);
  }, [operation, difficulty, clickSound]);

  const handleOperationChange = (op: Operation) => {
    clickSound();
    setOperation(op);
    speak(OPERATION_NARRATIONS[op]);
    setProblemState(createInitialProblem(op, difficulty));
    setIsCorrect(null);
    setActiveColumn(null);
  };

  const handleDifficultyChange = (diff: Difficulty) => {
    clickSound();
    setDifficulty(diff);
    speak(DIFFICULTY_NARRATIONS[diff]);
    setProblemState(createInitialProblem(operation, diff));
    setIsCorrect(null);
    setActiveColumn(null);
  };

  const handleDigitChange = (index: number, value: string) => {
    if (isCorrect !== null) return;

    // Only allow single digits
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    playSound('pop');
    setActiveColumn(index);

    setProblemState((prev) => {
      const newAnswer = [...prev.answer];
      newAnswer[index] = digit;
      return { ...prev, answer: newAnswer };
    });
  };

  const checkAnswer = () => {
    if (!problem) return;
    playSound('click');

    const answerLength = answer.length;
    const correctAnswer = padNumber(problem.answer, answerLength);
    const userAnswer = answer.join('');

    const newDigitStates = answer.map((digit, i) =>
      digit === correctAnswer[i] ? 'correct' : 'incorrect'
    ) as ('correct' | 'incorrect')[];

    setProblemState((prev) => ({ ...prev, digitStates: newDigitStates }));

    const correct = userAnswer === correctAnswer;
    setIsCorrect(correct);
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && answer.every((d) => d !== '')) {
      checkAnswer();
    }
  };

  // Difficulty as star count
  const difficultyStars: Record<Difficulty, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <CardTitle>Stacked Math</CardTitle>

          <div className="flex items-center gap-4">
            {/* Operation buttons - icons only */}
            <div className="flex gap-2">
              <button
                onClick={() => handleOperationChange('addition')}
                className={`
                  flex h-12 w-12 items-center justify-center rounded-full
                  transition-all duration-200 hover:scale-110
                  ${operation === 'addition'
                    ? 'bg-sage text-cream scale-110'
                    : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'}
                `}
                aria-label="Addition"
              >
                <StepIcon type="add" size="lg" />
              </button>
              <button
                onClick={() => handleOperationChange('subtraction')}
                className={`
                  flex h-12 w-12 items-center justify-center rounded-full
                  transition-all duration-200 hover:scale-110
                  ${operation === 'subtraction'
                    ? 'bg-coral text-cream scale-110'
                    : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'}
                `}
                aria-label="Subtraction"
              >
                <StepIcon type="subtract" size="lg" />
              </button>
            </div>

            {/* Difficulty as stars */}
            <div className="flex gap-1">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleDifficultyChange(diff)}
                  className={`
                    flex items-center justify-center rounded-lg px-2 py-1
                    transition-all duration-200 hover:scale-105
                    ${difficulty === diff
                      ? 'bg-yellow text-chocolate scale-105'
                      : 'bg-chocolate/10 text-chocolate/40 hover:bg-chocolate/20'}
                  `}
                  aria-label={diff}
                >
                  {Array.from({ length: difficultyStars[diff] }).map((_, i) => (
                    <svg key={i} className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Problem Card */}
      <Card>
        <CardContent>
          <div className="flex flex-col items-center gap-6">
            {/* Score as visual dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: score.total }).map((_, i) => (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-full ${
                    i < score.correct ? 'bg-sage' : 'bg-coral/50'
                  }`}
                />
              ))}
              {score.total === 0 && (
                <div className="h-3 w-12 rounded-full bg-chocolate/10" />
              )}
            </div>


            {/* Problem Display with start hint arrow */}
            {problem && (
              <div onKeyDown={handleKeyDown} className="relative">
                <StackedProblem
                  num1={problem.num1}
                  num2={problem.num2}
                  operation={operation}
                  answer={answer}
                  onDigitChange={handleDigitChange}
                  digitStates={digitStates}
                  interactive={isCorrect === null}
                  activeColumn={activeColumn}
                />
                {/* Arrow pointing to rightmost (ones) column */}
                {isCorrect === null && answer.every((d) => d === '') && (
                  <div className="absolute -right-8 bottom-4 text-coral animate-bounce-x">
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 12l8-8v5h8v6h-8v5l-8-8z" />
                    </svg>
                  </div>
                )}
              </div>
            )}

            {/* Feedback - audio handled by AnswerFeedback */}
            <AnswerFeedback isCorrect={isCorrect} correctAnswer={problem?.answer} showText={false} />

            {/* Buttons with icons only */}
            <div className="flex gap-3">
              {isCorrect === null ? (
                <Button
                  onClick={checkAnswer}
                  disabled={answer.some((d) => d === '')}
                  size="lg"
                  aria-label="Check answer"
                >
                  <StepIcon type="check" size="lg" />
                </Button>
              ) : (
                <Button onClick={generateNewProblem} size="lg" aria-label="Next problem">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
