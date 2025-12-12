'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardTitle, CardContent, Button, AnswerFeedback, ProgressBar, StarDisplay, StepIcon } from '@/components/common';
import { MathToolbox } from '@/components/math';
import { generateProblem } from '@/lib/problemGenerators';
import { useAppDispatch } from '@/hooks/useRedux';
import { recordPracticeSession } from '@/store/sessionSlice';
import { useAudio } from '@/hooks/useAudio';
import type { Problem, ProblemType, Difficulty } from '@/types';

type SessionState = 'setup' | 'active' | 'results';

const operatorSymbols: Record<ProblemType, string> = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷',
  mixed: '?',
};

// Map problem types to StepIcon types
const problemTypeToIcon: Record<ProblemType, 'add' | 'subtract' | 'multiply' | 'divide' | 'check'> = {
  addition: 'add',
  subtraction: 'subtract',
  multiplication: 'multiply',
  division: 'divide',
  mixed: 'check',
};

export function PracticeSection() {
  const dispatch = useAppDispatch();
  const { speak, playSound, clickSound, celebrateComplete } = useAudio();
  const [sessionState, setSessionState] = useState<SessionState>('setup');

  // Setup options
  const [problemType, setProblemType] = useState<ProblemType>('mixed');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [problemCount, setProblemCount] = useState(10);

  // Session state
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerOptions, setAnswerOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [starsEarned, setStarsEarned] = useState(0);
  const [showTools, setShowTools] = useState(false);

  // Helper to generate shuffled answer options for a problem
  const generateAnswerOptions = useCallback((problem: Problem): number[] => {
    const options = [
      problem.answer,
      problem.answer + Math.floor(Math.random() * 5) + 1,
      Math.max(0, problem.answer - Math.floor(Math.random() * 5) - 1),
      problem.answer + Math.floor(Math.random() * 3) + 2,
    ].filter((n, i, arr) => n >= 0 && arr.indexOf(n) === i);
    // Fisher-Yates shuffle
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options.slice(0, 4);
  }, []);

  // Narrate current problem
  useEffect(() => {
    if (sessionState === 'active' && problems[currentIndex] && isCorrect === null) {
      const problem = problems[currentIndex];
      const opWord = problem.type === 'addition' ? 'plus' :
                     problem.type === 'subtraction' ? 'minus' :
                     problem.type === 'multiplication' ? 'times' : 'divided by';
      speak(`${problem.num1} ${opWord} ${problem.num2}`);
    }
  }, [sessionState, currentIndex, problems, isCorrect, speak]);

  const handleProblemTypeChange = (type: ProblemType) => {
    clickSound();
    setProblemType(type);
    speak(type === 'mixed' ? 'Mixed problems!' : `${type}!`);
  };

  const handleDifficultyChange = (diff: Difficulty) => {
    clickSound();
    setDifficulty(diff);
    const stars = diff === 'easy' ? 1 : diff === 'medium' ? 2 : 3;
    speak(`${stars} star difficulty!`);
  };

  const handleCountChange = (count: number) => {
    clickSound();
    setProblemCount(count);
    speak(`${count} problems!`);
  };

  const startSession = useCallback(() => {
    clickSound();
    speak('Let\'s go!');
    const newProblems = Array.from({ length: problemCount }, () =>
      generateProblem(problemType, difficulty)
    );
    setProblems(newProblems);
    setCurrentIndex(0);
    setAnswerOptions(newProblems[0] ? generateAnswerOptions(newProblems[0]) : []);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setResults([]);
    setStarsEarned(0);
    setSessionState('active');
  }, [problemType, difficulty, problemCount, clickSound, speak, generateAnswerOptions]);

  const checkAnswer = (answer: number) => {
    if (isCorrect !== null) return;
    playSound('click');

    const problem = problems[currentIndex];
    const correct = answer === problem.answer;
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setResults((prev) => [...prev, correct]);
  };

  const nextProblem = () => {
    clickSound();
    if (currentIndex < problems.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setAnswerOptions(problems[nextIndex] ? generateAnswerOptions(problems[nextIndex]) : []);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      finishSession();
    }
  };

  const finishSession = async () => {
    const answeredCorrect = results.filter(Boolean).length;
    const totalCount = problems.length || results.length;

    try {
      const result = await dispatch(
        recordPracticeSession({
          correct: answeredCorrect,
          total: totalCount,
          type: problemType,
        })
      ).unwrap();

      setStarsEarned(result.starsEarned);
    } catch {
      const score = totalCount ? Math.round((answeredCorrect / totalCount) * 100) : 0;
      if (score >= 100) setStarsEarned(5);
      else if (score >= 80) setStarsEarned(4);
      else if (score >= 60) setStarsEarned(3);
      else if (score >= 40) setStarsEarned(2);
      else if (score >= 20) setStarsEarned(1);
    }

    celebrateComplete();
    setSessionState('results');
  };

  const currentProblem = problems[currentIndex];
  const correctCount = results.filter(Boolean).length;

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
          <CardTitle>Practice</CardTitle>
          {sessionState !== 'setup' && (
            <Button
              variant="ghost"
              onClick={() => { clickSound(); setSessionState('setup'); }}
              aria-label="New session"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
              </svg>
            </Button>
          )}
        </div>
      </Card>

      {sessionState === 'setup' && (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-8">
              {/* Problem Type - icons */}
              <div className="flex flex-wrap justify-center gap-3">
                {(['addition', 'subtraction', 'multiplication', 'division', 'mixed'] as ProblemType[]).map(
                  (type) => (
                    <button
                      key={type}
                      onClick={() => handleProblemTypeChange(type)}
                      className={`
                        flex h-14 w-14 items-center justify-center rounded-xl
                        transition-all duration-200 hover:scale-110
                        ${
                          problemType === type
                            ? 'bg-coral text-cream scale-110'
                            : 'bg-cream text-chocolate shadow-soft hover:shadow-md'
                        }
                      `}
                      aria-label={type}
                    >
                      <StepIcon type={problemTypeToIcon[type]} size="lg" />
                    </button>
                  )
                )}
              </div>

              {/* Difficulty - stars */}
              <div className="flex gap-3">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => handleDifficultyChange(diff)}
                    className={`
                      flex items-center justify-center rounded-xl px-4 py-3
                      transition-all duration-200 hover:scale-105
                      ${
                        difficulty === diff
                          ? 'bg-yellow text-chocolate scale-105'
                          : 'bg-cream text-chocolate/40 shadow-soft hover:shadow-md'
                      }
                    `}
                    aria-label={diff}
                  >
                    {Array.from({ length: difficultyStars[diff] }).map((_, i) => (
                      <svg key={i} className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </button>
                ))}
              </div>

              {/* Problem Count - number buttons */}
              <div className="flex gap-3">
                {[5, 10, 15, 20].map((count) => (
                  <button
                    key={count}
                    onClick={() => handleCountChange(count)}
                    className={`
                      flex h-14 w-14 items-center justify-center rounded-full
                      font-display text-xl font-bold
                      transition-all duration-200 hover:scale-110
                      ${
                        problemCount === count
                          ? 'bg-sage text-cream scale-110'
                          : 'bg-cream text-chocolate shadow-soft hover:shadow-md'
                      }
                    `}
                  >
                    {count}
                  </button>
                ))}
              </div>

              {/* Start button */}
              <Button onClick={startSession} size="lg" aria-label="Start practice">
                <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {sessionState === 'active' && currentProblem && (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-6">
              {/* Progress as dots */}
              <div className="flex items-center gap-1">
                {Array.from({ length: problems.length }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-full transition-all ${
                      i < results.length
                        ? results[i]
                          ? 'bg-sage'
                          : 'bg-coral/50'
                        : i === currentIndex
                          ? 'bg-sky scale-150'
                          : 'bg-chocolate/10'
                    }`}
                  />
                ))}
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-xs">
                <ProgressBar
                  value={currentIndex + 1}
                  max={problems.length}
                  color="coral"
                />
              </div>

              {/* Problem - visual display */}
              <div className="flex items-center gap-4">
                <span className="font-display text-5xl font-bold text-coral">{currentProblem.num1}</span>
                <span className="font-display text-4xl text-chocolate">{operatorSymbols[currentProblem.type]}</span>
                <span className="font-display text-5xl font-bold text-sage">{currentProblem.num2}</span>
                <span className="font-display text-4xl text-chocolate">=</span>
                <span className="font-display text-5xl font-bold text-chocolate/30">?</span>
              </div>

              {/* Helper Tools Toggle */}
              <button
                onClick={() => { clickSound(); setShowTools(!showTools); }}
                className={`
                  flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all
                  ${showTools
                    ? 'bg-sky text-cream'
                    : 'bg-cream text-chocolate/60 hover:bg-sky/10 hover:text-chocolate'
                  }
                `}
                aria-expanded={showTools}
                aria-label="Toggle helper tools"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
                </svg>
                {showTools ? 'Hide Tools' : 'Need Help?'}
              </button>

              {/* Math Toolbox */}
              {showTools && (
                <div className="w-full max-w-lg">
                  <MathToolbox
                    num1={currentProblem.num1}
                    num2={currentProblem.num2}
                    operation={currentProblem.type}
                  />
                </div>
              )}

              {/* Answer Options - large touch targets */}
              <div className="flex flex-wrap justify-center gap-4">
                {answerOptions.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => checkAnswer(option)}
                    disabled={isCorrect !== null}
                    className={`
                      flex h-20 w-20 items-center justify-center rounded-2xl
                      font-display text-3xl font-bold transition-all duration-200
                      ${
                        selectedAnswer === option
                          ? isCorrect
                            ? 'bg-sage text-cream scale-110'
                            : 'bg-coral text-cream animate-shake'
                          : isCorrect !== null && option === currentProblem.answer
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
                <Button onClick={nextProblem} size="lg" aria-label={currentIndex < problems.length - 1 ? 'Next problem' : 'See results'}>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {sessionState === 'results' && (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-6 text-center">
              {/* Celebration icon */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow animate-bounce">
                <svg className="h-12 w-12 text-chocolate" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </div>

              {/* Score as visual fraction */}
              <div className="flex items-center gap-2">
                <span className="font-display text-6xl font-bold text-sage">{correctCount}</span>
                <span className="font-display text-4xl text-chocolate/40">/</span>
                <span className="font-display text-6xl font-bold text-chocolate">{problems.length}</span>
              </div>

              {/* Stars Earned */}
              <StarDisplay count={starsEarned} size="lg" />

              {/* Result dots */}
              <div className="flex flex-wrap justify-center gap-2">
                {results.map((correct, i) => (
                  <div
                    key={i}
                    className={`h-4 w-4 rounded-full ${correct ? 'bg-sage' : 'bg-coral/50'}`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button onClick={startSession} aria-label="Practice again">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                  </svg>
                </Button>
                <Button variant="ghost" onClick={() => { clickSound(); setSessionState('setup'); }} aria-label="Change settings">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                  </svg>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
