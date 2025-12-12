'use client';

import { useAudio } from '@/hooks/useAudio';

interface AudioToggleProps {
  className?: string;
}

export function AudioToggle({ className = '' }: AudioToggleProps) {
  const { muted, setMuted, clickSound } = useAudio();

  const handleToggle = () => {
    if (!muted) {
      // Play click before muting
      clickSound();
    }
    setMuted(!muted);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        flex h-10 w-10 items-center justify-center rounded-full
        bg-cream/20 backdrop-blur-sm transition-all duration-200
        hover:bg-cream/30 hover:scale-110 active:scale-95
        ${className}
      `}
      aria-label={muted ? 'Unmute audio' : 'Mute audio'}
      title={muted ? 'Turn sound on' : 'Turn sound off'}
    >
      {muted ? (
        // Speaker with X (muted)
        <svg
          className="h-5 w-5 text-cream/70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        // Speaker with waves (unmuted)
        <svg
          className="h-5 w-5 text-cream"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}
