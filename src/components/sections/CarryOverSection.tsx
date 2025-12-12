'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardTitle, CardContent, Button, AnswerFeedback, StepIcon } from '@/components/common';
import { StackedProblem, CarryRow, CarryInputRow, Timeline, SumVisualization } from '@/components/math';
import { generateCarryProblem } from '@/lib/problemGenerators';
import { calculateCarryPositions, padNumber } from '@/lib/mathUtils';
import { useAudio } from '@/hooks/useAudio';
import type { Problem } from '@/types';

type Mode = 'demo' | 'practice';

interface DemoStep {
  label: string;
  description: string;
  narration: string;
}

const DEMO_STEPS: DemoStep[] = [
  { label: 'Start', description: 'Look at the problem', narration: 'Look at the problem!' },
  { label: 'Ones', description: 'Add the ones column', narration: 'Add the ones!' },
  { label: 'Carry', description: 'Carry the 1 if needed', narration: 'Carry the one!' },
  { label: 'Tens', description: 'Add the tens column', narration: 'Add the tens!' },
  { label: 'Carry', description: 'Carry the 1 if needed', narration: 'Carry if needed!' },
  { label: 'Hundreds', description: 'Add the hundreds column', narration: 'Add the hundreds!' },
  { label: 'Done', description: 'Final answer!', narration: 'Done! Great job!' },
];

export function CarryOverSection() {
  const { speak, playSound, clickSound } = useAudio();
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
  const computeStateForStep = useCallback((targetStep: number, shouldSpeak = true) => {
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

    // Narrate the step
    if (shouldSpeak && DEMO_STEPS[targetStep]) {
      speak(DEMO_STEPS[targetStep].narration);
    }
  }, [problem, speak]);

  // Go to a specific step
  const goToStep = useCallback((targetStep: number) => {
    // Stop any playing animation
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsPlaying(false);
    }
    computeStateForStep(targetStep);
  }, [computeStateForStep]);

  const handleModeChange = (newMode: Mode) => {
    clickSound();
    setMode(newMode);
    stopDemo();
    generateNewProblem();
    speak(newMode === 'demo' ? 'Demo mode! Watch and learn!' : 'Practice mode! Try it yourself!');
  };

  const playDemo = () => {
    if (!problem) return;
    clickSound();

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
        playSound('celebrate');
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
    playSound('click');

    const totalLen = Math.max(
      problem.num1.toString().length,
      problem.num2.toString().length,
      problem.answer.toString().length
    );

    const expectedCarries = calculateCarryPositions(problem.num1, problem.num2, totalLen);
    const expectedAnswer = padNumber(problem.answer, totalLen);

    const answerCorrect = answerInputs.join('') === expectedAnswer;
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
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <CardTitle>Carry Over</CardTitle>
          <div className="flex gap-2">
            <button
              onClick={() => handleModeChange('demo')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                mode === 'demo' ? 'bg-coral text-cream scale-110' : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'
              }`}
              aria-label="Demo mode"
            >
              <StepIcon type="start" size="lg" />
            </button>
            <button
              onClick={() => handleModeChange('practice')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                mode === 'practice' ? 'bg-sage text-cream scale-110' : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'
              }`}
              aria-label="Practice mode"
            >
              <StepIcon type="check" size="lg" />
            </button>
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
                    <Button variant="secondary" onClick={() => { clickSound(); stopDemo(); }} aria-label="Stop">
                      {/* Stop icon */}
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="6" width="12" height="12" rx="1" />
                      </svg>
                    </Button>
                  ) : (
                    <>
                      <Button onClick={playDemo} aria-label="Play demo">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </Button>
                      <Button variant="ghost" onClick={() => { clickSound(); generateNewProblem(); }} aria-label="New problem">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                        </svg>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Practice Mode */
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-6">
              {/* Score as dots */}
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

              {/* Visual hint: carry icon */}
              <div className="flex items-center gap-2 text-chocolate/40">
                <StepIcon type="carry" size="lg" />
                <span className="font-display text-sm">?</span>
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
                      playSound('pop');
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
                      playSound('pop');
                      const newInputs = [...answerInputs];
                      newInputs[i] = v.replace(/[^0-9]/g, '').slice(-1);
                      setAnswerInputs(newInputs);
                    }}
                    interactive={isCorrect === null}
                  />
                </div>
              )}

              <AnswerFeedback isCorrect={isCorrect} showText={false} />

              <div className="flex gap-3">
                {isCorrect === null ? (
                  <Button
                    onClick={checkPracticeAnswer}
                    disabled={answerInputs.some((d) => d === '')}
                    size="lg"
                    aria-label="Check answer"
                  >
                    <StepIcon type="check" size="lg" />
                  </Button>
                ) : (
                  <Button onClick={() => { clickSound(); generateNewProblem(); }} size="lg" aria-label="Next problem">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
