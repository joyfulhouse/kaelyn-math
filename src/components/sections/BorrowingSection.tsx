'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardTitle, CardContent, Button, AnswerFeedback } from '@/components/common';
import { StackedProblem, BorrowRow, Timeline, BorrowVisualization } from '@/components/math';
import { generateBorrowProblem } from '@/lib/problemGenerators';
import { calculateBorrowAdjustments, padNumber } from '@/lib/mathUtils';
import type { Problem } from '@/types';

type Mode = 'demo' | 'practice';

interface DemoStep {
  label: string;
  description: string;
}

const DEMO_STEPS: DemoStep[] = [
  { label: 'Start', description: 'Look at the problem' },
  { label: 'Check', description: 'Can we subtract the ones?' },
  { label: 'Borrow', description: 'Borrow from the tens' },
  { label: 'Ones', description: 'Subtract the ones' },
  { label: 'Tens', description: 'Subtract the tens' },
  { label: 'Hundreds', description: 'Subtract the hundreds' },
  { label: 'Done', description: 'Final answer!' },
];

export function BorrowingSection() {
  const [mode, setMode] = useState<Mode>('demo');
  const [problem, setProblem] = useState<Problem | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Demo state
  const [displayDigits, setDisplayDigits] = useState<number[]>([]);
  const [borrowed, setBorrowed] = useState<boolean[]>([]);
  const [receivedBorrow, setReceivedBorrow] = useState<boolean[]>([]);
  const [visibleAnswerDigits, setVisibleAnswerDigits] = useState<string[]>([]);
  const [borrowVizData, setBorrowVizData] = useState<{
    topDigit: number;
    bottomDigit: number;
    showBorrow: boolean;
    visible: boolean;
  } | null>(null);

  // Practice state
  const [practiceDisplayDigits, setPracticeDisplayDigits] = useState<number[]>([]);
  const [practiceBorrowed, setPracticeBorrowed] = useState<boolean[]>([]);
  const [practiceReceived, setPracticeReceived] = useState<boolean[]>([]);
  const [answerInputs, setAnswerInputs] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const totalLen = 3; // Always use 3 digits for borrowing problems

  const generateNewProblem = useCallback(() => {
    const newProblem = generateBorrowProblem();
    setProblem(newProblem);

    const num1Digits = padNumber(newProblem.num1, totalLen).split('').map(Number);

    // Demo state
    setDisplayDigits(num1Digits);
    setBorrowed(Array(totalLen).fill(false));
    setReceivedBorrow(Array(totalLen).fill(false));
    setVisibleAnswerDigits(Array(totalLen).fill(''));
    setCurrentStep(0);
    setBorrowVizData(null);

    // Practice state
    setPracticeDisplayDigits(num1Digits);
    setPracticeBorrowed(Array(totalLen).fill(false));
    setPracticeReceived(Array(totalLen).fill(false));
    setAnswerInputs(Array(totalLen).fill(''));
    setIsCorrect(null);
  }, []);

  useEffect(() => {
    generateNewProblem();
  }, [generateNewProblem]);

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

    const { borrows, adjusted } = calculateBorrowAdjustments(problem.num1, problem.num2, totalLen);
    const answerStr = padNumber(problem.answer, totalLen);
    const originalDigits = padNumber(problem.num1, totalLen).split('').map(Number);
    const bottomDigits = padNumber(problem.num2, totalLen).split('').map(Number);

    // Initialize state
    let newDisplayDigits = [...originalDigits];
    const newBorrowed = Array(totalLen).fill(false) as boolean[];
    const newReceived = Array(totalLen).fill(false) as boolean[];
    const newAnswerDigits = Array(totalLen).fill('') as string[];
    let newBorrowVizData: typeof borrowVizData = null;

    // Build up state based on target step
    // Step 0: Start - show original problem
    // Step 1: Check - show if ones needs borrow
    // Step 2: Borrow - apply borrow if needed
    // Step 3: Ones - show ones answer
    // Step 4: Tens - show tens answer
    // Step 5: Hundreds - show hundreds answer
    // Step 6: Done

    if (targetStep >= 1) {
      // Show check visualization for ones column
      const topDigit = originalDigits[totalLen - 1];
      const bottomDigit = bottomDigits[totalLen - 1];
      if (targetStep === 1) {
        newBorrowVizData = {
          topDigit,
          bottomDigit,
          showBorrow: false,
          visible: true,
        };
      }
    }

    if (targetStep >= 2) {
      // Apply borrow for ones column if needed
      if (borrows[totalLen - 1]) {
        newDisplayDigits = [...adjusted];
        newBorrowed[totalLen - 2] = true; // tens gave
        newReceived[totalLen - 1] = true; // ones received
        if (targetStep === 2) {
          newBorrowVizData = {
            topDigit: originalDigits[totalLen - 1],
            bottomDigit: bottomDigits[totalLen - 1],
            showBorrow: true,
            visible: true,
          };
        }
      } else {
        if (targetStep === 2) {
          newBorrowVizData = null;
        }
      }
    }

    if (targetStep >= 3) {
      // Show ones answer
      newAnswerDigits[totalLen - 1] = answerStr[totalLen - 1];
      // Apply all borrows for display
      newDisplayDigits = [...adjusted];
      // Show any additional borrows
      if (borrows[totalLen - 2]) {
        newBorrowed[totalLen - 3] = true;
        newReceived[totalLen - 2] = true;
      }
      if (targetStep === 3) {
        newBorrowVizData = null;
      }
    }

    if (targetStep >= 4) {
      // Show tens answer
      newAnswerDigits[totalLen - 2] = answerStr[totalLen - 2];
      if (targetStep === 4) {
        newBorrowVizData = null;
      }
    }

    if (targetStep >= 5) {
      // Show hundreds answer
      newAnswerDigits[totalLen - 3] = answerStr[totalLen - 3];
      if (targetStep === 5) {
        newBorrowVizData = null;
      }
    }

    if (targetStep >= 6) {
      // Done
      newBorrowVizData = null;
    }

    setDisplayDigits(newDisplayDigits);
    setBorrowed(newBorrowed);
    setReceivedBorrow(newReceived);
    setVisibleAnswerDigits(newAnswerDigits);
    setBorrowVizData(newBorrowVizData);
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

  const handleBorrowClick = (receiverIndex: number) => {
    if (isCorrect !== null || receiverIndex === 0) return;

    const giverIndex = receiverIndex - 1;
    if (practiceDisplayDigits[giverIndex] <= 0) return;
    if (practiceReceived[receiverIndex]) return;

    // Get bottom digit for validation
    if (!problem) return;
    const bottomDigits = padNumber(problem.num2, totalLen).split('').map(Number);

    // Check if this column actually needs borrowing
    if (practiceDisplayDigits[receiverIndex] >= bottomDigits[receiverIndex]) return;

    const newDisplayDigits = [...practiceDisplayDigits];
    const newBorrowed = [...practiceBorrowed];
    const newReceived = [...practiceReceived];

    newDisplayDigits[giverIndex] -= 1;
    newDisplayDigits[receiverIndex] += 10;
    newBorrowed[giverIndex] = true;
    newReceived[receiverIndex] = true;

    setPracticeDisplayDigits(newDisplayDigits);
    setPracticeBorrowed(newBorrowed);
    setPracticeReceived(newReceived);
  };

  const checkPracticeAnswer = () => {
    if (!problem) return;

    const expectedAnswer = padNumber(problem.answer, totalLen);
    const correct = answerInputs.join('') === expectedAnswer;

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
            <CardTitle>Borrowing</CardTitle>
            <p className="mt-1 font-body text-chocolate/70">
              Learn to borrow numbers when subtracting!
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

          <Card>
            <CardContent>
              <div className="flex flex-col items-center gap-6">
                {problem && (
                  <StackedProblem
                    num1={problem.num1}
                    num2={problem.num2}
                    operation="subtraction"
                    borrowRow={
                      <BorrowRow
                        originalDigits={padNumber(problem.num1, totalLen).split('').map(Number)}
                        displayDigits={displayDigits}
                        borrowed={borrowed}
                        receivedBorrow={receivedBorrow}
                      />
                    }
                    answer={visibleAnswerDigits}
                    interactive={false}
                  />
                )}

                {/* Borrow Visualization during demo */}
                {borrowVizData && borrowVizData.visible && (
                  <BorrowVisualization
                    topDigit={borrowVizData.topDigit}
                    bottomDigit={borrowVizData.bottomDigit}
                    showBorrow={borrowVizData.showBorrow}
                    visible={borrowVizData.visible}
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
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <span className="font-display text-lg text-chocolate">
                  Score: {score.correct}/{score.total}
                </span>
              </div>

              <p className="text-center font-body text-sm text-chocolate/60">
                Click on a digit that needs to borrow (when top &lt; bottom)
              </p>

              {problem && (
                <StackedProblem
                  num1={problem.num1}
                  num2={problem.num2}
                  operation="subtraction"
                  borrowRow={
                    <BorrowRow
                      originalDigits={padNumber(problem.num1, totalLen).split('').map(Number)}
                      displayDigits={practiceDisplayDigits}
                      borrowed={practiceBorrowed}
                      receivedBorrow={practiceReceived}
                      interactive={isCorrect === null}
                      onBorrowClick={handleBorrowClick}
                      bottomDigits={padNumber(problem.num2, totalLen).split('').map(Number)}
                    />
                  }
                  answer={answerInputs}
                  onDigitChange={(i, v) => {
                    const newInputs = [...answerInputs];
                    newInputs[i] = v.replace(/[^0-9]/g, '').slice(-1);
                    setAnswerInputs(newInputs);
                  }}
                  interactive={isCorrect === null}
                />
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
