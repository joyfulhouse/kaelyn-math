'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardTitle, CardContent, Button, AnswerFeedback, StepIcon } from '@/components/common';
import { SetVisual, PairingVisual, SetComparison } from '@/components/math';
import { generateSetsQuiz, generatePairsQuiz, generateCompareQuiz } from '@/lib/problemGenerators';
import { useAudio } from '@/hooks/useAudio';
import type { SetsQuiz, PairsQuiz, CompareQuiz } from '@/types';

type Mode = 'explore' | 'pairs' | 'groups' | 'compare' | 'quiz';

// Mode narrations for audio feedback
const MODE_NARRATIONS: Record<Mode, string> = {
  explore: 'Explore mode! Build your own sets!',
  pairs: 'Pairs mode! Let\'s make pairs!',
  groups: 'Groups mode! Equal groups everywhere!',
  compare: 'Compare mode! Which set has more?',
  quiz: 'Quiz time! Test yourself!',
};

// Story scenarios for Groups mode
const GROUP_SCENARIOS = [
  { item: 'cookies', container: 'plates', icon: '🍪' },
  { item: 'apples', container: 'baskets', icon: '🍎' },
  { item: 'stars', container: 'flags', icon: '⭐' },
  { item: 'fish', container: 'bowls', icon: '🐟' },
  { item: 'flowers', container: 'vases', icon: '🌸' },
];

export function SetsPairsSection() {
  const { speak, playSound, clickSound } = useAudio();
  const [mode, setMode] = useState<Mode>('explore');

  // Explore mode state
  const [numSets, setNumSets] = useState(3);
  const [itemsPerSet, setItemsPerSet] = useState(4);

  // Pairs mode state
  const [pairNumber, setPairNumber] = useState(8);
  const [showPairs, setShowPairs] = useState(false);

  // Groups mode state
  const [groupScenario, setGroupScenario] = useState(0);
  const [groupSets, setGroupSets] = useState(3);
  const [groupItems, setGroupItems] = useState(4);

  // Compare mode state
  const [compareA, setCompareA] = useState(5);
  const [compareB, setCompareB] = useState(3);
  const [showCompareResult, setShowCompareResult] = useState(false);

  // Quiz mode state
  const [quizType, setQuizType] = useState<'sets' | 'pairs' | 'compare'>('sets');
  const [setsQuiz, setSetsQuiz] = useState<SetsQuiz | null>(null);
  const [pairsQuiz, setPairsQuiz] = useState<PairsQuiz | null>(null);
  const [compareQuiz, setCompareQuiz] = useState<CompareQuiz | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // Narrate when sets/items change in explore mode
  useEffect(() => {
    if (mode === 'explore') {
      const total = numSets * itemsPerSet;
      speak(`${numSets} sets of ${itemsPerSet} equals ${total}`);
    }
  }, [numSets, itemsPerSet, mode, speak]);

  // Narrate when groups change in groups mode
  useEffect(() => {
    if (mode === 'groups') {
      const scenario = GROUP_SCENARIOS[groupScenario];
      const total = groupSets * groupItems;
      speak(`${groupSets} ${scenario.container} with ${groupItems} ${scenario.item} each equals ${total} ${scenario.item} total`);
    }
  }, [groupSets, groupItems, groupScenario, mode, speak]);

  const handleModeChange = (newMode: Mode) => {
    clickSound();
    setMode(newMode);
    speak(MODE_NARRATIONS[newMode]);

    // Reset mode-specific state
    if (newMode === 'pairs') {
      setShowPairs(false);
    }
    if (newMode === 'compare') {
      setShowCompareResult(false);
    }
    if (newMode === 'quiz') {
      startQuiz();
    }
  };

  // Quiz functions
  const startQuiz = useCallback(() => {
    // Rotate through quiz types
    const types: ('sets' | 'pairs' | 'compare')[] = ['sets', 'pairs', 'compare'];
    const nextType = types[Math.floor(Math.random() * types.length)];
    setQuizType(nextType);

    if (nextType === 'sets') {
      const quiz = generateSetsQuiz();
      setSetsQuiz(quiz);
      if (quiz.questionType === 'find-total') {
        speak(`${quiz.numSets} sets of ${quiz.itemsPerSet}. How many total?`);
      } else if (quiz.questionType === 'find-sets') {
        speak(`There are ${quiz.total} items in groups of ${quiz.itemsPerSet}. How many groups?`);
      } else {
        speak(`There are ${quiz.total} items in ${quiz.numSets} equal sets. How many in each set?`);
      }
    } else if (nextType === 'pairs') {
      const quiz = generatePairsQuiz();
      setPairsQuiz(quiz);
      speak(`Is ${quiz.number} even or odd?`);
    } else {
      const quiz = generateCompareQuiz();
      setCompareQuiz(quiz);
      speak(`Set A has ${quiz.setA}. Set B has ${quiz.setB}. Which has more?`);
    }

    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [speak]);

  const handleAnswerSelect = (answer: string | number) => {
    if (isCorrect !== null) return;
    playSound('click');
    setSelectedAnswer(answer);

    let correct = false;
    if (quizType === 'sets' && setsQuiz) {
      correct = answer === setsQuiz.options.find((o) => {
        switch (setsQuiz.questionType) {
          case 'find-total':
            return o === setsQuiz.total;
          case 'find-sets':
            return o === setsQuiz.numSets;
          case 'find-items':
            return o === setsQuiz.itemsPerSet;
        }
      });
    } else if (quizType === 'pairs' && pairsQuiz) {
      correct = (answer === 'even' && pairsQuiz.isEven) || (answer === 'odd' && !pairsQuiz.isEven);
    } else if (quizType === 'compare' && compareQuiz) {
      correct = answer === compareQuiz.answer;
    }

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

  // Control handlers for Explore mode
  const handleSetsChange = (delta: number) => {
    clickSound();
    setNumSets((prev) => Math.max(2, Math.min(6, prev + delta)));
  };

  const handleItemsChange = (delta: number) => {
    clickSound();
    setItemsPerSet((prev) => Math.max(2, Math.min(8, prev + delta)));
  };

  // Control handlers for Pairs mode
  const handlePairNumberChange = (delta: number) => {
    clickSound();
    setPairNumber((prev) => Math.max(1, Math.min(20, prev + delta)));
    setShowPairs(false);
  };

  const handleMakePairs = () => {
    clickSound();
    setShowPairs(true);
    const isEven = pairNumber % 2 === 0;
    const numPairs = Math.floor(pairNumber / 2);
    if (isEven) {
      playSound('celebrate');
      speak(`${pairNumber} makes ${numPairs} pairs! ${pairNumber} is even!`);
    } else {
      speak(`${pairNumber} makes ${numPairs} pairs with 1 left over. ${pairNumber} is odd!`);
    }
  };

  // Control handlers for Groups mode
  const handleGroupScenarioChange = () => {
    clickSound();
    setGroupScenario((prev) => (prev + 1) % GROUP_SCENARIOS.length);
  };

  const handleGroupSetsChange = (delta: number) => {
    clickSound();
    setGroupSets((prev) => Math.max(2, Math.min(6, prev + delta)));
  };

  const handleGroupItemsChange = (delta: number) => {
    clickSound();
    setGroupItems((prev) => Math.max(2, Math.min(8, prev + delta)));
  };

  // Control handlers for Compare mode
  const handleCompareAChange = (delta: number) => {
    clickSound();
    setCompareA((prev) => Math.max(1, Math.min(10, prev + delta)));
    setShowCompareResult(false);
  };

  const handleCompareBChange = (delta: number) => {
    clickSound();
    setCompareB((prev) => Math.max(1, Math.min(10, prev + delta)));
    setShowCompareResult(false);
  };

  const handleCompare = () => {
    clickSound();
    setShowCompareResult(true);
    if (compareA > compareB) {
      speak(`Set A has more! ${compareA} is greater than ${compareB}`);
    } else if (compareA < compareB) {
      speak(`Set B has more! ${compareB} is greater than ${compareA}`);
    } else {
      playSound('celebrate');
      speak(`They're the same! Both have ${compareA}`);
    }
  };

  const scenario = GROUP_SCENARIOS[groupScenario];

  return (
    <div className="space-y-6">
      {/* Header with mode selector */}
      <Card variant="elevated">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <CardTitle>Sets & Pairs</CardTitle>

          {/* Mode buttons */}
          <div className="flex gap-2">
            {/* Explore - Build Sets */}
            <button
              onClick={() => handleModeChange('explore')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                mode === 'explore'
                  ? 'bg-coral text-cream scale-110'
                  : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'
              }`}
              aria-label="Explore mode"
              title="Build Sets"
            >
              {/* Grid icon */}
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </button>

            {/* Pairs - Even/Odd */}
            <button
              onClick={() => handleModeChange('pairs')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                mode === 'pairs'
                  ? 'bg-sage text-cream scale-110'
                  : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'
              }`}
              aria-label="Pairs mode"
              title="Make Pairs"
            >
              {/* Pair icon - two circles connected */}
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="7" cy="12" r="4" />
                <circle cx="17" cy="12" r="4" />
                <rect x="10" y="11" width="4" height="2" />
              </svg>
            </button>

            {/* Groups - Story mode */}
            <button
              onClick={() => handleModeChange('groups')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                mode === 'groups'
                  ? 'bg-yellow text-chocolate scale-110'
                  : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'
              }`}
              aria-label="Groups mode"
              title="Equal Groups"
            >
              {/* Groups icon - multiple containers */}
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="6" width="6" height="12" rx="1" />
                <rect x="9" y="6" width="6" height="12" rx="1" />
                <rect x="16" y="6" width="6" height="12" rx="1" />
              </svg>
            </button>

            {/* Compare */}
            <button
              onClick={() => handleModeChange('compare')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                mode === 'compare'
                  ? 'bg-sky text-cream scale-110'
                  : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'
              }`}
              aria-label="Compare mode"
              title="Compare Sets"
            >
              {/* Compare icon - scale balance */}
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <rect x="11" y="2" width="2" height="18" />
                <rect x="3" y="20" width="18" height="2" />
                <circle cx="6" cy="8" r="3" />
                <circle cx="18" cy="12" r="3" />
              </svg>
            </button>

            {/* Quiz */}
            <button
              onClick={() => handleModeChange('quiz')}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 ${
                mode === 'quiz'
                  ? 'bg-violet text-cream scale-110'
                  : 'bg-chocolate/10 text-chocolate/60 hover:bg-chocolate/20'
              }`}
              aria-label="Quiz mode"
              title="Quiz"
            >
              <StepIcon type="check" size="lg" />
            </button>
          </div>
        </div>
      </Card>

      {/* EXPLORE MODE - Build Sets */}
      {mode === 'explore' && (
        <div className="space-y-6">
          <Card>
            <CardContent>
              <div className="flex flex-col gap-6">
                {/* Equation display */}
                <div className="flex items-center justify-center gap-3">
                  <span className="font-display text-4xl font-bold text-coral">{numSets}</span>
                  <span className="font-display text-2xl text-chocolate">sets</span>
                  <span className="font-display text-3xl text-chocolate">×</span>
                  <span className="font-display text-4xl font-bold text-sage">{itemsPerSet}</span>
                  <span className="font-display text-2xl text-chocolate">items</span>
                  <span className="font-display text-3xl text-chocolate">=</span>
                  <span className="font-display text-4xl font-bold text-sky">
                    {numSets * itemsPerSet}
                  </span>
                  <span className="font-display text-2xl text-chocolate">total</span>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap justify-center gap-8">
                  {/* Number of sets */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-display text-sm text-chocolate/60">Sets</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSetsChange(-1)}
                        disabled={numSets <= 2}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/20 text-coral transition-all hover:bg-coral/30 disabled:opacity-30"
                      >
                        <StepIcon type="subtract" size="md" />
                      </button>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-coral text-cream font-display text-2xl font-bold">
                        {numSets}
                      </div>
                      <button
                        onClick={() => handleSetsChange(1)}
                        disabled={numSets >= 6}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/20 text-coral transition-all hover:bg-coral/30 disabled:opacity-30"
                      >
                        <StepIcon type="add" size="md" />
                      </button>
                    </div>
                  </div>

                  {/* Items per set */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-display text-sm text-chocolate/60">Items per set</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleItemsChange(-1)}
                        disabled={itemsPerSet <= 2}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-sage transition-all hover:bg-sage/30 disabled:opacity-30"
                      >
                        <StepIcon type="subtract" size="md" />
                      </button>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage text-cream font-display text-2xl font-bold">
                        {itemsPerSet}
                      </div>
                      <button
                        onClick={() => handleItemsChange(1)}
                        disabled={itemsPerSet >= 8}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-sage transition-all hover:bg-sage/30 disabled:opacity-30"
                      >
                        <StepIcon type="add" size="md" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual display */}
          <Card>
            <CardContent>
              <SetVisual
                numSets={numSets}
                itemsPerSet={itemsPerSet}
                animated
                showTotal={false}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* PAIRS MODE - Even/Odd */}
      {mode === 'pairs' && (
        <div className="space-y-6">
          <Card>
            <CardContent>
              <div className="flex flex-col items-center gap-6">
                {/* Number selector */}
                <div className="flex flex-col items-center gap-2">
                  <span className="font-display text-lg text-chocolate/60">How many items?</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handlePairNumberChange(-1)}
                      disabled={pairNumber <= 1}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-coral/20 text-coral transition-all hover:bg-coral/30 disabled:opacity-30"
                    >
                      <StepIcon type="subtract" size="lg" />
                    </button>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-coral text-cream font-display text-4xl font-bold">
                      {pairNumber}
                    </div>
                    <button
                      onClick={() => handlePairNumberChange(1)}
                      disabled={pairNumber >= 20}
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-coral/20 text-coral transition-all hover:bg-coral/30 disabled:opacity-30"
                    >
                      <StepIcon type="add" size="lg" />
                    </button>
                  </div>
                </div>

                {/* Make Pairs button */}
                {!showPairs && (
                  <Button onClick={handleMakePairs} size="lg">
                    Make Pairs!
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pairing visual */}
          <Card>
            <CardContent>
              <PairingVisual
                number={pairNumber}
                showPairs={showPairs}
                animated
                size="lg"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* GROUPS MODE - Story scenarios */}
      {mode === 'groups' && (
        <div className="space-y-6">
          <Card>
            <CardContent>
              <div className="flex flex-col items-center gap-6">
                {/* Scenario selector */}
                <button
                  onClick={handleGroupScenarioChange}
                  className="flex items-center gap-2 rounded-full bg-yellow/20 px-6 py-3 font-display text-lg text-chocolate transition-all hover:bg-yellow/30"
                >
                  <span className="text-2xl">{scenario.icon}</span>
                  <span>{scenario.item} in {scenario.container}</span>
                  <span className="text-chocolate/40">↻</span>
                </button>

                {/* Story text */}
                <div className="text-center">
                  <p className="font-body text-lg text-chocolate">
                    There are{' '}
                    <span className="font-bold text-coral">{groupSets} {scenario.container}</span>
                    {' '}with{' '}
                    <span className="font-bold text-sage">{groupItems} {scenario.item}</span>
                    {' '}in each.
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold text-chocolate">
                    How many {scenario.item} in all?{' '}
                    <span className="text-sky">{groupSets * groupItems}</span>
                  </p>
                </div>

                {/* Controls */}
                <div className="flex flex-wrap justify-center gap-8">
                  {/* Number of containers */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-display text-sm text-chocolate/60">{scenario.container}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleGroupSetsChange(-1)}
                        disabled={groupSets <= 2}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/20 text-coral transition-all hover:bg-coral/30 disabled:opacity-30"
                      >
                        <StepIcon type="subtract" size="md" />
                      </button>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-coral text-cream font-display text-xl font-bold">
                        {groupSets}
                      </div>
                      <button
                        onClick={() => handleGroupSetsChange(1)}
                        disabled={groupSets >= 6}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/20 text-coral transition-all hover:bg-coral/30 disabled:opacity-30"
                      >
                        <StepIcon type="add" size="md" />
                      </button>
                    </div>
                  </div>

                  {/* Items per container */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-display text-sm text-chocolate/60">{scenario.item} each</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleGroupItemsChange(-1)}
                        disabled={groupItems <= 2}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-sage transition-all hover:bg-sage/30 disabled:opacity-30"
                      >
                        <StepIcon type="subtract" size="md" />
                      </button>
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-cream font-display text-xl font-bold">
                        {groupItems}
                      </div>
                      <button
                        onClick={() => handleGroupItemsChange(1)}
                        disabled={groupItems >= 8}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/20 text-sage transition-all hover:bg-sage/30 disabled:opacity-30"
                      >
                        <StepIcon type="add" size="md" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Equation */}
                <div className="rounded-xl bg-cream px-6 py-3 font-display text-xl text-chocolate">
                  <span className="font-bold text-coral">{groupSets}</span>
                  <span className="mx-2">×</span>
                  <span className="font-bold text-sage">{groupItems}</span>
                  <span className="mx-2">=</span>
                  <span className="font-bold text-sky">{groupSets * groupItems}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual display */}
          <Card>
            <CardContent>
              <SetVisual
                numSets={groupSets}
                itemsPerSet={groupItems}
                animated
                showTotal={false}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* COMPARE MODE */}
      {mode === 'compare' && (
        <div className="space-y-6">
          <Card>
            <CardContent>
              <div className="flex flex-col items-center gap-6">
                {/* Controls for both sets */}
                <div className="flex flex-wrap justify-center gap-12">
                  {/* Set A */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-display text-lg font-bold text-coral">Set A</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCompareAChange(-1)}
                        disabled={compareA <= 1}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/20 text-coral transition-all hover:bg-coral/30 disabled:opacity-30"
                      >
                        <StepIcon type="subtract" size="md" />
                      </button>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-coral text-cream font-display text-3xl font-bold">
                        {compareA}
                      </div>
                      <button
                        onClick={() => handleCompareAChange(1)}
                        disabled={compareA >= 10}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/20 text-coral transition-all hover:bg-coral/30 disabled:opacity-30"
                      >
                        <StepIcon type="add" size="md" />
                      </button>
                    </div>
                  </div>

                  {/* Set B */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-display text-lg font-bold text-sky">Set B</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCompareBChange(-1)}
                        disabled={compareB <= 1}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-sky/20 text-sky transition-all hover:bg-sky/30 disabled:opacity-30"
                      >
                        <StepIcon type="subtract" size="md" />
                      </button>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky text-cream font-display text-3xl font-bold">
                        {compareB}
                      </div>
                      <button
                        onClick={() => handleCompareBChange(1)}
                        disabled={compareB >= 10}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-sky/20 text-sky transition-all hover:bg-sky/30 disabled:opacity-30"
                      >
                        <StepIcon type="add" size="md" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Compare button */}
                {!showCompareResult && (
                  <Button onClick={handleCompare} size="lg">
                    Compare!
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Visual comparison */}
          <Card>
            <CardContent>
              <SetComparison
                setA={compareA}
                setB={compareB}
                showResult={showCompareResult}
                highlightDifference={showCompareResult}
                animated
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* QUIZ MODE */}
      {mode === 'quiz' && (
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

              {/* SETS QUIZ */}
              {quizType === 'sets' && setsQuiz && (
                <>
                  {/* Visual hint */}
                  <SetVisual
                    numSets={setsQuiz.numSets}
                    itemsPerSet={setsQuiz.itemsPerSet}
                    size="sm"
                    showTotal={false}
                    showLabels={false}
                  />

                  {/* Question */}
                  <div className="text-center font-display text-xl text-chocolate">
                    {setsQuiz.questionType === 'find-total' && (
                      <>
                        <span className="font-bold text-coral">{setsQuiz.numSets}</span> sets of{' '}
                        <span className="font-bold text-sage">{setsQuiz.itemsPerSet}</span>.
                        <br />How many total?
                      </>
                    )}
                    {setsQuiz.questionType === 'find-sets' && (
                      <>
                        <span className="font-bold text-sky">{setsQuiz.total}</span> items in groups of{' '}
                        <span className="font-bold text-sage">{setsQuiz.itemsPerSet}</span>.
                        <br />How many groups?
                      </>
                    )}
                    {setsQuiz.questionType === 'find-items' && (
                      <>
                        <span className="font-bold text-sky">{setsQuiz.total}</span> items in{' '}
                        <span className="font-bold text-coral">{setsQuiz.numSets}</span> equal sets.
                        <br />How many in each set?
                      </>
                    )}
                  </div>

                  {/* Options */}
                  <div className="flex flex-wrap justify-center gap-4">
                    {setsQuiz.options.map((option, i) => {
                      const correctAnswer =
                        setsQuiz.questionType === 'find-total'
                          ? setsQuiz.total
                          : setsQuiz.questionType === 'find-sets'
                          ? setsQuiz.numSets
                          : setsQuiz.itemsPerSet;

                      return (
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
                                : isCorrect !== null && option === correctAnswer
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
                </>
              )}

              {/* PAIRS QUIZ */}
              {quizType === 'pairs' && pairsQuiz && (
                <>
                  {/* Visual hint */}
                  <PairingVisual
                    number={pairsQuiz.number}
                    showPairs={false}
                    size="sm"
                  />

                  {/* Question */}
                  <div className="text-center font-display text-2xl text-chocolate">
                    Is <span className="font-bold text-coral">{pairsQuiz.number}</span> even or odd?
                  </div>

                  {/* Options */}
                  <div className="flex justify-center gap-6">
                    {(['even', 'odd'] as const).map((option) => {
                      const isThisCorrect = option === 'even' ? pairsQuiz.isEven : !pairsQuiz.isEven;
                      return (
                        <button
                          key={option}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={isCorrect !== null}
                          className={`
                            flex h-20 w-32 items-center justify-center rounded-2xl
                            font-display text-2xl font-bold capitalize transition-all duration-200
                            ${
                              selectedAnswer === option
                                ? isCorrect
                                  ? 'bg-sage text-cream scale-110'
                                  : 'bg-coral text-cream animate-shake'
                                : isCorrect !== null && isThisCorrect
                                ? 'bg-sage text-cream scale-110'
                                : option === 'even'
                                ? 'bg-sage/20 text-sage hover:bg-sage/30 hover:scale-105'
                                : 'bg-coral/20 text-coral hover:bg-coral/30 hover:scale-105'
                            }
                            disabled:cursor-not-allowed
                          `}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* COMPARE QUIZ */}
              {quizType === 'compare' && compareQuiz && (
                <>
                  {/* Visual hint */}
                  <SetComparison
                    setA={compareQuiz.setA}
                    setB={compareQuiz.setB}
                    showResult={false}
                    highlightDifference={false}
                  />

                  {/* Question */}
                  <div className="text-center font-display text-xl text-chocolate">
                    Which set has <span className="font-bold">more</span>?
                  </div>

                  {/* Options */}
                  <div className="flex flex-wrap justify-center gap-4">
                    {(['more', 'fewer', 'same'] as const).map((option) => {
                      const labels = {
                        more: 'Set A has more',
                        fewer: 'Set B has more',
                        same: 'They\'re the same',
                      };
                      return (
                        <button
                          key={option}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={isCorrect !== null}
                          className={`
                            flex h-16 items-center justify-center rounded-2xl px-6
                            font-display text-lg font-bold transition-all duration-200
                            ${
                              selectedAnswer === option
                                ? isCorrect
                                  ? 'bg-sage text-cream scale-110'
                                  : 'bg-coral text-cream animate-shake'
                                : isCorrect !== null && option === compareQuiz.answer
                                ? 'bg-sage text-cream scale-110'
                                : option === 'more'
                                ? 'bg-coral/20 text-coral hover:bg-coral/30 hover:scale-105'
                                : option === 'fewer'
                                ? 'bg-sky/20 text-sky hover:bg-sky/30 hover:scale-105'
                                : 'bg-yellow/20 text-chocolate hover:bg-yellow/30 hover:scale-105'
                            }
                            disabled:cursor-not-allowed
                          `}
                        >
                          {labels[option]}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Feedback */}
              <AnswerFeedback isCorrect={isCorrect} showText={false} />

              {/* Next Button */}
              {isCorrect !== null && (
                <Button onClick={nextQuestion} size="lg" aria-label="Next question">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
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
