'use client';

import { useState, useCallback } from 'react';
import { Card, CardTitle, CardContent, Button, Slider, AnswerFeedback } from '@/components/common';
import { DotGrid, TimesTableGrid } from '@/components/math';
import { generateMultiplicationQuiz } from '@/lib/problemGenerators';
import type { MultiplicationQuiz } from '@/types';

type Mode = 'visual' | 'tables' | 'quiz';

export function MultiplicationSection() {
  const [mode, setMode] = useState<Mode>('visual');

  // Visual mode state
  const [visualRows, setVisualRows] = useState(3);
  const [visualCols, setVisualCols] = useState(4);

  // Tables mode state
  const [selectedTable, setSelectedTable] = useState(2);

  // Quiz mode state
  const [quiz, setQuiz] = useState<MultiplicationQuiz | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const startQuiz = useCallback(() => {
    setQuiz(generateMultiplicationQuiz());
    setUserAnswer('');
    setIsCorrect(null);
  }, []);

  const checkAnswer = () => {
    if (!quiz) return;
    const correct = parseInt(userAnswer) === quiz.answer;
    setIsCorrect(correct);
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const nextQuestion = () => {
    startQuiz();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Multiplication</CardTitle>
            <p className="mt-1 font-body text-chocolate/70">
              Learn times tables with visual grids!
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={mode === 'visual' ? 'primary' : 'ghost'}
              onClick={() => setMode('visual')}
            >
              Visual
            </Button>
            <Button
              variant={mode === 'tables' ? 'primary' : 'ghost'}
              onClick={() => setMode('tables')}
            >
              Tables
            </Button>
            <Button
              variant={mode === 'quiz' ? 'primary' : 'ghost'}
              onClick={() => {
                setMode('quiz');
                startQuiz();
              }}
            >
              Quiz
            </Button>
          </div>
        </div>
      </Card>

      {mode === 'visual' && (
        <div className="space-y-6">
          {/* Controls */}
          <Card>
            <CardContent>
              <div className="flex flex-col gap-6">
                {/* Equation display */}
                <div className="flex items-center justify-center gap-3">
                  <span className="font-display text-3xl font-bold text-coral">{visualRows}</span>
                  <span className="font-display text-2xl text-chocolate">×</span>
                  <span className="font-display text-3xl font-bold text-sage">{visualCols}</span>
                  <span className="font-display text-2xl text-chocolate">=</span>
                  <span className="font-display text-3xl font-bold text-sky">{visualRows * visualCols}</span>
                </div>

                {/* Sliders */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Slider
                    value={visualRows}
                    min={1}
                    max={12}
                    onChange={setVisualRows}
                    label="Rows"
                    color="coral"
                  />
                  <Slider
                    value={visualCols}
                    min={1}
                    max={12}
                    onChange={setVisualCols}
                    label="Columns"
                    color="sage"
                  />
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

      {mode === 'tables' && (
        <div className="space-y-6">
          {/* Table Selector */}
          <Card>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setSelectedTable(n)}
                    className={`
                      flex h-10 w-10 items-center justify-center rounded-lg
                      font-display font-bold transition-all duration-200
                      ${
                        selectedTable === n
                          ? 'bg-coral text-cream'
                          : 'bg-cream text-chocolate hover:bg-coral/20'
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
            <CardTitle className="text-center">
              {selectedTable} Times Table
            </CardTitle>
            <CardContent className="mt-4">
              <TimesTableGrid factor={selectedTable} />
            </CardContent>
          </Card>
        </div>
      )}

      {mode === 'quiz' && quiz && (
        <Card>
          <CardContent>
            <div className="flex flex-col items-center gap-6">
              {/* Score */}
              <div className="flex items-center gap-4">
                <span className="font-display text-lg text-chocolate">
                  Score: {score.correct}/{score.total}
                </span>
              </div>

              {/* Question */}
              <div className="text-center">
                <p className="font-display text-4xl font-bold text-chocolate">
                  {quiz.a} × {quiz.b} = ?
                </p>
              </div>

              {/* Visual hint */}
              <DotGrid rows={quiz.a} cols={quiz.b} size="sm" />

              {/* Answer Input */}
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && userAnswer) {
                    if (isCorrect === null) {
                      checkAnswer();
                    } else {
                      nextQuestion();
                    }
                  }
                }}
                disabled={isCorrect !== null}
                className="w-24 rounded-xl border-2 border-chocolate/20 bg-cream px-4 py-3 text-center font-display text-2xl font-bold text-chocolate outline-none focus:border-coral disabled:opacity-50"
                placeholder="?"
                autoFocus
              />

              {/* Feedback */}
              <AnswerFeedback isCorrect={isCorrect} correctAnswer={quiz.answer} />

              {/* Buttons */}
              <div className="flex gap-3">
                {isCorrect === null ? (
                  <Button onClick={checkAnswer} disabled={!userAnswer}>
                    Check Answer
                  </Button>
                ) : (
                  <Button onClick={nextQuestion}>Next Question</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
