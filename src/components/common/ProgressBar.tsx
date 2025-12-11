'use client';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'coral' | 'sage' | 'yellow' | 'sky';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const colorStyles = {
  coral: 'bg-coral',
  sage: 'bg-sage',
  yellow: 'bg-yellow',
  sky: 'bg-sky',
};

const sizeStyles = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

export function ProgressBar({
  value,
  max,
  color = 'coral',
  showLabel = false,
  size = 'md',
  animated = true,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1 flex justify-between font-body text-sm text-chocolate/70">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div
        className={`w-full overflow-hidden rounded-full bg-chocolate/10 ${sizeStyles[size]}`}
      >
        <div
          className={`
            h-full rounded-full
            ${colorStyles[color]}
            ${animated ? 'transition-all duration-500 ease-out' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Step progress indicator (for demos)
interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`
              flex h-8 w-8 items-center justify-center rounded-full
              font-display font-bold transition-all duration-200
              ${
                i < currentStep
                  ? 'bg-sage text-cream'
                  : i === currentStep
                    ? 'bg-coral text-cream scale-110'
                    : 'bg-chocolate/10 text-chocolate/40'
              }
            `}
          >
            {i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div
              className={`
                h-1 w-8 rounded-full transition-all duration-200
                ${i < currentStep ? 'bg-sage' : 'bg-chocolate/10'}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
}
