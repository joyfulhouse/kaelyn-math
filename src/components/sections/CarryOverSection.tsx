'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardTitle, CardContent, Button, AnswerFeedback } from '@/components/common';
import { StackedProblem, CarryRow, CarryInputRow, Timeline, SumVisualization } from '@/components/math';
import { generateCarryProblem } from '@/lib/problemGenerators';
import { calculateCarryPositions, padNumber } from '@/lib/mathUtils';
import type { Problem } from '@/types';

type Mode = 'demo' | 'practice';

interface DemoStep {
  label: string;
  description: string;
}

const DEMO_STEPS: DemoStep[] = [
  { label: 'Start', description: 'Look at the problem' },
  { label: 'Ones', description: 'Add the ones column' },
  { label: 'Carry', description: 'Carry the 1 if needed' },
  { label: 'Tens', description: 'Add the tens column' },
  { label: 'Carry', description: 'Carry the 1 if needed' },
  { label: 'Hundreds', description: 'Add the hundreds column' },
  { label: 'Done', description: 'Final answer!' },
];

export function CarryOverSection() {
  const [mode, setMode] = useState<Mode>('demo');
  const [problem, setProblem] = useState<Problem | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Demo state
  const [visibleCarries, setVisibleCarries] = useState<boolean[]>([]);
  const [visibleAnswerDigits, setVisibleAnswerDigits] = useState<string[]>([]);
  const [sumVizData, setSumVizData] = useState<{
    digit1: number;
    digit2: number;
    carry: number;
    showSplit: boolean;
    visible: boolean;
  } | null>(null);

  // Practice state
  const [carryInputs, setCarryInputs] = useState<string[]>([]);
  const [answerInputs, setAnswerInputs] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const generateNewProblem = useCallback(() => {
    const newProblem = generateCarryProblem();
    setProblem(newProblem);

    const totalLen = Math.max(
      newProblem.num1.toString().length,
      newProblem.num2.toString().length,
      newProblem.answer.toString().length
    );

    setVisibleCarries(Array(totalLen).fill(false));
    setVisibleAnswerDigits(Array(totalLen).fill(''));
    setCarryInputs(Array(totalLen).fill(''));
    setAnswerInputs(Array(totalLen).fill(''));
    setCurrentStep(0);
    setIsCorrect(null);
    setSumVizData(null);
  }, []);

  useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Compute state for a given step
  const computeStateForStep = useCallback((targetStep: number) => {
    if (!problem) return;

    const totalLen = Math.max(
      problem.num1.toString().length,
      problem.num2.toString().length,
      problem.answer.toString().length
    );

    const carries = calculateCarryPositions(problem.num1, problem.num2, totalLen);
    const answerStr = padNumber(problem.answer, totalLen);
    const num1Str = padNumber(problem.num1, totalLen);
    const num2Str = padNumber(problem.num2, totalLen);

    // Reset state
    const newCarries = Array(totalLen).fill(false);
    const newAnswerDigits = Array(totalLen).fill('');
    let newSumVizData: typeof sumVizData = null;

    // Calculate cumulative carry for visualization
    let carryForViz = 0;

    // Build up state based on completed steps
    for (let step = 1; step <= targetStep; step++) {
      const columnIndex = totalLen - Math.ceil(step / 2);

      if (columnIndex >= 0) {
        if (step % 2 === 1) {
          // Odd steps: show answer digit and visualization
          const d1 = parseInt(num1Str[columnIndex]) || 0;
          const d2 = parseInt(num2Str[columnIndex]) || 0;
          const sum = d1 + d2 + carryForViz;

          // Show visualization only for current step
          if (step === targetStep) {
            newSumVizData = {
              digit1: d1,
              digit2: d2,
              carry: carryForViz,
              showSplit: sum >= 10,
              visible: true,
            };
          }

          newAnswerDigits[columnIndex] = answerStr[columnIndex];
        } else {
          // Even steps: show carry
          if (columnIndex > 0 && carries[columnIndex - 1]) {
            newCarries[columnIndex - 1] = true;
            carryForViz = 1;
          } else {
            carryForViz = 0;
          }
          // Hide visualization on carry steps
          if (step === targetStep) {
            newSumVizData = null;
          }
        }
      }
    }

    setVisibleCarries(newCarries);
    setVisibleAnswerDigits(newAnswerDigits);
    setSumVizData(newSumVizData);
    setCurrentStep(targetStep);
  }, [problem]);

  // Go to a specific step
  const goToStep = useCallback((targetStep: number) => {
    // Stop any playing animation
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    }
    computeStateForStep(targetStep);
  }, [computeStateForStep]);

  const playDemo = () => {
    if (!problem) return;

    // Stop any existing playback
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start from step 0
    goToStep(0);
    setIsPlaying(true);

    let step = 0;
    intervalRef.current = setInterval(() => {
      step++;
      if (step >= DEMO_STEPS.length) {
        setIsPlaying(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        return;
      }
      computeStateForStep(step);
    }, 1500);
  };

  const stopDemo = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const checkPracticeAnswer = () => {
    if (!problem) return;

    const totalLen = Math.max(
      problem.num1.toString().length,
      problem.num2.toString().length,
      problem.answer.toString().length
    );

    const expectedCarries = calculateCarryPositions(problem.num1, problem.num2, totalLen);
    const expectedAnswer = padNumber(problem.answer, totalLen);

    const answerCorrect = answerInputs.join('') === expectedAnswer;
    // Check carries (ignoring trailing positions)
    const carriesCorrect = carryInputs.every((c, i) => {
      const expected = expectedCarries[i] ? '1' : '';
      return c === expected;
    });

    const correct = answerCorrect && carriesCorrect;
    setIsCorrect(correct);
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Carry Over</CardTitle>
            <p className="mt-1 font-body text-chocolate/70">
              Learn to carry numbers when adding!
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={mode === 'demo' ? 'primary' : 'ghost'}
              onClick={() => {
                setMode('demo');
                stopDemo();
                generateNewProblem();
              }}
            >
              Demo
            </Button>
            <Button
              variant={mode === 'practice' ? 'primary' : 'ghost'}
              onClick={() => {
                setMode('practice');
                stopDemo();
                generateNewProblem();
              }}
            >
              Practice
            </Button>
          </div>
        </div>
      </Card>

      {mode === 'demo' ? (
        /* Demo Mode */
        <div className="space-y-6">
          {/* Timeline - Clickable */}
          <Card>
            <CardContent>
              <Timeline
                steps={DEMO_STEPS}
                currentStep={currentStep}
                onStepClick={goToStep}
              />
            </CardContent>
          </Card>

          {/* Problem with animation */}
          <Card>
            <CardContent>
              <div className="flex flex-col items-center gap-6">
                {problem && (
                  <StackedProblem
                    num1={problem.num1}
                    num2={problem.num2}
                    operation="addition"
                    carryRow={<CarryRow carries={visibleCarries} animated />}
                    answer={visibleAnswerDigits}
                    interactive={false}
                  />
                )}

                {/* Sum Visualization during demo */}
                {sumVizData && sumVizData.visible && (
                  <SumVisualization
                    digit1={sumVizData.digit1}
                    digit2={sumVizData.digit2}
                    carry={sumVizData.carry}
                    showSplit={sumVizData.showSplit}
                    visible={sumVizData.visible}
                  />
                )}

                <div className="flex gap-3">
                  {isPlaying ? (
                    <Button variant="secondary" onClick={stopDemo}>
                      Stop
                    </Button>
                  ) : (
                    <>
                      <Button onClick={playDemo}>Play Demo</Button>
                      <Button variant="ghost" onClick={generateNewProblem}>
                        New Problem
                      </Button>
                    </>
                  )}
                </div>

                {/* Step navigation hint */}
                <p className="text-center font-body text-xs text-chocolate/50">
                  Click any step above to jump to it
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Practice Mode */
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <span className="font-display text-lg text-chocolate">
                  Score: {score.correct}/{score.total}
                </span>
              </div>

              {problem && (
                <div className="flex flex-col items-center gap-2">
                  {/* Carry inputs */}
                  <CarryInputRow
                    length={Math.max(
                      problem.num1.toString().length,
                      problem.num2.toString().length,
                      problem.answer.toString().length
                    )}
                    values={carryInputs}
                    expectedCarries={calculateCarryPositions(
                      problem.num1,
                      problem.num2,
                      Math.max(
                        problem.num1.toString().length,
                        problem.num2.toString().length,
                        problem.answer.toString().length
                      )
                    )}
                    onCarryChange={(i, v) => {
                      const newInputs = [...carryInputs];
                      newInputs[i] = v;
                      setCarryInputs(newInputs);
                    }}
                    showValidation={isCorrect !== null}
                  />

                  <StackedProblem
                    num1={problem.num1}
                    num2={problem.num2}
                    operation="addition"
                    answer={answerInputs}
                    onDigitChange={(i, v) => {
                      const newInputs = [...answerInputs];
                      newInputs[i] = v.replace(/[^0-9]/g, '').slice(-1);
                      setAnswerInputs(newInputs);
                    }}
                    interactive={isCorrect === null}
                  />
                </div>
              )}

              <AnswerFeedback isCorrect={isCorrect} correctAnswer={problem?.answer} />

              <div className="flex gap-3">
                {isCorrect === null ? (
                  <Button
                    onClick={checkPracticeAnswer}
                    disabled={answerInputs.some((d) => d === '')}
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
      )}
    </div>
  );
}
