'use client';

interface DotGridProps {
  rows: number;
  cols: number;
  highlightRow?: number;
  highlightCol?: number;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

const gapClasses = {
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-3',
};

export function DotGrid({
  rows,
  cols,
  highlightRow,
  highlightCol,
  animated = false,
  size = 'md',
}: DotGridProps) {
  return (
    <div className={`inline-flex flex-col ${gapClasses[size]}`}>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={`row-${row}`} className={`flex ${gapClasses[size]}`}>
          {Array.from({ length: cols }).map((_, col) => {
            const isHighlightedRow = highlightRow !== undefined && row === highlightRow;
            const isHighlightedCol = highlightCol !== undefined && col === highlightCol;
            const isIntersection = isHighlightedRow && isHighlightedCol;

            return (
              <div
                key={`dot-${row}-${col}`}
                className={`
                  rounded-full transition-all duration-200
                  ${sizeClasses[size]}
                  ${
                    isIntersection
                      ? 'bg-coral scale-125'
                      : isHighlightedRow || isHighlightedCol
                        ? 'bg-yellow'
                        : 'bg-sage'
                  }
                  ${animated ? 'animate-dotAppear' : ''}
                `}
                style={{
                  animationDelay: animated ? `${(row * cols + col) * 50}ms` : undefined,
                }}
              />
            );
          })}
        </div>
      ))}

      {/* Labels */}
      <div className="mt-2 text-center font-display text-lg font-bold text-chocolate">
        {rows} × {cols} = {rows * cols}
      </div>
    </div>
  );
}

// Times table grid display
interface TimesTableGridProps {
  factor: number;
  maxFactor?: number;
  highlightedResults?: number[];
}

export function TimesTableGrid({
  factor,
  maxFactor = 12,
  highlightedResults = [],
}: TimesTableGridProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
      {Array.from({ length: maxFactor }, (_, i) => i + 1).map((n) => {
        const result = factor * n;
        const isHighlighted = highlightedResults.includes(result);

        return (
          <div
            key={`table-${n}`}
            className={`
              flex flex-col items-center rounded-xl p-3 transition-all duration-200
              ${isHighlighted ? 'bg-sage text-cream' : 'bg-cream hover:bg-yellow/20'}
            `}
          >
            <span className="font-body text-sm text-chocolate/60">
              {factor} × {n}
            </span>
            <span className="font-display text-2xl font-bold">{result}</span>
          </div>
        );
      })}
    </div>
  );
}
