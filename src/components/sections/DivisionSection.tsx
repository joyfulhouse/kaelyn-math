'use client';

import { useState, useCallback } from 'react';
import { Card, CardTitle, CardContent, Button, Slider, AnswerFeedback } from '@/components/common';
import { GroupingVisual, SharingStory } from '@/components/math';
import { generateDivisionQuiz } from '@/lib/problemGenerators';
import type { DivisionQuiz } from '@/types';

type Mode = 'story' | 'visual' | 'quiz';

export function DivisionSection() {
  const [mode, setMode] = useState<Mode>('story');

  // Story/Visual mode state
  const [total, setTotal] = useState(12);
  const [groups, setGroups] = useState(3);

  // Quiz mode state
  const [quiz, setQuiz] = useState<DivisionQuiz | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const startQuiz = useCallback(() => {
    setQuiz(generateDivisionQuiz());
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
            <CardTitle>Division</CardTitle>
            <p className="mt-1 font-body text-chocolate/70">
              Learn to share and divide equally!
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={mode === 'story' ? 'primary' : 'ghost'}
              onClick={() => setMode('story')}
            >
              Story
            </Button>
            <Button
              variant={mode === 'visual' ? 'primary' : 'ghost'}
              onClick={() => setMode('visual')}
            >
              Visual
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

      {mode === 'story' && (
        <div className="space-y-6">
          {/* Controls */}
          <Card>
            <CardContent>
              <div className="flex flex-col gap-6">
                {/* Equation display */}
                <div className="flex items-center justify-center gap-3">
                  <span className="font-display text-3xl font-bold text-coral">{total}</span>
                  <span className="font-display text-2xl text-chocolate">÷</span>
                  <span className="font-display text-3xl font-bold text-sage">{groups}</span>
                  <span className="font-display text-2xl text-chocolate">=</span>
                  <span className="font-display text-3xl font-bold text-sky">
                    {Math.floor(total / groups)}
                    {total % groups > 0 && (
                      <span className="ml-1 text-lg text-yellow">R{total % groups}</span>
                    )}
                  </span>
                </div>

                {/* Sliders */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Slider
                    value={total}
                    min={1}
                    max={100}
                    onChange={setTotal}
                    label="Total items"
                    color="coral"
                  />
                  <Slider
                    value={groups}
                    min={1}
                    max={12}
                    onChange={setGroups}
                    label="Groups"
                    color="sage"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Story */}
          <SharingStory total={total} recipients={groups} />

          {/* Visual */}
          <Card>
            <CardContent>
              <GroupingVisual total={total} groups={groups} animated />
            </CardContent>
          </Card>
        </div>
      )}

      {mode === 'visual' && (
        <div className="space-y-6">
          {/* Controls */}
          <Card>
            <CardContent>
              <div className="flex flex-col gap-6">
                {/* Equation display */}
                <div className="flex items-center justify-center gap-3">
                  <span className="font-display text-3xl font-bold text-coral">{total}</span>
                  <span className="font-display text-2xl text-chocolate">÷</span>
                  <span className="font-display text-3xl font-bold text-sage">{groups}</span>
                  <span className="font-display text-2xl text-chocolate">=</span>
                  <span className="font-display text-3xl font-bold text-sky">
                    {Math.floor(total / groups)}
                    {total % groups > 0 && (
                      <span className="ml-1 text-lg text-yellow">R{total % groups}</span>
                    )}
                  </span>
                </div>

                {/* Sliders */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Slider
                    value={total}
                    min={1}
                    max={100}
                    onChange={setTotal}
                    label="Total items"
                    color="coral"
                  />
                  <Slider
                    value={groups}
                    min={1}
                    max={12}
                    onChange={setGroups}
                    label="Groups"
                    color="sage"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Only */}
          <Card>
            <CardContent>
              <GroupingVisual total={total} groups={groups} animated showLabels />
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
                  {quiz.total} ÷ {quiz.groups} = ?
                </p>
              </div>

              {/* Visual hint */}
              <GroupingVisual
                total={quiz.total}
                groups={quiz.groups}
                showLabels={false}
              />

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
