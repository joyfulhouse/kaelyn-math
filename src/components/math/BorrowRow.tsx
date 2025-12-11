'use client';

interface BorrowRowProps {
  originalDigits: number[];
  displayDigits: number[];
  borrowed: boolean[];
  receivedBorrow: boolean[];
  interactive?: boolean;
  onBorrowClick?: (index: number) => void;
  bottomDigits?: number[];
}

export function BorrowRow({
  originalDigits,
  displayDigits,
  borrowed,
  receivedBorrow,
  interactive = false,
  onBorrowClick,
  bottomDigits = [],
}: BorrowRowProps) {
  return (
    <div className="flex">
      {displayDigits.map((digit, i) => {
        const hasBorrowed = borrowed[i];
        const hasReceived = receivedBorrow[i];
        const original = originalDigits[i];
        const bottom = bottomDigits[i] ?? 0;

        // Determine if this column can be clicked (needs to borrow)
        const canBorrow =
          interactive &&
          onBorrowClick &&
          i > 0 &&
          digit < bottom &&
          !hasReceived;

        return (
          <div
            key={`borrow-${i}`}
            className={`
              relative flex h-12 w-12 items-center justify-center
              font-display text-3xl font-bold
              ${canBorrow ? 'cursor-pointer hover:bg-yellow/20 rounded-lg transition-colors' : ''}
              ${hasReceived ? 'text-sage' : hasBorrowed ? 'text-coral' : 'text-chocolate'}
            `}
            onClick={() => canBorrow && onBorrowClick(i)}
          >
            {/* Show crossed out original if borrowed from */}
            {hasBorrowed && (
              <span className="absolute -top-3 text-sm text-chocolate/40 line-through">
                {original}
              </span>
            )}

            {/* Show +10 indicator if received borrow */}
            {hasReceived && (
              <span className="absolute -top-3 text-xs text-sage">+10</span>
            )}

            <span className={hasReceived ? 'animate-receiveBorrow' : hasBorrowed ? 'animate-shrinkDigit' : ''}>
              {digit}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Simplified borrow indicator for demos
interface BorrowIndicatorProps {
  fromIndex: number;
  toIndex: number;
  totalLength: number;
  animated?: boolean;
}

export function BorrowIndicator({
  fromIndex,
  toIndex,
  totalLength,
  animated = true,
}: BorrowIndicatorProps) {
  return (
    <div className="relative flex h-6">
      {Array.from({ length: totalLength }).map((_, i) => {
        const isFrom = i === fromIndex;
        const isTo = i === toIndex;
        const isBetween = i > fromIndex && i < toIndex;

        return (
          <div key={`indicator-${i}`} className="relative h-6 w-12">
            {isFrom && (
              <svg
                className={`absolute inset-0 text-coral ${animated ? 'animate-borrowDown' : ''}`}
                viewBox="0 0 48 24"
              >
                <path
                  d="M24 0 L24 20 L28 16 M24 20 L20 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
            {(isBetween || isTo) && (
              <div className="absolute bottom-0 h-0.5 w-full bg-coral" />
            )}
          </div>
        );
      })}
    </div>
  );
}
