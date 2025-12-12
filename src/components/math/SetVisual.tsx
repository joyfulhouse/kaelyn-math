'use client';

// Colors for different sets
const SET_COLORS = ['coral', 'sage', 'sky', 'yellow', 'violet', 'emerald'];

interface SetVisualProps {
  numSets: number;
  itemsPerSet: number;
  animated?: boolean;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTotal?: boolean;
}

/**
 * Displays multiple equal sets of items
 */
export function SetVisual({
  numSets,
  itemsPerSet,
  animated = false,
  showLabels = true,
  size = 'md',
  showTotal = true,
}: SetVisualProps) {
  const total = numSets * itemsPerSet;

  const sizeClasses = {
    sm: { dot: 'h-4 w-4', gap: 'gap-0.5', padding: 'p-2', fontSize: 'text-xs' },
    md: { dot: 'h-6 w-6', gap: 'gap-1', padding: 'p-3', fontSize: 'text-sm' },
    lg: { dot: 'h-8 w-8', gap: 'gap-1.5', padding: 'p-4', fontSize: 'text-base' },
  };

  const s = sizeClasses[size];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-4">
        {Array.from({ length: numSets }).map((_, setIndex) => {
          const color = SET_COLORS[setIndex % SET_COLORS.length];
          return (
            <div
              key={`set-${setIndex}`}
              className={`
                flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed
                border-${color}/50 bg-${color}/10 ${s.padding}
                ${animated ? 'animate-groupAppear' : ''}
              `}
              style={{
                animationDelay: animated ? `${setIndex * 200}ms` : undefined,
                borderColor: `var(--color-${color})`,
                backgroundColor: `color-mix(in srgb, var(--color-${color}) 10%, transparent)`,
              }}
            >
              <div className={`flex flex-wrap justify-center ${s.gap}`} style={{ maxWidth: '120px' }}>
                {Array.from({ length: itemsPerSet }).map((_, itemIndex) => (
                  <div
                    key={`item-${setIndex}-${itemIndex}`}
                    className={`
                      ${s.dot} rounded-full
                      ${animated ? 'animate-itemAppear' : ''}
                    `}
                    style={{
                      animationDelay: animated
                        ? `${setIndex * 200 + itemIndex * 50}ms`
                        : undefined,
                      backgroundColor: `var(--color-${color})`,
                    }}
                  />
                ))}
              </div>
              {showLabels && (
                <span
                  className={`font-display font-bold ${s.fontSize}`}
                  style={{ color: `var(--color-${color})` }}
                >
                  Set {setIndex + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {showTotal && (
        <div className="text-center font-display text-xl text-chocolate">
          <span className="font-bold text-coral">{numSets}</span>
          <span className="mx-2">sets</span>
          <span className="mx-1">×</span>
          <span className="font-bold text-sage">{itemsPerSet}</span>
          <span className="mx-2">items</span>
          <span className="mx-1">=</span>
          <span className="font-bold text-sky">{total}</span>
          <span className="ml-2">total</span>
        </div>
      )}
    </div>
  );
}

interface PairingVisualProps {
  number: number;
  showPairs: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Displays items that can be paired, showing even/odd concept
 */
export function PairingVisual({
  number,
  showPairs,
  animated = false,
  size = 'md',
}: PairingVisualProps) {
  const numPairs = Math.floor(number / 2);
  const leftover = number % 2;
  const isEven = leftover === 0;

  const sizeClasses = {
    sm: { dot: 'h-5 w-5', gap: 'gap-1', pairGap: 'gap-3' },
    md: { dot: 'h-7 w-7', gap: 'gap-1.5', pairGap: 'gap-4' },
    lg: { dot: 'h-9 w-9', gap: 'gap-2', pairGap: 'gap-5' },
  };

  const s = sizeClasses[size];

  if (!showPairs) {
    // Show items in a scattered/row pattern before pairing
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-wrap justify-center gap-2" style={{ maxWidth: '280px' }}>
          {Array.from({ length: number }).map((_, i) => (
            <div
              key={`unpaired-${i}`}
              className={`${s.dot} rounded-full bg-coral ${animated ? 'animate-itemAppear' : ''}`}
              style={{ animationDelay: animated ? `${i * 50}ms` : undefined }}
            />
          ))}
        </div>
        <p className="font-display text-lg text-chocolate">
          <span className="font-bold text-coral">{number}</span> items
        </p>
      </div>
    );
  }

  // Show items grouped into pairs
  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`flex flex-wrap justify-center ${s.pairGap}`}>
        {Array.from({ length: numPairs }).map((_, pairIndex) => (
          <div
            key={`pair-${pairIndex}`}
            className={`relative flex items-center ${s.gap} ${animated ? 'animate-groupAppear' : ''}`}
            style={{ animationDelay: animated ? `${pairIndex * 150}ms` : undefined }}
          >
            <div className={`${s.dot} rounded-full bg-sage`} />
            {/* Connecting line */}
            <div className="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 bg-sage/40" />
            <div className={`${s.dot} rounded-full bg-sage`} />
          </div>
        ))}

        {/* Leftover item if odd */}
        {leftover > 0 && (
          <div
            className={`flex items-center ${animated ? 'animate-bounce' : ''}`}
            style={{ animationDelay: animated ? `${numPairs * 150 + 200}ms` : undefined }}
          >
            <div className={`${s.dot} rounded-full bg-coral ring-2 ring-coral/30 ring-offset-2`} />
          </div>
        )}
      </div>

      {/* Result label */}
      <div className="text-center">
        <p className="font-display text-lg text-chocolate">
          <span className="font-bold text-sage">{numPairs}</span> pairs
          {leftover > 0 && (
            <>
              <span className="mx-2">+</span>
              <span className="font-bold text-coral">{leftover}</span> left over
            </>
          )}
        </p>
        <p
          className={`mt-2 font-display text-2xl font-bold ${isEven ? 'text-sage' : 'text-coral'}`}
        >
          {number} is {isEven ? 'EVEN' : 'ODD'}
        </p>
      </div>
    </div>
  );
}

interface SetComparisonProps {
  setA: number;
  setB: number;
  showResult?: boolean;
  highlightDifference?: boolean;
  animated?: boolean;
}

/**
 * Displays two sets side by side for comparison
 */
export function SetComparison({
  setA,
  setB,
  showResult = true,
  highlightDifference = true,
  animated = false,
}: SetComparisonProps) {
  const maxCount = Math.max(setA, setB);
  const minCount = Math.min(setA, setB);
  const difference = maxCount - minCount;

  let result: 'more' | 'fewer' | 'same';
  if (setA > setB) result = 'more';
  else if (setA < setB) result = 'fewer';
  else result = 'same';

  const renderSet = (count: number, label: string, color: string, isLarger: boolean) => (
    <div className="flex flex-col items-center gap-3">
      <span className="font-display text-lg font-bold text-chocolate">{label}</span>
      <div
        className={`
          rounded-2xl border-2 border-dashed p-4
          ${animated ? 'animate-groupAppear' : ''}
        `}
        style={{
          borderColor: `var(--color-${color})`,
          backgroundColor: `color-mix(in srgb, var(--color-${color}) 10%, transparent)`,
        }}
      >
        <div className="flex flex-col items-center gap-1">
          {Array.from({ length: count }).map((_, i) => {
            const isExtra = highlightDifference && isLarger && i >= minCount;
            return (
              <div
                key={i}
                className={`
                  h-6 w-6 rounded-full
                  ${isExtra ? 'ring-2 ring-yellow ring-offset-1' : ''}
                  ${animated ? 'animate-itemAppear' : ''}
                `}
                style={{
                  backgroundColor: isExtra ? 'var(--color-yellow)' : `var(--color-${color})`,
                  animationDelay: animated ? `${i * 50}ms` : undefined,
                }}
              />
            );
          })}
        </div>
      </div>
      <span
        className="font-display text-3xl font-bold"
        style={{ color: `var(--color-${color})` }}
      >
        {count}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-end justify-center gap-8">
        {renderSet(setA, 'Set A', 'coral', setA > setB)}
        <div className="flex flex-col items-center pb-8">
          <span className="font-display text-4xl text-chocolate/30">vs</span>
        </div>
        {renderSet(setB, 'Set B', 'sky', setB > setA)}
      </div>

      {showResult && (
        <div className="rounded-xl bg-cream px-6 py-3 text-center">
          <p className="font-display text-xl text-chocolate">
            Set A has{' '}
            <span
              className={`font-bold ${
                result === 'more' ? 'text-coral' : result === 'fewer' ? 'text-sky' : 'text-sage'
              }`}
            >
              {result === 'same' ? 'the same' : result}
            </span>
            {result !== 'same' && (
              <>
                {' '}
                <span className="text-yellow">({difference} {difference === 1 ? 'item' : 'items'})</span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
