'use client';

import { useState, useCallback } from 'react';
import { Card, CardTitle, CardContent, Button, AnswerFeedback } from '@/components/common';
import { PlaceValueDisplay, PlaceValueBlocks } from '@/components/math';
import { generatePlaceValueQuiz } from '@/lib/problemGenerators';
import { parseIntoPlaceValues } from '@/lib/mathUtils';
import type { PlaceValueQuiz, PlaceValue } from '@/types';

type Mode = 'explore' | 'quiz';

export function NumberPlacesSection() {
  const [mode, setMode] = useState<Mode>('explore');
  const [exploreNumber, setExploreNumber] = useState(1234);
  const [highlightPlace, setHighlightPlace] = useState<PlaceValue | undefined>();

  // Quiz state
  const [quiz, setQuiz] = useState<PlaceValueQuiz | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const startQuiz = useCallback(() => {
    setQuiz(generatePlaceValueQuiz(9999));
    setSelectedAnswer(null);
    setIsCorrect(null);
    setMode('quiz');
  }, []);

  const handleAnswerSelect = (answer: number) => {
    if (isCorrect !== null) return; // Already answered

    setSelectedAnswer(answer);
    const correct = answer === quiz?.answer;
    setIsCorrect(correct);
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const nextQuestion = () => {
    setQuiz(generatePlaceValueQuiz(9999));
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const randomNumber = () => {
    setExploreNumber(Math.floor(Math.random() * 9999) + 1);
  };

  const placeLabels: Record<PlaceValue, string> = {
    thousands: 'thousands',
    hundreds: 'hundreds',
    tens: 'tens',
    ones: 'ones',
  };

  const placeValues = parseIntoPlaceValues(exploreNumber);
  const placeMultipliers: Record<PlaceValue, number> = {
    thousands: 1000,
    hundreds: 100,
    tens: 10,
    ones: 1,
  };
  const placeColors: Record<PlaceValue, string> = {
    thousands: 'text-coral',
    hundreds: 'text-yellow',
    tens: 'text-sage',
    ones: 'text-sky',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div>
            <CardTitle>Number Places</CardTitle>
            <p className="mt-1 font-body text-chocolate/70">
              Learn about ones, tens, hundreds, and thousands!
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={mode === 'explore' ? 'primary' : 'ghost'}
              onClick={() => setMode('explore')}
            >
              Explore
            </Button>
            <Button
              variant={mode === 'quiz' ? 'primary' : 'ghost'}
              onClick={startQuiz}
            >
              Quiz
            </Button>
          </div>
        </div>
      </Card>

      {mode === 'explore' ? (
        /* Explore Mode */
        <div className="space-y-6">
          {/* Number Input */}
          <Card>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <label className="font-body text-chocolate/70">
                  Enter a number to explore (1-9999):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="9999"
                    value={exploreNumber}
                    onChange={(e) => setExploreNumber(Math.min(9999, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-32 rounded-xl border-2 border-chocolate/20 bg-cream px-4 py-2 text-center font-display text-2xl font-bold text-chocolate outline-none focus:border-coral"
                  />
                  <Button variant="secondary" size="sm" onClick={randomNumber}>
                    Random
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Place Value Display */}
          <Card>
            <CardTitle className="text-center">Place Values</CardTitle>
            <CardContent className="mt-6">
              <div className="flex justify-center">
                <PlaceValueDisplay
                  number={exploreNumber}
                  highlightPlace={highlightPlace}
                  showLabels
                  size="lg"
                />
              </div>

              {/* Place selector buttons */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {(['thousands', 'hundreds', 'tens', 'ones'] as PlaceValue[]).map((place) => (
                  <Button
                    key={place}
                    variant={highlightPlace === place ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setHighlightPlace(highlightPlace === place ? undefined : place)}
                  >
                    {placeLabels[place]}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Place Value Breakdown */}
          <Card>
            <CardTitle className="text-center">Place Value Breakdown</CardTitle>
            <CardContent className="mt-6">
              <div className="space-y-4">
                <p className="text-center font-body text-lg text-chocolate">
                  The number <strong className="text-2xl">{exploreNumber}</strong> has:
                </p>
                <ul className="space-y-2">
                  {(['thousands', 'hundreds', 'tens', 'ones'] as PlaceValue[]).map((place) => (
                    <li key={place} className="flex items-center justify-center gap-2 font-body text-chocolate">
                      <span className={`font-bold ${placeColors[place]}`}>
                        {placeValues[place]}
                      </span>
                      <span>{placeLabels[place]}</span>
                      <span className="text-chocolate/60">
                        ({placeValues[place]} × {placeMultipliers[place].toLocaleString()} = {(placeValues[place] * placeMultipliers[place]).toLocaleString()})
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-center font-display text-xl font-bold text-chocolate">
                  {(placeValues.thousands * 1000).toLocaleString()} + {(placeValues.hundreds * 100).toLocaleString()} + {placeValues.tens * 10} + {placeValues.ones} = <span className="text-coral">{exploreNumber.toLocaleString()}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Visual Blocks */}
          <Card>
            <CardTitle className="text-center">Visual Blocks</CardTitle>
            <CardContent className="mt-6">
              <PlaceValueBlocks number={exploreNumber} animated />
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Quiz Mode */
        <Card>
          <CardContent>
            {quiz && (
              <div className="flex flex-col items-center gap-6">
                {/* Score */}
                <div className="flex items-center gap-4">
                  <span className="font-display text-lg text-chocolate">
                    Score: {score.correct}/{score.total}
                  </span>
                </div>

                {/* Question */}
                <div className="text-center">
                  <p className="font-body text-lg text-chocolate/70">
                    What digit is in the <span className="font-bold text-coral">{quiz.place}</span> place?
                  </p>
                  <div className="mt-4">
                    <PlaceValueDisplay number={quiz.number} size="lg" showLabels={false} />
                  </div>
                </div>

                {/* Answer Options */}
                <div className="flex flex-wrap justify-center gap-3">
                  {quiz.options.map((option, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={isCorrect !== null}
                      className={`
                        flex h-16 w-16 items-center justify-center rounded-xl
                        font-display text-2xl font-bold transition-all duration-200
                        ${
                          selectedAnswer === option
                            ? isCorrect
                              ? 'bg-sage text-cream'
                              : 'bg-coral text-cream'
                            : isCorrect !== null && option === quiz.answer
                              ? 'bg-sage text-cream'
                              : 'bg-cream text-chocolate hover:bg-yellow/20'
                        }
                        disabled:cursor-not-allowed
                      `}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* Feedback */}
                <AnswerFeedback isCorrect={isCorrect} correctAnswer={quiz.answer} />

                {/* Next Button */}
                {isCorrect !== null && (
                  <Button onClick={nextQuestion}>Next Question</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
