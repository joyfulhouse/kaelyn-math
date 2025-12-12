'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardTitle, CardContent, Button, AnswerFeedback, StepIcon } from '@/components/common';
import { GroupingVisual, SharingStory } from '@/components/math';
import { generateDivisionQuiz } from '@/lib/problemGenerators';
import { useAudio } from '@/hooks/useAudio';
import type { DivisionQuiz } from '@/types';

type Mode = 'share' | 'group' | 'subtract' | 'quiz';

// Mode narrations
const MODE_NARRATIONS: Record<Mode, string> = {
  share: 'Sharing mode! Give everyone the same!',
  group: 'Grouping mode! Make equal groups!',
  subtract: 'Subtract mode! Take away groups!',
  quiz: 'Quiz time! Test yourself!',
};

export function DivisionSection() {
  const { speak, playSound, clickSound } = useAudio();
  const [mode, setMode] = useState<Mode>('share');

  // Story/Visual mode state
  const [total, setTotal] = useState(12);
  const [groups, setGroups] = useState(3);

  // Repeated subtraction animation state
  const [subStep, setSubStep] = useState(0);
  const [subAnimating, setSubAnimating] = useState(false);

  // Quiz mode state
  const [quiz, setQuiz] = useState<DivisionQuiz | null>(null);
  const [quizOptions, setQuizOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Narrate division when values change
  useEffect(() => {
    if (mode === 'share' || mode === 'group') {
      const quotient = Math.floor(total / groups);
      const remainder = total % groups;
      if (remainder > 0) {
        speak(`${total} divided by ${groups} equals ${quotient} with ${remainder} left over`);
      } else {
        speak(`${total} divided by ${groups} equals ${quotient}`);
      }
    }
  }, [total, groups, mode, speak]);

  // Repeated subtraction animation
  useEffect(() => {
    const maxSteps = Math.floor(total / groups);
    if (mode === 'subtract' && subAnimating && subStep < maxSteps) {
      const timer = setTimeout(() => {
        setSubStep((prev) => prev + 1);
        const remaining = total - (subStep + 1) * groups;
        speak(`Take away ${groups}. ${remaining} left!`);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (subStep >= maxSteps && subAnimating) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setSubAnimating(false);
        playSound('celebrate');
        speak(`We made ${maxSteps} groups!`);
      }, 0);
    }
  }, [mode, subAnimating, subStep, total, groups, speak, playSound]);

  const handleModeChange = (newMode: Mode) => {
    clickSound();
    setMode(newMode);
    speak(MODE_NARRATIONS[newMode]);
    if (newMode === 'quiz') {
      startQuiz();
    }
    if (newMode === 'subtract') {
      setSubStep(0);
      setSubAnimating(false);
    }
  };

  const startQuiz = useCallback(() => {
    const newQuiz = generateDivisionQuiz();
    setQuiz(newQuiz);
    // Generate and shuffle options
    const options = [newQuiz.answer, newQuiz.answer + 1, Math.max(0, newQuiz.answer - 1), newQuiz.answer + 2]
      .filter((n, i, arr) => n >= 0 && arr.indexOf(n) === i);
    // Fisher-Yates shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    setQuizOptions(options.slice(0, 4));
    setSelectedAnswer(null);
    setIsCorrect(null);
    speak(`${newQuiz.total} divided by ${newQuiz.groups}`);
  }, [speak]);

  const startSubtraction = () => {
    clickSound();
    setSubStep(0);
    setSubAnimating(true);
    speak(`Counting by ${groups} backwards from ${total}!`);
  };

  const handleTotalChange = (delta: number) => {
    clickSound();
    const newValue = Math.max(1, Math.min(48, total + delta));
    setTotal(newValue);
  };

  const handleGroupsChange = (delta: number) => {
    clickSound();
    const newValue = Math.max(1, Math.min(12, groups + delta));
    setGroups(newValue);
  };

  const handleAnswerSelect = (answer: number) => {
    if (isCorrect !== null) return;
    playSound('click');
    setSelectedAnswer(answer);
    const correct = answer === quiz?.answer;
    setIsCorrect(correct);
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const nextQuestion = () => {
    clickSound();
    startQuiz();
  };

  // Calculate division result
  const quotient = Math.floor(total / groups);
  const remainder = total % groups;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <CardTitle>Division</CardTitle>

          {/* Mode buttons with icons */}
          <div className="flex gap-2">
            {/* Sharing */}
            <button
              onClick={() => handleModeChange('share')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                mode === 'share' ? 'bg-coral text-cream scale-110' : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'
              }`}
              aria-label="Sharing mode"
            >
              {/* Share/distribute icon */}
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="6" r="3" />
                <circle cx="18" cy="18" r="3" />
                <path d="M8.59 13.51l6.83 3.98M15.41 7.51l-6.82 3.98" stroke="currentColor" strokeWidth="1.5" fill="none" />
              </svg>
            </button>

            {/* Grouping */}
            <button
              onClick={() => handleModeChange('group')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                mode === 'group' ? 'bg-sage text-cream scale-110' : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'
              }`}
              aria-label="Grouping mode"
            >
              {/* Groups icon */}
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="6" cy="6" r="2" />
                <circle cx="12" cy="6" r="2" />
                <circle cx="6" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <rect x="3" y="3" width="12" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>

            {/* Repeated Subtraction */}
            <button
              onClick={() => handleModeChange('subtract')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                mode === 'subtract' ? 'bg-yellow text-chocolate scale-110' : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'
              }`}
              aria-label="Subtraction mode"
            >
              <StepIcon type="subtract" size="lg" />
            </button>

            {/* Quiz */}
            <button
              onClick={() => handleModeChange('quiz')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                mode === 'quiz' ? 'bg-sky text-cream scale-110' : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'
              }`}
              aria-label="Quiz mode"
            >
              <StepIcon type="check" size="lg" />
            </button>
          </div>
        </div>
      </Card>

      {(mode === 'share' || mode === 'group') && (
        <div className="space-y-6">
          {/* Controls with +/- buttons */}
          <Card>
            <CardContent>
              <div className="flex flex-col gap-6">
                {/* Equation display */}
                <div className="flex items-center justify-center gap-3">
                  <span className="font-display text-4xl font-bold text-coral">{total}</span>
                  <span className="font-display text-3xl text-chocolate">÷</span>
                  <span className="font-display text-4xl font-bold text-sage">{groups}</span>
                  <span className="font-display text-3xl text-chocolate">=</span>
                  <span className="font-display text-4xl font-bold text-sky">
                    {quotient}
                    {remainder > 0 && (
                      <span className="ml-2 text-2xl text-yellow">R{remainder}</span>
                    )}
                  </span>
                </div>

                {/* Value adjusters */}
                <div className="flex flex-wrap justify-center gap-6">
                  {/* Total adjuster */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTotalChange(-1)}
                      disabled={total <= 1}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/20 text-coral transition-all hover:bg-coral/30 disabled:opacity-30"
                      aria-label="Decrease total"
                    >
                      <StepIcon type="subtract" size="md" />
                    </button>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-coral text-cream font-display text-2xl font-bold">
                      {total}
                    </div>
                    <button
                      onClick={() => handleTotalChange(1)}
                      disabled={total >= 48}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/20 text-coral transition-all hover:bg-coral/30 disabled:opacity-30"
                      aria-label="Increase total"
                    >
                      <StepIcon type="add" size="md" />
                    </button>
                  </div>

                  {/* Divider symbol */}
                  <div className="flex items-center">
                    <StepIcon type="divide" size="lg" className="text-chocolate/40" />
                  </div>

                  {/* Groups adjuster */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleGroupsChange(-1)}
                      disabled={groups <= 1}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-sage transition-all hover:bg-sage/30 disabled:opacity-30"
                      aria-label="Decrease groups"
                    >
                      <StepIcon type="subtract" size="md" />
                    </button>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage text-cream font-display text-2xl font-bold">
                      {groups}
                    </div>
                    <button
                      onClick={() => handleGroupsChange(1)}
                      disabled={groups >= 12}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-sage transition-all hover:bg-sage/30 disabled:opacity-30"
                      aria-label="Increase groups"
                    >
                      <StepIcon type="add" size="md" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sharing Story (visual only) or Grouping Visual */}
          {mode === 'share' ? (
            <SharingStory total={total} recipients={groups} />
          ) : (
            <Card>
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  {/* Grouping question visual */}
                  <div className="flex items-center gap-2 text-chocolate/60">
                    <span className="font-display text-lg">How many groups of</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage text-cream font-display font-bold">
                      {groups}
                    </span>
                    <span className="font-display text-lg">?</span>
                  </div>
                  <GroupingVisual total={total} groups={groups} animated />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {mode === 'subtract' && (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-6">
              {/* Number line visualization */}
              <div className="relative w-full max-w-lg">
                <div className="h-2 w-full rounded-full bg-chocolate/10" />

                {/* Subtraction markers */}
                <div className="mt-4 flex justify-between">
                  {Array.from({ length: quotient + 1 }).map((_, i) => {
                    const value = total - i * groups;
                    return (
                      <div
                        key={i}
                        className={`flex flex-col items-center transition-all duration-300 ${
                          i <= subStep ? 'opacity-100 scale-100' : 'opacity-30 scale-75'
                        }`}
                      >
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full font-display font-bold transition-all ${
                            i === subStep && subAnimating
                              ? 'bg-coral text-cream scale-125 animate-bounce'
                              : i < subStep
                                ? 'bg-sage text-cream'
                                : 'bg-chocolate/10 text-chocolate/40'
                          }`}
                        >
                          {value}
                        </div>
                        {i > 0 && i <= subStep && (
                          <span className="mt-1 text-xs font-body text-coral">-{groups}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Remainder display */}
              {remainder > 0 && subStep >= quotient && !subAnimating && (
                <div className="flex items-center gap-2 animate-bounceIn">
                  <span className="font-display text-lg text-chocolate/60">Left over:</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow text-chocolate font-display font-bold">
                    {remainder}
                  </span>
                </div>
              )}

              {/* Start/Reset button */}
              <Button onClick={startSubtraction} disabled={subAnimating}>
                {subStep === 0 ? (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                  </svg>
                )}
              </Button>

              {/* Result */}
              {subStep >= quotient && !subAnimating && (
                <div className="text-center animate-bounceIn">
                  <p className="font-display text-2xl font-bold text-chocolate">
                    {total} ÷ {groups} = <span className="text-sky text-3xl">{quotient}</span>
                    {remainder > 0 && <span className="text-yellow text-xl ml-2">R{remainder}</span>}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {mode === 'quiz' && quiz && (
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

              {/* Question - visual */}
              <div className="flex items-center gap-4">
                <span className="font-display text-5xl font-bold text-coral">{quiz.total}</span>
                <span className="font-display text-4xl text-chocolate">÷</span>
                <span className="font-display text-5xl font-bold text-sage">{quiz.groups}</span>
                <span className="font-display text-4xl text-chocolate">=</span>
                <span className="font-display text-5xl font-bold text-chocolate/30">?</span>
              </div>

              {/* Visual hint */}
              <GroupingVisual total={quiz.total} groups={quiz.groups} showLabels={false} />

              {/* Answer Options - large touch targets */}
              <div className="flex flex-wrap justify-center gap-4">
                {quizOptions.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={isCorrect !== null}
                    className={`
                      flex h-20 w-20 items-center justify-center rounded-2xl
                      font-display text-3xl font-bold transition-all duration-200
                      ${
                        selectedAnswer === option
                          ? isCorrect
                            ? 'bg-sage text-cream scale-110'
                            : 'bg-coral text-cream animate-shake'
                          : isCorrect !== null && option === quiz.answer
                            ? 'bg-sage text-cream scale-110'
                            : 'bg-cream text-chocolate shadow-soft hover:scale-105 hover:shadow-md'
                      }
                      disabled:cursor-not-allowed
                    `}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Feedback */}
              <AnswerFeedback isCorrect={isCorrect} showText={false} />

              {/* Next Button */}
              {isCorrect !== null && (
                <Button onClick={nextQuestion} size="lg" aria-label="Next question">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
