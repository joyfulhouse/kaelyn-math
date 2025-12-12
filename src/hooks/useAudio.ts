'use client';

import { useCallback } from 'react';
import { useAudioContext } from '@/contexts/AudioContext';

/**
 * Hook for audio feedback in learning modules.
 * Provides convenient methods for common audio interactions.
 */
export function useAudio() {
  const { speak, playSound, stopSpeaking, isSpeaking, muted, setMuted } = useAudioContext();

  // Celebration feedback for correct answers
  const celebrateCorrect = useCallback(async () => {
    playSound('correct');
    await speak('Great job!');
  }, [playSound, speak]);

  // Encouragement for incorrect answers
  const encourageRetry = useCallback(async () => {
    playSound('incorrect');
    await speak('Almost! Try again!');
  }, [playSound, speak]);

  // Generic feedback based on correctness
  const giveFeedback = useCallback(
    async (isCorrect: boolean) => {
      if (isCorrect) {
        await celebrateCorrect();
      } else {
        await encourageRetry();
      }
    },
    [celebrateCorrect, encourageRetry]
  );

  // Narrate a step in a demo
  const narrateStep = useCallback(
    async (narration: string) => {
      playSound('pop');
      await speak(narration);
    },
    [playSound, speak]
  );

  // Celebrate completing a section
  const celebrateComplete = useCallback(async () => {
    playSound('celebrate');
    await speak('Wonderful! You did it!');
  }, [playSound, speak]);

  // Button click sound
  const clickSound = useCallback(() => {
    playSound('click');
  }, [playSound]);

  // Transition sound
  const transitionSound = useCallback(() => {
    playSound('whoosh');
  }, [playSound]);

  return {
    // Core audio context
    speak,
    playSound,
    stopSpeaking,
    isSpeaking,
    muted,
    setMuted,
    // Convenience methods
    celebrateCorrect,
    encourageRetry,
    giveFeedback,
    narrateStep,
    celebrateComplete,
    clickSound,
    transitionSound,
  };
}
