'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardTitle, CardContent, Button, AnswerFeedback, StepIcon } from '@/components/common';
import { PlaceValueDisplay, PlaceValueBlocks } from '@/components/math';
import { generatePlaceValueQuiz } from '@/lib/problemGenerators';
import { parseIntoPlaceValues } from '@/lib/mathUtils';
import { useAudio } from '@/hooks/useAudio';
import type { PlaceValueQuiz, PlaceValue } from '@/types';

type Mode = 'explore' | 'quiz';

// Audio narrations for place values
const PLACE_NARRATIONS: Record<PlaceValue, string> = {
  thousands: 'Thousands! The biggest place!',
  hundreds: 'Hundreds!',
  tens: 'Tens!',
  ones: 'Ones! The smallest place!',
};

export function NumberPlacesSection() {
  const { speak, playSound, clickSound } = useAudio();
  const [mode, setMode] = useState<Mode>('explore');
  const [exploreNumber, setExploreNumber] = useState(1234);
  const [highlightPlace, setHighlightPlace] = useState<PlaceValue | undefined>();

  // Quiz state
  const [quiz, setQuiz] = useState<PlaceValueQuiz | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Narrate quiz question when it changes
  useEffect(() => {
    if (quiz && mode === 'quiz' && isCorrect === null) {
      speak(`Which number is in the ${quiz.place} place?`);
    }
  }, [quiz, mode, isCorrect, speak]);

  const startQuiz = useCallback(() => {
    clickSound();
    setQuiz(generatePlaceValueQuiz(9999));
    setSelectedIndex(null);
    setIsCorrect(null);
    setMode('quiz');
  }, [clickSound]);

  const handleAnswerSelect = (index: number, answer: number) => {
    if (isCorrect !== null) return;
    playSound('click');

    setSelectedIndex(index);
    const correct = answer === quiz?.answer;
    setIsCorrect(correct);
    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const nextQuestion = () => {
    clickSound();
    setQuiz(generatePlaceValueQuiz(9999));
    setSelectedIndex(null);
    setIsCorrect(null);
  };

  const randomNumber = () => {
    clickSound();
    const newNum = Math.floor(Math.random() * 9999) + 1;
    setExploreNumber(newNum);
    speak(`${newNum}`);
  };

  const handlePlaceClick = (place: PlaceValue) => {
    clickSound();
    if (highlightPlace === place) {
      setHighlightPlace(undefined);
    } else {
      setHighlightPlace(place);
      speak(PLACE_NARRATIONS[place]);
    }
  };

  const placeValues = parseIntoPlaceValues(exploreNumber);
  const placeBgColors: Record<PlaceValue, string> = {
    thousands: 'bg-coral',
    hundreds: 'bg-yellow',
    tens: 'bg-sage',
    ones: 'bg-sky',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="elevated">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <CardTitle>Number Places</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={mode === 'explore' ? 'primary' : 'ghost'}
              onClick={() => { clickSound(); setMode('explore'); }}
              aria-label="Explore mode"
            >
              <StepIcon type="start" size="md" />
            </Button>
            <Button
              variant={mode === 'quiz' ? 'primary' : 'ghost'}
              onClick={startQuiz}
              aria-label="Quiz mode"
            >
              <StepIcon type="check" size="md" />
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
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="9999"
                    value={exploreNumber}
                    onChange={(e) => {
                      const val = Math.min(9999, Math.max(1, parseInt(e.target.value) || 1));
                      setExploreNumber(val);
                    }}
                    className="w-36 rounded-xl border-2 border-chocolate/20 bg-cream px-4 py-3 text-center font-display text-3xl font-bold text-chocolate outline-none focus:border-coral"
                  />
                  <Button variant="secondary" size="lg" onClick={randomNumber} aria-label="Random number">
                    🎲
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Place Value Display */}
          <Card>
            <CardContent>
              <div className="flex justify-center">
                <PlaceValueDisplay
                  number={exploreNumber}
                  highlightPlace={highlightPlace}
                  showLabels={false}
                  size="lg"
                />
              </div>

              {/* Place selector buttons - visual icons */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {(['thousands', 'hundreds', 'tens', 'ones'] as PlaceValue[]).map((place) => (
                  <button
                    key={place}
                    onClick={() => handlePlaceClick(place)}
                    className={`
                      flex h-14 w-14 items-center justify-center rounded-full
                      transition-all duration-200 hover:scale-110
                      ${highlightPlace === place
                        ? `${placeBgColors[place]} text-cream scale-110`
                        : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'}
                    `}
                    aria-label={place}
                  >
                    <StepIcon type={place === 'thousands' ? 'thousands' : place === 'hundreds' ? 'hundreds' : place === 'tens' ? 'tens' : 'ones'} size="lg" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Visual Place Value Breakdown - dots instead of text */}
          <Card>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-4">
                {(['thousands', 'hundreds', 'tens', 'ones'] as PlaceValue[]).map((place) => (
                  <div
                    key={place}
                    className={`flex flex-col items-center gap-2 rounded-xl p-4 ${
                      highlightPlace === place ? 'bg-chocolate/10' : ''
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full ${placeBgColors[place]} text-cream`}>
                      <span className="font-display text-xl font-bold">{placeValues[place]}</span>
                    </div>
                    <StepIcon type={place === 'thousands' ? 'thousands' : place === 'hundreds' ? 'hundreds' : place === 'tens' ? 'tens' : 'ones'} size="sm" className="text-chocolate/40" />
                  </div>
                ))}
              </div>
              {/* Visual equation with large numbers */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 font-display text-2xl font-bold">
                <span className="text-coral">{placeValues.thousands}</span>
                <span className="text-chocolate/40">×</span>
                <span className="text-chocolate/60">1000</span>
                <span className="text-chocolate/40">+</span>
                <span className="text-yellow">{placeValues.hundreds}</span>
                <span className="text-chocolate/40">×</span>
                <span className="text-chocolate/60">100</span>
                <span className="text-chocolate/40">+</span>
                <span className="text-sage">{placeValues.tens}</span>
                <span className="text-chocolate/40">×</span>
                <span className="text-chocolate/60">10</span>
                <span className="text-chocolate/40">+</span>
                <span className="text-sky">{placeValues.ones}</span>
                <span className="text-chocolate/40">=</span>
                <span className="text-coral text-3xl">{exploreNumber.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Visual Blocks */}
          <Card>
            <CardContent>
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
                {/* Score - visual dots */}
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

                {/* Visual question indicator - highlight the place being asked */}
                <div className="flex items-center gap-3">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full ${placeBgColors[quiz.place]} text-cream animate-pulse`}>
                    <StepIcon type={quiz.place === 'thousands' ? 'thousands' : quiz.place === 'hundreds' ? 'hundreds' : quiz.place === 'tens' ? 'tens' : 'ones'} size="lg" />
                  </div>
                  <span className="font-display text-3xl text-chocolate/40">?</span>
                </div>

                {/* Number display - only highlight place AFTER answering */}
                <div className="mt-2">
                  <PlaceValueDisplay
                    number={quiz.number}
                    size="lg"
                    showLabels={false}
                    highlightPlace={isCorrect !== null ? quiz.place : undefined}
                  />
                </div>

                {/* Answer Options - large touch targets, track by index */}
                <div className="flex flex-wrap justify-center gap-4">
                  {quiz.options.map((option, i) => {
                    const isSelected = selectedIndex === i;
                    const isCorrectAnswer = option === quiz.answer;
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswerSelect(i, option)}
                        disabled={isCorrect !== null}
                        className={`
                          flex h-20 w-20 items-center justify-center rounded-2xl
                          font-display text-3xl font-bold transition-all duration-200
                          ${
                            isSelected
                              ? isCorrect
                                ? 'bg-sage text-cream scale-110'
                                : 'bg-coral text-cream animate-shake'
                              : isCorrect !== null && isCorrectAnswer
                                ? 'bg-sage text-cream scale-110'
                                : 'bg-cream text-chocolate shadow-soft hover:scale-105 hover:shadow-md'
                          }
                          disabled:cursor-not-allowed
                        `}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback - icon only, audio handles the rest */}
                <AnswerFeedback isCorrect={isCorrect} showText={false} />

                {/* Next Button - arrow icon */}
                {isCorrect !== null && (
                  <Button onClick={nextQuestion} size="lg" aria-label="Next question">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
