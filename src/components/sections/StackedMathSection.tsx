'use client';

import { useState, useCallback } from 'react';
import { Card, CardTitle, CardContent, Button, Select, AnswerFeedback } from '@/components/common';
import { StackedProblem } from '@/components/math';
import { generateAdditionProblem, generateSubtractionProblem } from '@/lib/problemGenerators';
import { padNumber } from '@/lib/mathUtils';
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

export function StackedMathSection() {
  const [operation, setOperation] = useState<Operation>('addition');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [problemState, setProblemState] = useState(() => createInitialProblem('addition', 'easy'));
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const { problem, answer, digitStates } = problemState;

  const generateNewProblem = useCallback(() => {
    setProblemState(createInitialProblem(operation, difficulty));
    setIsCorrect(null);
  }, [operation, difficulty]);

  const handleDigitChange = (index: number, value: string) => {
    if (isCorrect !== null) return;

    // Only allow single digits
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    setProblemState((prev) => {
      const newAnswer = [...prev.answer];
      newAnswer[index] = digit;
      return { ...prev, answer: newAnswer };
    });
  };

  const checkAnswer = () => {
    if (!problem) return;

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Stacked Math</CardTitle>
            <p className="mt-1 font-body text-chocolate/70">
              Practice addition and subtraction with stacked problems!
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              value={operation}
              onChange={(e) => setOperation(e.target.value as Operation)}
              options={[
                { value: 'addition', label: 'Addition' },
                { value: 'subtraction', label: 'Subtraction' },
              ]}
            />
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              options={[
                { value: 'easy', label: 'Easy (1-10)' },
                { value: 'medium', label: 'Medium (10-100)' },
                { value: 'hard', label: 'Hard (100-1000)' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Problem Card */}
      <Card>
        <CardContent>
          <div className="flex flex-col items-center gap-6">
            {/* Score */}
            <div className="flex items-center gap-4">
              <span className="font-display text-lg text-chocolate">
                Score: {score.correct}/{score.total}
              </span>
            </div>

            {/* Problem Display */}
            {problem && (
              <div onKeyDown={handleKeyDown}>
                <StackedProblem
                  num1={problem.num1}
                  num2={problem.num2}
                  operation={operation}
                  answer={answer}
                  onDigitChange={handleDigitChange}
                  digitStates={digitStates}
                  interactive={isCorrect === null}
                />
              </div>
            )}

            {/* Feedback */}
            <AnswerFeedback isCorrect={isCorrect} correctAnswer={problem?.answer} />

            {/* Buttons */}
            <div className="flex gap-3">
              {isCorrect === null ? (
                <Button
                  onClick={checkAnswer}
                  disabled={answer.some((d) => d === '')}
                >
                  Check Answer
                </Button>
              ) : (
                <Button onClick={generateNewProblem}>Next Problem</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card variant="outlined">
        <CardTitle className="text-lg">Tips</CardTitle>
        <CardContent className="mt-3">
          <ul className="list-inside list-disc space-y-1 font-body text-sm text-chocolate/70">
            <li>Start from the rightmost column (ones place)</li>
            <li>Work your way left, column by column</li>
            <li>
              For addition: if a column adds up to 10+, you&apos;ll need to carry (try the Carry module!)
            </li>
            <li>
              For subtraction: if you can&apos;t subtract, you&apos;ll need to borrow (try the Borrowing module!)
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
