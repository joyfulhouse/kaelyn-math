'use client';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import {
  updatePhonics,
  addPhonemeLearned,
  addWordBlended,
  addStars,
} from '@/store/sessionSlice';
import { Card, Button, Feedback } from '@/components/common';
import { useAudio } from '@/hooks/useAudio';
import {
  getPhonicsUnit,
  getTotalUnits,
  isPhonemeUnit,
  isWordUnit,
  getPhoneme,
  segmentWord,
  generateSoundQuiz,
  getRandomPhoneme,
  getRandomWord,
  getWordDistractors,
  getRandomFallbackWord,
  shuffleWords,
  PHONEME_COLORS,
  PHONICS_UNITS,
  type PhonicsWord,
  type SoundQuiz,
} from '@/lib/phonicsData';

type Mode = 'explore' | 'quiz' | 'blend';

interface BlendState {
  word: PhonicsWord;
  currentPhonemeIndex: number;
  phonemesSounded: boolean[];
  isBlending: boolean;
  blendComplete: boolean;
}

export function PhonicsSection() {
  const dispatch = useAppDispatch();
  const { speak, clickSound, playSound } = useAudio();
  const phonicsProgress = useAppSelector((state) => state.session.phonics);

  const [mode, setMode] = useState<Mode>('explore');
  const [currentUnit, setCurrentUnit] = useState(phonicsProgress.currentUnit || 1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quiz, setQuiz] = useState<SoundQuiz | null>(null);
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [streak, setStreak] = useState(0);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [blendState, setBlendState] = useState<BlendState | null>(null);

  const unit = getPhonicsUnit(currentUnit);
  const totalUnits = getTotalUnits();
  const isPhoneme = unit ? isPhonemeUnit(unit) : false;
  const isWord = unit ? isWordUnit(unit) : false;

  // Get current item (phoneme or word)
  const currentPhoneme = isPhoneme && unit?.phonemes ? unit.phonemes[currentIndex] : null;
  const currentWord = isWord && unit?.words ? unit.words[currentIndex] : null;
  const itemCount = isPhoneme ? unit?.phonemes?.length || 0 : unit?.words?.length || 0;

  // Speak phoneme/word when it changes in explore mode
  useEffect(() => {
    if (mode === 'explore') {
      const timer = setTimeout(() => {
        if (currentPhoneme) {
          speak(currentPhoneme.sound);
        } else if (currentWord) {
          speak(currentWord.word);
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentPhoneme, currentWord, mode, speak]);

  // Helper to create initial blend state for a word
  const createBlendState = (word: PhonicsWord): BlendState => ({
    word,
    currentPhonemeIndex: 0,
    phonemesSounded: new Array(word.phonemes.length).fill(false),
    isBlending: false,
    blendComplete: false,
  });

  const handleUnitChange = (newUnit: number) => {
    clickSound();
    setCurrentUnit(newUnit);
    setCurrentIndex(0);
    setMode('explore');
    dispatch(updatePhonics({ currentUnit: newUnit }));
    const unitInfo = getPhonicsUnit(newUnit);
    if (unitInfo) {
      speak(unitInfo.name);
    }
  };

  const handleNextItem = () => {
    clickSound();
    if (currentIndex < itemCount - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevItem = () => {
    clickSound();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(itemCount - 1);
    }
  };

  const handleSpeakCurrent = () => {
    clickSound();
    if (currentPhoneme) {
      speak(currentPhoneme.sound);
      dispatch(addPhonemeLearned(currentPhoneme.symbol));
    } else if (currentWord) {
      speak(currentWord.word);
    }
  };

  // Quiz generation - not using useCallback to avoid memoization issues with derived values
  const generateQuizQuestion = () => {
    if (!unit) return;

    if (isPhoneme && unit.phonemes) {
      const target = getRandomPhoneme(unit);
      if (target) {
        const quizData = generateSoundQuiz(target, unit.phonemes);
        setQuiz(quizData);
        setFeedback(null);
        setSelectedQuizIndex(null);
        setTimeout(() => {
          speak(`What sound does ${target.symbol} make?`);
        }, 500);
      }
    } else if (isWord && unit.words) {
      // Word quiz: match word to phonemes or recognize word
      const word = getRandomWord(unit);
      if (word) {
        // Create a "find the word" quiz using utility functions
        const distractors = getWordDistractors(unit, word.word, 3);

        // Add fallback words if needed
        while (distractors.length < 3) {
          const fallback = getRandomFallbackWord(unit.unit);
          if (
            fallback &&
            !distractors.some((d) => d.word === fallback.word) &&
            fallback.word !== word.word
          ) {
            distractors.push(fallback);
          } else {
            break;
          }
        }

        // Shuffle options using the utility function
        const allOptions = [word, ...distractors];
        const options = shuffleWords(allOptions);
        const correctIndex = options.findIndex((o) => o.word === word.word);

        // Create a pseudo SoundQuiz for word recognition
        setQuiz({
          target: {
            symbol: word.word,
            sound: word.word,
            type: 'vowel',
            exampleWord: word.word,
          },
          options: options.map((w) => ({
            symbol: w.word,
            sound: w.word,
            type: 'vowel' as const,
            exampleWord: w.word,
          })),
          correctIndex,
        });
        setFeedback(null);
        setSelectedQuizIndex(null);
        setTimeout(() => {
          speak(`Find the word: ${word.word}`);
        }, 500);
      }
    }
  };

  const handleStartQuiz = () => {
    clickSound();
    setMode('quiz');
    setQuizScore({ correct: 0, total: 0 });
    setStreak(0);
    generateQuizQuestion();
  };

  const handleQuizAnswer = (selectedIndex: number) => {
    if (!quiz || feedback) return;

    setSelectedQuizIndex(selectedIndex);
    const isCorrect = selectedIndex === quiz.correctIndex;
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) {
      playSound('correct');
      speak('Great job!');
      setStreak((s) => s + 1);
      setQuizScore((s) => ({ correct: s.correct + 1, total: s.total + 1 }));

      if (isPhoneme) {
        dispatch(addPhonemeLearned(quiz.target.symbol));
      }
      dispatch(
        updatePhonics({
          questionsCorrect: phonicsProgress.questionsCorrect + 1,
          questionsAttempted: phonicsProgress.questionsAttempted + 1,
          bestStreak: Math.max(phonicsProgress.bestStreak, streak + 1),
        })
      );

      if ((streak + 1) % 5 === 0) {
        dispatch(addStars(1));
        playSound('celebrate');
      }
    } else {
      playSound('incorrect');
      const correctOption = quiz.options[quiz.correctIndex];
      speak(`That was ${quiz.options[selectedIndex].sound}. The answer is ${correctOption.sound}.`);
      setStreak(0);
      setQuizScore((s) => ({ correct: s.correct, total: s.total + 1 }));
      dispatch(
        updatePhonics({
          questionsAttempted: phonicsProgress.questionsAttempted + 1,
        })
      );
    }

    setTimeout(() => {
      generateQuizQuestion();
    }, 2000);
  };

  const handleStartBlend = () => {
    clickSound();
    if (unit) {
      const word = getRandomWord(unit);
      if (word) {
        setBlendState(createBlendState(word));
      }
    }
    setMode('blend');
  };

  const handlePhonemeTap = (index: number) => {
    if (!blendState || index !== blendState.currentPhonemeIndex || blendState.isBlending) return;

    clickSound();
    const phonemeSymbol = blendState.word.phonemes[index];
    const phoneme = getPhoneme(phonemeSymbol);
    if (phoneme) {
      speak(phoneme.sound);
    } else {
      speak(phonemeSymbol);
    }

    const newSounded = [...blendState.phonemesSounded];
    newSounded[index] = true;

    setBlendState({
      ...blendState,
      phonemesSounded: newSounded,
      currentPhonemeIndex: index + 1,
    });
  };

  const handleBlendTogether = async () => {
    if (!blendState || blendState.isBlending) return;

    setBlendState({ ...blendState, isBlending: true });

    // Wait for animation
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Say the blended word
    speak(blendState.word.word);
    playSound('correct');

    setBlendState({
      ...blendState,
      isBlending: false,
      blendComplete: true,
    });

    // Track progress
    dispatch(addWordBlended(blendState.word.word));
    dispatch(
      updatePhonics({
        questionsCorrect: phonicsProgress.questionsCorrect + 1,
        questionsAttempted: phonicsProgress.questionsAttempted + 1,
      })
    );
  };

  const handleNextBlendWord = () => {
    clickSound();
    if (!unit) return;

    const word = getRandomWord(unit);
    if (word) {
      setBlendState(createBlendState(word));
    }
  };

  const handleBackToExplore = () => {
    clickSound();
    setMode('explore');
    setQuiz(null);
    setFeedback(null);
    setBlendState(null);
  };

  const allPhonemesSounded = blendState?.phonemesSounded.every(Boolean) ?? false;

  return (
    <div className="space-y-8 animate-fade-slide-in">
      {/* Header */}
      <Card variant="elevated">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-chocolate">Phonics</h2>
            <p className="text-chocolate-muted">Learn to sound out words!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-coral">
                {phonicsProgress.phonemesLearned.length}
              </div>
              <div className="text-xs text-chocolate-muted">Sounds Learned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-sage">
                {phonicsProgress.wordsBlended.length}
              </div>
              <div className="text-xs text-chocolate-muted">Words Blended</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Unit Selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {PHONICS_UNITS.map((u) => (
          <button
            key={u.unit}
            onClick={() => handleUnitChange(u.unit)}
            className={`rounded-full px-4 py-2 font-body text-sm font-medium transition-all ${
              currentUnit === u.unit
                ? 'bg-coral text-cream shadow-soft'
                : 'bg-paper text-chocolate hover:bg-coral/10'
            }`}
            title={u.description}
          >
            {u.name}
          </button>
        ))}
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={handleBackToExplore}
          className={`rounded-full px-5 py-2 font-body text-sm font-medium transition-all ${
            mode === 'explore'
              ? 'bg-sage text-cream shadow-soft'
              : 'bg-paper text-chocolate hover:bg-sage/10'
          }`}
        >
          Explore
        </button>
        <button
          onClick={handleStartQuiz}
          className={`rounded-full px-5 py-2 font-body text-sm font-medium transition-all ${
            mode === 'quiz'
              ? 'bg-sage text-cream shadow-soft'
              : 'bg-paper text-chocolate hover:bg-sage/10'
          }`}
        >
          Quiz
        </button>
        {isWord && (
          <button
            onClick={handleStartBlend}
            className={`rounded-full px-5 py-2 font-body text-sm font-medium transition-all ${
              mode === 'blend'
                ? 'bg-sage text-cream shadow-soft'
                : 'bg-paper text-chocolate hover:bg-sage/10'
            }`}
          >
            Blend
          </button>
        )}
      </div>

      {/* Content based on mode */}
      {mode === 'explore' && (
        <Card variant="elevated" className="text-center">
          <div className="space-y-8 py-8">
            {/* Unit info */}
            <p className="text-lg text-chocolate-muted">{unit?.description}</p>

            {/* Phoneme or Word Display */}
            {isPhoneme && currentPhoneme && (
              <button
                onClick={handleSpeakCurrent}
                className={`group mx-auto block rounded-3xl px-16 py-12 transition-all hover:scale-105 hover:shadow-lifted ${
                  PHONEME_COLORS[currentPhoneme.type]
                }/20 hover:${PHONEME_COLORS[currentPhoneme.type]}/30`}
              >
                <span className="font-display text-8xl font-bold text-chocolate group-hover:text-coral">
                  {currentPhoneme.symbol}
                </span>
                <div className="mt-4 text-xl text-chocolate-muted">
                  as in &quot;{currentPhoneme.exampleWord}&quot;
                </div>
                <div className="mt-2 flex items-center justify-center gap-2 text-chocolate-muted">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                  <span className="text-sm">Tap to hear the sound</span>
                </div>
              </button>
            )}

            {isWord && currentWord && (
              <button
                onClick={handleSpeakCurrent}
                className="group mx-auto block rounded-3xl bg-gradient-to-br from-sage/20 to-sage/10 px-16 py-12 transition-all hover:scale-105 hover:shadow-lifted"
              >
                <span className="font-display text-7xl font-bold text-chocolate group-hover:text-sage">
                  {currentWord.word}
                </span>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {segmentWord(currentWord).map((seg, idx) => (
                    <span
                      key={idx}
                      className={`rounded-lg px-3 py-1 font-display text-2xl font-bold text-cream ${seg.color}`}
                    >
                      {seg.segment}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-center gap-2 text-chocolate-muted">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                  <span className="text-sm">Tap to hear</span>
                </div>
              </button>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4">
              <Button onClick={handlePrevItem} variant="ghost" size="lg">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </Button>
              <span className="font-body text-chocolate-muted">
                {currentIndex + 1} of {itemCount}
              </span>
              <Button onClick={handleNextItem} variant="ghost" size="lg">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                </svg>
              </Button>
            </div>

            {/* Item Grid */}
            <div className="mx-auto flex max-w-xl flex-wrap justify-center gap-2">
              {isPhoneme &&
                unit?.phonemes?.map((p, idx) => (
                  <button
                    key={p.symbol}
                    onClick={() => {
                      clickSound();
                      setCurrentIndex(idx);
                    }}
                    className={`rounded-lg px-3 py-1 text-sm transition-all ${
                      idx === currentIndex
                        ? `${PHONEME_COLORS[p.type]} text-cream`
                        : phonicsProgress.phonemesLearned.includes(p.symbol)
                        ? `${PHONEME_COLORS[p.type]}/30 text-chocolate`
                        : 'bg-cream text-chocolate hover:bg-coral/10'
                    }`}
                  >
                    {p.symbol}
                  </button>
                ))}
              {isWord &&
                unit?.words?.map((w, idx) => (
                  <button
                    key={w.word}
                    onClick={() => {
                      clickSound();
                      setCurrentIndex(idx);
                    }}
                    className={`rounded-lg px-3 py-1 text-sm transition-all ${
                      idx === currentIndex
                        ? 'bg-sage text-cream'
                        : phonicsProgress.wordsBlended.includes(w.word)
                        ? 'bg-sage/20 text-sage'
                        : 'bg-cream text-chocolate hover:bg-sage/10'
                    }`}
                  >
                    {w.word}
                  </button>
                ))}
            </div>
          </div>
        </Card>
      )}

      {mode === 'quiz' && (
        <Card variant="elevated" className="text-center">
          <div className="space-y-8 py-8">
            {/* Quiz Stats */}
            <div className="flex justify-center gap-8">
              <div>
                <div className="text-3xl font-bold text-sage">{quizScore.correct}</div>
                <div className="text-sm text-chocolate-muted">Correct</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-coral">{streak}</div>
                <div className="text-sm text-chocolate-muted">Streak</div>
              </div>
            </div>

            {quiz && (
              <>
                {/* Prompt */}
                <div className="space-y-2">
                  <p className="text-lg text-chocolate-muted">
                    {isPhoneme ? 'What sound does this make?' : 'Find the word:'}
                  </p>
                  <button
                    onClick={() => speak(isPhoneme ? quiz.target.sound : quiz.target.symbol)}
                    className="mx-auto flex items-center gap-2 rounded-full bg-coral/10 px-6 py-3 text-coral transition-all hover:bg-coral/20"
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                    </svg>
                    <span className="text-sm">Tap to hear</span>
                  </button>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {quiz.options.map((option, idx) => (
                    <button
                      key={option.symbol + idx}
                      onClick={() => handleQuizAnswer(idx)}
                      disabled={feedback !== null}
                      className={`rounded-2xl p-6 font-display text-2xl font-bold transition-all ${
                        feedback !== null
                          ? idx === quiz.correctIndex
                            ? 'bg-sage text-cream'
                            : feedback === 'incorrect' && selectedQuizIndex === idx
                            ? 'bg-coral/50 text-cream'
                            : 'bg-cream text-chocolate-muted'
                          : 'bg-paper text-chocolate shadow-soft hover:scale-105 hover:shadow-lifted active:scale-95'
                      }`}
                    >
                      {isPhoneme ? option.sound : option.symbol}
                    </button>
                  ))}
                </div>

                {/* Feedback */}
                {feedback && (
                  <Feedback
                    type={feedback === 'correct' ? 'success' : 'error'}
                    message={
                      feedback === 'correct'
                        ? 'Great job!'
                        : `The answer was "${quiz.options[quiz.correctIndex].sound}"`
                    }
                  />
                )}
              </>
            )}
          </div>
        </Card>
      )}

      {mode === 'blend' && blendState && (
        <Card variant="elevated" className="text-center">
          <div className="space-y-8 py-8">
            {/* Instructions */}
            <p className="text-lg text-chocolate-muted">
              {blendState.blendComplete
                ? 'You did it!'
                : allPhonemesSounded
                ? 'Now blend them together!'
                : 'Tap each part to hear its sound'}
            </p>

            {/* Segmented Word Display */}
            <div
              className={`flex justify-center ${
                blendState.isBlending ? 'gap-0 animate-blend-together' : 'gap-4'
              } transition-all duration-500`}
            >
              {segmentWord(blendState.word).map((seg, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePhonemeTap(idx)}
                  disabled={
                    idx !== blendState.currentPhonemeIndex ||
                    blendState.isBlending ||
                    blendState.blendComplete
                  }
                  className={`
                    rounded-2xl px-6 py-8 font-display text-5xl font-bold
                    transition-all duration-300
                    ${
                      blendState.phonemesSounded[idx]
                        ? `${seg.color} text-cream scale-110`
                        : `${seg.color}/20 text-chocolate`
                    }
                    ${
                      idx === blendState.currentPhonemeIndex &&
                      !blendState.isBlending &&
                      !blendState.blendComplete
                        ? 'animate-pulse ring-4 ring-yellow'
                        : ''
                    }
                    ${
                      !blendState.phonemesSounded[idx] &&
                      idx !== blendState.currentPhonemeIndex
                        ? 'opacity-50'
                        : ''
                    }
                  `}
                >
                  {seg.segment}
                </button>
              ))}
            </div>

            {/* Blend Button */}
            {allPhonemesSounded && !blendState.blendComplete && !blendState.isBlending && (
              <Button
                onClick={handleBlendTogether}
                variant="primary"
                size="lg"
                className="animate-bounce"
              >
                <span className="flex items-center gap-2">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Blend it together!
                </span>
              </Button>
            )}

            {/* Success State */}
            {blendState.blendComplete && (
              <div className="space-y-4">
                <div className="font-display text-6xl font-bold text-sage animate-celebrate">
                  {blendState.word.word}
                </div>
                <Feedback type="success" message="Great blending!" />
                <Button onClick={handleNextBlendWord} variant="primary">
                  Next Word
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Progress Indicator */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalUnits }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 w-8 rounded-full transition-all ${
                idx + 1 <= currentUnit ? 'bg-coral' : 'bg-cream-dark'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
