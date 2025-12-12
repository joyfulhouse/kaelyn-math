'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardTitle, CardContent, Button, AnswerFeedback, StepIcon } from '@/components/common';
import { DotGrid, TimesTableGrid } from '@/components/math';
import { generateMultiplicationQuiz } from '@/lib/problemGenerators';
import { useAudio } from '@/hooks/useAudio';
import type { MultiplicationQuiz } from '@/types';

type Mode = 'visual' | 'add' | 'skip' | 'tables' | 'quiz';

// Mode icons and narrations
const MODE_CONFIG: Record<Mode, { narration: string }> = {
  visual: { narration: 'Visual mode! Count the dots!' },
  add: { narration: 'Repeated addition! Add them up!' },
  skip: { narration: 'Skip counting! Jump by numbers!' },
  tables: { narration: 'Times tables! Learn the facts!' },
  quiz: { narration: 'Quiz time! Test yourself!' },
};

export function MultiplicationSection() {
  const { speak, playSound, clickSound } = useAudio();
  const [mode, setMode] = useState<Mode>('visual');

  // Visual mode state
  const [visualRows, setVisualRows] = useState(3);
  const [visualCols, setVisualCols] = useState(4);

  // Skip counting animation state
  const [skipStep, setSkipStep] = useState(0);
  const [skipAnimating, setSkipAnimating] = useState(false);

  // Tables mode state
  const [selectedTable, setSelectedTable] = useState(2);

  // Quiz mode state
  const [quiz, setQuiz] = useState<MultiplicationQuiz | null>(null);
  const [quizOptions, setQuizOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Narrate visual equation when it changes
  useEffect(() => {
    if (mode === 'visual') {
      speak(`${visualRows} times ${visualCols} equals ${visualRows * visualCols}`);
    }
  }, [visualRows, visualCols, mode, speak]);

  // Skip counting animation
  useEffect(() => {
    if (mode === 'skip' && skipAnimating && skipStep < visualRows) {
      const timer = setTimeout(() => {
        setSkipStep((prev) => prev + 1);
        speak(`${(skipStep + 1) * visualCols}`);
      }, 800);
      return () => clearTimeout(timer);
    } else if (skipStep >= visualRows) {
      // Use setTimeout to avoid synchronous setState in effect
      setTimeout(() => {
        setSkipAnimating(false);
        playSound('celebrate');
      }, 0);
    }
  }, [mode, skipAnimating, skipStep, visualRows, visualCols, speak, playSound]);

  const handleModeChange = (newMode: Mode) => {
    clickSound();
    setMode(newMode);
    speak(MODE_CONFIG[newMode].narration);
    if (newMode === 'quiz') {
      startQuiz();
    }
  };

  const startQuiz = useCallback(() => {
    const newQuiz = generateMultiplicationQuiz();
    setQuiz(newQuiz);
    // Generate and shuffle options
    const options = [newQuiz.answer, newQuiz.answer + newQuiz.a, newQuiz.answer - newQuiz.b, newQuiz.answer + newQuiz.b]
      .filter((n) => n > 0);
    // Fisher-Yates shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    setQuizOptions(options.slice(0, 4));
    setSelectedAnswer(null);
    setIsCorrect(null);
    speak(`${newQuiz.a} times ${newQuiz.b}`);
  }, [speak]);

  const startSkipCounting = () => {
    clickSound();
    setSkipStep(0);
    setSkipAnimating(true);
    speak(`Counting by ${visualCols}!`);
  };

  const handleRowChange = (delta: number) => {
    clickSound();
    const newValue = Math.max(1, Math.min(12, visualRows + delta));
    setVisualRows(newValue);
  };

  const handleColChange = (delta: number) => {
    clickSound();
    const newValue = Math.max(1, Math.min(12, visualCols + delta));
    setVisualCols(newValue);
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

  const handleTableSelect = (n: number) => {
    clickSound();
    setSelectedTable(n);
    speak(`${n} times table!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <CardTitle>Multiplication</CardTitle>

          {/* Mode buttons with icons */}
          <div className="flex flex-wrap gap-2">
            {/* Visual Grid */}
            <button
              onClick={() => handleModeChange('visual')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                mode === 'visual' ? 'bg-coral text-cream scale-110' : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'
              }`}
              aria-label="Visual mode"
            >
              {/* Grid icon */}
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>

            {/* Repeated Addition */}
            <button
              onClick={() => handleModeChange('add')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                mode === 'add' ? 'bg-sage text-cream scale-110' : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'
              }`}
              aria-label="Repeated addition mode"
            >
              <StepIcon type="add" size="lg" />
            </button>

            {/* Skip Counting */}
            <button
              onClick={() => handleModeChange('skip')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                mode === 'skip' ? 'bg-yellow text-chocolate scale-110' : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'
              }`}
              aria-label="Skip counting mode"
            >
              {/* Skip/jump icon */}
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 18h2v-2H4v2zm0-4h2v-2H4v2zm0-4h2V8H4v2zm4 8h14v-2H8v2zm0-4h14v-2H8v2zm0-4h14V8H8v2z" />
              </svg>
            </button>

            {/* Times Tables */}
            <button
              onClick={() => handleModeChange('tables')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                mode === 'tables' ? 'bg-sky text-cream scale-110' : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'
              }`}
              aria-label="Times tables mode"
            >
              <StepIcon type="multiply" size="lg" />
            </button>

            {/* Quiz */}
            <button
              onClick={() => handleModeChange('quiz')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                mode === 'quiz' ? 'bg-coral text-cream scale-110' : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'
              }`}
              aria-label="Quiz mode"
            >
              <StepIcon type="check" size="lg" />
            </button>
          </div>
        </div>
      </Card>

      {mode === 'visual' && (
        <div className="space-y-6">
          {/* Controls with +/- buttons instead of sliders */}
          <Card>
            <CardContent>
              <div className="flex flex-col gap-6">
                {/* Equation display */}
                <div className="flex items-center justify-center gap-3">
                  <span className="font-display text-4xl font-bold text-coral">{visualRows}</span>
                  <span className="font-display text-3xl text-chocolate">×</span>
                  <span className="font-display text-4xl font-bold text-sage">{visualCols}</span>
                  <span className="font-display text-3xl text-chocolate">=</span>
                  <span className="font-display text-4xl font-bold text-sky">{visualRows * visualCols}</span>
                </div>

                {/* Row/Column adjusters */}
                <div className="flex flex-wrap justify-center gap-6">
                  {/* Rows adjuster */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRowChange(-1)}
                      disabled={visualRows <= 1}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/20 text-coral transition-all hover:bg-coral/30 disabled:opacity-30"
                      aria-label="Decrease rows"
                    >
                      <StepIcon type="subtract" size="md" />
                    </button>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral text-cream font-display text-xl font-bold">
                      {visualRows}
                    </div>
                    <button
                      onClick={() => handleRowChange(1)}
                      disabled={visualRows >= 12}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/20 text-coral transition-all hover:bg-coral/30 disabled:opacity-30"
                      aria-label="Increase rows"
                    >
                      <StepIcon type="add" size="md" />
                    </button>
                  </div>

                  {/* Columns adjuster */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleColChange(-1)}
                      disabled={visualCols <= 1}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-sage transition-all hover:bg-sage/30 disabled:opacity-30"
                      aria-label="Decrease columns"
                    >
                      <StepIcon type="subtract" size="md" />
                    </button>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-cream font-display text-xl font-bold">
                      {visualCols}
                    </div>
                    <button
                      onClick={() => handleColChange(1)}
                      disabled={visualCols >= 12}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-sage transition-all hover:bg-sage/30 disabled:opacity-30"
                      aria-label="Increase columns"
                    >
                      <StepIcon type="add" size="md" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dot Grid */}
          <Card>
            <CardContent>
              <div className="flex justify-center">
                <DotGrid rows={visualRows} cols={visualCols} animated size="md" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {mode === 'add' && (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-6">
              {/* Visual: rows stacks of cols dots */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                {Array.from({ length: visualRows }).map((_, rowIndex) => (
                  <div key={rowIndex} className="flex flex-col items-center animate-pop-in" style={{ animationDelay: `${rowIndex * 150}ms` }}>
                    <div className="flex gap-1">
                      {Array.from({ length: visualCols }).map((_, colIndex) => (
                        <div key={colIndex} className="h-4 w-4 rounded-full bg-coral" />
                      ))}
                    </div>
                    <span className="mt-1 font-display text-lg font-bold text-coral">{visualCols}</span>
                  </div>
                ))}
              </div>

              {/* Addition equation */}
              <div className="flex flex-wrap items-center justify-center gap-2 font-display text-2xl">
                {Array.from({ length: visualRows }).map((_, i) => (
                  <span key={i} className="flex items-center">
                    {i > 0 && <span className="mx-2 text-chocolate/40">+</span>}
                    <span className="text-coral font-bold">{visualCols}</span>
                  </span>
                ))}
                <span className="mx-2 text-chocolate/40">=</span>
                <span className="text-sky font-bold text-3xl">{visualRows * visualCols}</span>
              </div>

              {/* Verbal explanation */}
              <p className="font-display text-lg text-chocolate/60 text-center">
                {visualRows} groups of {visualCols}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {mode === 'skip' && (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-6">
              {/* Number line */}
              <div className="relative w-full max-w-md">
                <div className="h-2 w-full rounded-full bg-chocolate/10" />

                {/* Skip markers */}
                <div className="mt-4 flex justify-between">
                  {Array.from({ length: visualRows + 1 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex flex-col items-center transition-all duration-300 ${
                        i <= skipStep ? 'opacity-100 scale-100' : 'opacity-30 scale-75'
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full font-display font-bold transition-all ${
                          i === skipStep && skipAnimating
                            ? 'bg-yellow text-chocolate scale-125 animate-bounce'
                            : i < skipStep
                              ? 'bg-sage text-cream'
                              : 'bg-chocolate/10 text-chocolate/40'
                        }`}
                      >
                        {i * visualCols}
                      </div>
                      {i > 0 && i <= skipStep && (
                        <span className="mt-1 text-xs font-body text-sage">+{visualCols}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Start/Reset button */}
              <Button onClick={startSkipCounting} disabled={skipAnimating}>
                {skipStep === 0 ? (
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
              {skipStep >= visualRows && (
                <div className="text-center animate-bounceIn">
                  <p className="font-display text-2xl font-bold text-chocolate">
                    {visualRows} × {visualCols} = <span className="text-sky text-3xl">{visualRows * visualCols}</span>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {mode === 'tables' && (
        <div className="space-y-6">
          {/* Table Selector - large number buttons */}
          <Card>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => handleTableSelect(n)}
                    className={`
                      flex h-12 w-12 items-center justify-center rounded-xl
                      font-display text-xl font-bold transition-all duration-200
                      ${
                        selectedTable === n
                          ? 'bg-sky text-cream scale-110'
                          : 'bg-cream text-chocolate shadow-soft hover:scale-105 hover:shadow-md'
                      }
                    `}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Times Table Grid */}
          <Card>
            <CardContent>
              <TimesTableGrid factor={selectedTable} />
            </CardContent>
          </Card>
        </div>
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
                <span className="font-display text-5xl font-bold text-coral">{quiz.a}</span>
                <span className="font-display text-4xl text-chocolate">×</span>
                <span className="font-display text-5xl font-bold text-sage">{quiz.b}</span>
                <span className="font-display text-4xl text-chocolate">=</span>
                <span className="font-display text-5xl font-bold text-chocolate/30">?</span>
              </div>

              {/* Visual hint - small dot grid */}
              <DotGrid rows={quiz.a} cols={quiz.b} size="sm" />

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
